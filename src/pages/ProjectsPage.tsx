import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { ProjectCard } from "../components/project/ProjectCard";
import { AddProjectModal } from "../components/modals/AddProjectModal";
import { TitleBar } from "../components/layout/TitleBar";
import type { Project } from "../types/Project";

interface ProjectsPageProps {
  projects: Project[];
  onAddProject: (projectData: {
    name: string;
    path: string;
    category: string;
    defaultIde: string;
    tags: string[];
  }) => void;
  onUpdateProject?: (id: string, updates: Partial<Project>) => void;
  onDeleteProject?: (id: string) => void;
  onOpenIDE?: (projectPath: string, ide: string) => Promise<void>;
}

export function ProjectsPage({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onOpenIDE,
}: ProjectsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("recent");
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Category filter (from sidebar)
    if (activeCategory !== "all") {
      if (activeCategory === "Archived") {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === "archived"
        );
      } else {
        filtered = filtered.filter((p) => p.category === activeCategory);
      }
    }

    // Header filter options
    if (filterOption === "recent") {
      filtered = filtered.filter((p) => p.lastOpenedAt !== undefined);
    } else if (filterOption === "archived") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === "archived"
      );
    }
    // "favorites" filter can be added later if we add a favorites feature

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((project) => {
        const matchesBasic =
          project.name.toLowerCase().includes(query) ||
          project.path.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchesModules = project.modules?.some((module) => {
          return (
            module.name.toLowerCase().includes(query) ||
            module.path.toLowerCase().includes(query) ||
            module.techStack.some((tech) => tech.toLowerCase().includes(query))
          );
        });

        const allTechStack =
          project.modules?.flatMap((module) => module.techStack) || [];
        const matchesTechStack = allTechStack.some((tech) =>
          tech.toLowerCase().includes(query)
        );

        return matchesBasic || matchesModules || matchesTechStack;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "recent":
          const aTime = a.lastOpenedAt || 0;
          const bTime = b.lastOpenedAt || 0;
          return bTime - aTime;
        case "oldest":
          const aTimeOld = a.lastOpenedAt || 0;
          const bTimeOld = b.lastOpenedAt || 0;
          return aTimeOld - bTimeOld;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return sorted;
  }, [projects, activeCategory, searchQuery, filterOption, sortOption]);

  return (
    <>
      <TitleBar showSearch={true} showActions={true} projects={projects} />
      <div className="relative flex h-screen w-full flex-row overflow-hidden pt-[49px]">
        <Sidebar
          onNewProjectClick={() => setIsModalOpen(true)}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        <div className="flex flex-1 flex-col h-full min-w-0 bg-background-dark relative">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterOption={filterOption}
            onFilterChange={setFilterOption}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto pb-20">
              {filteredAndSortedProjects.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <span className="material-symbols-outlined text-[64px] text-text-secondary/50 mb-4">
                    search_off
                  </span>
                  <h3 className="text-white text-lg font-semibold mb-2">
                    No projects found
                  </h3>
                  <p className="text-text-secondary text-sm mb-6">
                    {searchQuery || filterOption !== "all"
                      ? "Try adjusting your search query or filters"
                      : "Add your first project to get started"}
                  </p>
                  {!searchQuery && filterOption === "all" && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-colors"
                    >
                      Add Project
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {filteredAndSortedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                      onOpenIDE={onOpenIDE}
                      onRevealInExplorer={async (projectPath: string) => {
                        if (window.dockevShell?.openFolder) {
                          await window.dockevShell.openFolder(projectPath);
                        }
                      }}
                      onArchive={(projectId: string) => {
                        if (onUpdateProject) {
                          onUpdateProject(projectId, { category: "Archived" });
                        }
                      }}
                      onDelete={onDeleteProject}
                    />
                  ))}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex flex-col items-center justify-center rounded-2xl bg-surface-dark border border-dashed border-border-dark p-6 gap-3 hover:border-primary/50 hover:bg-surface-dark/80 transition-all cursor-pointer group min-h-[300px]"
                  >
                    <div className="size-14 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors text-[28px]">
                        add
                      </span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-white text-[15px] font-semibold">
                        New Project
                      </h3>
                      <p className="text-text-secondary text-xs mt-1">
                        Initialize a new repository
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddProject}
      />
    </>
  );
}
