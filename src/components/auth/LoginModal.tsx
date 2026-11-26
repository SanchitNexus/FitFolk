import { useState } from 'react';
import { LogIn, UserCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import VerificationBadge from '../common/VerificationBadge';
import { useDemoContext } from '../../app/providers/DemoContext';
import { useToast } from '../../app/providers/ToastContext';
import { isOwnerDevice } from '../../lib/deviceAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { state, login } = useDemoContext();
  const { showToast } = useToast();
  const isOwner = isOwnerDevice();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('fitfolk123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showProfilePicker, setShowProfilePicker] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your username, email, or select a profile below.');
      return;
    }

    const success = login(identifier.trim(), password);
    if (success) {
      showToast(`Logged in successfully as @${identifier.trim()}!`, 'success');
      onClose();
    } else {
      setError('Invalid credentials. (Hint: Demo password is "fitfolk123")');
    }
  };

  const handleSelectUser = (username: string) => {
    setIdentifier(username);
    setPassword('fitfolk123');
    login(username, 'fitfolk123');
    showToast(`Logged in as @${username}!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log In to FitFolk" size="sm">
      <div className="space-y-4 text-xs">
        {/* Brand Header */}
        <div className="text-center pb-2">
          <div className="w-14 h-14 mx-auto rounded-xl overflow-hidden bg-black shadow-md border border-brand-border/80 mb-2 p-0.5">
            <img src="/assets/fitfolk-logo.jpg" alt="Fitfolk" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center justify-center">
            <span className="font-black text-2xl tracking-tight text-brand-text-primary">Fit</span>
            <span className="font-black text-2xl tracking-tight text-[#99FF00]">folk</span>
          </div>
          <span className="text-[10px] text-brand-text-secondary">Enter your username and password</span>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-2.5">
          <div>
            <input
              type="text"
              placeholder="Username or email (e.g. priya_fitstart)"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-neutral-500"
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-md bg-brand-elevated border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-neutral-500 pr-12"
              autoComplete="current-password"
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-brand-text-secondary hover:text-brand-text-primary"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log in</span>
          </button>
        </form>

        {/* 1-Click Profile Selection (OWNER ONLY) */}
        {isOwner && (
          <>
            {/* OR Divider */}
            <div className="flex items-center my-2">
              <div className="flex-1 h-[1px] bg-brand-border" />
              <span className="px-3 text-[10px] font-bold text-brand-text-secondary">OR</span>
              <div className="flex-1 h-[1px] bg-brand-border" />
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setShowProfilePicker(!showProfilePicker)}
                className="w-full py-2 px-3 rounded-lg border border-brand-border bg-brand-elevated hover:bg-brand-surface text-brand-text-primary text-xs font-semibold flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 text-[#0095F6]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Pre-made Profiles</span>
                </div>
                <span className="text-[10px] text-brand-text-secondary">{showProfilePicker ? 'Hide' : 'Show (10)'}</span>
              </button>

              {showProfilePicker && (
                <div className="space-y-1 max-h-48 overflow-y-auto border border-brand-border rounded-lg p-1.5 bg-brand-elevated">
                  <div className="px-2 py-0.5 text-[9px] text-brand-text-secondary font-bold uppercase tracking-wider">
                    Password: <span className="text-[#0095F6] font-mono">fitfolk123</span>
                  </div>
                  {Object.values(state.users).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectUser(user.username)}
                      className="w-full p-1.5 rounded-md hover:bg-brand-surface text-left flex items-center gap-2 transition-colors group"
                    >
                      <Avatar user={user} size="xs" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-brand-text-primary truncate block leading-tight">
                          {user.displayName}
                        </span>
                        <span className="text-[10px] text-brand-text-secondary truncate block">
                          @{user.username}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#0095F6] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-brand-border text-[11px]">
          {onSwitchToRegister && (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#0095F6] hover:underline font-semibold"
            >
              Don't have an account? Sign up
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              showToast(
                isOwner
                  ? 'All demo accounts password: "fitfolk123"'
                  : 'Please sign up or check your login credentials.',
                'info'
              )
            }
            className="text-brand-text-secondary hover:text-brand-text-primary ml-auto"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </Modal>
  );
}
