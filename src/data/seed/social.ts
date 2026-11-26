import type { Conversation, Notification, Question, Challenge, LiveSession, Story } from '../../types';

export const seedConversations: Conversation[] = [
  {
    id: 'conv-1', participantIds: ['user-priya', 'user-sarah'], isGroup: false, isMuted: false, isRequest: false, unreadCount: 2,
    lastMessageAt: '2026-10-25T09:30:00Z',
    messages: [
      { id: 'msg-1', senderId: 'user-priya', text: 'Hi Coach Sarah! I just started doing push-ups and my wrists hurt. Is that normal?', timestamp: '2026-10-25T09:15:00Z', type: 'text', isRead: true },
      { id: 'msg-2', senderId: 'user-sarah', text: 'Hey Priya! Wrist pain during push-ups is quite common for beginners. Try doing them on your fists or using push-up handles to keep your wrists neutral.', timestamp: '2026-10-25T09:20:00Z', type: 'text', isRead: true },
      { id: 'msg-3', senderId: 'user-sarah', text: 'Also, try some wrist warm-up circles before your workout. If the pain persists, consult a physiotherapist.', timestamp: '2026-10-25T09:22:00Z', type: 'text', isRead: true },
      { id: 'msg-4', senderId: 'user-priya', text: 'Thank you so much! Will try the fist push-ups today 💪', timestamp: '2026-10-25T09:25:00Z', type: 'text', isRead: false },
      { id: 'msg-5', senderId: 'user-sarah', text: 'You got this! Let me know how it goes 🙌', timestamp: '2026-10-25T09:30:00Z', type: 'text', isRead: false },
    ],
  },
  {
    id: 'conv-2', participantIds: ['user-marcus', 'user-luna'], isGroup: false, isMuted: false, isRequest: false, unreadCount: 1,
    lastMessageAt: '2026-10-24T18:45:00Z',
    messages: [
      { id: 'msg-6', senderId: 'user-marcus', text: 'Luna, that 145kg squat was insane! What program are you running?', timestamp: '2026-10-24T18:30:00Z', type: 'text', isRead: true },
      { id: 'msg-7', senderId: 'user-luna', text: 'Thanks Marcus! I\'m doing a modified 5/3/1 with extra squat volume. Been running it for 12 weeks now.', timestamp: '2026-10-24T18:35:00Z', type: 'text', isRead: true },
      { id: 'msg-8', senderId: 'user-marcus', text: 'Nice! I might try that for my deadlift. Been stuck at 190 for a while.', timestamp: '2026-10-24T18:40:00Z', type: 'text', isRead: true },
      { id: 'msg-9', senderId: 'user-luna', text: 'Happy to share my spreadsheet! Let me know 💪', timestamp: '2026-10-24T18:45:00Z', type: 'text', isRead: false },
    ],
  },
  {
    id: 'conv-3', participantIds: ['user-jake', 'user-raj'], isGroup: false, isMuted: false, isRequest: true, unreadCount: 1,
    lastMessageAt: '2026-10-24T14:10:00Z',
    messages: [
      { id: 'msg-10', senderId: 'user-jake', text: 'Dr. Patel, I read your article on protein timing. Does it really matter if I eat protein right after workout?', timestamp: '2026-10-24T14:00:00Z', type: 'text', isRead: true },
      { id: 'msg-11', senderId: 'user-raj', text: 'Great question Jake! The "anabolic window" is a bit of a myth. Total daily protein intake matters far more than timing. Aim for 1.6-2.2g per kg bodyweight spread across meals.', timestamp: '2026-10-24T14:10:00Z', type: 'text', isRead: false },
    ],
  },
  {
    id: 'conv-4', participantIds: ['user-zoe', 'user-aisha', 'user-alex'], isGroup: true, groupName: 'Morning Crew 🌅', isMuted: false, isRequest: false, unreadCount: 0,
    lastMessageAt: '2026-10-25T06:30:00Z',
    messages: [
      { id: 'msg-12', senderId: 'user-aisha', text: 'Who\'s up for a 6am run tomorrow?', timestamp: '2026-10-25T06:00:00Z', type: 'text', isRead: true },
      { id: 'msg-13', senderId: 'user-alex', text: 'I\'m in! I\'ll do yoga after at the park 🧘', timestamp: '2026-10-25T06:15:00Z', type: 'text', isRead: true },
      { id: 'msg-14', senderId: 'user-zoe', text: 'Count me in! I\'ll film a Reel if that\'s okay? 🎬', timestamp: '2026-10-25T06:20:00Z', type: 'text', isRead: true },
      { id: 'msg-15', senderId: 'user-aisha', text: 'Sure! Meet at Riverside Park at 6am. See you there! 🏃‍♀️', timestamp: '2026-10-25T06:30:00Z', type: 'text', isRead: true },
    ],
  },
  {
    id: 'conv-5', participantIds: ['user-mike', 'user-marcus'], isGroup: false, isMuted: false, isRequest: false, unreadCount: 0,
    lastMessageAt: '2026-10-23T20:00:00Z',
    messages: [
      { id: 'msg-16', senderId: 'user-mike', text: 'Marcus, have you tried box squats for your sticking point?', timestamp: '2026-10-23T19:50:00Z', type: 'text', isRead: true },
      { id: 'msg-17', senderId: 'user-marcus', text: 'Not yet, but Coach Sarah mentioned them too. Will add them to my next cycle!', timestamp: '2026-10-23T20:00:00Z', type: 'text', isRead: true },
    ],
  },
];

