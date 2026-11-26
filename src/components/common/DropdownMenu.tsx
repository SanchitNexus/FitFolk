import { useState, useRef, useEffect, useCallback, ReactNode, ElementType } from 'react';

export interface DropdownItem {
  label: string;
  icon?: ElementType;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export default function DropdownMenu({ trigger, items, align = 'left' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(true);
          setFocusIndex(0);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setFocusIndex(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusIndex(prev => (prev + 1) % items.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusIndex(prev => (prev - 1 + items.length) % items.length);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusIndex >= 0 && focusIndex < items.length) {
            items[focusIndex].onClick();
            setIsOpen(false);
          }
          break;
      }
    },
    [isOpen, focusIndex, items]
  );

  // Focus the active item
  useEffect(() => {
    if (isOpen && focusIndex >= 0) {
      itemRefs.current[focusIndex]?.focus();
    }
  }, [focusIndex, isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <div
        onClick={() => {
          setIsOpen(prev => !prev);
          setFocusIndex(-1);
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          className={`
            absolute z-50 mt-2 min-w-[200px]
            bg-brand-surface border border-brand-border rounded-xl
            shadow-xl py-1 animate-scale-in
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                ref={el => { itemRefs.current[i] = el; }}
                role="menuitem"
                tabIndex={-1}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                  transition-colors outline-none
                  ${item.danger
                    ? 'text-brand-error hover:bg-brand-error/10 focus:bg-brand-error/10'
                    : 'text-brand-text-primary hover:bg-brand-elevated focus:bg-brand-elevated'
                  }
                `}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
