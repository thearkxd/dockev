import { useState, useEffect } from "react";
import type { Project } from "../../types/Project";

interface TechStackItem {
  name: string;
  version?: string;
  icon?: string;
  color?: string;
}

interface ManageTechStackModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onSave: (updates: Partial<Project>) => void;
}

// Predefined tech stack configurations
const predefinedTechs: Record<
  string,
  { icon: string; color: string; defaultVersion?: string }
> = {
  React: { icon: "code_blocks", color: "#61DAFB", defaultVersion: "^18.0.0" },
  "React Native / Expo": {
    icon: "smartphone",
    color: "#61DAFB",
    defaultVersion: "^0.72.0",
  },
  "Tailwind CSS": {
    icon: "brush",
    color: "#38B2AC",
    defaultVersion: "^3.0.0",
  },
  TypeScript: {
    icon: "data_object",
    color: "#3178C6",
    defaultVersion: "^5.0.0",
  },
  "Node.js": { icon: "dns", color: "#8CC84B", defaultVersion: "^20.0.0" },
  "Next.js": { icon: "web", color: "#000000", defaultVersion: "^14.0.0" },
  Vue: { icon: "code", color: "#4FC08D", defaultVersion: "^3.0.0" },
  Angular: { icon: "code", color: "#DD0031", defaultVersion: "^17.0.0" },
  Python: { icon: "code", color: "#3776AB", defaultVersion: "^3.11.0" },
  Django: { icon: "code", color: "#092E20", defaultVersion: "^4.2.0" },
  Flask: { icon: "code", color: "#000000", defaultVersion: "^3.0.0" },
  Go: { icon: "code", color: "#00ADD8", defaultVersion: "^1.21.0" },
  Rust: { icon: "code", color: "#000000", defaultVersion: "^1.70.0" },
};

