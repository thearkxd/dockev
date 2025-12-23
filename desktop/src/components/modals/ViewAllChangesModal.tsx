import { useState, useEffect } from "react";
import type { Project } from "../../types/Project";

interface ViewAllChangesModalProps {
  isOpen: boolean;
  project: Project;
  gitStatus: {
    branch: string;
    lastCommit: string;
    lastCommitTime: string;
    pendingChanges: number;
    files: Array<{ name: string; status: string }>;
  } | null;
  onClose: () => void;
}

export function ViewAllChangesModal({
  isOpen,
  project,
  gitStatus,
  onClose,
}: ViewAllChangesModalProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [diff, setDiff] = useState<string | null>(null);
  const [isLoadingDiff, setIsLoadingDiff] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setSelectedFile(null);
      setDiff(null);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleFileClick = async (fileName: string) => {
    setSelectedFile(fileName);
    setIsLoadingDiff(true);
    setDiff(null);

    try {
      if (window.dockevWindow?.git?.getDiff) {
        const fileDiff = await window.dockevWindow.git.getDiff(
          project.path,
          fileName
        );
        setDiff(fileDiff);
      }
    } catch (error) {
      console.error("Error loading diff:", error);
      setDiff("Error loading diff");
    } finally {
      setIsLoadingDiff(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "added":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "deleted":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "renamed":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "added":
        return "add";
      case "deleted":
        return "delete";
      case "renamed":
        return "drive_file_rename";
      default:
        return "edit";
    }
  };

  // Parse diff and highlight lines
  const renderDiff = (diffText: string) => {
    if (!diffText) return <div className="text-text-secondary">No changes</div>;

    const lines = diffText.split("\n");
    return (
      <div className="font-mono text-xs">
        {lines.map((line, index) => {
          const isHeader = line.startsWith("diff --git") || line.startsWith("index") || line.startsWith("---") || line.startsWith("+++");
          const isAdded = line.startsWith("+") && !line.startsWith("+++");
          const isRemoved = line.startsWith("-") && !line.startsWith("---");
          const isContext = line.startsWith("@@");

          if (isHeader) {
            return (
              <div key={index} className="text-text-secondary py-1">
                {line}
              </div>
            );
          }
          if (isContext) {
            return (
              <div key={index} className="text-blue-400 bg-blue-500/10 py-1 px-2">
                {line}
              </div>
            );
          }
          if (isAdded) {
            return (
              <div key={index} className="text-green-400 bg-green-500/10 py-1 px-2">
                {line}
              </div>
            );
          }
          if (isRemoved) {
            return (
              <div key={index} className="text-red-400 bg-red-500/10 py-1 px-2">
                {line}
              </div>
            );
          }
          return (
            <div key={index} className="text-text-secondary py-1">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen || !gitStatus) return null;

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
          className={`relative w-full max-w-6xl h-[90vh] flex flex-col rounded-2xl bg-surface-dark shadow-2xl border border-border-dark/50 pointer-events-auto transition-all duration-300 ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 py-6 pb-2 border-b border-border-dark">
            <div className="flex-1">
              <h2 className="text-2xl font-bold leading-tight text-white">
                Git Changes
              </h2>
              <div className="mt-2 flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    call_split
                  </span>
                  <span className="font-mono">{gitStatus.branch}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    description
                  </span>
                  <span>{gitStatus.pendingChanges} files changed</span>
                </span>
              </div>
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
          <div className="flex-1 overflow-hidden flex">
            {/* File List */}
            <div className="w-80 border-r border-border-dark flex flex-col">
              <div className="px-4 py-3 border-b border-border-dark">
                <h3 className="text-white text-sm font-semibold">Changed Files</h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {gitStatus.files.length === 0 ? (
                  <div className="p-4 text-center text-text-secondary text-sm">
                    No files changed
                  </div>
                ) : (
                  <div className="divide-y divide-border-dark">
                    {gitStatus.files.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => handleFileClick(file.name)}
                        className={`w-full text-left p-3 px-4 hover:bg-surface-dark/50 transition-colors ${
                          selectedFile === file.name
                            ? "bg-primary/10 border-l-2 border-primary"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`material-symbols-outlined text-[16px] ${getStatusColor(file.status).split(" ")[0]}`}
                          >
                            {getStatusIcon(file.status)}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(file.status)}`}
                          >
                            {file.status}
                          </span>
                        </div>
                        <div className="text-sm text-white font-mono truncate">
                          {file.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Diff View */}
            <div className="flex-1 flex flex-col min-w-0">
              {selectedFile ? (
                <>
                  <div className="px-6 py-3 border-b border-border-dark flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-text-secondary text-[20px]">
                        code
                      </span>
                      <span className="text-white font-mono text-sm truncate">
                        {selectedFile}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setDiff(null);
                      }}
                      className="text-xs text-text-secondary hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-background-dark">
                    {isLoadingDiff ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                          <p className="text-text-secondary text-sm">
                            Loading diff...
                          </p>
                        </div>
                      </div>
                    ) : diff ? (
                      <div className="whitespace-pre-wrap">{renderDiff(diff)}</div>
                    ) : (
                      <div className="text-text-secondary text-sm text-center py-8">
                        No diff available
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[48px] text-text-secondary mb-4">
                      code_off
                    </span>
                    <p className="text-text-secondary text-sm">
                      Select a file to view its diff
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-8 py-6 pt-2 border-t border-border-dark">
            <button
              onClick={onClose}
              className="px-5 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

