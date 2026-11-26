import type { DemoState } from '../types';
import { seedUsers } from './seed/users';
import { seedPosts } from './seed/posts';
import { seedExercises } from './seed/exercises';
import { seedWorkoutTemplates, seedWorkouts } from './seed/workouts';
import { seedFoodDatabase, seedNutritionDays, seedSavedRecipes } from './seed/nutrition';
import { seedConversations, seedNotifications, seedQuestions, seedChallenges, seedLiveSessions, seedStories } from './seed/social';

export function getInitialDemoState(): DemoState {
  // New visitors / devices start logged out in guest mode
  const currentUserId = '';

  // Build following graph
  const following: Record<string, string[]> = {
    'user-priya': ['user-sarah', 'user-raj', 'user-zoe', 'user-aisha', 'user-jake'],
    'user-marcus': ['user-luna', 'user-mike', 'user-sarah', 'user-raj'],
    'user-sarah': ['user-raj', 'user-mike', 'user-zoe', 'user-marcus', 'user-luna'],
    'user-raj': ['user-sarah', 'user-mike', 'user-alex'],
    'user-zoe': ['user-sarah', 'user-aisha', 'user-alex', 'user-luna'],
    'user-aisha': ['user-alex', 'user-zoe', 'user-sarah', 'user-priya'],
    'user-jake': ['user-sarah', 'user-raj', 'user-marcus', 'user-mike', 'user-priya'],
    'user-mike': ['user-sarah', 'user-marcus', 'user-luna'],
    'user-luna': ['user-marcus', 'user-mike', 'user-sarah', 'user-zoe'],
    'user-alex': ['user-aisha', 'user-zoe', 'user-raj', 'user-sarah'],
  };

  // Build followers from following
  const followers: Record<string, string[]> = {};
  Object.keys(seedUsers).forEach(uid => { followers[uid] = []; });
  Object.entries(following).forEach(([uid, followedIds]) => {
    followedIds.forEach(fid => {
      if (followers[fid] && !followers[fid].includes(uid)) {
        followers[fid].push(uid);
      }
    });
  });

  return {
    version: 4,
    currentUserId,
    isLoggedIn: false,
    theme: 'dark',
    users: { ...seedUsers },
    posts: [...seedPosts],
    stories: [...seedStories],
    storyHighlights: [],
    workouts: [...seedWorkouts],
    workoutTemplates: [...seedWorkoutTemplates],
    exercises: [...seedExercises],
    nutritionDays: [...seedNutritionDays],
    foodDatabase: [...seedFoodDatabase],
    savedRecipes: [...seedSavedRecipes],
    conversations: [...seedConversations],
    notifications: [...seedNotifications],
    questions: [...seedQuestions],
    challenges: [...seedChallenges],
    liveSessions: [...seedLiveSessions],
    following,
    followers,
    savedPostIds: [],
    likedPostIds: [],
    archivedPostIds: [],
    blockedUserIds: [],
    mutedUserIds: [],
    reports: [],
    privacySettings: {
      isPrivate: false,
      allowFollowRequests: true,
      allowComments: 'everyone',
      allowMentions: 'everyone',
      allowDMs: 'everyone',
      hideEngagementCounts: false,
      showWorkoutLogs: 'public',
      showNutritionLogs: 'followers',
      allowResharing: true,
    },
    notificationPreferences: {
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      messages: true,
      challengeReminders: true,
      liveReminders: true,
      safetyAlerts: true,
    },
    recentSearches: [],
    tourCompleted: false,
    drafts: [],
  };
}
