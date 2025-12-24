import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Module } from "../../types/Module";

interface EditModuleModalProps {
  isOpen: boolean;
  module: Module | null;
  onClose: () => void;
  onSave: (updatedModule: Module) => void;
}

export function EditModuleModal({
  isOpen,
  module,
  onClose,
  onSave,
}: EditModuleModalProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [devServerCommand, setDevServerCommand] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen && module) {
      setName(module.name);
      setPath(module.path);
      setDevServerCommand(module.devServerCommand || "");
      setTimeout(() => {
        setIsAnimating(true);
      }, 0);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, module]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!module) return;

    const updatedModule: Module = {
      ...module,
      name: name.trim(),
      path: path.trim(),
      devServerCommand: devServerCommand.trim() || undefined,
    };

    onSave(updatedModule);
    toast.success(`Module "${name.trim()}" updated successfully!`);
    onClose();
  };

  if (!isOpen || !module) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative w-full max-w-md flex flex-col rounded-2xl bg-surface-dark shadow-2xl border border-border-dark/50 pointer-events-auto transition-all duration-300 ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 py-6 pb-2">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-white">
                Edit Module
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Update module name, path, and dev server command
              </p>
            </div>
            <button
              onClick={onClose}
              className="group rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">
                close
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            <div className="space-y-4">
              {/* Module Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Module Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border-dark bg-surface-darker text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/5"
                  placeholder="e.g., frontend, api, mobile"
                />
              </div>

              {/* Module Path */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Module Path
                </label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border-dark bg-surface-darker text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/5"
                  placeholder="e.g., ./frontend, api, packages/mobile"
                />
                <p className="mt-1 text-xs text-text-secondary">
                  Relative to project root or absolute path
                </p>
              </div>

              {/* Dev Server Command */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Dev Server Command (Optional)
                </label>
                <input
                  type="text"
                  value={devServerCommand}
                  onChange={(e) => setDevServerCommand(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border-dark bg-surface-darker text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/5"
                  placeholder="e.g., npm run dev, yarn start, pnpm dev"
                />
                <p className="mt-1 text-xs text-text-secondary">
                  Custom command to run dev server for this module. Leave empty
                  to use default (npm/yarn/pnpm run dev).
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-8 py-6 pt-2">
            <button
              onClick={onClose}
              className="px-5 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !path.trim()}
              className="px-5 h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                save
              </span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

