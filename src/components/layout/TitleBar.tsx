import { useNavigate } from "react-router-dom";

interface TitleBarProps {
  breadcrumb?: {
    label: string;
    onClick?: () => void;
  };
  projectName?: string;
  showSearch?: boolean;
  showActions?: boolean;
  projects?: Array<{
    id: string;
    name: string;
    path: string;
    category: string;
    tags: string[];
  }>;
}

export function TitleBar({
  breadcrumb,
  projectName,
  showSearch = false,
  showActions = false,
  projects = [],
}: TitleBarProps) {
  const navigate = useNavigate();

  // Handle search button click
  const handleSearchClick = () => {
    // Trigger global spotlight open via custom event
    window.dispatchEvent(new CustomEvent("openSpotlight"));
  };
  return (
    <header className="flex items-center justify-between border-b border-border-dark/50 bg-background-dark/80 backdrop-blur-md px-6 py-3 fixed top-0 left-0 right-0 z-40 select-none drag-region">
      <div className="flex items-center gap-6">
        {breadcrumb ? (
          <>
            <button
              onClick={breadcrumb.onClick}
              className="flex items-center gap-2.5 text-white cursor-pointer hover:opacity-80 transition-opacity no-drag"
            >
              <div className="size-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
                <span className="material-symbols-outlined text-[20px]">
                  terminal
                </span>
              </div>
              <h2 className="text-base font-bold tracking-tight">Dockev</h2>
            </button>
            <div className="h-5 w-px bg-border-dark hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary">
              <button
                onClick={breadcrumb.onClick}
                className="flex items-center gap-1.5 hover:text-white transition-colors no-drag group"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                  arrow_back
                </span>
                <span>{breadcrumb.label}</span>
              </button>
              {projectName && (
                <>
                  <span className="material-symbols-outlined text-[14px]">
                    chevron_right
                  </span>
                  <span className="text-white font-medium">{projectName}</span>
                </>
              )}
            </div>
          </>
        ) : (
          <span className="text-sm font-semibold">Dockev</span>
        )}
      </div>

      <div className="flex items-center gap-3 no-drag">
        {showSearch && (
          <button
            onClick={handleSearchClick}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-dark bg-surface-dark/50 text-text-secondary hover:border-border-dark hover:text-white transition-colors text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              search
            </span>
            <span className="pr-8">Search...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border-dark bg-surface-dark px-1.5 font-mono text-[10px] font-medium text-text-secondary">
              {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}K
            </kbd>
          </button>
        )}

        {showActions && (
          <div className="flex items-center gap-1 pl-2">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center justify-center rounded-md size-8 hover:bg-surface-dark text-text-secondary hover:text-white transition-colors"
              title="Settings"
            >
              <span className="material-symbols-outlined text-[20px]">
                settings
              </span>
            </button>
          </div>
        )}

        <div className="flex gap-2 ml-2">
          <button
            onClick={() => {
              if (window.dockevWindow) {
                window.dockevWindow.minimize();
              }
            }}
            className="flex items-center justify-center p-1 hover:bg-white/5 rounded transition-colors"
            title="Minimize"
          >
            <span className="material-symbols-outlined text-[16px] text-text-secondary hover:text-white">
              remove
            </span>
          </button>

          <button
            onClick={() => {
              if (window.dockevWindow) {
                window.dockevWindow.maximize();
              }
            }}
            className="flex items-center justify-center p-1 hover:bg-white/5 rounded transition-colors"
            title="Maximize"
          >
            <span className="material-symbols-outlined text-[16px] text-text-secondary hover:text-white">
              filter_none
            </span>
          </button>

          <button
            onClick={() => {
              if (window.dockevWindow) {
                window.dockevWindow.close();
              }
            }}
            className="flex items-center justify-center p-1 hover:bg-red-500/5 rounded transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined text-[16px] text-text-secondary hover:text-white">
              close
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
