import { useState } from 'react';
import { Plus } from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import StoryViewer from '../stories/StoryViewer';
import CreateStoryDialog from '../stories/CreateStoryDialog';
import { useDemoContext } from '../../app/providers/DemoContext';

export default function StoryBar() {
  const { state } = useDemoContext();
  const [activeStoryUserId, setActiveStoryUserId] = useState<string | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const currentUser = state.users[state.currentUserId];

  // Users who have stories
  const userStoryPairs = state.stories
    .map((s) => ({
      story: s,
      user: state.users[s.userId],
    }))
    .filter((pair) => pair.user && pair.user.id !== state.currentUserId);

  return (
    <>
      <div className="flex items-center gap-3.5 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none border-b border-brand-border/40 select-none">
        {/* Your Story Button */}
        <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
          <div
            onClick={() => setIsCreatingStory(true)}
            className="relative p-0.5 rounded-full hover:scale-105 transition-transform"
          >
            {currentUser && <Avatar user={currentUser} size="md" />}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0095F6] text-white rounded-full flex items-center justify-center font-bold border-2 border-brand-bg shadow">
              <Plus className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[10px] text-brand-text-secondary group-hover:text-brand-text-primary transition-colors max-w-[56px] truncate">
            Your Story
          </span>
        </div>

        {/* Stories from creators */}
        {userStoryPairs.map(({ story, user }) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryUserId(user.id)}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
          >
            <div className="p-0.5 rounded-full hover:scale-105 transition-transform">
              <Avatar user={user} size="md" hasStory={!story.isViewed} />
            </div>
            <span className="text-[10px] text-brand-text-secondary group-hover:text-brand-text-primary transition-colors max-w-[56px] truncate">
              {user.username}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStoryUserId && (
        <StoryViewer
          userId={activeStoryUserId}
          onClose={() => setActiveStoryUserId(null)}
        />
      )}

      {/* Create Story Dialog */}
      <CreateStoryDialog
        isOpen={isCreatingStory}
        onClose={() => setIsCreatingStory(false)}
      />
    </>
  );
}
