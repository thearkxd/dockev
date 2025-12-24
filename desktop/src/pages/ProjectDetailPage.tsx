import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectDetail } from "../components/project/ProjectDetail";
import { TitleBar } from "../components/layout/TitleBar";
import { ProjectConfigModal } from "../components/modals/ProjectConfigModal";
import { ManageTechStackModal } from "../components/modals/ManageTechStackModal";
import { ViewAllChangesModal } from "../components/modals/ViewAllChangesModal";
import { MoveProjectModal } from "../components/modals/MoveProjectModal";
import type { Project } from "../types/Project";

interface ProjectDetailPageProps {
  projects: Project[];
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onOpenIDE: (projectPath: string, ide: string) => Promise<void>;
}

export function ProjectDetailPage({
  projects,
  onUpdateProject,
  onDeleteProject,
  onOpenIDE,
}: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const [isViewAllChangesModalOpen, setIsViewAllChangesModalOpen] =
    useState(false);
  const [isMoveProjectModalOpen, setIsMoveProjectModalOpen] = useState(false);
  const [gitStatus, setGitStatus] = useState<{
    branch: string;
    lastCommit: string;
    lastCommitTime: string;
    pendingChanges: number;
    files: Array<{ name: string; status: string }>;
  } | null>(null);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="bg-background-dark text-text-primary font-display antialiased overflow-hidden selection:bg-primary/20 selection:text-primary flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Project Not Found
          </h2>
          <p className="text-text-secondary mb-4">
            The project you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors"
          >
            Go Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const handleOpenIDE = async (projectPath: string, ide: string) => {
    await onOpenIDE(projectPath, ide);
    // Update last opened time
    onUpdateProject(project.id, { lastOpenedAt: Date.now() });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove "${project.name}"?`)) {
      onDeleteProject(project.id);
      navigate("/");
    }
  };

  const handleRunDevServer = async (projectPath: string) => {
    try {
      if (window.dockevWindow?.run?.devServer) {
        await window.dockevWindow.run.devServer(
          projectPath,
          project.config?.devServerCommand,
          project.config?.environmentVariables
        );
      }
    } catch (error) {
      console.error("Error running dev server:", error);
      throw error;
    }
  };

  const handleOpenConfig = () => {
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = (updates: Partial<Project>) => {
    onUpdateProject(project.id, updates);
  };

  const handleManageTechStack = () => {
    setIsTechStackModalOpen(true);
  };

  const handleSaveTechStack = (updates: Partial<Project>) => {
    onUpdateProject(project.id, updates);
  };

      const handleViewAllChanges = async () => {
        // Load git status if not already loaded
        if (!gitStatus && window.dockevWindow?.git?.getStatus) {
          try {
            const status = await window.dockevWindow.git.getStatus(project.path);
            setGitStatus(status);
          } catch (error) {
            console.error("Error loading git status:", error);
          }
        }
        setIsViewAllChangesModalOpen(true);
      };

      const handleMoveProject = () => {
        setIsMoveProjectModalOpen(true);
      };

      const handleMoveComplete = (newPath: string) => {
        onUpdateProject(project.id, { path: newPath });
      };

  return (
    <>
      <TitleBar
        breadcrumb={{
          label: "Projects",
          onClick: () => navigate("/"),
        }}
        projectName={project.name}
        showSearch={true}
        showActions={true}
        projects={projects}
      />
      <div className="h-screen pt-[49px] overflow-y-auto">
            <ProjectDetail
              project={project}
              onOpenIDE={handleOpenIDE}
              onDelete={handleDelete}
              onRunDevServer={handleRunDevServer}
              onOpenConfig={handleOpenConfig}
              onManageTechStack={handleManageTechStack}
              onViewAllChanges={handleViewAllChanges}
              onUpdateProject={(updates) => onUpdateProject(project.id, updates)}
              onMoveProject={handleMoveProject}
            />
      </div>
      <ProjectConfigModal
        isOpen={isConfigModalOpen}
        project={project}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveConfig}
      />
      <ManageTechStackModal
        isOpen={isTechStackModalOpen}
        project={project}
        onClose={() => setIsTechStackModalOpen(false)}
        onSave={handleSaveTechStack}
      />
          <ViewAllChangesModal
            isOpen={isViewAllChangesModalOpen}
            project={project}
            gitStatus={gitStatus}
            onClose={() => setIsViewAllChangesModalOpen(false)}
          />
          <MoveProjectModal
            isOpen={isMoveProjectModalOpen}
            project={project}
            onClose={() => setIsMoveProjectModalOpen(false)}
            onMoveComplete={handleMoveComplete}
          />
        </>
      );
    }
