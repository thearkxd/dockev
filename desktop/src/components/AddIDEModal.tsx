import { useState, useEffect } from "react";
import type { IDE } from "../types/Settings";

interface AddIDEModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ide: IDE) => void;
  editingIDE?: IDE | null;
}

export function AddIDEModal({
  isOpen,
  onClose,
  onSave,
  editingIDE,
}: AddIDEModalProps) {
  const [name, setName] = useState("");
  const [command, setCommand] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingIDE) {
        setName(editingIDE.name);
        setCommand(editingIDE.command);
      } else {
        setName("");
        setCommand("");
      }
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, editingIDE]);

  const handleSave = () => {
    if (!name.trim() || !command.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const ide: IDE = {
      id: editingIDE?.id || Date.now().toString(),
      name: name.trim(),
      command: command.trim(),
    };

    onSave(ide);
  };

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
          className={`relative w-full max-w-[500px] flex flex-col rounded-2xl bg-surface-dark shadow-2xl border border-border-dark/50 pointer-events-auto transition-all duration-300 ${
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
                {editingIDE ? "Edit IDE" : "Add New IDE"}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {editingIDE
                  ? "Update IDE configuration"
                  : "Add a custom IDE to your workspace"}
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
            <div className="space-y-6">
              {/* IDE Name */}
              <div>
                <label
                  htmlFor="ideName"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  IDE Name
                </label>
                <input
                  type="text"
                  id="ideName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border-dark bg-surface-dark px-4 py-3 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., IntelliJ IDEA, Sublime Text"
                />
              </div>

              {/* Command */}
              <div>
                <label
                  htmlFor="ideCommand"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  Command
                </label>
                <input
                  type="text"
                  id="ideCommand"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full rounded-lg border border-border-dark bg-surface-dark px-4 py-3 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="e.g., idea, subl, code"
                />
                <p className="mt-2 text-xs text-text-secondary">
                  The command used to launch this IDE from the terminal (must be
                  available in PATH)
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
              className="px-5 h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95"
            >
              {editingIDE ? "Update IDE" : "Add IDE"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

