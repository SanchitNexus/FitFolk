import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Bot } from 'lucide-react';
import { useDemoContext } from '../../app/providers/DemoContext';
import Avatar from '../common/Avatar';

export default function MobileNav() {
  const { state, isLoggedIn } = useDemoContext();
  const currentUser = isLoggedIn ? state.users[state.currentUserId] : null;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-brand-bg/95 backdrop-blur-md border-t border-brand-border md:hidden px-2 py-1.5 flex items-center justify-around"
      aria-label="Mobile Navigation"
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          `p-2.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            isActive ? 'text-brand-accent' : 'text-brand-text-secondary'
          }`
        }
        aria-label="Home"
      >
        <Home className="w-5 h-5" />
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `p-2.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            isActive ? 'text-brand-accent' : 'text-brand-text-secondary'
          }`
        }
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </NavLink>

      <NavLink
        to="/create"
        className="p-2 ig-gradient-bg text-white rounded-xl shadow-md active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <PlusSquare className="w-6 h-6 stroke-[2.5]" />
      </NavLink>

      <NavLink
        to="/ai-coach"
        className={({ isActive }) =>
          `p-2.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            isActive ? 'text-brand-accent' : 'text-brand-text-secondary'
          }`
        }
        aria-label="AI Coach"
        title="Ollama AI Coach"
      >
        <Bot className="w-5 h-5" />
      </NavLink>

      <NavLink
        to={`/profile/${currentUser?.username || 'me'}`}
        className={({ isActive }) =>
          `p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            isActive ? 'ring-2 ring-brand-accent rounded-full' : ''
          }`
        }
        aria-label="Profile"
      >
        {currentUser ? (
          <Avatar user={currentUser} size="xs" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-brand-border" />
        )}
      </NavLink>
    </nav>
  );
}