export function ManageTechStackModal({
  isOpen,
  project,
  onClose,
  onSave,
}: ManageTechStackModalProps) {
  // Get all unique tech stacks from modules and project tags
  const getAllTechStacks = (): string[] => {
    const techSet = new Set<string>();

    // Add from modules
    project.modules?.forEach((module) => {
      module.techStack.forEach((tech) => techSet.add(tech));
    });

    // Add from project tags
    project.tags.forEach((tag) => techSet.add(tag));

    return Array.from(techSet);
  };

  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [newTechName, setNewTechName] = useState("");
  const [newTechVersion, setNewTechVersion] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize tech stack items with versions from config
  useEffect(() => {
    if (isOpen) {
      const techNames = getAllTechStacks();
      const versions = project.config?.techStackVersions || {};

      const initializedTechStack: TechStackItem[] = techNames.map((name) => ({
        name,
        version: versions[name] || "",
        ...(predefinedTechs[name] || { icon: "code", color: "#6366F1" }),
      }));

      setTechStack(initializedTechStack);
      setNewTechName("");
      setNewTechVersion("");
      setSearchQuery("");
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
    // Modal açıldığında form state'ini resetlemek için gerekli
    // eslint-disable-next-line react-compiler/react-compiler
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

  const handleAddTech = () => {
    const trimmedName = newTechName.trim();
    const trimmedVersion = newTechVersion.trim();

    if (!trimmedName) return;

    // Check if tech already exists
    if (techStack.some((tech) => tech.name === trimmedName)) {
      alert("This technology is already in the stack.");
      return;
    }

    const newTech: TechStackItem = {
      name: trimmedName,
      version: trimmedVersion || undefined,
      ...(predefinedTechs[trimmedName] || { icon: "code", color: "#6366F1" }),
    };

    setTechStack([...techStack, newTech]);
    setNewTechName("");
    setNewTechVersion("");
  };

  const handleRemoveTech = (techName: string) => {
    setTechStack(techStack.filter((tech) => tech.name !== techName));
  };

  const handleUpdateVersion = (techName: string, version: string) => {
    setTechStack(
      techStack.map((tech) =>
        tech.name === techName ? { ...tech, version } : tech
      )
    );
  };

  const handleSave = () => {
    // Update project tags with tech stack names
    const techNames = techStack.map((tech) => tech.name);

    // Create versions object
    const versions: Record<string, string> = {};
    techStack.forEach((tech) => {
      if (tech.version) {
        versions[tech.name] = tech.version;
      }
    });

    // Update project
    onSave({
      tags: techNames,
      config: {
        ...project.config,
        techStackVersions: versions,
      },
    });

    onClose();
  };

  // Filter tech stack based on search query
  const filteredTechStack = techStack.filter((tech) =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get available predefined techs that are not yet added
  const availablePredefinedTechs = Object.keys(predefinedTechs).filter(
    (techName) => !techStack.some((tech) => tech.name === techName)
  );

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
          className={`relative w-full max-w-4xl flex flex-col max-h-[90vh] rounded-2xl bg-surface-dark shadow-2xl border border-border-dark/50 pointer-events-auto transition-all duration-300 ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 py-6 pb-2 border-b border-border-dark">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-white">
                Manage Technology Stack
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Add, remove, and manage versions for your project technologies.
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
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Search Technologies
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border-dark bg-background-dark px-4 py-3 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search by name..."
                />
              </div>

              {/* Current Tech Stack */}
              <div>
                <h3 className="text-white text-base font-semibold mb-4">
                  Current Technologies ({techStack.length})
                </h3>
                {filteredTechStack.length === 0 ? (
                  <div className="rounded-xl border border-border-dark bg-surface-dark/40 p-8 text-center">
                    <span className="material-symbols-outlined text-[40px] text-text-secondary mb-2">
                      code_off
                    </span>
                    <p className="text-text-secondary text-sm">
                      {searchQuery
                        ? "No technologies match your search."
                        : "No technologies added yet."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredTechStack.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-center gap-3 p-4 rounded-xl border border-border-dark bg-surface-dark/40 hover:border-primary/30 transition-colors group"
                      >
                        <div
                          className="size-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: `${tech.color}10`,
                            color: tech.color,
                          }}
                        >
                          <span className="material-symbols-outlined text-[24px]">
                            {tech.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-white truncate">
                              {tech.name}
                            </span>
                            <button
                              onClick={() => handleRemoveTech(tech.name)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all"
                              title="Remove"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={tech.version || ""}
                            onChange={(e) =>
                              handleUpdateVersion(tech.name, e.target.value)
                            }
                            className="w-full rounded-md border border-border-dark bg-background-dark px-2 py-1 text-xs text-text-secondary placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Version (e.g., ^18.0.0)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Technology */}
              <div className="border-t border-border-dark pt-6">
                <h3 className="text-white text-base font-semibold mb-4">
                  Add New Technology
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newTechName}
                      onChange={(e) => setNewTechName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      className="w-full rounded-lg border border-border-dark bg-background-dark px-4 py-3 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Technology name (e.g., React, Vue, Python)"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newTechVersion}
                      onChange={(e) => setNewTechVersion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      className="w-full rounded-lg border border-border-dark bg-background-dark px-4 py-3 text-sm text-white placeholder-text-secondary/60 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Version (optional, e.g., ^18.0.0)"
                    />
                  </div>
                  <button
                    onClick={handleAddTech}
                    className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95 whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>

                {/* Quick Add Predefined Techs */}
                {availablePredefinedTechs.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-text-secondary mb-2">
                      Quick add:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availablePredefinedTechs.slice(0, 8).map((techName) => {
                        const techConfig = predefinedTechs[techName];
                        return (
                          <button
                            key={techName}
                            onClick={() => {
                              setNewTechName(techName);
                              setNewTechVersion(
                                techConfig.defaultVersion || ""
                              );
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-dark bg-surface-dark/40 hover:bg-surface-dark text-sm text-white transition-colors"
                          >
                            <div
                              className="size-4 rounded"
                              style={{
                                backgroundColor: techConfig.color,
                              }}
                            ></div>
                            <span>{techName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-8 py-6 pt-2 border-t border-border-dark">
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
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
