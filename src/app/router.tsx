import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import FeedPage from '../features/feed/FeedPage';
import ExplorePage from '../features/explore/ExplorePage';
import ReelsPage from '../features/reels/ReelsPage';
import ProfilePage from '../features/profiles/ProfilePage';
import MessagesPage from '../features/messages/MessagesPage';
import NotificationsPage from '../features/notifications/NotificationsPage';
import WorkoutPage from '../features/workouts/WorkoutPage';
import NutritionPage from '../features/nutrition/NutritionPage';
import CommunityPage from '../features/community/CommunityPage';
import ChallengesPage from '../features/challenges/ChallengesPage';
import LivePage from '../features/live/LivePage';
import SavedPage from '../features/saved/SavedPage';
import SettingsPage from '../features/settings/SettingsPage';
import CreatePage from '../features/create/CreatePage';
import JoinPage from '../features/auth-demo/JoinPage';
import LoginPage from '../features/auth/LoginPage';
import SignupPage from '../features/auth/SignupPage';
import AICoachPage from '../features/ai-coach/AICoachPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'join', element: <SignupPage /> },
      { path: 'ai-coach', element: <AICoachPage /> },
      { path: 'search', element: <ExplorePage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'reels', element: <ReelsPage /> },
      { path: 'profile/:username', element: <ProfilePage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'workouts', element: <WorkoutPage /> },
      { path: 'nutrition', element: <NutritionPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'challenges', element: <ChallengesPage /> },
      { path: 'live', element: <LivePage /> },
      { path: 'saved', element: <SavedPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'create', element: <CreatePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