export const seedNotifications: Notification[] = [
  { id: 'n1', type: 'like', fromUserId: 'user-zoe', message: 'liked your post', targetId: 'p1', targetType: 'post', isRead: false, createdAt: '2026-10-25T10:30:00Z' },
  { id: 'n2', type: 'comment', fromUserId: 'user-sarah', message: 'commented on your workout post: "Great form! Keep it up!"', targetId: 'p3', targetType: 'post', isRead: false, createdAt: '2026-10-25T09:45:00Z' },
  { id: 'n3', type: 'follow', fromUserId: 'user-jake', message: 'started following you', isRead: false, createdAt: '2026-10-25T08:20:00Z' },
  { id: 'n4', type: 'like', fromUserId: 'user-marcus', message: 'liked your post', targetId: 'p5', targetType: 'post', isRead: true, createdAt: '2026-10-24T22:15:00Z' },
  { id: 'n5', type: 'mention', fromUserId: 'user-aisha', message: 'mentioned you in a comment', targetId: 'p7', targetType: 'comment', isRead: true, createdAt: '2026-10-24T18:00:00Z' },
  { id: 'n6', type: 'follow_request', fromUserId: 'user-alex', message: 'requested to follow you', isRead: false, createdAt: '2026-10-24T16:30:00Z' },
  { id: 'n7', type: 'challenge_reminder', fromUserId: 'user-sarah', message: 'Don\'t forget to check in on "30-Day Push-up Challenge"!', targetId: 'ch-1', targetType: 'challenge', isRead: false, createdAt: '2026-10-25T07:00:00Z' },
  { id: 'n8', type: 'reply', fromUserId: 'user-raj', message: 'replied to your question about protein intake', targetId: 'q1', targetType: 'comment', isRead: true, createdAt: '2026-10-24T14:10:00Z' },
  { id: 'n9', type: 'like', fromUserId: 'user-luna', message: 'liked your workout log', targetId: 'wk-1', targetType: 'workout', isRead: true, createdAt: '2026-10-24T12:00:00Z' },
  { id: 'n10', type: 'live_reminder', fromUserId: 'user-sarah', message: '"Morning Mobility Flow" starts in 30 minutes!', targetId: 'ls-3', targetType: 'live', isRead: false, createdAt: '2026-10-25T05:30:00Z' },
  { id: 'n11', type: 'achievement', fromUserId: 'user-priya', message: 'You earned the "7-Day Streak" achievement! 🔥', isRead: false, createdAt: '2026-10-25T00:00:00Z' },
  { id: 'n12', type: 'comment', fromUserId: 'user-mike', message: 'commented: "Solid programming. Consider adding tempo work."', targetId: 'p10', targetType: 'post', isRead: true, createdAt: '2026-10-23T20:30:00Z' },
  { id: 'n13', type: 'tag', fromUserId: 'user-zoe', message: 'tagged you in a post', targetId: 'p15', targetType: 'post', isRead: true, createdAt: '2026-10-23T15:00:00Z' },
  { id: 'n14', type: 'follow', fromUserId: 'user-luna', message: 'started following you', isRead: true, createdAt: '2026-10-22T10:00:00Z' },
  { id: 'n15', type: 'safety_alert', fromUserId: 'user-priya', message: 'Your report has been received. Our team will review it.', isRead: false, createdAt: '2026-10-25T11:00:00Z', isSafety: true },
];

