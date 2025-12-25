import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/Project";

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}

export function Spotlight({ isOpen, onClose, projects }: SpotlightProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter projects based on query
  const filteredProjects = projects.filter((project) => {
    if (!query.trim()) return false;
    const searchTerm = query.toLowerCase();
    
    // Basic project fields
    const matchesBasic =
      project.name.toLowerCase().includes(searchTerm) ||
      project.path.toLowerCase().includes(searchTerm) ||
      project.category.toLowerCase().includes(searchTerm) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

    // Module search
    const matchesModules = project.modules?.some((module) => {
      return (
        module.name.toLowerCase().includes(searchTerm) ||
        module.path.toLowerCase().includes(searchTerm) ||
        module.techStack.some((tech) => tech.toLowerCase().includes(searchTerm))
      );
    });

    // Technology stack search (from modules)
    const allTechStack = project.modules?.flatMap((module) => module.techStack) || [];
    const matchesTechStack = allTechStack.some((tech) =>
      tech.toLowerCase().includes(searchTerm)
    );

    // Project details search (description, author, etc.)
    // Note: projectDetails are loaded dynamically, so we can't search them here
    // But we can search tags which might include tech stack info
    
    return matchesBasic || matchesModules || matchesTechStack;
  });

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelectProject = (project: Project) => {
    navigate(`/project/${project.id}`);
    onClose();
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredProjects.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && filteredProjects[selectedIndex]) {
        e.preventDefault();
        handleSelectProject(filteredProjects[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredProjects, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Spotlight Modal */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
        <div
          className="w-full max-w-2xl bg-surface-dark rounded-2xl border border-border-dark shadow-2xl pointer-events-auto overflow-hidden transform transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border-dark">
            <span className="material-symbols-outlined text-text-secondary text-[24px]">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search projects..."
              className="flex-1 bg-transparent text-white text-lg placeholder-text-secondary/60 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  close
                </span>
              </button>
            )}
            <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border border-border-dark bg-surface-darker px-2 font-mono text-[10px] font-medium text-text-secondary">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div
            ref={resultsRef}
            className="max-h-[60vh] overflow-y-auto custom-scrollbar"
          >
            {!query.trim() ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[28px]">
                      search
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      Search projects
                    </p>
                    <p className="text-text-secondary text-xs mt-1">
                      Type to search by name, path, category, tags, modules, or technologies
                    </p>
                  </div>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-text-secondary text-[40px]">
                    search_off
                  </span>
                  <p className="text-text-secondary text-sm">
                    No projects found for "{query}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Projects ({filteredProjects.length})
                </div>
                {filteredProjects.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className={`w-full flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors ${
                      index === selectedIndex ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        folder
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-semibold truncate">
                          {project.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {project.category}
                        </span>
                        {project.modules && project.modules.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {project.modules.length} {project.modules.length === 1 ? "module" : "modules"}
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary text-xs font-mono truncate">
                        {project.path}
                      </p>
                      {/* Show tags */}
                      {project.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-surface-darker text-text-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Show technology stack from modules */}
                      {project.modules && project.modules.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {Array.from(
                            new Set(
                              project.modules.flatMap((module) => module.techStack)
                            )
                          )
                            .slice(0, 4)
                            .map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                              >
                                {tech}
                              </span>
                            ))}
                        </div>
                      )}
                      {/* Show module names if they match search */}
                      {project.modules && project.modules.length > 0 && query.trim() && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {project.modules
                            .filter((module) =>
                              module.name.toLowerCase().includes(query.toLowerCase()) ||
                              module.path.toLowerCase().includes(query.toLowerCase())
                            )
                            .slice(0, 2)
                            .map((module) => (
                              <span
                                key={module.id}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[10px]">
                                  folder
                                </span>
                                {module.name}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-text-secondary text-[20px]">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-border-dark flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="h-5 px-1.5 rounded border border-border-dark bg-surface-darker font-mono">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="h-5 px-1.5 rounded border border-border-dark bg-surface-darker font-mono">
                  ↵
                </kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="h-5 px-1.5 rounded border border-border-dark bg-surface-darker font-mono">
                ESC
              </kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

