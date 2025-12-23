import { useState } from "react";
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
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "Archived") {
      return project.category.toLowerCase() === "archived";
    }
    return project.category === activeCategory;
  });

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
          <Header />
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto pb-20">
              {filteredProjects.map((project) => (
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
