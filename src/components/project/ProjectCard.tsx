import { useState, useEffect } from "react";
import type { Project } from "../../types/Project";
import { ProjectCardContextMenu } from "./ProjectCardContextMenu";
import { settingsStorage } from "../../utils/settingsStorage";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onOpenIDE?: (projectPath: string, ide: string) => Promise<void>;
  onRevealInExplorer?: (projectPath: string) => Promise<void>;
  onArchive?: (projectId: string) => void;
  onEditProject?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}

export const ProjectCard = ({
  project,
  onClick,
  onOpenIDE,
  onRevealInExplorer,
  onEditProject,
  onArchive,
  onDelete,
}: ProjectCardProps) => {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
  }>({ isOpen: false, position: { x: 0, y: 0 } });
  const [gitRemoteUrl, setGitRemoteUrl] = useState<string | null>(null);
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "backend":
        return "dns";
      case "web":
        return "web";
      case "mobile":
        return "smartphone";
      case "experiments":
        return "science";
      default:
        return "folder";
    }
  };

  const getTagColor = (tag: string) => {
    const colors: Record<
      string,
      { bg: string; border: string; dot: string; text: string }
    > = {
      node: {
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        dot: "bg-green-500",
        text: "text-green-400",
      },
      express: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        dot: "bg-yellow-500",
        text: "text-yellow-400",
      },
      react: {
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/20",
        dot: "bg-cyan-400",
        text: "text-cyan-400",
      },
      tailwind: {
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
        dot: "bg-blue-400",
        text: "text-blue-400",
      },
      expo: {
        bg: "bg-white/10",
        border: "border-white/20",
        dot: "bg-white",
        text: "text-white",
      },
      typescript: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        dot: "bg-blue-500",
        text: "text-blue-400",
      },
      python: {
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
        dot: "bg-yellow-400",
        text: "text-yellow-400",
      },
      pytorch: {
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        dot: "bg-orange-500",
        text: "text-orange-400",
      },
    };
    return (
      colors[tag.toLowerCase()] || {
        bg: "bg-white/10",
        border: "border-white/20",
        dot: "bg-white",
        text: "text-white",
      }
    );
  };

  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Load git remote URL
  useEffect(() => {
    const loadGitRemoteUrl = async () => {
      try {
        if (window.dockevWindow?.git?.getRemoteUrl) {
          const remoteUrl = await window.dockevWindow.git.getRemoteUrl(project.path);
          setGitRemoteUrl(remoteUrl);
        }
      } catch (error) {
        console.error("Error loading git remote URL:", error);
      }
    };
    loadGitRemoteUrl();
  }, [project.path]);

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "Not opened yet";
    const diff = currentTime - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const isArchived = project.category.toLowerCase() === "archived";

  const formatPath = (path: string) => {
    // Windows path format: C:\Users\Alperr\Desktop\hizmetino
    // Show: C:\...\Desktop\hizmetino

    const parts = path.split(/[/\\]/).filter(Boolean);

    if (parts.length <= 3) {
      // If path is short enough, show as is
      return path;
    }

    // Get drive letter (first part, e.g., "C:")
    const drive = parts[0];

    // Get last 2 segments
    const lastTwo = parts.slice(-2);

    // Combine: C:\...\Desktop\hizmetino
    return `${drive}\\...\\${lastTwo.join("\\")}`;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleOpen = async () => {
    // Open with default IDE
    const settings = settingsStorage.getSettings();
    const defaultIde = settings.defaultIde || project.defaultIde || "vscode";

    if (onOpenIDE) {
      try {
        await onOpenIDE(project.path, defaultIde);
      } catch (error) {
        console.error("Error opening project:", error);
      }
    } else if (onClick) {
      onClick();
    }
  };

  const handleOpenIn = async (ide: string) => {
    if (onOpenIDE) {
      try {
        await onOpenIDE(project.path, ide);
      } catch (error) {
        console.error("Error opening project in IDE:", error);
      }
    }
  };

  const handleRevealInExplorer = async () => {
    if (onRevealInExplorer) {
      try {
        await onRevealInExplorer(project.path);
      } catch (error) {
        console.error("Error revealing in explorer:", error);
      }
    } else if (window.dockevShell?.openFolder) {
      try {
        await window.dockevShell.openFolder(project.path);
      } catch (error) {
        console.error("Error opening folder:", error);
      }
    }
  };

  const handleEditProject = async () => {
    if (onEditProject) {
      await onEditProject(project.id);
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(project.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(project.id);
    }
  };

  const handleOpenInGitHub = async () => {
    if (!gitRemoteUrl) return;
    
    // Convert git remote URL to GitHub web URL
    let url = gitRemoteUrl;
    if (url.startsWith("git@")) {
      url = url.replace("git@", "https://").replace(":", "/");
    }
    if (url.startsWith("https://github.com") || url.startsWith("http://github.com")) {
      url = url.replace(/\.git$/, "");
      if (window.dockevWindow?.openExternal) {
        await window.dockevWindow.openExternal(url);
      } else {
        window.open(url, "_blank");
      }
    }
  };

  const availableIDEs = settingsStorage.getAllIDEs();

  return (
    <>
      <div
        onClick={onClick}
        onContextMenu={handleContextMenu}
        className={`group flex flex-col rounded-2xl bg-surface-dark border transition-all duration-300 overflow-hidden relative cursor-pointer hover:shadow-glow ${
          project.color ? "" : "border-border-dark hover:border-primary/40"
        } ${isArchived ? "opacity-70 hover:opacity-100" : ""}`}
        style={
          project.color
            ? {
                borderColor: `${project.color}30`,
              }
            : undefined
        }
        onMouseEnter={(e) => {
          if (project.color) {
            e.currentTarget.style.borderColor = `${project.color}60`;
          }
        }}
        onMouseLeave={(e) => {
          if (project.color) {
            e.currentTarget.style.borderColor = `${project.color}30`;
          }
        }}
      >
        <div
          className="h-36 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: project.color
              ? `linear-gradient(135deg, ${project.color}15 0%, ${project.color}05 50%, rgba(18, 18, 21, 1) 100%)`
              : `linear-gradient(180deg, rgba(9, 9, 11, 0) 0%, rgba(18, 18, 21, 1) 100%), url('https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop')`,
            backgroundColor: project.color ? `${project.color}10` : undefined,
          }}
        >
          {project.color && (
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: project.color }}
            />
          )}
          {project.category && (
            <div className="absolute top-4 right-4 z-10">
              <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur border border-white/5 text-[10px] font-mono text-white/80 shadow-sm">
                {project.category}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col px-6 pb-6 pt-2 gap-5 flex-1 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-white text-[17px] font-semibold tracking-tight group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-text-secondary text-xs line-clamp-2 mt-1">
                  {project.description}
                </p>
              )}
              <p className="text-text-secondary text-[11px] font-mono bg-white/5 px-2 py-1 rounded border border-white/5 w-fit max-w-[220px] truncate">
                {formatPath(project.path)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-white/5 text-text-secondary border border-white/5">
              <span className="material-symbols-outlined text-[18px]">
                {getCategoryIcon(project.category)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-auto">
            {project.tags.slice(0, 2).map((tag) => {
              const colors = getTagColor(tag);
              return (
                <div
                  key={tag}
                  className={`flex items-center justify-center px-2.5 py-1 rounded-full ${colors.bg} border ${colors.border}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${colors.dot} mr-2`}
                  ></span>
                  <p
                    className={`${colors.text} text-[11px] font-medium font-mono`}
                  >
                    {tag}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-1">
            <p className="text-text-secondary/70 text-[11px] font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">
                schedule
              </span>
              {formatTimeAgo(project.lastOpenedAt)}
            </p>
            {isArchived ? (
              <button className="h-8 px-4 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-md flex items-center justify-center transition-colors">
                Restore
              </button>
            ) : (
              <button className="h-8 pl-3 pr-4 bg-primary text-white text-[11px] font-bold rounded-md flex items-center justify-center gap-1 hover:bg-primary-hover transition-colors shadow-lg shadow-blue-900/20 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 duration-200">
                <span>Open Project</span>
                <span className="material-symbols-outlined text-[14px]">
                  arrow_forward
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <ProjectCardContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        project={project}
        onClose={() =>
          setContextMenu({ isOpen: false, position: { x: 0, y: 0 } })
        }
        onOpen={handleOpen}
        onOpenIn={handleOpenIn}
        onRevealInExplorer={handleRevealInExplorer}
        onEditProject={handleEditProject}
        onOpenInGitHub={handleOpenInGitHub}
        onArchive={handleArchive}
        onDelete={handleDelete}
        availableIDEs={availableIDEs}
        gitRemoteUrl={gitRemoteUrl}
      />
    </>
  );
};