export const seedQuestions: Question[] = [
  {
    id: 'q1', userId: 'user-jake', title: 'How much protein do I really need to build muscle?', body: 'I\'m a beginner (6 months in) weighing 75kg. I see numbers ranging from 1g to 2.5g per kg bodyweight online. What\'s the actual science say?', category: 'Nutrition', tags: ['protein', 'muscle-building', 'beginner'], isAnonymous: false, upvotes: 42, isUpvoted: false, views: 318, createdAt: '2026-10-23T10:00:00Z', acceptedAnswerId: 'a1',
    answers: [
      { id: 'a1', userId: 'user-raj', body: 'The current evidence supports 1.6-2.2g of protein per kg of bodyweight per day for muscle building. For you at 75kg, that\'s 120-165g per day. Spread it across 3-5 meals for optimal muscle protein synthesis. The upper end is more relevant during a caloric deficit.', upvotes: 38, isUpvoted: false, isAccepted: true, isVerifiedProfessional: true, references: ['Morton et al. (2018) - British Journal of Sports Medicine', 'Schoenfeld & Aragon (2018) - JISSN'], createdAt: '2026-10-23T11:00:00Z' },
      { id: 'a2', userId: 'user-marcus', body: 'I\'ve personally found 2g/kg works best for me. Been training 5 years and the difference between 1.5g and 2g is noticeable in recovery and strength.', upvotes: 15, isUpvoted: false, isAccepted: false, isVerifiedProfessional: false, createdAt: '2026-10-23T12:30:00Z' },
    ],
  },
  {
    id: 'q2', userId: 'user-priya', title: 'Is it normal to feel dizzy during workouts?', body: 'Sometimes during squats or when I stand up quickly after a set, I feel lightheaded. Should I be worried? I drink about 1.5L water a day.', category: 'Health & Safety', tags: ['dizziness', 'beginner', 'safety'], isAnonymous: false, upvotes: 28, isUpvoted: false, views: 205, createdAt: '2026-10-22T15:00:00Z',
    answers: [
      { id: 'a3', userId: 'user-sarah', body: 'Some lightheadedness can be caused by holding your breath (Valsalva maneuver) or standing up too quickly. Tips: breathe through reps, stand up slowly, stay hydrated (aim for 2-3L/day), eat a light snack 1-2 hours before training. However, frequent dizziness should be checked by a healthcare professional.', upvotes: 22, isUpvoted: false, isAccepted: false, isVerifiedProfessional: true, createdAt: '2026-10-22T15:45:00Z' },
    ],
  },
  {
    id: 'q3', userId: 'user-jake', title: 'Creatine — is it safe for beginners?', body: 'I keep hearing about creatine monohydrate. Is it actually safe? Any side effects? I\'m 24M, no health conditions.', category: 'Supplements', tags: ['creatine', 'supplements', 'beginner', 'safety'], isAnonymous: false, upvotes: 55, isUpvoted: false, views: 420, createdAt: '2026-10-20T09:00:00Z',
    answers: [
      { id: 'a4', userId: 'user-raj', body: 'Creatine monohydrate is one of the most researched supplements in sports science. It\'s generally considered safe for healthy adults. Standard dosing: 3-5g daily. No need for a loading phase. Stay well hydrated. Common minor effects: slight water retention, mild digestive discomfort if taken on an empty stomach. As always, consult your doctor if you have kidney concerns.', upvotes: 48, isUpvoted: false, isAccepted: false, isVerifiedProfessional: true, references: ['Kreider et al. (2017) - JISSN Position Stand'], createdAt: '2026-10-20T10:30:00Z' },
    ],
  },
  {
    id: 'q4', userId: 'user-alex', title: 'Best yoga poses for recovery after weight training?', body: 'I lift 4x per week and want to add yoga on rest days for recovery. Which poses target common tight spots for lifters?', category: 'Yoga & Flexibility', tags: ['yoga', 'recovery', 'flexibility', 'weightlifting'], isAnonymous: false, upvotes: 31, isUpvoted: false, views: 178, createdAt: '2026-10-21T08:00:00Z',
    answers: [
      { id: 'a5', userId: 'user-aisha', body: 'Great combo! Focus on: Pigeon Pose (hip flexors), Downward Dog (hamstrings & calves), Child\'s Pose (back & shoulders), Thread the Needle (thoracic spine), Figure-4 Stretch (glutes). Hold each for 60-90 seconds. A 20-minute flow with these will make a huge difference in your mobility.', upvotes: 25, isUpvoted: false, isAccepted: false, isVerifiedProfessional: false, createdAt: '2026-10-21T09:00:00Z' },
    ],
  },
  {
    id: 'q5', userId: 'user-priya', title: 'How do I stop comparing myself to others at the gym?', body: 'I\'m 3 months in and everyone around me lifts so much more. I know I shouldn\'t compare but it\'s hard. Any tips?', category: 'Mindset', tags: ['mindset', 'motivation', 'beginner', 'gym-anxiety'], isAnonymous: true, upvotes: 89, isUpvoted: false, views: 612, createdAt: '2026-10-19T17:00:00Z',
    answers: [
      { id: 'a6', userId: 'user-luna', body: 'I totally felt this when I started! Remember: everyone started somewhere. That person deadlifting 200kg was once struggling with an empty bar. Track YOUR progress — take photos, log your lifts, celebrate YOUR PRs. The only person you need to be better than is who you were yesterday.', upvotes: 67, isUpvoted: false, isAccepted: false, isVerifiedProfessional: false, createdAt: '2026-10-19T18:00:00Z' },
      { id: 'a7', userId: 'user-sarah', body: 'This is so common and completely normal. A few strategies: 1) Focus on form over weight, 2) Use a training log to see YOUR improvements, 3) Put on headphones and zone in, 4) Remember that most gym-goers are too focused on themselves to notice others, 5) Celebrate small wins.', upvotes: 54, isUpvoted: false, isAccepted: false, isVerifiedProfessional: true, createdAt: '2026-10-19T18:30:00Z' },
    ],
  },
  {
    id: 'q6', userId: 'user-marcus', title: 'Programming: 5/3/1 vs. GZCL for intermediate lifters?', body: 'Been running Starting Strength for a year, lifts are S:170/B:130/D:190. Looking to switch to an intermediate program. Thoughts on 5/3/1 vs GZCL?', category: 'Programming', tags: ['programming', 'intermediate', 'powerlifting', '531', 'gzcl'], isAnonymous: false, upvotes: 34, isUpvoted: false, views: 245, createdAt: '2026-10-18T12:00:00Z',
    answers: [
      { id: 'a8', userId: 'user-mike', body: 'Both are excellent programs. 5/3/1 is great for long-term progression with built-in deloads — I\'d recommend the BBB variant for hypertrophy. GZCL gives more flexibility with tier structure and is better if you like auto-regulating. With your numbers, either will work. Key: pick one and run it for at least 12 weeks before judging.', upvotes: 28, isUpvoted: false, isAccepted: false, isVerifiedProfessional: true, createdAt: '2026-10-18T13:30:00Z' },
    ],
  },
  {
    id: 'q7', userId: 'user-jake', title: 'What should I eat before a morning workout?', body: 'I work out at 6am. Should I eat before? If so, what? I don\'t want to feel sick during exercise.', category: 'Nutrition', tags: ['pre-workout', 'nutrition', 'morning', 'beginner'], isAnonymous: false, upvotes: 23, isUpvoted: false, views: 156, createdAt: '2026-10-17T20:00:00Z',
    answers: [
      { id: 'a9', userId: 'user-raj', body: 'Training fasted is fine for moderate intensity, but for heavy lifting or long cardio, a small meal helps. Quick-digesting options: banana + small coffee, rice cake + peanut butter, small smoothie. Eat 30-45 min before. Some people tolerate training on an empty stomach well — it\'s individual.', upvotes: 19, isUpvoted: false, isAccepted: false, isVerifiedProfessional: true, createdAt: '2026-10-17T21:00:00Z' },
    ],
  },
  {
    id: 'q8', userId: 'user-alex', title: 'Can meditation actually improve athletic performance?', body: 'I\'ve been meditating daily for 2 months. Has anyone noticed actual performance improvements from mindfulness practice?', category: 'Mindset', tags: ['meditation', 'mindfulness', 'performance', 'mental-health'], isAnonymous: false, upvotes: 18, isUpvoted: false, views: 134, createdAt: '2026-10-16T11:00:00Z',
    answers: [
      { id: 'a10', userId: 'user-aisha', body: 'Absolutely! Meditation helped me enormously with my marathon mental game. During long runs, mindfulness helps me stay present and manage discomfort instead of panicking. Studies show it can reduce perceived effort and improve focus. I do 10min daily and it\'s been a game-changer.', upvotes: 14, isUpvoted: false, isAccepted: false, isVerifiedProfessional: false, createdAt: '2026-10-16T12:00:00Z' },
    ],
  },
];

