import { useState, useEffect, useRef } from "react";
import type { Project } from "../../types/Project";

interface MoveProjectModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onMoveComplete: (newPath: string) => void;
}

interface MoveProgress {
  phase: "preparing" | "moving" | "cleaning" | "complete" | "error";
  currentFile?: string;
  filesProcessed?: number;
  totalFiles?: number;
  error?: string;
}

export function MoveProjectModal({
  isOpen,
  project,
  onClose,
  onMoveComplete,
}: MoveProjectModalProps) {
  const [destinationPath, setDestinationPath] = useState("");
  const [excludeNodeModules, setExcludeNodeModules] = useState(true);
  const [deleteSource, setDeleteSource] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [progress, setProgress] = useState<MoveProgress | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setIsAnimating(true);
        setDestinationPath("");
        setExcludeNodeModules(true);
        setDeleteSource(false);
        setIsMoving(false);
        setProgress(null);
        cancelRef.current = false;
      }, 0);
    } else {
      setTimeout(() => {
        setIsAnimating(false);
      }, 0);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isMoving) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isMoving, onClose]);

  const handleSelectDestination = async () => {
    if (window.dockevDialog?.selectFolder) {
      const selectedPath = await window.dockevDialog.selectFolder();
      if (selectedPath) {
        setDestinationPath(selectedPath);
      }
    }
  };

  const handleCancel = () => {
    if (isMoving) {
      cancelRef.current = true;
    } else {
      onClose();
    }
  };

  const handleMove = async () => {
    if (!destinationPath.trim()) {
      alert("Please select a destination directory");
      return;
    }

    // Show confirmation dialog
    const confirmed = confirm(
      `⚠️ WARNING: Move Project Folder\n\n` +
        `Source: ${project.path}\n` +
        `Destination: ${destinationPath}\n\n` +
        `Files will be physically moved on disk.\n` +
        `This may take time for large projects.\n\n` +
        `Do you want to continue?`
    );

    if (!confirmed) {
      return;
    }

    setIsMoving(true);
    setProgress({ phase: "preparing" });
    cancelRef.current = false;

    // Set up progress listener
    const progressHandler = (progressUpdate: MoveProgress) => {
      if (!cancelRef.current) {
        setProgress(progressUpdate);
      }
    };

    if (window.dockevProject?.onMoveProgress) {
      window.dockevProject.onMoveProgress(progressHandler);
    }

    try {
      if (window.dockevProject?.moveFolder) {
        const result = await window.dockevProject.moveFolder(
          project.path,
          destinationPath.trim(),
          excludeNodeModules,
          deleteSource
        );

        // Remove progress listener
        if (window.dockevProject?.removeMoveProgressListener) {
          window.dockevProject.removeMoveProgressListener();
        }

        if (cancelRef.current) {
          setProgress({ phase: "error", error: "Operation cancelled" });
          setIsMoving(false);
          return;
        }

        if (result.success && result.newPath) {
          setProgress({ phase: "complete" });
          setTimeout(() => {
            onMoveComplete(result.newPath!);
            onClose();
          }, 1000);
        } else {
          setProgress({
            phase: "error",
            error: result.error || "Unknown error",
          });
          setIsMoving(false);
        }
      } else {
        setIsMoving(false);
      }
    } catch (error) {
      // Remove progress listener on error
      if (window.dockevProject?.removeMoveProgressListener) {
        window.dockevProject.removeMoveProgressListener();
      }
      console.error("Error moving project:", error);
      setProgress({
        phase: "error",
        error:
          error instanceof Error ? error.message : "Failed to move project",
      });
      setIsMoving(false);
    }
  };

  if (!isOpen) return null;

  const getProgressMessage = () => {
    if (!progress) return "";
    switch (progress.phase) {
      case "preparing":
        return "Preparing to move files...";
      case "moving":
        if (progress.filesProcessed && progress.totalFiles) {
          const percent = Math.round(
            (progress.filesProcessed / progress.totalFiles) * 100
          );
          return `Moving files... ${progress.filesProcessed}/${progress.totalFiles} (${percent}%)`;
        }
        return progress.currentFile
          ? `Moving: ${progress.currentFile}`
          : "Moving files...";
      case "cleaning":
        return "Cleaning up...";
      case "complete":
        return "Move completed successfully!";
      case "error":
        return `Error: ${progress.error}`;
      default:
        return "";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={isMoving ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-surface-dark shadow-2xl border border-border-dark/50 pointer-events-auto transition-all duration-300 ${
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
                Move Project Folder
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Experimental feature: Move project folder to a new location
              </p>
            </div>
            {!isMoving && (
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
            <div className="space-y-6">
              {/* Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-yellow-500 text-[24px]">
                    warning
                  </span>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-semibold mb-1">
                      Experimental Feature
                    </h3>
                    <p className="text-yellow-300/80 text-sm">
                      This will physically move files on disk. Large projects
                      may take significant time. Ensure you have backups before
                      proceeding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Source Path */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Source Path
                </label>
                <div className="rounded-lg border border-border-dark bg-surface-darker px-4 py-3 text-sm text-text-secondary font-mono">
                  {project.path}
                </div>
              </div>

              {/* Destination Path */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Destination Directory
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={destinationPath}
                    onChange={(e) => setDestinationPath(e.target.value)}
                    placeholder="Select destination directory..."
                    disabled={isMoving}
                    className="flex-1 rounded-lg border border-border-dark bg-surface-dark px-4 py-3 text-sm text-white placeholder-text-secondary/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSelectDestination}
                    disabled={isMoving}
                    className="px-5 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Browse
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={excludeNodeModules}
                    onChange={(e) => setExcludeNodeModules(e.target.checked)}
                    disabled={isMoving}
                    className="mt-1 w-4 h-4 rounded border-border-dark bg-surface-dark text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <div className="flex-1">
                    <span className="text-white text-sm font-medium block">
                      Exclude node_modules
                    </span>
                    <p className="text-text-secondary text-xs mt-1">
                      Skip moving node_modules folder. You'll need to run{" "}
                      <code className="bg-surface-darker px-1 py-0.5 rounded text-xs">
                        npm install
                      </code>{" "}
                      after moving.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={deleteSource}
                    onChange={(e) => setDeleteSource(e.target.checked)}
                    disabled={isMoving}
                    className="mt-1 w-4 h-4 rounded border-border-dark bg-surface-dark text-red-500 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  />
                  <div className="flex-1">
                    <span className="text-white text-sm font-medium block">
                      Delete source folder after move
                    </span>
                    <p className="text-text-secondary text-xs mt-1">
                      Permanently delete the original folder after successful
                      move. This action cannot be undone.
                    </p>
                  </div>
                </label>
              </div>

              {/* Progress */}
              {isMoving && progress && (
                <div className="space-y-3">
                  <div className="h-2 bg-surface-darker rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        progress.phase === "complete"
                          ? "bg-green-500"
                          : progress.phase === "error"
                          ? "bg-red-500"
                          : "bg-primary"
                      }`}
                      style={{
                        width:
                          progress.phase === "complete"
                            ? "100%"
                            : progress.phase === "error"
                            ? "100%"
                            : progress.filesProcessed && progress.totalFiles
                            ? `${
                                (progress.filesProcessed /
                                  progress.totalFiles) *
                                100
                              }%`
                            : progress.phase === "preparing"
                            ? "10%"
                            : progress.phase === "cleaning"
                            ? "90%"
                            : "50%",
                      }}
                    />
                  </div>
                  <p className="text-sm text-text-secondary text-center">
                    {getProgressMessage()}
                  </p>
                  {progress.currentFile && (
                    <p className="text-xs text-text-secondary/70 text-center font-mono truncate">
                      {progress.currentFile}
                    </p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {progress?.phase === "error" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-400 text-[20px]">
                      error
                    </span>
                    <div className="flex-1">
                      <p className="text-red-400 text-sm">{progress.error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {progress?.phase === "complete" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-400 text-[20px]">
                      check_circle
                    </span>
                    <div className="flex-1">
                      <p className="text-green-400 text-sm font-semibold mb-1">
                        Move completed successfully!
                      </p>
                      {excludeNodeModules && (
                        <p className="text-green-300/80 text-xs mt-2">
                          Don't forget to run{" "}
                          <code className="bg-surface-darker px-1 py-0.5 rounded">
                            npm install
                          </code>{" "}
                          in the new location.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-8 py-6 pt-2">
            <button
              onClick={handleCancel}
              disabled={isMoving && progress?.phase !== "error"}
              className="px-5 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMoving ? "Cancel" : "Close"}
            </button>
            {!isMoving && (
              <button
                onClick={handleMove}
                disabled={!destinationPath.trim()}
                className="px-5 h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Move Project
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
