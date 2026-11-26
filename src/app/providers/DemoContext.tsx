// ============================================================
// FitFolk Demo Context – Main application state
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

import type {
  DemoState,
  Post,
  User,
  Workout,
  NutritionDay,
  Question,
  Answer,
  Report,
  PrivacySettings,
  Comment,
  Message,
} from '../../types';

import { loadDemoState, saveDemoState, resetDemoState } from '../../lib/storage';
import { getInitialDemoState } from '../../data/demoData';
import { useToast } from './ToastContext';

// ---- Context value shape ----

interface DemoContextValue {
  state: DemoState;
  isLoggedIn: boolean;

  // Auth & User actions
  login: (usernameOrEmailOrId: string, password?: string) => boolean;
  logout: () => void;
  registerUser: (user: User) => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;

  // Post actions
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  archivePost: (postId: string) => void;
  unarchivePost: (postId: string) => void;
  hidePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;

  // Social actions
  toggleFollow: (userId: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Messages
  sendMessage: (conversationId: string, text: string) => void;

  // Workouts
  addWorkout: (workout: Workout) => void;

  // Nutrition
  updateNutrition: (day: NutritionDay) => void;
  addWaterIntake: (amount: number) => void;

  // Challenges
  joinChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;

  // Community Q&A
  addQuestion: (question: Question) => void;
  addAnswer: (questionId: string, answer: Answer) => void;
  upvoteQuestion: (questionId: string) => void;
  upvoteAnswer: (questionId: string, answerId: string) => void;

  // Live sessions
  toggleReminder: (sessionId: string) => void;

  // Settings
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;

  // Search
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Reports
  submitReport: (report: Report) => void;

  // Drafts
  saveDraft: (draft: Partial<Post>) => void;
  deleteDraft: (index: number) => void;

  // Tour
  setTourCompleted: (completed: boolean) => void;

  // Theme
  toggleTheme: () => void;

  // Demo lifecycle
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

// ---- Provider ----

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const [state, setState] = useState<DemoState>(() => {
    return loadDemoState() ?? getInitialDemoState();
  });

  // Ref to avoid saving on initial mount
  const isFirstRender = useRef(true);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveDemoState(state);
  }, [state]);

  // ---- Helper to update state immutably ----
  const update = useCallback(
    (updater: (prev: DemoState) => DemoState) => setState(updater),
    [],
  );

  // Toast notifier for real-time network events
  let showToast: ((message: string, type: 'success' | 'error' | 'info') => void) | undefined;
  try {
    const toastContext = useToast();
    showToast = toastContext?.showToast;
  } catch {
    // Graceful fallback if instantiated outside provider
  }

  // Ref for local multi-tab broadcast channel
  const channelRef = useRef<BroadcastChannel | null>(null);

  // =========================================================
  // Real-Time Local Server Synchronization (SSE + REST)
  // Syncs users, profile updates, and posts between devices on Wi-Fi
  // =========================================================
  useEffect(() => {
    // 1. Initial fetch of any server-stored users
    fetch('/api/users')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.users && Array.isArray(data.users) && data.users.length > 0) {
          update((s) => {
            const updatedUsers = { ...s.users };
            let hasChanges = false;
            for (const u of data.users) {
              if (!updatedUsers[u.id] || JSON.stringify(updatedUsers[u.id]) !== JSON.stringify(u)) {
                updatedUsers[u.id] = u;
                hasChanges = true;
              }
            }
            if (!hasChanges) return s;
            return { ...s, users: updatedUsers };
          });
        }
      })
      .catch(() => {});

    // 2. Initial fetch of server-stored posts
    fetch('/api/posts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          update((s) => {
            const existingIds = new Set(s.posts.map((p) => p.id));
            const newPosts = data.posts.filter((p: any) => !existingIds.has(p.id));
            if (newPosts.length === 0) return s;
            return { ...s, posts: [...newPosts, ...s.posts] };
          });
        }
      })
      .catch(() => {});

    // 3. Connect to Server-Sent Events (SSE) stream for live push
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === 'user_registered' && payload.user) {
            const incomingUser: User = payload.user;
            update((s) => {
              if (s.users[incomingUser.id]) return s; // already added locally
              return {
                ...s,
                users: {
                  ...s.users,
                  [incomingUser.id]: incomingUser,
                },
                following: {
                  ...s.following,
                  [incomingUser.id]: s.following[incomingUser.id] || ['user-sarah', 'user-raj'],
                },
                followers: {
                  ...s.followers,
                  [incomingUser.id]: s.followers[incomingUser.id] || [],
                },
              };
            });

            if (showToast) {
              showToast(`🎉 New athlete joined! @${incomingUser.username} created a profile.`, 'success');
            }
          } else if (payload.type === 'user_updated' && payload.userId && payload.updates) {
            update((s) => {
              const u = s.users[payload.userId];
              if (!u) return s;
              return {
                ...s,
                users: {
                  ...s.users,
                  [payload.userId]: { ...u, ...payload.updates },
                },
              };
            });
          } else if (payload.type === 'post_created' && payload.post) {
            const incomingPost: Post = payload.post;
            update((s) => {
              if (s.posts.some((p) => p.id === incomingPost.id)) return s;
              return {
                ...s,
                posts: [incomingPost, ...s.posts],
              };
            });
          } else if (payload.type === 'post_deleted' && payload.postId) {
            update((s) => ({
              ...s,
              posts: s.posts.filter((p) => p.id !== payload.postId),
              likedPostIds: s.likedPostIds.filter((id) => id !== payload.postId),
              savedPostIds: s.savedPostIds.filter((id) => id !== payload.postId),
              archivedPostIds: (s.archivedPostIds || []).filter((id) => id !== payload.postId),
            }));
          } else if (payload.type === 'post_archived' && payload.postId) {
            update((s) => ({
              ...s,
              posts: s.posts.map((p) =>
                p.id === payload.postId ? { ...p, isArchived: payload.isArchived } : p
              ),
              archivedPostIds: payload.isArchived
                ? [...new Set([...(s.archivedPostIds || []), payload.postId])]
                : (s.archivedPostIds || []).filter((id) => id !== payload.postId),
            }));
          } else if (payload.type === 'follow_toggled' && payload.followerId && payload.followingId) {
            update((s) => {
              const currentFollowing = s.following[payload.followerId] || [];
              const currentFollowers = s.followers[payload.followingId] || [];
              const nextFollowing = payload.isFollowing
                ? [...new Set([...currentFollowing, payload.followingId])]
                : currentFollowing.filter((id: string) => id !== payload.followingId);
              const nextFollowers = payload.isFollowing
                ? [...new Set([...currentFollowers, payload.followerId])]
                : currentFollowers.filter((id: string) => id !== payload.followerId);

              const followerUser = s.users[payload.followerId];
              const targetUser = s.users[payload.followingId];

              return {
                ...s,
                following: { ...s.following, [payload.followerId]: nextFollowing },
                followers: { ...s.followers, [payload.followingId]: nextFollowers },
                users: {
                  ...s.users,
                  ...(followerUser
                    ? {
                        [payload.followerId]: {
                          ...followerUser,
                          following: Math.max(0, nextFollowing.length),
                        },
                      }
                    : {}),
                  ...(targetUser
                    ? {
                        [payload.followingId]: {
                          ...targetUser,
                          followers: Math.max(0, nextFollowers.length),
                        },
                      }
                    : {}),
                },
              };
            });
          }
        } catch (err) {
          console.warn('[FitFolk Sync] Error parsing SSE payload:', err);
        }
      };
    } catch (err) {
      console.warn('[FitFolk Sync] EventSource connection failed:', err);
    }

    // 4. Setup BroadcastChannel for multi-tab sync
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('fitfolk_network_sync');
        channelRef.current = ch;
        ch.onmessage = (e) => {
          if (e.data?.type === 'user_registered' && e.data.user) {
            const incomingUser: User = e.data.user;
            update((s) => {
              if (s.users[incomingUser.id]) return s;
              return {
                ...s,
                users: {
                  ...s.users,
                  [incomingUser.id]: incomingUser,
                },
              };
            });
          }
        };
      }
    } catch {}

    return () => {
      eventSource?.close();
      channelRef.current?.close();
    };
  }, [update, showToast]);

  // ===================== Actions =====================

  const login = useCallback(
    (identifier: string, password?: string): boolean => {
      let matchedUserId = '';
      const cleanIdent = identifier.trim().toLowerCase();

      // Check if identifier is exact user ID
      if (state.users[identifier]) {
        matchedUserId = identifier;
      } else {
        // Search by username or email
        const found = Object.values(state.users).find(
          (u) =>
            u.username.toLowerCase() === cleanIdent ||
            (u.email && u.email.toLowerCase() === cleanIdent)
        );
        if (found) {
          matchedUserId = found.id;
        }
      }

      if (!matchedUserId) {
        return false;
      }

      const user = state.users[matchedUserId];

      // If a password was provided, validate it
      if (password !== undefined && password.trim() !== '') {
        const validPassword = user.password || 'fitfolk123';
        if (password !== validPassword && password !== 'fitfolk123') {
          return false;
        }
      }

      update((s) => ({
        ...s,
        currentUserId: matchedUserId,
        isLoggedIn: true,
      }));
      return true;
    },
    [state.users, update]
  );

  const logout = useCallback(
    () =>
      update((s) => ({
        ...s,
        currentUserId: '',
        isLoggedIn: false,
      })),
    [update]
  );

  const registerUser = useCallback(
    (newUser: User) => {
      update((s) => ({
        ...s,
        users: {
          ...s.users,
          [newUser.id]: newUser,
        },
        currentUserId: newUser.id,
        isLoggedIn: true,
        following: {
          ...s.following,
          [newUser.id]: ['user-sarah', 'user-raj'],
        },
        followers: {
          ...s.followers,
          [newUser.id]: [],
        },
      }));

      // Broadcast to other tabs in same browser
      try {
        channelRef.current?.postMessage({ type: 'user_registered', user: newUser });
      } catch {}

      // Broadcast to server for other devices on local network
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch((err) => {
        console.warn('[FitFolk Sync] Could not reach server:', err);
      });
    },
    [update],
  );

  const switchUser = useCallback(
    (userId: string) =>
      update((s) => {
        if (!s.users[userId]) return s;
        return { ...s, currentUserId: userId, isLoggedIn: true };
      }),
    [update],
  );

  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      let currentId = '';
      update((s) => {
        currentId = s.currentUserId;
        const user = s.users[s.currentUserId];
        if (!user) return s;
        return {
          ...s,
          users: {
            ...s.users,
            [s.currentUserId]: { ...user, ...updates, id: user.id },
          },
        };
      });

      if (currentId) {
        fetch('/api/users/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentId, updates }),
        }).catch(() => {});
      }
    },
    [update],
  );

  // ---- Posts ----

  const toggleLike = useCallback(
    (postId: string) =>
      update((s) => {
        const isLiked = s.likedPostIds.includes(postId);
        return {
          ...s,
          posts: s.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isLiked: !isLiked,
                  likes: p.likes + (isLiked ? -1 : 1),
                }
              : p,
          ),
          likedPostIds: isLiked
            ? s.likedPostIds.filter((id) => id !== postId)
            : [...s.likedPostIds, postId],
        };
      }),
    [update],
  );

  const toggleSave = useCallback(
    (postId: string) =>
      update((s) => {
        const isSaved = s.savedPostIds.includes(postId);
        return {
          ...s,
          posts: s.posts.map((p) =>
            p.id === postId ? { ...p, isSaved: !isSaved } : p,
          ),
          savedPostIds: isSaved
            ? s.savedPostIds.filter((id) => id !== postId)
            : [...s.savedPostIds, postId],
        };
      }),
    [update],
  );

  const addPost = useCallback(
    (post: Post) => {
      update((s) => ({
        ...s,
        posts: [post, ...s.posts],
      }));

      // Post to server for other devices on local network
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      }).catch(() => {});
    },
    [update],
  );

  const deletePost = useCallback(
    (postId: string) => {
      update((s) => ({
        ...s,
        posts: s.posts.filter((p) => p.id !== postId),
        likedPostIds: s.likedPostIds.filter((id) => id !== postId),
        savedPostIds: s.savedPostIds.filter((id) => id !== postId),
        archivedPostIds: (s.archivedPostIds || []).filter((id) => id !== postId),
      }));

      // Delete from server for all devices
      fetch('/api/posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      }).catch(() => {});
    },
    [update],
  );

  const archivePost = useCallback(
    (postId: string) => {
      update((s) => ({
        ...s,
        posts: s.posts.map((p) => (p.id === postId ? { ...p, isArchived: true } : p)),
        archivedPostIds: [...new Set([...(s.archivedPostIds || []), postId])],
      }));

      // Sync archive status with server
      fetch('/api/posts/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, isArchived: true }),
      }).catch(() => {});
    },
    [update],
  );

  const unarchivePost = useCallback(
    (postId: string) => {
      update((s) => ({
        ...s,
        posts: s.posts.map((p) => (p.id === postId ? { ...p, isArchived: false } : p)),
        archivedPostIds: (s.archivedPostIds || []).filter((id) => id !== postId),
      }));

      // Sync unarchive status with server
      fetch('/api/posts/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, isArchived: false }),
      }).catch(() => {});
    },
    [update],
  );

  const hidePost = useCallback(
    (postId: string) =>
      update((s) => ({
        ...s,
        posts: s.posts.filter((p) => p.id !== postId),
      })),
    [update],
  );

  const addComment = useCallback(
    (postId: string, text: string) =>
      update((s) => {
        const comment: Comment = {
          id: `comment-${Date.now()}`,
          userId: s.currentUserId,
          text,
          likes: 0,
          isLiked: false,
          createdAt: new Date().toISOString(),
        };
        return {
          ...s,
          posts: s.posts.map((p) =>
            p.id === postId
              ? { ...p, comments: [...p.comments, comment] }
              : p,
          ),
        };
      }),
    [update],
  );

  // ---- Social ----

  const toggleFollow = useCallback(
    (userId: string) =>
      update((s) => {
        const myFollowing = s.following[s.currentUserId] ?? [];
        const isFollowing = myFollowing.includes(userId);

        const newFollowing = isFollowing
          ? myFollowing.filter((id) => id !== userId)
          : [...myFollowing, userId];

        const theirFollowers = s.followers[userId] ?? [];
        const newFollowers = isFollowing
          ? theirFollowers.filter((id) => id !== s.currentUserId)
          : [...theirFollowers, s.currentUserId];

        // Update follower/following counts on user objects
        const currentUser = s.users[s.currentUserId];
        const targetUser = s.users[userId];

        return {
          ...s,
          following: { ...s.following, [s.currentUserId]: newFollowing },
          followers: { ...s.followers, [userId]: newFollowers },
          users: {
            ...s.users,
            ...(currentUser
              ? {
                  [s.currentUserId]: {
                    ...currentUser,
                    following: currentUser.following + (isFollowing ? -1 : 1),
                  },
                }
              : {}),
            ...(targetUser
              ? {
                  [userId]: {
                    ...targetUser,
                    followers: targetUser.followers + (isFollowing ? -1 : 1),
                  },
                }
              : {}),
          },
        };
      }),
    [update],
  );

  // ---- Notifications ----

  const markNotificationRead = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
      })),
    [update],
  );

  const markAllNotificationsRead = useCallback(
    () =>
      update((s) => ({
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      })),
    [update],
  );

  // ---- Messages ----

  const sendMessage = useCallback(
    (conversationId: string, text: string) =>
      update((s) => {
        const message: Message = {
          id: `msg-${Date.now()}`,
          senderId: s.currentUserId,
          text,
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: true,
        };

        return {
          ...s,
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  lastMessageAt: message.timestamp,
                }
              : c,
          ),
        };
      }),
    [update],
  );

  // ---- Workouts ----

  const addWorkout = useCallback(
    (workout: Workout) =>
      update((s) => ({
        ...s,
        workouts: [workout, ...s.workouts],
      })),
    [update],
  );

  // ---- Nutrition ----

  const updateNutrition = useCallback(
    (day: NutritionDay) =>
      update((s) => {
        const exists = s.nutritionDays.some((d) => d.date === day.date);
        return {
          ...s,
          nutritionDays: exists
            ? s.nutritionDays.map((d) => (d.date === day.date ? day : d))
            : [...s.nutritionDays, day],
        };
      }),
    [update],
  );

  const addWaterIntake = useCallback(
    (amount: number) =>
      update((s) => {
        const today = new Date().toISOString().split('T')[0];
        const exists = s.nutritionDays.some((d) => d.date === today);
        return {
          ...s,
          nutritionDays: exists
            ? s.nutritionDays.map((d) =>
                d.date === today
                  ? { ...d, waterIntake: d.waterIntake + amount }
                  : d,
              )
            : [
                ...s.nutritionDays,
                {
                  date: today,
                  meals: [],
                  waterIntake: amount,
                  calorieGoal: 2200,
                  proteinGoal: 150,
                  carbsGoal: 250,
                  fatGoal: 70,
                },
              ],
        };
      }),
    [update],
  );

  // ---- Challenges ----

  const joinChallenge = useCallback(
    (challengeId: string) =>
      update((s) => ({
        ...s,
        challenges: s.challenges.map((c) =>
          c.id === challengeId
            ? {
                ...c,
                isJoined: !c.isJoined,
                participantCount:
                  c.participantCount + (c.isJoined ? -1 : 1),
              }
            : c,
        ),
      })),
    [update],
  );

  const updateChallengeProgress = useCallback(
    (challengeId: string, progress: number) =>
      update((s) => ({
        ...s,
        challenges: s.challenges.map((c) =>
          c.id === challengeId
            ? { ...c, progress: Math.min(100, Math.max(0, progress)) }
            : c,
        ),
      })),
    [update],
  );

  // ---- Community Q&A ----

  const addQuestion = useCallback(
    (question: Question) =>
      update((s) => ({
        ...s,
        questions: [question, ...s.questions],
      })),
    [update],
  );

  const addAnswer = useCallback(
    (questionId: string, answer: Answer) =>
      update((s) => ({
        ...s,
        questions: s.questions.map((q) =>
          q.id === questionId
            ? { ...q, answers: [...q.answers, answer] }
            : q,
        ),
      })),
    [update],
  );

  const upvoteQuestion = useCallback(
    (questionId: string) =>
      update((s) => ({
        ...s,
        questions: s.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                isUpvoted: !q.isUpvoted,
                upvotes: q.upvotes + (q.isUpvoted ? -1 : 1),
              }
            : q,
        ),
      })),
    [update],
  );

  const upvoteAnswer = useCallback(
    (questionId: string, answerId: string) =>
      update((s) => ({
        ...s,
        questions: s.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a.id === answerId
                    ? {
                        ...a,
                        isUpvoted: !a.isUpvoted,
                        upvotes: a.upvotes + (a.isUpvoted ? -1 : 1),
                      }
                    : a,
                ),
              }
            : q,
        ),
      })),
    [update],
  );

  // ---- Live sessions ----

  const toggleReminder = useCallback(
    (sessionId: string) =>
      update((s) => ({
        ...s,
        liveSessions: s.liveSessions.map((ls) =>
          ls.id === sessionId
            ? { ...ls, hasReminder: !ls.hasReminder }
            : ls,
        ),
      })),
    [update],
  );

  // ---- Settings ----

  const updatePrivacySettings = useCallback(
    (settings: Partial<PrivacySettings>) =>
      update((s) => ({
        ...s,
        privacySettings: { ...s.privacySettings, ...settings },
      })),
    [update],
  );

  // ---- Search ----

  const addRecentSearch = useCallback(
    (term: string) =>
      update((s) => {
        const trimmed = term.trim();
        if (!trimmed) return s;
        const filtered = s.recentSearches.filter((t) => t !== trimmed);
        return {
          ...s,
          recentSearches: [trimmed, ...filtered].slice(0, 20),
        };
      }),
    [update],
  );

  const clearRecentSearches = useCallback(
    () => update((s) => ({ ...s, recentSearches: [] })),
    [update],
  );

  // ---- Reports ----

  const submitReport = useCallback(
    (report: Report) =>
      update((s) => ({
        ...s,
        reports: [...s.reports, report],
      })),
    [update],
  );

  // ---- Drafts ----

  const saveDraft = useCallback(
    (draft: Partial<Post>) =>
      update((s) => ({
        ...s,
        drafts: [...s.drafts, draft],
      })),
    [update],
  );

  const deleteDraft = useCallback(
    (index: number) =>
      update((s) => ({
        ...s,
        drafts: s.drafts.filter((_, i) => i !== index),
      })),
    [update],
  );

  // ---- Tour ----

  const setTourCompleted = useCallback(
    (completed: boolean) =>
      update((s) => ({ ...s, tourCompleted: completed })),
    [update],
  );

  // ---- Theme ----

  const toggleTheme = useCallback(
    () =>
      update((s) => ({
        ...s,
        theme: s.theme === 'dark' ? 'light' : 'dark',
      })),
    [update],
  );

  // ---- Demo lifecycle ----

  const resetDemo = useCallback(() => {
    resetDemoState();
    const fresh = getInitialDemoState();
    setState(fresh);
    saveDemoState(fresh);
  }, []);

  // ---- Context value (stable reference via useCallback) ----

  const value: DemoContextValue = {
    state,
    isLoggedIn: state.isLoggedIn === true && !!state.currentUserId && !!state.users[state.currentUserId],
    login,
    logout,
    registerUser,
    switchUser,
    updateProfile,
    toggleLike,
    toggleSave,
    addPost,
    deletePost,
    archivePost,
    unarchivePost,
    hidePost,
    addComment,
    toggleFollow,
    markNotificationRead,
    markAllNotificationsRead,
    sendMessage,
    addWorkout,
    updateNutrition,
    addWaterIntake,
    joinChallenge,
    updateChallengeProgress,
    addQuestion,
    addAnswer,
    upvoteQuestion,
    upvoteAnswer,
    toggleReminder,
    updatePrivacySettings,
    addRecentSearch,
    clearRecentSearches,
    submitReport,
    saveDraft,
    deleteDraft,
    setTourCompleted,
    toggleTheme,
    resetDemo,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

/**
 * Access the demo context. Must be used within a DemoProvider.
 */
export function useDemoContext(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error('useDemoContext must be used within a <DemoProvider>');
  }
  return ctx;
}

export default DemoProvider;
