interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div
      className="flex overflow-x-auto border-b border-brand-border scrollbar-none"
      role="tablist"
      aria-label="Content tabs"
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={`
              relative px-4 py-3 text-sm font-medium whitespace-nowrap
              transition-colors duration-150 shrink-0
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
              ${isActive
                ? 'text-brand-accent'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
              }
            `}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`
                    text-xs px-1.5 py-0.5 rounded-full
                    ${isActive
                      ? 'bg-brand-accent/15 text-brand-accent'
                      : 'bg-brand-elevated text-brand-text-secondary'
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {/* Active indicator */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
