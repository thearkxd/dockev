import { useState, useEffect } from "react";
import type { Project, ProjectConfig } from "../../types/Project";

interface ProjectConfigModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onSave: (updates: Partial<Project>) => void;
}

export function ProjectConfigModal({
  isOpen,
  project,
  onClose,
  onSave,
}: ProjectConfigModalProps) {
  const [name, setName] = useState(project.name);
  const [category, setCategory] = useState(project.category);
  const [defaultIde, setDefaultIde] = useState(project.defaultIde);
  const [tags, setTags] = useState<string[]>(project.tags);
  const [tagInput, setTagInput] = useState("");
  const [color, setColor] = useState<string>(project.color || "");
  const [devServerCommand, setDevServerCommand] = useState(
    project.config?.devServerCommand || ""
  );

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
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>(
    project.config?.environmentVariables
      ? Object.entries(project.config.environmentVariables).map(([k, v]) => ({
          key: k,
          value: v,
        }))
      : []
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setName(project.name);
        setCategory(project.category);
        setDefaultIde(project.defaultIde);
        setTags(project.tags);
        setColor(project.color || "");
        setDevServerCommand(project.config?.devServerCommand || "");
        setEnvVars(
          project.config?.environmentVariables
            ? Object.entries(project.config.environmentVariables).map(
                ([k, v]) => ({
                  key: k,
                  value: v,
                })
              )
            : []
        );
        setIsAnimating(true);
      }, 0);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, project]);

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

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const handleUpdateEnvVar = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...envVars];
    updated[index] = { ...updated[index], [field]: value };
    setEnvVars(updated);
  };

  const handleRemoveEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const config: ProjectConfig = {
      devServerCommand: devServerCommand.trim() || undefined,
      environmentVariables:
        envVars.length > 0 && envVars.some((e) => e.key && e.value)
          ? envVars.reduce((acc, { key, value }) => {
              if (key && value) {
                acc[key] = value;
              }
              return acc;
            }, {} as Record<string, string>)
          : undefined,
    };

    onSave({
      name: name.trim(),
      category: category.trim(),
      defaultIde,
      tags,
      color: color.trim() || undefined,
      config: Object.keys(config).length > 0 ? config : undefined,
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
                Project Configuration
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Configure project settings and preferences.
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
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border-dark bg-background-dark/50 px-4 py-3 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., My Awesome Project"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-border-dark bg-background-dark/50 px-4 py-3 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Web, Mobile, Backend"
                />
              </div>

              {/* Default IDE */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Default IDE
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["vscode", "cursor", "webstorm"] as const).map((ide) => (
                    <button
                      key={ide}
                      onClick={() => setDefaultIde(ide)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                        defaultIde === ide
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border-dark bg-background-dark/50 text-text-secondary hover:border-primary/50 hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {ide === "vscode"
                          ? "code"
                          : ide === "cursor"
                          ? "edit_square"
                          : "laptop_chromebook"}
                      </span>
                      <span className="text-xs font-medium">
                        {ide === "vscode"
                          ? "VS Code"
                          : ide === "cursor"
                          ? "Cursor"
                          : "WebStorm"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Color */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
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
                      className="flex-1 rounded-lg border border-border-dark bg-background-dark/50 px-4 py-3 text-sm text-white font-mono placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-medium"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-primary/70 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          close
                        </span>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 rounded-lg border border-border-dark bg-background-dark/50 px-4 py-2 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Dev Server Command */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Dev Server Command
                </label>
                <p className="text-xs text-text-secondary mb-2">
                  Custom command to run dev server (leave empty to use default:
                  npm/yarn/pnpm run dev)
                </p>
                <input
                  type="text"
                  value={devServerCommand}
                  onChange={(e) => setDevServerCommand(e.target.value)}
                  className="w-full rounded-lg border border-border-dark bg-background-dark/50 px-4 py-3 text-sm text-white placeholder-text-secondary/60 font-mono transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., npm run dev, yarn start, pnpm dev"
                />
              </div>

              {/* Environment Variables */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white">
                    Environment Variables
                  </label>
                  <button
                    onClick={handleAddEnvVar}
                    className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                    Add Variable
                  </button>
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  Add environment variables that will be set when running dev
                  server.
                </p>
                <div className="space-y-2">
                  {envVars.map((envVar, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={envVar.key}
                        onChange={(e) =>
                          handleUpdateEnvVar(index, "key", e.target.value)
                        }
                        className="flex-1 rounded-lg border border-border-dark bg-background-dark/50 px-4 py-2 text-sm text-white placeholder-text-secondary/60 font-mono transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="KEY"
                      />
                      <input
                        type="text"
                        value={envVar.value}
                        onChange={(e) =>
                          handleUpdateEnvVar(index, "value", e.target.value)
                        }
                        className="flex-1 rounded-lg border border-border-dark bg-background-dark/50 px-4 py-2 text-sm text-white placeholder-text-secondary/60 font-mono transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="value"
                      />
                      <button
                        onClick={() => handleRemoveEnvVar(index)}
                        className="px-3 py-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>
                  ))}
                  {envVars.length === 0 && (
                    <div className="text-center py-4 text-text-secondary text-sm border border-dashed border-border-dark rounded-lg">
                      No environment variables added
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-6 pt-2 border-t border-border-dark">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
