import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { ProjectCard } from "../components/ProjectCard";
import { AddProjectModal } from "../components/AddProjectModal";
import { TitleBar } from "../components/TitleBar";
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
}

export function ProjectsPage({ projects, onAddProject }: ProjectsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  return (
    <>
      <TitleBar showSearch={true} showActions={true} />
      <div className="relative flex h-screen w-full flex-row overflow-hidden pt-[49px]">
        <Sidebar onNewProjectClick={() => setIsModalOpen(true)} />
        <div className="flex flex-1 flex-col h-full min-w-0 bg-background-dark relative">
          <Header />
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto pb-20">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
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
