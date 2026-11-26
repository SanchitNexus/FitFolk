// ============================================================
// FitFolk Type Definitions
// ============================================================

// --- User & Auth ---
export type VerificationCategory =
  | 'personal_trainer'
  | 'dietitian'
  | 'doctor'
  | 'sports_coach'
  | 'yoga_instructor'
  | 'fitness_researcher'
  | 'fitness_influencer';

export interface ProfessionalCredential {
  title: string;
  issuer: string;
  year: number;
  category: VerificationCategory;
}

export interface User {
  id: string;
  displayName: string;
  username: string;
  email?: string;
  password?: string;
  bio: string;
  avatarUrl?: string;
  avatarGradient: [string, string]; // Two colors for CSS gradient avatar
  avatarInitials: string;
  isVerified: boolean;
  verificationCategory?: VerificationCategory;
  credentials?: ProfessionalCredential[];
  fitnessInterests: string[];
  fitnessGoals: string[];
  followers: number;
  following: number;
  postsCount: number;
  isPrivate: boolean;
  externalLinks?: { label: string; url: string }[];
  joinedDate: string;
  personalRecords?: PersonalRecord[];
  achievements?: Achievement[];
}

export interface PersonalRecord {
  exercise: string;
  value: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
}

// --- Posts ---
export type PostType =
  | 'photo'
  | 'video'
  | 'text'
  | 'carousel'
  | 'workout'
  | 'nutrition'
  | 'poll'
  | 'article'
  | 'progress'
  | 'question';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Post {
  id: string;
  userId: string;
  type: PostType;
  caption: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  thumbnailUrl?: string;
  isReel?: boolean;
  mediaPlaceholders?: MediaPlaceholder[];
  hashtags: string[];
  topicTags: string[];
  likes: number;
  comments: Comment[];
  reposts: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  isReposted: boolean;
  isArchived?: boolean;
  // Poll specific
  pollOptions?: PollOption[];
  pollEndsAt?: string;
  votedOptionId?: string;
  // Workout specific
  workoutData?: WorkoutSummary;
  // Nutrition specific
  nutritionData?: NutritionSummary;
  // Article specific
  articleTitle?: string;
  articleBody?: string;
  references?: string[];
  // Progress specific
  progressType?: 'weight' | 'strength' | 'endurance' | 'physique';
  progressBefore?: string;
  progressAfter?: string;
}

export interface MediaPlaceholder {
  type: 'image' | 'video' | 'carousel';
  gradient: [string, string];
  label: string;
  aspectRatio?: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
  isVerifiedProfessional?: boolean;
}

// --- Stories ---
export interface Story {
  id: string;
  userId: string;
  items: StoryItem[];
  isViewed: boolean;
  createdAt: string;
  expiresAt: string;
  audience: 'public' | 'close_friends';
}

export interface StoryItem {
  id: string;
  type: 'text' | 'photo' | 'video' | 'poll' | 'question';
  gradient?: [string, string];
  text?: string;
  pollQuestion?: string;
  pollOptions?: string[];
  questionPrompt?: string;
  duration: number; // seconds
}

export interface StoryHighlight {
  id: string;
  userId: string;
  title: string;
  coverGradient: [string, string];
  storyIds: string[];
}

// --- Workouts ---
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'bodyweight' | 'olympic';
  equipment: string;
  instructions: string[];
  safetyNotes?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkoutSet {
  id: string;
  reps?: number;
  weight?: number;
  duration?: number; // seconds
  distance?: number; // meters
  isCompleted: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  restSeconds: number;
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  title: string;
  exercises: WorkoutExercise[];
  duration: number; // minutes
  date: string;
  isTemplate: boolean;
  isCompleted: boolean;
  notes?: string;
  calories?: number;
}

export interface WorkoutSummary {
  title: string;
  exerciseCount: number;
  duration: number;
  totalVolume?: number;
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  description: string;
  exercises: Omit<WorkoutExercise, 'id'>[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  estimatedDuration: number;
  createdBy: string;
}

// --- Nutrition ---
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  category: string;
}

export interface MealEntry {
  id: string;
  foodId: string;
  foodName: string;
  servings: number;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  entries: MealEntry[];
  date: string;
}