export const seedChallenges: Challenge[] = [
  {
    id: 'ch-1', title: '30-Day Push-up Challenge', description: 'Build upper body strength with progressive push-up goals. Start with 10 and work up to 50!', type: 'daily', rules: ['Complete the target push-ups each day', 'Any push-up variation counts', 'Post a check-in to earn points', 'Rest days allowed (max 2 per week)'], startDate: '2026-10-01', endDate: '2026-10-31', goal: 'Complete 30 days of progressive push-ups', participantCount: 847, progress: 80, isJoined: true, createdBy: 'user-sarah', category: 'Strength', isPrivate: false,
    safetyGuidelines: ['Stop if you feel sharp pain', 'Modify to knee push-ups if needed', 'Rest if muscles are overly sore'],
    leaderboard: [
      { userId: 'user-marcus', rank: 1, score: 2400, progress: 100 },
      { userId: 'user-luna', rank: 2, score: 2200, progress: 96 },
      { userId: 'user-sarah', rank: 3, score: 2100, progress: 92 },
      { userId: 'user-priya', rank: 15, score: 1200, progress: 80 },
    ],
    badges: [
      { id: 'b1', title: 'Push-up Starter', description: 'Complete week 1', icon: '💪', requirement: '7 days completed' },
      { id: 'b2', title: 'Push-up Warrior', description: 'Complete all 30 days', icon: '🏆', requirement: '30 days completed' },
    ],
  },
  {
    id: 'ch-2', title: 'Hydration Week', description: 'Drink at least 2.5L of water every day for 7 days. Track your intake and feel the difference!', type: 'weekly', rules: ['Log at least 2500ml water daily', 'Track in the Nutrition Tracker', 'Share your hydration tips'], startDate: '2026-10-20', endDate: '2026-10-27', goal: 'Drink 2.5L daily for 7 days', participantCount: 1230, progress: 60, isJoined: true, createdBy: 'user-raj', category: 'Nutrition', isPrivate: false,
    safetyGuidelines: ['Don\'t overhydrate — listen to your body', 'Spread intake throughout the day'],
    leaderboard: [
      { userId: 'user-aisha', rank: 1, score: 7, progress: 100 },
      { userId: 'user-alex', rank: 2, score: 6, progress: 86 },
      { userId: 'user-priya', rank: 5, score: 4, progress: 60 },
    ],
    badges: [
      { id: 'b3', title: 'Hydrated', description: 'Complete all 7 days', icon: '💧', requirement: '7 days at 2.5L+' },
    ],
  },
  {
    id: 'ch-3', title: '10K Steps Daily', description: 'Walk 10,000 steps every day for 2 weeks. Get moving and explore your neighborhood!', type: 'community', rules: ['Walk at least 10,000 steps daily', 'Any walking counts — commute, hiking, treadmill', 'Post a daily check-in'], startDate: '2026-10-15', endDate: '2026-10-29', goal: '10,000 steps daily for 14 days', participantCount: 2100, progress: 40, isJoined: false, createdBy: 'user-zoe', category: 'Cardio', isPrivate: false,
    safetyGuidelines: ['Wear comfortable shoes', 'Start slower if you\'re currently sedentary', 'Listen to your body'],
    leaderboard: [
      { userId: 'user-aisha', rank: 1, score: 14, progress: 100 },
      { userId: 'user-zoe', rank: 2, score: 12, progress: 86 },
    ],
    badges: [
      { id: 'b4', title: 'Step Master', description: 'Complete all 14 days', icon: '👟', requirement: '14 days at 10K steps' },
    ],
  },
  {
    id: 'ch-4', title: 'Meal Prep Sunday', description: 'Prep all your meals for the week every Sunday. Share your meal prep photos and recipes!', type: 'weekly', rules: ['Prepare at least 5 meals on Sunday', 'Share a photo of your prep', 'Include macros if possible'], startDate: '2026-10-06', endDate: '2026-11-03', goal: 'Meal prep 4 Sundays in a row', participantCount: 560, progress: 75, isJoined: false, createdBy: 'user-raj', category: 'Nutrition', isPrivate: false,
    safetyGuidelines: ['Store food safely — refrigerate within 2 hours', 'Use containers with proper seals'],
    leaderboard: [],
    badges: [
      { id: 'b5', title: 'Prep Pro', description: 'Complete 4 weeks', icon: '🍱', requirement: '4 Sundays completed' },
    ],
  },
  {
    id: 'ch-5', title: 'Flexibility Focus', description: 'Spend 15 minutes stretching every day for 21 days. Improve mobility and prevent injuries!', type: 'individual', rules: ['Stretch for at least 15 minutes daily', 'Focus on major muscle groups', 'Can include yoga'], startDate: '2026-10-10', endDate: '2026-10-31', goal: '15 min daily stretching for 21 days', participantCount: 430, progress: 30, isJoined: false, createdBy: 'user-alex', category: 'Flexibility', isPrivate: false,
    safetyGuidelines: ['Never bounce during stretches', 'Don\'t stretch cold muscles — do a light warm-up first', 'Stop if you feel sharp pain'],
    leaderboard: [],
    badges: [
      { id: 'b6', title: 'Bendy', description: 'Complete 21 days', icon: '🧘', requirement: '21 days completed' },
    ],
  },
];

