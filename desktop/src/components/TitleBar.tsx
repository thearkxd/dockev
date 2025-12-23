export function TitleBar() {
  return (
    <div className="h-10 flex items-center px-3 bg-zinc-950 border-b border-zinc-800 select-none drag-region">
      <span className="text-sm font-semibold">Dockev</span>

      <div className="ml-auto flex gap-2 no-drag">
        <button
          onClick={() => {
            if (window.dockevWindow) {
              window.dockevWindow.minimize();
            }
          }}
          className="p-1 hover:bg-white/5 rounded transition-colors"
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
          className="p-1 hover:bg-white/5 rounded transition-colors"
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
          className="p-1 hover:bg-red-500/5 rounded transition-colors"
          title="Close"
        >
          <span className="material-symbols-outlined text-[16px] text-text-secondary hover:text-white">
            close
          </span>
        </button>
      </div>
    </div>
  );
}