export interface NutritionDay {
  date: string;
  meals: Meal[];
  waterIntake: number; // ml
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

export interface NutritionSummary {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface SavedRecipe {
  id: string;
  name: string;
  ingredients: MealEntry[];
  instructions: string[];
  servings: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// --- Messages ---
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'workout' | 'post' | 'voice';
  isRead: boolean;
  sharedPostId?: string;
  sharedWorkoutId?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  isGroup: boolean;
  groupName?: string;
  messages: Message[];
  lastMessageAt: string;
  isMuted: boolean;
  isRequest: boolean;
  unreadCount: number;
}

// --- Notifications ---
export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'follow_request'
  | 'mention'
  | 'tag'
  | 'message'
  | 'reply'
  | 'challenge_reminder'
  | 'challenge_result'
  | 'live_reminder'
  | 'safety_alert'
  | 'achievement';

export interface Notification {
  id: string;
  type: NotificationType;
  fromUserId: string;
  message: string;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'workout' | 'challenge' | 'profile' | 'live';
  isRead: boolean;
  createdAt: string;
  isSafety?: boolean;
}

// --- Community Q&A ---
export interface Question {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  isAnonymous: boolean;
  answers: Answer[];
  upvotes: number;
  isUpvoted: boolean;
  views: number;
  createdAt: string;
  acceptedAnswerId?: string;
}

export interface Answer {
  id: string;
  userId: string;
  body: string;
  upvotes: number;
  isUpvoted: boolean;
  isAccepted: boolean;
  isVerifiedProfessional: boolean;
  references?: string[];
  createdAt: string;
  replies?: Answer[];
}

// --- Challenges ---
export type ChallengeType = 'daily' | 'weekly' | 'community' | 'individual' | 'team';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  rules: string[];
  startDate: string;
  endDate: string;
  goal: string;
  participantCount: number;
  maxParticipants?: number;
  progress: number; // 0-100
  isJoined: boolean;
  createdBy: string;
  leaderboard: LeaderboardEntry[];
  badges: ChallengeBadge[];
  safetyGuidelines: string[];
  isPrivate: boolean;
  category: string;
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  score: number;
  progress: number;
}

export interface ChallengeBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
}

// --- Live Sessions ---
export interface LiveSession {
  id: string;
  hostId: string;
  title: string;
  description: string;
  topic: string;
  scheduledAt: string;
  isLive: boolean;
  viewerCount: number;
  hasReminder: boolean;
  chatMessages: LiveChatMessage[];
  allowsReplay: boolean;
  duration?: number;
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  isQuestion: boolean;
}

// --- Settings ---
export interface PrivacySettings {
  isPrivate: boolean;
  allowFollowRequests: boolean;
  allowComments: 'everyone' | 'followers' | 'none';
  allowMentions: 'everyone' | 'followers' | 'none';
  allowDMs: 'everyone' | 'followers' | 'none';
  hideEngagementCounts: boolean;
  showWorkoutLogs: 'public' | 'followers' | 'private';
  showNutritionLogs: 'public' | 'followers' | 'private';
  allowResharing: boolean;
}

export interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  mentions: boolean;
  messages: boolean;
  challengeReminders: boolean;
  liveReminders: boolean;
  safetyAlerts: boolean;
}

// --- Report ---
export type ReportCategory =
  | 'spam'
  | 'harassment'
  | 'misinformation'
  | 'inappropriate'
  | 'impersonation'
  | 'self_harm'
  | 'misleading_health'
  | 'other';

export interface Report {
  id: string;
  targetType: 'post' | 'comment' | 'user' | 'message' | 'question' | 'answer';
  targetId: string;
  category: ReportCategory;
  description: string;
  createdAt: string;
  status: 'submitted' | 'reviewed';
}

// --- App State ---
export interface DemoState {
  version: number;
  currentUserId: string;
  isLoggedIn?: boolean;
  theme: 'dark' | 'light';
  users: Record<string, User>;
  posts: Post[];
  stories: Story[];
  storyHighlights: StoryHighlight[];
  workouts: Workout[];
  workoutTemplates: WorkoutTemplate[];
  exercises: Exercise[];
  nutritionDays: NutritionDay[];
  foodDatabase: FoodItem[];
  savedRecipes: SavedRecipe[];
  conversations: Conversation[];
  notifications: Notification[];
  questions: Question[];
  challenges: Challenge[];
  liveSessions: LiveSession[];
  following: Record<string, string[]>; // userId -> [followedUserIds]
  followers: Record<string, string[]>;
  savedPostIds: string[];
  likedPostIds: string[];
  archivedPostIds?: string[];
  blockedUserIds: string[];
  mutedUserIds: string[];
  reports: Report[];
  privacySettings: PrivacySettings;
  notificationPreferences: NotificationPreferences;
  recentSearches: string[];
  tourCompleted: boolean;
  drafts: Partial<Post>[];
  activeWorkoutId?: string;
}

// --- Tour ---
export interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}
