import { useState, useEffect, useRef } from "react";
import type { Project } from "../../types/Project";
import { Icon } from "@iconify/react";

interface ProjectCardContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  project: Project;
  onClose: () => void;
  onOpen: () => void | Promise<void>;
  onOpenIn: (ide: string) => void | Promise<void>;
  onRevealInExplorer: () => void | Promise<void>;
  onOpenInGitHub?: () => void | Promise<void>;
  onArchive: () => void;
  onDelete: () => void;
  availableIDEs: Array<{ id: string; name: string }>;
  gitRemoteUrl?: string | null;
}

export function ProjectCardContextMenu({
  isOpen,
  position,
  project,
  onClose,
  onOpen,
  onOpenIn,
  onRevealInExplorer,
  onOpenInGitHub,
  onArchive,
  onDelete,
  availableIDEs,
  gitRemoteUrl,
}: ProjectCardContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpenInSubmenuOpen, setIsOpenInSubmenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Adjust position if menu goes off screen
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      menu.style.left = `${viewportWidth - rect.width - 8}px`;
    }
    if (rect.bottom > viewportHeight) {
      menu.style.top = `${viewportHeight - rect.height - 8}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={menuRef}
        className="fixed z-[10000] bg-surface-dark border border-border-dark rounded-lg shadow-2xl py-1 min-w-[200px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Open */}
        <button
          onClick={async () => {
            await onOpen();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[18px] text-text-secondary">
            open_in_new
          </span>
          <span>Open</span>
        </button>

        {/* Open in… */}
        <div className="relative">
          <button
            onMouseEnter={() => setIsOpenInSubmenuOpen(true)}
            onMouseLeave={() => setIsOpenInSubmenuOpen(false)}
            className="w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-text-secondary">
                code
              </span>
              <span>Open in…</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-text-secondary">
              chevron_right
            </span>
          </button>
          {isOpenInSubmenuOpen && (
            <div
              className="absolute left-full top-0 ml-1 bg-surface-dark border border-border-dark rounded-lg shadow-2xl py-1 min-w-[180px]"
              onMouseEnter={() => setIsOpenInSubmenuOpen(true)}
              onMouseLeave={() => setIsOpenInSubmenuOpen(false)}
            >
              {availableIDEs.map((ide) => (
                <button
                  key={ide.id}
                  onClick={async () => {
                    await onOpenIn(ide.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors text-left"
                >
                  {/* <span className="material-symbols-outlined text-[18px] text-text-secondary">
                    {ide.id === "vscode" ||
                    ide.id === "cursor" ||
                    ide.id === "webstorm"
                      ? "code"
                      : ide.id === "terminal"
                      ? "terminal"
                      : "settings"}
                  </span> */}
                  <Icon icon={ide.id === "cursor" ? "material-icon-theme:cursor" : ide.id === "webstorm" ? "simple-icons:webstorm" : "octicon:vscode-32"} width="20" height="20" />
                  <span>{ide.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-border-dark my-1"></div>

        {/* Reveal in Explorer */}
        <button
          onClick={async () => {
            await onRevealInExplorer();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[18px] text-text-secondary">
            folder_open
          </span>
          <span>Reveal in Explorer</span>
        </button>

        {/* Open in GitHub */}
        {onOpenInGitHub &&
          gitRemoteUrl &&
          (() => {
            // Convert git remote URL to GitHub web URL
            let url = gitRemoteUrl;
            if (url.startsWith("git@")) {
              url = url.replace("git@", "https://").replace(":", "/");
            }
            if (
              url.startsWith("https://github.com") ||
              url.startsWith("http://github.com")
            ) {
              url = url.replace(/\.git$/, "");
              return (
                <>
                  <div className="h-px bg-border-dark my-1"></div>
                  <button
                    onClick={async () => {
                      await onOpenInGitHub();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Icon icon="mdi:github" width="20" height="20" />
                    <span>Open in GitHub</span>
                  </button>
                </>
              );
            }
            return null;
          })()}

        <div className="h-px bg-border-dark my-1"></div>

        {/* Archive */}
        <button
          onClick={() => {
            onArchive();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[18px] text-text-secondary">
            archive
          </span>
          <span>Archive</span>
        </button>

        {/* Delete */}
        <button
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
              onDelete();
            }
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          <span>Delete</span>
        </button>
      </div>
    </>
  );
}
