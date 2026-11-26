import { useState, useEffect } from 'react';
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Search,
  RotateCcw,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { Workout, WorkoutExercise, Exercise } from '../../types';

export default function WorkoutPage() {
  const { state, addWorkout } = useDemoContext();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'tracker' | 'templates' | 'library' | 'history'>('tracker');
  const [searchExercise, setSearchExercise] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');

  // Active workout session state
  const [activeSession, setActiveSession] = useState<{
    title: string;
    exercises: WorkoutExercise[];
    elapsedSeconds: number;
    isActive: boolean;
  } | null>(null);

  // Rest timer
  const [restTimer, setRestTimer] = useState<number | null>(null);

  // Active session clock
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeSession?.isActive) {
      interval = setInterval(() => {
        setActiveSession((prev) => (prev ? { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession?.isActive]);

  // Rest countdown clock
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const startTemplate = (tmplTitle: string, exercisesList: Exercise[]) => {
    const formattedExercises: WorkoutExercise[] = exercisesList.slice(0, 3).map((ex, i) => ({
      id: `we-${Date.now()}-${i}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      restSeconds: 60,
      sets: [
        { id: `s-${i}-1`, reps: 10, weight: 50, isCompleted: false },
        { id: `s-${i}-2`, reps: 10, weight: 50, isCompleted: false },
        { id: `s-${i}-3`, reps: 8, weight: 55, isCompleted: false },
      ],
    }));

    setActiveSession({
      title: tmplTitle,
      exercises: formattedExercises,
      elapsedSeconds: 0,
      isActive: true,
    });
    setActiveTab('tracker');
    showToast(`Started "${tmplTitle}"!`, 'success');
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    if (!activeSession) return;
    const updatedExercises = [...activeSession.exercises];
    const targetSet = updatedExercises[exerciseIndex].sets[setIndex];
    targetSet.isCompleted = !targetSet.isCompleted;

    if (targetSet.isCompleted) {
      setRestTimer(updatedExercises[exerciseIndex].restSeconds || 60);
      showToast('Set finished! Rest timer started.', 'info');
    }

    setActiveSession({
      ...activeSession,
      exercises: updatedExercises,
    });
  };

  const finishWorkout = () => {
    if (!activeSession) return;
    const durationMins = Math.max(1, Math.round(activeSession.elapsedSeconds / 60));

    const newWorkout: Workout = {
      id: `wk-${Date.now()}`,
      userId: state.currentUserId,
      title: activeSession.title,
      exercises: activeSession.exercises,
      duration: durationMins,
      date: new Date().toISOString().split('T')[0],
      isTemplate: false,
      isCompleted: true,
      calories: Math.round(durationMins * 7.5),
    };

    addWorkout(newWorkout);
    setActiveSession(null);
    setRestTimer(null);
    showToast(`Workout logged! Burned ~${newWorkout.calories} kcal. Great job!`, 'success');
    setActiveTab('history');
  };

  // Filtered exercise library
  const filteredExercises = state.exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchExercise.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchExercise.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();
    return matchesSearch && matchesMuscle;
  });

  const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  return (
    <div className="py-3 px-3 sm:px-4">
      {/* Top Banner / Heading */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-brand-accent" />
            <span>Workout Tracker</span>
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Log sets, run rest timers, and follow structured training programs.
          </p>
        </div>

        {activeSession && (
          <span className="badge-accent flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {Math.floor(activeSession.elapsedSeconds / 60)}:
              {String(activeSession.elapsedSeconds % 60).padStart(2, '0')}
            </span>
          </span>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-brand-border mb-4 text-xs font-semibold overflow-x-auto scrollbar-none">
        {[
          { id: 'tracker' as const, label: 'Active Session' },
          { id: 'templates' as const, label: 'Templates' },
          { id: 'library' as const, label: 'Exercise Library' },
          { id: 'history' as const, label: 'Workout History' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 1. Active Tracker Tab */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          {restTimer !== null && (
            <div className="bg-brand-accent text-brand-bg p-3 rounded-xl flex items-center justify-between font-bold text-xs shadow-lg animate-slide-down">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Rest Timer: {restTimer}s remaining</span>
              </div>
              <button
                onClick={() => setRestTimer(null)}
                className="bg-brand-bg/20 hover:bg-brand-bg/30 px-2 py-0.5 rounded text-[10px]"
              >
                Skip Rest
              </button>
            </div>
          )}

          {activeSession ? (
            <div className="card p-4 bg-brand-surface border border-brand-border rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                <div>
                  <h3 className="font-bold text-sm text-brand-text-primary">{activeSession.title}</h3>
                  <p className="text-[11px] text-brand-text-secondary">
                    In progress • {activeSession.exercises.length} movements
                  </p>
                </div>
                <button
                  onClick={finishWorkout}
                  className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish Workout</span>
                </button>
              </div>

              {/* Exercises in Session */}
              <div className="space-y-4">
                {activeSession.exercises.map((ex, exIdx) => (
                  <div
                    key={ex.id}
                    className="p-3 bg-brand-elevated rounded-xl border border-brand-border/70"
                  >
                    <h4 className="font-bold text-xs text-brand-text-primary mb-2 flex items-center justify-between">
                      <span>{ex.exerciseName}</span>
                      <span className="text-[10px] text-brand-text-secondary">
                        Rest: {ex.restSeconds}s
                      </span>
                    </h4>

                    {/* Sets table */}
                    <div className="space-y-1.5 text-xs">
                      <div className="grid grid-cols-4 text-[10px] text-brand-text-secondary uppercase font-semibold px-2">
                        <span>Set</span>
                        <span>Weight (kg)</span>
                        <span>Reps</span>
                        <span className="text-right">Done</span>
                      </div>
                      {ex.sets.map((set, setIdx) => (
                        <div
                          key={set.id}
                          className={`grid grid-cols-4 items-center p-2 rounded-lg border transition-colors ${
                            set.isCompleted
                              ? 'bg-brand-accent/10 border-brand-accent/40'
                              : 'bg-brand-surface border-brand-border/40'
                          }`}
                        >
                          <span className="font-bold text-brand-text-primary">#{setIdx + 1}</span>
                          <input
                            type="number"
                            value={set.weight || 0}
                            onChange={(e) => {
                              const updated = [...activeSession.exercises];
                              updated[exIdx].sets[setIdx].weight = Number(e.target.value);
                              setActiveSession({ ...activeSession, exercises: updated });
                            }}
                            className="w-16 bg-brand-elevated border border-brand-border rounded px-1.5 py-0.5 text-xs"
                          />
                          <input
                            type="number"
                            value={set.reps || 0}
                            onChange={(e) => {
                              const updated = [...activeSession.exercises];
                              updated[exIdx].sets[setIdx].reps = Number(e.target.value);
                              setActiveSession({ ...activeSession, exercises: updated });
                            }}
                            className="w-14 bg-brand-elevated border border-brand-border rounded px-1.5 py-0.5 text-xs"
                          />
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={() => toggleSetComplete(exIdx, setIdx)}
                              className={`p-1 rounded-md transition-colors ${
                                set.isCompleted
                                  ? 'bg-brand-accent text-brand-bg font-bold'
                                  : 'bg-brand-border/60 text-brand-text-secondary hover:text-brand-text-primary'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center bg-brand-surface border border-brand-border rounded-2xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-accent/15 text-brand-accent flex items-center justify-center mx-auto">
                <Dumbbell className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-text-primary">No Active Workout</h3>
                <p className="text-xs text-brand-text-secondary mt-1 max-w-sm mx-auto">
                  Pick a pre-made routine from Templates or start an empty customized session right now.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => startTemplate('Custom Full-Body Session', state.exercises)}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Empty Workout</span>
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Browse Templates
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-3">
          {state.workoutTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="card p-4 bg-brand-surface border border-brand-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-brand-accent/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-xs text-brand-text-primary">{tmpl.title}</h4>
                  <span className="text-[10px] font-semibold uppercase bg-brand-elevated px-2 py-0.5 rounded text-brand-accent">
                    {tmpl.difficulty}
                  </span>
                </div>
                <p className="text-xs text-brand-text-secondary mb-2">{tmpl.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-brand-text-secondary">
                  <span>⏱ {tmpl.estimatedDuration} mins</span>
                  <span>•</span>
                  <span>Target: {tmpl.muscleGroups.join(', ')}</span>
                </div>
              </div>
              <button
                onClick={() => startTemplate(tmpl.title, state.exercises)}
                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shrink-0 self-end sm:self-center"
              >
                <Play className="w-3.5 h-3.5 fill-brand-bg" />
                <span>Start Routine</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-3">
          {/* Search & Muscle Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-text-secondary absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchExercise}
                onChange={(e) => setSearchExercise(e.target.value)}
                placeholder="Search exercise movements..."
                className="input-field pl-9 text-xs py-2"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {muscleGroups.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedMuscle === muscle
                      ? 'bg-brand-accent text-brand-bg font-bold'
                      : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="card p-3.5 bg-brand-surface border border-brand-border rounded-xl space-y-2 hover:bg-brand-elevated transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-brand-text-primary">{ex.name}</h4>
                  <span className="text-[10px] uppercase font-bold text-brand-accent">
                    {ex.muscleGroup}
                  </span>
                </div>
                <p className="text-[11px] text-brand-text-secondary">
                  Equipment: {ex.equipment} • Level: {ex.difficulty}
                </p>
                <div className="text-[11px] text-brand-text-secondary/90 space-y-0.5 pt-1 border-t border-brand-border/50">
                  <span className="font-semibold text-brand-text-primary block text-[10px]">
                    Instructions:
                  </span>
                  {ex.instructions.slice(0, 2).map((step, idx) => (
                    <div key={idx} className="truncate">
                      • {step}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {state.workouts.length === 0 ? (
            <div className="card p-6 text-center text-xs text-brand-text-secondary italic">
              No logged workouts yet. Complete your first session to see your records!
            </div>
          ) : (
            state.workouts.map((wk) => (
              <div
                key={wk.id}
                className="card p-3.5 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-xs text-brand-text-primary">{wk.title}</h4>
                    <span className="badge-accent text-[9px]">Verified</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-brand-text-secondary">
                    <span>📅 {wk.date}</span>
                    <span>⏱ {wk.duration} mins</span>
                    {wk.calories && (
                      <span className="text-brand-accent font-semibold flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> {wk.calories} kcal
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-brand-text-primary">
                    {wk.exercises.length} exercises
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
