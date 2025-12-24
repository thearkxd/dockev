import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface InstallPackagesModalProps {
  isOpen: boolean;
  projectPath: string;
  moduleName?: string;
  modulePath?: string;
  onClose: () => void;
  onInstall: (
    packageManager: "npm" | "yarn" | "pnpm",
    modulePath?: string
  ) => Promise<void>;
}

export function InstallPackagesModal({
  isOpen,
  projectPath,
  moduleName,
  modulePath,
  onClose,
  onInstall,
}: InstallPackagesModalProps) {
  const [selectedPackageManager, setSelectedPackageManager] = useState<
    "npm" | "yarn" | "pnpm"
  >("npm");
  const [isInstalling, setIsInstalling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Debug: Log modulePath when it changes
  useEffect(() => {
    console.log("InstallPackagesModal - modulePath prop:", modulePath);
  }, [modulePath]);

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened - modulePath:", modulePath);
      setTimeout(() => {
        setIsAnimating(true);
        setSelectedPackageManager("npm");
        setIsInstalling(false);
      }, 0);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, modulePath]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isInstalling) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isInstalling, onClose]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      console.log("Modal - Calling onInstall with modulePath:", modulePath);
      await onInstall(selectedPackageManager, modulePath);
      toast.success(
        `Dependencies installed successfully using ${selectedPackageManager}!${
          moduleName ? ` (${moduleName})` : ""
        }`
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error installing packages:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to install dependencies";
      toast.error(`Failed to install dependencies: ${errorMessage}`);
      setIsInstalling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={isInstalling ? undefined : onClose}
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
                Install Dependencies
                {moduleName && (
                  <span className="text-primary ml-2">({moduleName})</span>
                )}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {moduleName
                  ? `Select a package manager to install dependencies for ${moduleName} module`
                  : "Select a package manager to install project dependencies"}
              </p>
            </div>
            {!isInstalling && (
              <button
                onClick={onClose}
                className="group rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">
                  close
                </span>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            <div className="space-y-4">
              {/* Package Manager Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Package Manager
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["npm", "yarn", "pnpm"] as const).map((pm) => (
                    <label
                      key={pm}
                      className={`relative cursor-pointer group ${
                        isInstalling ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="packageManager"
                        value={pm}
                        checked={selectedPackageManager === pm}
                        onChange={() => setSelectedPackageManager(pm)}
                        disabled={isInstalling}
                        className="peer sr-only"
                      />
                      <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border-dark bg-surface-darker hover:bg-surface-dark transition-all peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5">
                        <span className="text-white text-lg font-bold uppercase">
                          {pm}
                        </span>
                        {pm === "npm" && (
                          <span className="text-xs text-text-secondary">
                            Node Package Manager
                          </span>
                        )}
                        {pm === "yarn" && (
                          <span className="text-xs text-text-secondary">
                            Yarn Package Manager
                          </span>
                        )}
                        {pm === "pnpm" && (
                          <span className="text-xs text-text-secondary">
                            Performant npm
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-primary transition-opacity">
                        <span className="material-symbols-outlined text-xl filled">
                          check_circle
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Project Path */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Project Path
                </label>
                <div className="rounded-lg border border-border-dark bg-surface-darker px-4 py-3 text-sm text-text-secondary font-mono">
                  {projectPath}
                </div>
              </div>

              {/* Installing Status */}
              {isInstalling && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                    <div className="flex-1">
                      <p className="text-blue-400 text-sm font-semibold">
                        Installing dependencies...
                      </p>
                      <p className="text-blue-300/80 text-xs mt-1">
                        This may take a few minutes depending on the number of
                        packages.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-8 py-6 pt-2">
            <button
              onClick={onClose}
              disabled={isInstalling}
              className="px-5 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="px-5 h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isInstalling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Installing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  <span>Install</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

