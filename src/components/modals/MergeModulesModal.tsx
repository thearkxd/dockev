import { useState, useEffect } from "react";
import type { Module } from "../../types/Module";

interface MergeModulesModalProps {
  isOpen: boolean;
  modules: Module[];
  onClose: () => void;
  onMerge: (sourceModuleId: string, targetModuleId: string) => void;
}

export function MergeModulesModal({
  isOpen,
  modules,
  onClose,
  onMerge,
}: MergeModulesModalProps) {
  const [sourceModuleId, setSourceModuleId] = useState<string>("");
  const [targetModuleId, setTargetModuleId] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSourceModuleId("");
      setTargetModuleId("");
      setTimeout(() => {
        setIsAnimating(true);
      }, 0);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

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

  const handleMerge = () => {
    if (sourceModuleId && targetModuleId && sourceModuleId !== targetModuleId) {
      onMerge(sourceModuleId, targetModuleId);
      onClose();
    }
  };

  const sourceModule = modules.find((m) => m.id === sourceModuleId);
  const targetModule = modules.find((m) => m.id === targetModuleId);

  if (!isOpen) return null;

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
                Merge Modules
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Merge one module into another. The source module will be
                removed.
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
              {/* Source Module */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Source Module (will be removed)
                </label>
                <select
                  value={sourceModuleId}
                  onChange={(e) => setSourceModuleId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border-dark bg-surface-darker text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/5"
                >
                  <option value="" className="bg-[#242424]">Select source module...</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id} className="bg-[#242424]">
                      {module.name} ({module.path})
                    </option>
                  ))}
                </select>
                {sourceModule && (
                  <div className="mt-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-xs text-yellow-300/80">
                      This module will be removed after merging.
                    </p>
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <span className="material-symbols-outlined text-[32px] text-primary">
                  arrow_downward
                </span>
              </div>

              {/* Target Module */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Target Module (will keep)
                </label>
                <select
                  value={targetModuleId}
                  onChange={(e) => setTargetModuleId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border-dark bg-surface-darker text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/5"
                >
                  <option value="" className="bg-[#242424]">Select target module...</option>
                  {modules
                    .filter((m) => m.id !== sourceModuleId)
                    .map((module) => (
                      <option key={module.id} value={module.id} className="bg-[#242424]">
                        {module.name} ({module.path})
                      </option>
                    ))}
                </select>
                {targetModule && (
                  <div className="mt-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-xs text-green-300/80">
                      This module will be kept and updated with merged data.
                    </p>
                  </div>
                )}
              </div>

              {/* Merge Preview */}
              {sourceModule && targetModule && (
                <div className="mt-4 p-4 rounded-lg bg-surface-darker border border-border-dark">
                  <h4 className="text-sm font-semibold text-white mb-2">
                    Merge Preview:
                  </h4>
                  <div className="space-y-2 text-xs text-text-secondary">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {targetModule.name}
                    </div>
                    <div>
                      <span className="font-medium">Path:</span>{" "}
                      {targetModule.path}
                    </div>
                    <div>
                      <span className="font-medium">Tech Stack:</span>{" "}
                      {[
                        ...new Set([
                          ...targetModule.techStack,
                          ...sourceModule.techStack,
                        ]),
                      ].join(", ")}
                    </div>
                    {sourceModule.devServerCommand && (
                      <div>
                        <span className="font-medium">Dev Server:</span>{" "}
                        {sourceModule.devServerCommand || "Default"}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
              onClick={handleMerge}
              disabled={
                !sourceModuleId ||
                !targetModuleId ||
                sourceModuleId === targetModuleId
              }
              className="px-5 h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                merge
              </span>
              <span>Merge Modules</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
