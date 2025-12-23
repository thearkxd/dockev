export const Header = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark/60 px-8 py-5 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-white text-lg font-medium tracking-tight">
          Overview
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-3 items-center">
        <div className="relative w-full max-w-sm group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors text-[18px]">
              search
            </span>
          </div>
          <input
            className="block w-full pl-10 pr-12 py-2 bg-surface-dark/50 border border-border-dark rounded-lg text-sm text-white placeholder-text-secondary/70 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-light"
            placeholder="Search projects..."
            type="text"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] text-text-secondary bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>
        </div>
        <div className="w-px h-6 bg-border-dark mx-1"></div>
        <div className="flex gap-2">
          <button
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-text-secondary hover:text-white"
            title="Filter"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          <button
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-text-secondary hover:text-white"
            title="Sort"
          >
            <span className="material-symbols-outlined text-[20px]">sort</span>
          </button>
        </div>
      </div>
    </header>
  );
};

