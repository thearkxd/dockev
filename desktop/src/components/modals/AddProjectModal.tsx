import { useState, useEffect } from "react";
import { settingsStorage } from "../../utils/settingsStorage";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: {
    name: string;
    path: string;
    category: string;
    defaultIde: string;
    tags: string[];
    color?: string;
  }) => void;
}

export function AddProjectModal({
  isOpen,
  onClose,
  onSave,
}: AddProjectModalProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [category, setCategory] = useState("");
  const [defaultIde, setDefaultIde] = useState(
    settingsStorage.getSettings().defaultIde || "vscode"
  );
  const [availableIDEs] = useState(() => settingsStorage.getAllIDEs());
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [color, setColor] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; path?: string }>({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Predefined color palette
  const colorPalette = [
    "#6366F1", // indigo
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#F43F5E", // rose
    "#EF4444", // red
    "#F59E0B", // amber
    "#10B981", // emerald
    "#06B6D4", // cyan
    "#3B82F6", // blue
    "#14B8A6", // teal
    "#F97316", // orange
    "#84CC16", // lime
  ];

  // Reset form when modal closes
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setName("");
      setPath("");
      setCategory("");
      setDefaultIde("vscode");
      setTags([]);
      setTagInput("");
      setColor("");
      setErrors({});
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

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleBrowseFolder = async () => {
    try {
      const selectedPath = await window.dockevDialog?.selectFolder();
      if (selectedPath) {
        setPath(selectedPath);
        setErrors((prev) => ({ ...prev, path: undefined }));
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; path?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!path.trim()) {
      newErrors.path = "Folder path is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      name: name.trim(),
      path: path.trim(),
      category,
      defaultIde,
      tags,
      color: color.trim() || undefined,
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative w-full max-w-[680px] flex flex-col max-h-[90vh] rounded-2xl bg-surface-dark shadow-2xl border border-border-dark/50 pointer-events-auto transition-all duration-300 ${
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
                Add Project
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Configure your new project workspace details.
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
            <div className="space-y-7">
              {/* Project Name */}
              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Project Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "border-border-dark bg-white/5 focus:border-primary focus:ring-primary/20"
                  }`}
                  placeholder="e.g., Portfolio Redesign"
                  type="text"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Folder Path */}
              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Folder Path <span className="text-red-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    value={path}
                    onChange={(e) => {
                      setPath(e.target.value);
                      if (errors.path) {
                        setErrors((prev) => ({ ...prev, path: undefined }));
                      }
                    }}
                    className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 ${
                      errors.path
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : "border-border-dark bg-white/5 focus:border-primary focus:ring-primary/20"
                    }`}
                    placeholder="C:\\Users\\username\\projects\\..."
                    type="text"
                  />
                  <button
                    onClick={handleBrowseFolder}
                    className="absolute right-2 p-1.5 rounded-md text-text-secondary hover:bg-white/10 hover:text-white transition-colors"
                    title="Browse folder"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      folder_open
                    </span>
                  </button>
                </div>
                {errors.path && (
                  <p className="mt-1 text-xs text-red-400">{errors.path}</p>
                )}
              </div>

              {/* Category and Default IDE */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border-dark bg-white/5 px-4 py-3 pr-10 text-sm text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Web" className="text-white bg-border-dark">
                        Web
                      </option>
                      <option
                        value="Mobile"
                        className="text-white bg-border-dark"
                      >
                        Mobile
                      </option>
                      <option
                        value="Backend"
                        className="text-white bg-border-dark"
                      >
                        Backend
                      </option>
                      <option
                        value="Experiments"
                        className="text-white bg-border-dark"
                      >
                        Experiments
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                      <span className="material-symbols-outlined text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Default IDE
                  </label>
                  <div className="relative">
                    <select
                      value={defaultIde}
                      onChange={(e) => setDefaultIde(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border-dark bg-white/5 px-4 py-3 pr-10 text-sm text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {availableIDEs.map((ide) => (
                        <option
                          key={ide.id}
                          value={ide.id}
                          className="text-white bg-border-dark"
                        >
                          {ide.name}
                        </option>
                      ))}
                      <option
                        value="terminal"
                        className="text-white bg-border-dark"
                      >
                        Terminal
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                      <span className="material-symbols-outlined text-[20px]">
                        code
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Color */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Project Color (Optional)
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {colorPalette.map((paletteColor) => (
                      <button
                        key={paletteColor}
                        type="button"
                        onClick={() =>
                          setColor(color === paletteColor ? "" : paletteColor)
                        }
                        className={`size-10 rounded-lg border-2 transition-all hover:scale-110 ${
                          color === paletteColor
                            ? "border-white ring-2 ring-primary ring-offset-2 ring-offset-surface-dark"
                            : "border-border-dark hover:border-white/50"
                        }`}
                        style={{ backgroundColor: paletteColor }}
                        title={paletteColor}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color || "#6366F1"}
                      onChange={(e) => setColor(e.target.value)}
                      className="size-10 rounded-lg border border-border-dark bg-white/5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#6366F1"
                      className="flex-1 rounded-lg border border-border-dark bg-white/5 px-4 py-2 text-sm text-white font-mono placeholder-text-secondary/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                    {color && (
                      <button
                        type="button"
                        onClick={() => setColor("")}
                        className="px-3 py-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Clear color"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          close
                        </span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">
                    Choose a custom color for this project card
                  </p>
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Tech Stack
                </label>
                <div className="w-full min-h-[52px] rounded-lg border border-border-dark bg-white/5 p-2 transition-all focus-within:border-primary focus-within:bg-white/10 focus-within:ring-2 focus-within:ring-primary/20">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-primary/20 py-1 pl-3 pr-2 text-xs font-medium text-blue-300 ring-1 ring-inset ring-primary/30"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/30 transition-colors"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            close
                          </span>
                        </button>
                      </div>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleAddTag}
                      className="min-w-[100px] flex-1 border-0 bg-transparent p-1.5 text-sm text-white placeholder-text-secondary/60 focus:outline-none focus:ring-0"
                      placeholder="Add tag..."
                      type="text"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-text-secondary">
                  Separated by comma or enter
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-6">
            <button
              onClick={onClose}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !path.trim()}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-primary-hover hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
              type="button"
            >
              Save Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