export const seedLiveSessions: LiveSession[] = [
  {
    id: 'ls-1', hostId: 'user-zoe', title: 'Dance HIIT Party 🎉', description: 'Join me for a 30-minute high-energy dance workout! No equipment needed, all levels welcome.', topic: 'Dance Fitness', scheduledAt: '2026-10-25T15:00:00Z', isLive: true, viewerCount: 234, hasReminder: false, allowsReplay: true,
    chatMessages: [
      { id: 'lm1', userId: 'user-priya', text: 'This is so fun!! 💃', timestamp: '2026-10-25T15:05:00Z', isQuestion: false },
      { id: 'lm2', userId: 'user-jake', text: 'Can you slow down the last move?', timestamp: '2026-10-25T15:08:00Z', isQuestion: true },
      { id: 'lm3', userId: 'user-alex', text: 'Love the energy Zoe!', timestamp: '2026-10-25T15:10:00Z', isQuestion: false },
    ],
  },
  {
    id: 'ls-2', hostId: 'user-mike', title: 'Speed & Agility Q&A', description: 'Ask me anything about speed training, agility drills, and athletic performance. Open discussion!', topic: 'Athletic Performance', scheduledAt: '2026-10-25T16:00:00Z', isLive: true, viewerCount: 89, hasReminder: false, allowsReplay: true,
    chatMessages: [
      { id: 'lm4', userId: 'user-marcus', text: 'Coach, how often should sprint work be programmed?', timestamp: '2026-10-25T16:05:00Z', isQuestion: true },
    ],
  },
  {
    id: 'ls-3', hostId: 'user-sarah', title: 'Morning Mobility Flow', description: 'A gentle 20-minute mobility routine to start your day. Perfect for desk workers and lifters.', topic: 'Mobility', scheduledAt: '2026-10-26T06:00:00Z', isLive: false, viewerCount: 0, hasReminder: true, allowsReplay: true,
    chatMessages: [],
  },
  {
    id: 'ls-4', hostId: 'user-raj', title: 'Nutrition Myths Debunked', description: 'Let\'s discuss the most common nutrition myths and what the science actually says.', topic: 'Nutrition Science', scheduledAt: '2026-10-27T14:00:00Z', isLive: false, viewerCount: 0, hasReminder: false, allowsReplay: true,
    chatMessages: [],
  },
];

