import { useState, useRef } from 'react';
import {
  X,
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
  Video,
} from 'lucide-react';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import type { Post, PostType } from '../../types';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function CreatePostDialog({ isOpen, onClose }: CreatePostDialogProps) {
  const { state, addPost, saveDraft } = useDemoContext();
  const { showToast } = useToast();

  const currentUser = state.users[state.currentUserId];

  const [selectedType, setSelectedType] = useState<PostType>('photo');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [audience, setAudience] = useState<'everyone' | 'followers' | 'close_friends'>('everyone');

  // Media state
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format-specific state
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [exerciseCount, setExerciseCount] = useState(4);

  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState(450);
  const [protein, setProtein] = useState(35);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(12);

  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);

  const [articleTitle, setArticleTitle] = useState('');
  const [articleBody, setArticleBody] = useState('');

  const resetForm = () => {
    setCaption('');
    setHashtags('');
    setMediaFile(null);
    setMediaPreviewUrl('');
    setWorkoutTitle('');
    setMealName('');
    setPollQuestion('');
    setArticleTitle('');
    setArticleBody('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setMediaFile(file);
    setMediaType(isVideo ? 'video' : 'image');

    if (isVideo && selectedType !== 'video') {
      setSelectedType('video');
    }

    const previewUrl = URL.createObjectURL(file);
    setMediaPreviewUrl(previewUrl);
  };

  const handleSelectSampleMedia = (url: string, type: 'image' | 'video') => {
    setMediaFile(null);
    setMediaPreviewUrl(url);
    setMediaType(type);
    if (type === 'video') setSelectedType('video');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!caption.trim() && !mediaPreviewUrl && selectedType !== 'workout' && selectedType !== 'nutrition') {
      showToast('Please add a caption or upload media for your post', 'error');
      return;
    }

    setIsUploading(true);
    let finalMediaUrl = mediaPreviewUrl;

    // If local file was selected, upload it to the server
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
          if (uploadData?.url) {
            finalMediaUrl = uploadData.url;
          }
        }
      } catch (err) {
        console.warn('Upload API error, using direct data URL:', err);
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
      caption: caption.trim() || workoutTitle || mealName || articleTitle || (isReel ? 'New Reel 🔥' : 'Fitness Update 📸'),
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
    } else if (selectedType === 'poll') {
      newPost.pollOptions = pollOptions.map((opt, i) => ({
        id: `opt-${i + 1}`,
        text: opt.trim() || `Option ${i + 1}`,
        votes: 0,
      }));
    } else if (selectedType === 'article') {
      newPost.articleTitle = articleTitle.trim() || 'Fitness & Health Guide';
      newPost.articleBody = articleBody.trim() || caption.trim();
    }

    addPost(newPost);
    setIsUploading(false);
    showToast(isReel ? '🎬 Reel published successfully!' : '📸 Photo published to your profile!', 'success');
    resetForm();
    onClose();
  };

  const handleSaveDraft = () => {
    saveDraft({
      type: selectedType,
      caption,
      hashtags: [hashtags],
    });
    showToast('Draft saved to browser storage', 'info');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Content" size="lg">
      <form onSubmit={handlePublish} className="space-y-4 text-xs">
        {/* Creator Info Header */}
        {currentUser && (
          <div className="flex items-center gap-2.5 pb-2 border-b border-brand-border/60">
            <Avatar user={currentUser} size="sm" />
            <div>
              <span className="font-bold text-xs text-brand-text-primary block">
                {currentUser.displayName}
              </span>
              <span className="text-[10px] text-brand-text-secondary">
                Posting as @{currentUser.username}
              </span>
            </div>
          </div>
        )}

        {/* Content Type Selector */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-2">
            Select Format:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {[
              { type: 'photo' as PostType, label: 'Photo', icon: Image },
              { type: 'video' as PostType, label: 'Reel / Video', icon: Film },
              { type: 'workout' as PostType, label: 'Workout', icon: Dumbbell },
              { type: 'nutrition' as PostType, label: 'Meal', icon: Utensils },
              { type: 'poll' as PostType, label: 'Poll', icon: Vote },
              { type: 'article' as PostType, label: 'Article', icon: BookOpen },
              { type: 'text' as PostType, label: 'Note', icon: Sparkles },
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSelectedType(type);
                  if (type === 'video') setMediaType('video');
                  if (type === 'photo') setMediaType('image');
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                  selectedType === type
                    ? 'bg-brand-accent/15 border-brand-accent text-brand-accent font-semibold shadow-sm'
                    : 'bg-brand-elevated border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload & Preview Section (Active for Photo & Video/Reel) */}
        {(selectedType === 'photo' || selectedType === 'video') && (
          <div className="space-y-3 p-3 bg-brand-elevated rounded-xl border border-brand-border">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-brand-text-primary text-[11px] flex items-center gap-1.5">
                {selectedType === 'video' ? <Film className="w-3.5 h-3.5 text-indigo-400" /> : <Image className="w-3.5 h-3.5 text-emerald-400" />}
                {selectedType === 'video' ? 'Upload Reel / Video' : 'Upload Fitness Photo'}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary text-[10px] px-2.5 py-1 flex items-center gap-1 font-semibold"
              >
                <Upload className="w-3 h-3" />
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

            {/* Live Media Preview Box */}
            {mediaPreviewUrl ? (
              <div className="relative rounded-xl overflow-hidden bg-black max-h-[340px] flex items-center justify-center border border-brand-border/80 group">
                {mediaType === 'video' ? (
                  <video
                    src={mediaPreviewUrl}
                    controls
                    playsInline
                    className="w-full max-h-[320px] object-contain"
                  />
                ) : (
                  <img
                    src={mediaPreviewUrl}
                    alt="Upload preview"
                    className="w-full max-h-[320px] object-contain"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreviewUrl('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors shadow-lg"
                  title="Remove media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-brand-border hover:border-brand-accent/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-brand-surface/50"
              >
                <div className="w-10 h-10 rounded-full bg-brand-elevated flex items-center justify-center mx-auto mb-2 text-brand-text-secondary">
                  <Upload className="w-5 h-5 text-brand-accent" />
                </div>
                <span className="font-semibold text-xs text-brand-text-primary block">
                  Click to upload from phone or computer
                </span>
                <span className="text-[10px] text-brand-text-secondary block mt-0.5">
                  Supports JPG, PNG, MP4, WebM (or take picture directly)
                </span>
              </div>
            )}

            {/* Quick 1-Click Sample Media Presets */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold text-brand-text-secondary block mb-1.5">
                Or choose from quick sample media:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedType === 'video'
                  ? SAMPLE_REELS.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => handleSelectSampleMedia(sample.url, 'video')}
                        className="btn-secondary text-[10px] px-2 py-1 flex items-center gap-1 rounded-lg"
                      >
                        <Play className="w-2.5 h-2.5 fill-current text-indigo-400" />
                        <span>{sample.label}</span>
                      </button>
                    ))
                  : SAMPLE_PHOTOS.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => handleSelectSampleMedia(sample.url, 'image')}
                        className="btn-secondary text-[10px] px-2 py-1 flex items-center gap-1 rounded-lg"
                      >
                        <Image className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{sample.label}</span>
                      </button>
                    ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Fields: Workout */}
        {selectedType === 'workout' && (
          <div className="p-3 bg-brand-elevated rounded-xl border border-brand-border space-y-2.5">
            <h4 className="font-semibold text-brand-accent flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" /> Workout Details
            </h4>
            <div>
              <label className="text-[11px] text-brand-text-secondary block mb-1">Routine Title</label>
              <input
                type="text"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                placeholder="e.g. Upper Body Hypertrophy"
                className="input-field text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-brand-text-secondary block mb-1">Duration (mins)</label>
                <input
                  type="number"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-brand-text-secondary block mb-1">Exercise Count</label>
                <input
                  type="number"
                  value={exerciseCount}
                  onChange={(e) => setExerciseCount(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Fields: Nutrition */}
        {selectedType === 'nutrition' && (
          <div className="p-3 bg-brand-elevated rounded-xl border border-brand-border space-y-2.5">
            <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" /> Nutrition Details
            </h4>
            <div>
              <label className="text-[11px] text-brand-text-secondary block mb-1">Meal Name</label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g. Grilled Salmon Bowl"
                className="input-field text-xs"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-brand-text-secondary block mb-1">Calories</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-brand-text-secondary block mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-brand-text-secondary block mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-brand-text-secondary block mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Fields: Poll */}
        {selectedType === 'poll' && (
          <div className="p-3 bg-brand-elevated rounded-xl border border-brand-border space-y-2.5">
            <h4 className="font-semibold text-brand-accent flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5" /> Community Poll
            </h4>
            <div>
              <label className="text-[11px] text-brand-text-secondary block mb-1">Question</label>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="e.g. How many days per week do you train?"
                className="input-field text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] text-brand-text-secondary block">Options</label>
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[i] = e.target.value;
                      setPollOptions(updated);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="input-field text-xs py-1.5"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                      className="p-1 text-brand-error hover:bg-brand-error/10 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`])}
                  className="flex items-center gap-1 text-[11px] text-brand-accent font-semibold pt-1"
                >
                  <Plus className="w-3 h-3" /> Add Option
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Fields: Article */}
        {selectedType === 'article' && (
          <div className="p-3 bg-brand-elevated rounded-xl border border-brand-border space-y-2.5">
            <h4 className="font-semibold text-blue-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Educational Article
            </h4>
            <div>
              <label className="text-[11px] text-brand-text-secondary block mb-1">Article Title</label>
              <input
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="e.g. Understanding Progressive Overload"
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-brand-text-secondary block mb-1">Article Body</label>
              <textarea
                value={articleBody}
                onChange={(e) => setArticleBody(e.target.value)}
                placeholder="Write educational evidence-backed insights..."
                rows={4}
                className="input-field text-xs"
              />
            </div>
          </div>
        )}

        {/* Caption Field */}
        <div>
          <label className="font-semibold text-brand-text-primary block mb-1.5">
            Caption & Thoughts:
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption, workout summary, or fitness advice for your followers..."
            rows={3}
            className="input-field text-xs"
          />
        </div>

        {/* Hashtags and Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-brand-text-primary block mb-1">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#legday #reels #fitness #gains"
              className="input-field text-xs"
            />
          </div>
          <div>
            <label className="font-semibold text-brand-text-primary block mb-1">Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as any)}
              className="input-field text-xs bg-brand-surface"
            >
              <option value="everyone">Everyone (Public Profile & Feed)</option>
              <option value="followers">Followers Only</option>
              <option value="close_friends">Close Friends Circle</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="btn-secondary text-xs px-3 py-2"
          >
            Save Draft
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="btn-ghost text-xs px-3 py-2">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isUploading ? 'Uploading...' : selectedType === 'video' ? 'Share Reel' : 'Share Post'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
