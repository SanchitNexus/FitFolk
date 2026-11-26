import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Image,
  Film,
  Dumbbell,
  Utensils,
  BookOpen,
  Vote,
  Sparkles,
  Upload,
  Play,
  Check,
  Trash2,
  Plus,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { Post, PostType } from '../../types';

const SAMPLE_PHOTOS = [
  {
    label: 'Heavy Deadlift PR',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop',
  },
  {
    label: 'Outdoor Trail Run',
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop',
  },
  {
    label: 'High-Protein Bowl',
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop',
  },
  {
    label: 'Dumbbell Hypertrophy',
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop',
  },
];

const SAMPLE_REELS = [
  {
    label: 'HIIT Kettlebell Circuit',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    label: 'Sprint & Agility Drill',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  },
];

export default function CreatePage() {
  const { state, addPost } = useDemoContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const currentUser = state.users[state.currentUserId];

  const [selectedType, setSelectedType] = useState<PostType>('photo');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [audience, setAudience] = useState<'everyone' | 'followers' | 'close_friends'>('everyone');

  // Media
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format details
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [exerciseCount, setExerciseCount] = useState(4);

  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState(450);
  const [protein, setProtein] = useState(35);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(12);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setMediaFile(file);
    setMediaType(isVideo ? 'video' : 'image');
    if (isVideo && selectedType !== 'video') setSelectedType('video');

    setMediaPreviewUrl(URL.createObjectURL(file));
  };

  const handleSelectSample = (url: string, type: 'image' | 'video') => {
    setMediaFile(null);
    setMediaPreviewUrl(url);
    setMediaType(type);
    if (type === 'video') setSelectedType('video');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!caption.trim() && !mediaPreviewUrl && selectedType !== 'workout' && selectedType !== 'nutrition') {
      showToast('Please add a caption or upload media for your post', 'error');
      return;
    }

    setIsUploading(true);
    let finalMediaUrl = mediaPreviewUrl;

    if (mediaFile) {
      try {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(mediaFile);
        });

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: mediaFile.name,
            type: mediaFile.type,
            data: base64Data,
          }),
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData?.url) finalMediaUrl = uploadData.url;
        }
      } catch (err) {
        console.warn('Upload API error, using direct URL:', err);
      }
    }

    const parsedHashtags = hashtags
      .split(/[\s,]+/)
      .filter((t) => t.trim().length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const isReel = selectedType === 'video' || mediaType === 'video';

    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: state.currentUserId,
      type: selectedType,
      caption: caption.trim() || workoutTitle || mealName || (isReel ? 'New Reel 🔥' : 'Fitness Update 📸'),
      mediaUrl: finalMediaUrl || undefined,
      mediaType: finalMediaUrl ? mediaType : undefined,
      isReel,
      mediaPlaceholders: [
        {
          type: isReel ? 'video' : 'image',
          gradient: isReel ? ['#6366F1', '#312E81'] : ['#10B981', '#064E3B'],
          label: isReel ? 'User Reel' : 'User Photo',
        },
      ],
      hashtags: parsedHashtags.length > 0 ? parsedHashtags : [isReel ? '#Reels' : '#FitFolk', '#Fitness'],
      topicTags: [selectedType.toUpperCase()],
      likes: 0,
      comments: [],
      reposts: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isSaved: false,
      isReposted: false,
    };

    if (selectedType === 'workout') {
      newPost.workoutData = {
        title: workoutTitle.trim() || 'Custom Training Session',
        exerciseCount,
        duration: workoutDuration,
        totalVolume: 1200,
      };
    } else if (selectedType === 'nutrition') {
      newPost.nutritionData = {
        mealName: mealName.trim() || 'Healthy Fuel Bowl',
        calories,
        protein,
        carbs,
        fat,
      };
    }

    addPost(newPost);
    setIsUploading(false);
    showToast(isReel ? '🎬 Reel shared to your profile!' : '📸 Photo shared to your profile!', 'success');
    navigate(`/profile/${currentUser?.username || ''}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-3 sm:px-4">
      <div className="card p-5 sm:p-7 bg-brand-surface border border-brand-border/80 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-brand-border/70 mb-5">
          <div className="flex items-center gap-3">
            <Avatar user={currentUser} size="md" />
            <div>
              <h2 className="text-base font-bold text-brand-text-primary">Create New Content</h2>
              <p className="text-xs text-brand-text-secondary">Posting as @{currentUser.username}</p>
            </div>
          </div>
          <span className="text-xs uppercase font-bold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-lg">
            {selectedType === 'video' ? 'Reel Video' : selectedType === 'photo' ? 'Photo Post' : selectedType}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Format Selector Pills */}
          <div>
            <label className="font-semibold text-brand-text-primary block mb-2 text-xs">
              Choose Post Type:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[
                { type: 'photo' as PostType, label: 'Photo', icon: Image },
                { type: 'video' as PostType, label: 'Reel', icon: Film },
                { type: 'workout' as PostType, label: 'Workout', icon: Dumbbell },
                { type: 'nutrition' as PostType, label: 'Meal', icon: Utensils },
                { type: 'poll' as PostType, label: 'Poll', icon: Vote },
                { type: 'article' as PostType, label: 'Article', icon: BookOpen },
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedType(type);
                    if (type === 'video') setMediaType('video');
                    if (type === 'photo') setMediaType('image');
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                    selectedType === type
                      ? 'bg-brand-accent/15 border-brand-accent text-brand-accent font-bold shadow-sm'
                      : 'bg-brand-elevated border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Media Area */}
          {(selectedType === 'photo' || selectedType === 'video') && (
            <div className="space-y-3 p-4 bg-brand-elevated/70 rounded-2xl border border-brand-border">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-text-primary text-xs flex items-center gap-1.5">
                  {selectedType === 'video' ? <Film className="w-4 h-4 text-indigo-400" /> : <Image className="w-4 h-4 text-emerald-400" />}
                  {selectedType === 'video' ? 'Upload Reel / Video' : 'Upload Fitness Photo'}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File / Camera</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={selectedType === 'video' ? 'video/*' : 'image/*,video/*'}
                onChange={handleFileSelect}
                className="hidden"
              />

              {mediaPreviewUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-black max-h-[360px] flex items-center justify-center border border-brand-border">
                  {mediaType === 'video' ? (
                    <video
                      src={mediaPreviewUrl}
                      controls
                      playsInline
                      className="w-full max-h-[350px] object-contain"
                    />
                  ) : (
                    <img
                      src={mediaPreviewUrl}
                      alt="Upload preview"
                      className="w-full max-h-[350px] object-contain"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaFile(null);
                      setMediaPreviewUrl('');
                    }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors shadow-lg"
                    title="Remove media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brand-border hover:border-brand-accent/60 rounded-2xl p-7 text-center cursor-pointer transition-colors bg-brand-surface/40"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-elevated flex items-center justify-center mx-auto mb-2 text-brand-text-secondary">
                    <Upload className="w-6 h-6 text-brand-accent" />
                  </div>
                  <span className="font-bold text-xs text-brand-text-primary block">
                    Tap to upload photo or reel from your phone or PC
                  </span>
                  <span className="text-[10px] text-brand-text-secondary block mt-1">
                    Supports JPG, PNG, MP4, MOV, WebM
                  </span>
                </div>
              )}

              {/* Sample Media Presets */}
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-brand-text-secondary block mb-1.5">
                  Or pick a sample workout media:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedType === 'video'
                    ? SAMPLE_REELS.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => handleSelectSample(s.url, 'video')}
                          className="btn-secondary text-[10px] px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
                        >
                          <Play className="w-2.5 h-2.5 fill-current text-indigo-400" />
                          <span>{s.label}</span>
                        </button>
                      ))
                    : SAMPLE_PHOTOS.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => handleSelectSample(s.url, 'image')}
                          className="btn-secondary text-[10px] px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
                        >
                          <Image className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{s.label}</span>
                        </button>
                      ))}
                </div>
              </div>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="font-semibold text-brand-text-primary block mb-1.5 text-xs">
              Caption:
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption, exercise details, or fitness tips..."
              rows={3}
              className="input-field text-xs py-2"
            />
          </div>

          {/* Hashtags & Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-brand-text-primary block mb-1 text-xs">
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#fitness #reels #workout #gains"
                className="input-field text-xs py-2"
              />
            </div>
            <div>
              <label className="font-semibold text-brand-text-primary block mb-1 text-xs">
                Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as any)}
                className="input-field text-xs py-2 bg-brand-surface"
              >
                <option value="everyone">Everyone (Public Feed & Profile)</option>
                <option value="followers">Followers Only</option>
                <option value="close_friends">Close Friends Circle</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-ghost text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2 font-bold shadow-md"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isUploading ? 'Uploading...' : selectedType === 'video' ? 'Share Reel' : 'Share Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