export const seedStories: Story[] = [
  // 1. Priya Sharma (Beginner Journey)
  {
    id: 'st-priya',
    userId: 'user-priya',
    isViewed: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-p1', type: 'text', gradient: ['#FF6B6B', '#FFE66D'], text: '🌅 Morning 5,000 steps completed before 8am! Consistency feels amazing.', duration: 5 },
      { id: 'si-p2', type: 'photo', gradient: ['#FA709A', '#FEE140'], text: '🥣 High-protein breakfast: Greek yogurt, chia seeds & wild blueberries (28g protein)', duration: 5 },
      { id: 'si-p3', type: 'poll', gradient: ['#4FACFE', '#00F2FE'], pollQuestion: 'Do you prefer morning or evening workouts?', pollOptions: ['Morning 🌅', 'Evening 🌙'], duration: 8 },
      { id: 'si-p4', type: 'text', gradient: ['#667EEA', '#764BA2'], text: '✨ First time using the 10kg dumbbells without my hands shaking! Small wins add up.', duration: 5 },
      { id: 'si-p5', type: 'question', gradient: ['#10B981', '#059669'], questionPrompt: 'Beginners: What habit was hardest for you to start?', duration: 8 },
    ],
  },

  // 2. Marcus Chen (Heavy Strength)
  {
    id: 'st-marcus',
    userId: 'user-marcus',
    isViewed: false,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 21 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-m1', type: 'text', gradient: ['#2C3E50', '#000000'], text: '☕ Double espresso + pinch of sea salt. Heavy bench day loading...', duration: 5 },
      { id: 'si-m2', type: 'photo', gradient: ['#4ECDC4', '#556270'], text: '🏋️‍♂️ Warmup ramp: 70kg -> 100kg -> 125kg -> 140kg target single', duration: 5 },
      { id: 'si-m3', type: 'poll', gradient: ['#FF416C', '#FF4B2B'], pollQuestion: 'Bench press grip: Narrow or Wide?', pollOptions: ['Narrow (Triceps)', 'Wide (Pecs)'], duration: 8 },
      { id: 'si-m4', type: 'text', gradient: ['#667EEA', '#764BA2'], text: '🎯 140kg moved like butter! 145kg attempt next week. progressive overload works.', duration: 5 },
      { id: 'si-m5', type: 'photo', gradient: ['#1F1C2C', '#928DAB'], text: '🥩 Post-lift fuel: 350g flank steak, jasmine rice & grilled peppers', duration: 5 },
    ],
  },

  // 3. Dr. Sarah Williams (Certified Trainer)
  {
    id: 'st-sarah',
    userId: 'user-sarah',
    isViewed: false,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-s1', type: 'text', gradient: ['#0095F6', '#002244'], text: '💡 Coach Note: If your lower back arches during overhead press, squeeze your glutes!', duration: 6 },
      { id: 'si-s2', type: 'poll', gradient: ['#A3FF12', '#0D9488'], pollQuestion: 'Do you stretch BEFORE or AFTER lifting?', pollOptions: ['Dynamic Before', 'Static After'], duration: 8 },
      { id: 'si-s3', type: 'question', gradient: ['#833AB4', '#FD1D1D'], questionPrompt: 'Ask any exercise form question for tonight\'s breakdown!', duration: 9 },
      { id: 'si-s4', type: 'text', gradient: ['#F093FB', '#F5576C'], text: '📈 Client shoutout: 12 weeks in, zero knee pain, and 40kg squat achieved!', duration: 5 },
      { id: 'si-s5', type: 'photo', gradient: ['#11998E', '#38EF7D'], text: '🥑 Recovery smoothie: Whey isolate, spinach, avocado, almond milk', duration: 5 },
    ],
  },

  // 4. Dr. Raj Patel (Sports Dietitian)
  {
    id: 'st-raj',
    userId: 'user-raj',
    isViewed: false,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 19 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-r1', type: 'text', gradient: ['#F59E0B', '#B45309'], text: '🧪 Myth Bust: "Eating carbs after 8pm turns into fat." FALSE. 24h caloric balance rules.', duration: 7 },
      { id: 'si-r2', type: 'photo', gradient: ['#10B981', '#047857'], text: '🥗 10-Minute Lunch: Lentil salad with hemp hearts, cucumber, and olive oil (34g protein)', duration: 5 },
      { id: 'si-r3', type: 'poll', gradient: ['#EC4899', '#8B5CF6'], pollQuestion: 'Do you track macros or eat intuitively?', pollOptions: ['Track Macros 📊', 'Intuitive Eating 🥑'], duration: 8 },
      { id: 'si-r4', type: 'question', gradient: ['#0095F6', '#00F2FE'], questionPrompt: 'What supplement do you want me to scientifically analyze next?', duration: 9 },
      { id: 'si-r5', type: 'text', gradient: ['#3B82F6', '#1E3A5F'], text: '💧 Hydration rule: Drink 500ml water right when you wake up before coffee.', duration: 5 },
    ],
  },

  // 5. Zoe Martinez (Dance Fitness & HIIT)
  {
    id: 'st-zoe',
    userId: 'user-zoe',
    isViewed: false,
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 23 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-z1', type: 'text', gradient: ['#EC4899', '#F43F5E'], text: '🔥 Going LIVE at 3pm EST! Dance HIIT Cardio Party — grab your sneakers!', duration: 5 },
      { id: 'si-z2', type: 'photo', gradient: ['#FA709A', '#FEE140'], text: '👟 Sneaker rotation check: Cushioning matters when jumping 1,000+ times!', duration: 5 },
      { id: 'si-z3', type: 'poll', gradient: ['#FF6B6B', '#FFE66D'], pollQuestion: 'Fast tempo or slow burning core workout?', pollOptions: ['High Energy HIIT 🔥', 'Slow Burn Core 🧘'], duration: 8 },
      { id: 'si-z4', type: 'text', gradient: ['#8B5CF6', '#6366F1'], text: '🎬 3 new Reels recorded today. The hip mobility dance flow drops tomorrow!', duration: 5 },
      { id: 'si-z5', type: 'question', gradient: ['#F093FB', '#F5576C'], questionPrompt: 'What song should I choreograph for next week\'s workout?', duration: 8 },
    ],
  },

  // 6. Aisha Mohammed (Marathon & Yoga)
  {
    id: 'st-aisha',
    userId: 'user-aisha',
    isViewed: false,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 18 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-a1', type: 'photo', gradient: ['#06B6D4', '#0284C7'], text: '🌅 5:15am alarm: 15K tempo run along the lake. 4:18/km average pace.', duration: 5 },
      { id: 'si-a2', type: 'text', gradient: ['#10B981', '#059669'], text: '🧘‍♀️ Post-run recovery: 20 minutes of restorative pigeon pose and hamstring releases.', duration: 5 },
      { id: 'si-a3', type: 'poll', gradient: ['#A18CD1', '#FBC2EB'], pollQuestion: 'Do you run with or without music/podcasts?', pollOptions: ['Music/Audio 🎧', 'Pure Nature 🍃'], duration: 8 },
      { id: 'si-a4', type: 'text', gradient: ['#FF9A9E', '#FECFEF'], text: '🏃‍♀️ Running Tip: Shorten your stride and aim for 175-180 cadence to save your knees.', duration: 6 },
      { id: 'si-a5', type: 'question', gradient: ['#00C9FF', '#92FE9D'], questionPrompt: 'Marathon runners: What is your favorite race day fuel?', duration: 8 },
    ],
  },

  // 7. Jake Thompson (Curious Beginner)
  {
    id: 'st-jake',
    userId: 'user-jake',
    isViewed: false,
    createdAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 17 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-j1', type: 'text', gradient: ['#F97316', '#EA580C'], text: 'Late night empty gym session 🌙 Zero waiting for squat racks is heaven.', duration: 5 },
      { id: 'si-j2', type: 'photo', gradient: ['#FACC15', '#CA8A04'], text: '🎉 60kg Bench achieved today! Started with the 20kg bar 3 months ago.', duration: 5 },
      { id: 'si-j3', type: 'poll', gradient: ['#6366F1', '#4F46E5'], pollQuestion: 'For beginners: Full body 3x/week or Upper/Lower 4x/week?', pollOptions: ['Full Body 3x', 'Upper/Lower 4x'], duration: 8 },
      { id: 'si-j4', type: 'question', gradient: ['#EC4899', '#DB2777'], questionPrompt: 'How do other desk workers stay awake for evening workouts?', duration: 8 },
      { id: 'si-j5', type: 'text', gradient: ['#14B8A6', '#0F766E'], text: '😴 8 hours of sleep tonight. Recovery is where the muscle actually grows.', duration: 5 },
    ],
  },

  // 8. Coach Mike (D1 Performance)
  {
    id: 'st-mike',
    userId: 'user-mike',
    isViewed: false,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-mk1', type: 'text', gradient: ['#1E3A5F', '#0F172A'], text: '🏈 6:00am Athlete weight room session: Velocity Based Training (VBT) on squats.', duration: 5 },
      { id: 'si-mk2', type: 'photo', gradient: ['#3B82F6', '#1D4ED8'], text: '💥 Power Clean metric: Catch speed is under 0.28 seconds. Elite athletic pop.', duration: 5 },
      { id: 'si-mk3', type: 'poll', gradient: ['#EF4444', '#B91C1C'], pollQuestion: 'For field athletes: Barbell or Trap Bar Deadlift?', pollOptions: ['Trap Bar 🛡️', 'Straight Bar 🏋️'], duration: 8 },
      { id: 'si-mk4', type: 'text', gradient: ['#F59E0B', '#D97706'], text: '⚠️ If your knees cave in on box jumps, step down — do NOT jump backwards off the box.', duration: 6 },
      { id: 'si-mk5', type: 'question', gradient: ['#10B981', '#047857'], questionPrompt: 'Coaches & athletes: Drop any speed/sprint mechanics questions here!', duration: 8 },
    ],
  },

  // 9. Luna Kim (Powerlifter)
  {
    id: 'st-luna',
    userId: 'user-luna',
    isViewed: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-l1', type: 'text', gradient: ['#8B5CF6', '#6D28D9'], text: '⚪ Chalked up! Heavy deadlift singles: 150kg -> 160kg -> 170kg target.', duration: 5 },
      { id: 'si-l2', type: 'photo', gradient: ['#EC4899', '#BE185D'], text: '🔥 Hook grip holding strong. Thumbs hurt, but the bar didn\'t move a millimeter.', duration: 5 },
      { id: 'si-l3', type: 'poll', gradient: ['#3B82F6', '#1D4ED8'], pollQuestion: 'Lifting belt: Lever belt or Prong belt?', pollOptions: ['Lever Belt ⚡', 'Prong Belt 🔒'], duration: 8 },
      { id: 'si-l4', type: 'text', gradient: ['#F97316', '#C2410C'], text: '🏆 3 weeks out from national trials. Bodyweight steady at 62.6kg. We peak on time.', duration: 5 },
      { id: 'si-l5', type: 'question', gradient: ['#10B981', '#065F46'], questionPrompt: 'Ask me anything about powerlifting attempt selection or cutting water weight!', duration: 9 },
    ],
  },

  // 10. Alex Rivera (Yoga & Mobility)
  {
    id: 'st-alex',
    userId: 'user-alex',
    isViewed: false,
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 16 * 3600000).toISOString(),
    audience: 'public',
    items: [
      { id: 'si-x1', type: 'photo', gradient: ['#10B981', '#064E3B'], text: '🌿 Morning park meditation under the pines. 20 minutes of stillness resets everything.', duration: 5 },
      { id: 'si-x2', type: 'text', gradient: ['#6366F1', '#4338CA'], text: '🍵 Ceremonial matcha + lion\'s mane mushroom. Clean cognitive focus without caffeine jitters.', duration: 5 },
      { id: 'si-x3', type: 'poll', gradient: ['#F59E0B', '#B45309'], pollQuestion: 'Do you practice daily breathwork (pranayama)?', pollOptions: ['Yes, every day 🧘', 'Want to start ✨'], duration: 8 },
      { id: 'si-x4', type: 'text', gradient: ['#EC4899', '#9D174D'], text: '✨ Spine check: Rotate, flex, extend, and side-bend daily. You are as young as your spine is flexible.', duration: 6 },
      { id: 'si-x5', type: 'question', gradient: ['#06B6D4', '#0E7490'], questionPrompt: 'What muscle group feels most restricted in your body right now?', duration: 8 },
    ],
  },
];
