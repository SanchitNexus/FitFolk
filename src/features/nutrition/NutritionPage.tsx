import { useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Droplets,
  Search,
  Trash2,
  PieChart,
  Check,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { FoodItem, MealEntry, Meal } from '../../types';

export default function NutritionPage() {
  const { state, updateNutrition, addWaterIntake } = useDemoContext();
  const { showToast } = useToast();

  const [activeDate] = useState('2026-10-25');
  const [activeTab, setActiveTab] = useState<'daily' | 'recipes' | 'database'>('daily');
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [foodSearch, setFoodSearch] = useState('');

  // Current day nutrition log (or fallback)
  const currentDay =
    state.nutritionDays.find((d) => d.date === activeDate) || state.nutritionDays[0];

  // Calculate totals
  const allEntries = (currentDay?.meals || []).flatMap((m) => m.entries);
  const totalCalories = Math.round(allEntries.reduce((sum, e) => sum + e.calories, 0));
  const totalProtein = Math.round(allEntries.reduce((sum, e) => sum + e.protein, 0));
  const totalCarbs = Math.round(allEntries.reduce((sum, e) => sum + e.carbs, 0));
  const totalFat = Math.round(allEntries.reduce((sum, e) => sum + e.fat, 0));

  const calorieGoal = currentDay?.calorieGoal || 2200;
  const proteinGoal = currentDay?.proteinGoal || 150;
  const waterIntake = currentDay?.waterIntake || 0;

  const handleAddFoodItem = (food: FoodItem) => {
    if (!currentDay) return;

    const newEntry: MealEntry = {
      id: `me-${Date.now()}`,
      foodId: food.id,
      foodName: food.name,
      servings: 1,
      servingSize: food.servingSize,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    };

    const updatedMeals = currentDay.meals.map((meal) => {
      if (meal.type === selectedMealType) {
        return {
          ...meal,
          entries: [...meal.entries, newEntry],
        };
      }
      return meal;
    });

    updateNutrition({
      ...currentDay,
      meals: updatedMeals,
    });

    showToast(`Added ${food.name} to ${selectedMealType}!`, 'success');
    setIsAddFoodOpen(false);
  };

  const handleDeleteEntry = (mealType: string, entryId: string) => {
    if (!currentDay) return;

    const updatedMeals = currentDay.meals.map((meal) => {
      if (meal.type === mealType) {
        return {
          ...meal,
          entries: meal.entries.filter((e) => e.id !== entryId),
        };
      }
      return meal;
    });

    updateNutrition({
      ...currentDay,
      meals: updatedMeals,
    });

    showToast('Entry removed from meal log', 'info');
  };

  const filteredFoods = state.foodDatabase.filter(
    (f) =>
      f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(foodSearch.toLowerCase())
  );

  return (
    <div className="py-3 px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-brand-accent" />
            <span>Nutrition & Macro Tracker</span>
          </h2>
          <p className="text-xs text-brand-text-secondary">
            Log whole foods, monitor daily macronutrients, and track hydration.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border mb-4 text-xs font-semibold">
        {[
          { id: 'daily' as const, label: 'Today\'s Log' },
          { id: 'recipes' as const, label: 'Saved Meal Prep' },
          { id: 'database' as const, label: 'Food Database' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-2 px-3 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Daily View */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Calorie & Macro Target Progress Card */}
          <div className="card p-4 bg-brand-surface border border-brand-border rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-text-secondary tracking-wider">
                  Daily Caloric Budget
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-brand-accent">{totalCalories}</span>
                  <span className="text-xs text-brand-text-secondary">/ {calorieGoal} kcal target</span>
                </div>
              </div>

              {/* Quick Macro Pills */}
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-brand-elevated px-3 py-1.5 rounded-xl border border-brand-border text-center">
                  <div className="text-[10px] text-brand-text-secondary">Protein</div>
                  <div className="font-bold text-brand-text-primary">{totalProtein}g / {proteinGoal}g</div>
                </div>
                <div className="bg-brand-elevated px-3 py-1.5 rounded-xl border border-brand-border text-center">
                  <div className="text-[10px] text-brand-text-secondary">Carbs</div>
                  <div className="font-bold text-brand-text-primary">{totalCarbs}g</div>
                </div>
                <div className="bg-brand-elevated px-3 py-1.5 rounded-xl border border-brand-border text-center">
                  <div className="text-[10px] text-brand-text-secondary">Fats</div>
                  <div className="font-bold text-brand-text-primary">{totalFat}g</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-brand-elevated h-2.5 rounded-full overflow-hidden border border-brand-border/60">
              <div
                className="bg-brand-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalCalories / calorieGoal) * 100))}%` }}
              />
            </div>
          </div>

          {/* Water Intake Tracker */}
          <div className="card p-3.5 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-brand-text-primary">Hydration Tracker</div>
                <div className="text-[11px] text-brand-text-secondary">
                  {waterIntake} ml logged today (Target: 2500 ml)
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                addWaterIntake(250);
                showToast('+250ml water logged!', 'success');
              }}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+250 ml</span>
            </button>
          </div>

          {/* Meals Timeline */}
          <div className="space-y-3">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
              const currentMeal = currentDay?.meals.find((m) => m.type === mealType);
              const mealEntries = currentMeal?.entries || [];
              const mealCalories = mealEntries.reduce((s, e) => s + e.calories, 0);

              return (
                <div
                  key={mealType}
                  className="card p-3.5 bg-brand-surface border border-brand-border rounded-xl space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs capitalize text-brand-text-primary">
                        {mealType}
                      </h4>
                      <span className="text-[10px] text-brand-accent font-semibold">
                        {Math.round(mealCalories)} kcal
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMealType(mealType);
                        setIsAddFoodOpen(true);
                      }}
                      className="btn-secondary text-[11px] px-2.5 py-1 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Food</span>
                    </button>
                  </div>

                  {/* Entries */}
                  {mealEntries.length === 0 ? (
                    <p className="text-[11px] text-brand-text-secondary/60 italic py-1">
                      No foods logged for {mealType}
                    </p>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      {mealEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated border border-brand-border/40 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-brand-text-primary block">
                              {entry.foodName}
                            </span>
                            <span className="text-[10px] text-brand-text-secondary">
                              {entry.servingSize} • P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-text-primary text-[11px]">
                              {entry.calories} kcal
                            </span>
                            <button
                              onClick={() => handleDeleteEntry(mealType, entry.id)}
                              className="p-1 text-brand-text-secondary hover:text-brand-error"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recipes Tab */}
      {activeTab === 'recipes' && (
        <div className="space-y-3">
          {state.savedRecipes.map((rec) => (
            <div
              key={rec.id}
              className="card p-4 bg-brand-surface border border-brand-border rounded-xl space-y-2 hover:border-brand-accent/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-brand-text-primary">{rec.name}</h4>
                <span className="badge-accent text-[10px]">{rec.totalCalories} kcal / serving</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-brand-text-secondary">
                <span>P: {rec.totalProtein}g</span>
                <span>•</span>
                <span>C: {rec.totalCarbs}g</span>
                <span>•</span>
                <span>F: {rec.totalFat}g</span>
                <span>•</span>
                <span>{rec.servings} servings</span>
              </div>
              <div className="pt-2 border-t border-brand-border/60 text-[11px] text-brand-text-secondary space-y-1">
                <span className="font-semibold text-brand-text-primary block text-[10px]">
                  Instructions:
                </span>
                {rec.instructions.map((step, i) => (
                  <p key={i}>
                    {i + 1}. {step}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Database Tab */}
      {activeTab === 'database' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-text-secondary absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="Search reference nutrition database..."
              className="input-field pl-9 text-xs py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredFoods.map((f) => (
              <div
                key={f.id}
                className="card p-3 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-brand-text-primary">{f.name}</div>
                  <div className="text-[10px] text-brand-text-secondary mt-0.5">
                    {f.servingSize} • P: {f.protein}g | C: {f.carbs}g | F: {f.fat}g
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-brand-accent text-xs block">{f.calories} kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      <Modal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        title={`Add to ${selectedMealType.toUpperCase()}`}
      >
        <div className="space-y-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-text-secondary absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="Search food library..."
              className="input-field pl-9 text-xs py-2"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredFoods.slice(0, 15).map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated border border-brand-border/60 hover:bg-brand-surface transition-colors"
              >
                <div>
                  <div className="font-semibold text-brand-text-primary">{f.name}</div>
                  <div className="text-[10px] text-brand-text-secondary">
                    {f.servingSize} • {f.calories} kcal
                  </div>
                </div>
                <button
                  onClick={() => handleAddFoodItem(f)}
                  className="btn-primary text-[11px] px-2.5 py-1 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
