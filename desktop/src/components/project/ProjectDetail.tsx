import { useState, useEffect } from "react";
import type { Project } from "../../types/Project";
import type { Module } from "../../types/Module";
import { Icon } from "@iconify/react";
import { InstallPackagesModal } from "../modals/InstallPackagesModal";
import { EditModuleModal } from "../modals/EditModuleModal";
import { MergeModulesModal } from "../modals/MergeModulesModal";

interface ProjectDetailProps {
  project: Project;
  onOpenIDE: (projectPath: string, ide: string) => Promise<void>;
  onDelete: () => void;
  onRunDevServer?: (projectPath: string) => Promise<void>;
  onOpenConfig?: () => void;
  onManageTechStack?: () => void;
  onViewAllChanges?: () => void;
  onUpdateProject?: (updates: Partial<Project>) => void;
  onMoveProject?: () => void;
}

export function ProjectDetail({
  project,
  onOpenIDE,
  onDelete,
  onRunDevServer,
  onOpenConfig,
  onManageTechStack,
  onViewAllChanges,
  onUpdateProject,
  onMoveProject,
}: ProjectDetailProps) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [gitStatus, setGitStatus] = useState<{
    branch: string;
    lastCommit: string;
    lastCommitTime: string;
    pendingChanges: number;
    files: Array<{ name: string; status: string }>;
  } | null>(null);
  const [isLoadingGit, setIsLoadingGit] = useState(true);
  const [gitRemoteUrl, setGitRemoteUrl] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>(project.modules || []);
  const [isDetectingModules, setIsDetectingModules] = useState(false);
  const [detectedModules, setDetectedModules] = useState<
    Array<{
      name: string;
      path: string;
      techStack: string[];
      confidence: number;
    }>
  >([]);
  const [projectDetails, setProjectDetails] = useState<{
    name?: string;
    description?: string;
    version?: string;
    author?: string;
    license?: string;
    repository?: string;
    homepage?: string;
    readme?: string;
  } | null>(null);
  const [projectStats, setProjectStats] = useState<{
    size: number;
    fileCount: number;
    folderCount: number;
    created: number;
    modified: number;
    language?: string;
  } | null>(null);
  const [nodeModulesStatus, setNodeModulesStatus] = useState<{
    root: {
      hasNodeModules: boolean;
      hasPackageJson: boolean;
    };
    modules: Array<{
      name: string;
      path: string;
      hasNodeModules: boolean;
      hasPackageJson: boolean;
    }>;
  } | null>(null);
  const [isInstallPackagesModalOpen, setIsInstallPackagesModalOpen] =
    useState(false);
  const [pendingModuleInstall, setPendingModuleInstall] = useState<
    string | undefined
  >(undefined);
  const [pendingModuleName, setPendingModuleName] = useState<
    string | undefined
  >(undefined);
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isMergeModulesModalOpen, setIsMergeModulesModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadGitStatus = async () => {
      setIsLoadingGit(true);
      try {
        if (window.dockevWindow?.git?.getStatus) {
          const status = await window.dockevWindow.git.getStatus(project.path);
          setGitStatus(status);
        }
      } catch (error) {
        console.error("Error loading git status:", error);
        setGitStatus(null);
      } finally {
        setIsLoadingGit(false);
      }
    };

    const loadGitRemoteUrl = async () => {
      try {
        if (window.dockevWindow?.git?.getRemoteUrl) {
          const remoteUrl = await window.dockevWindow.git.getRemoteUrl(
            project.path
          );
          setGitRemoteUrl(remoteUrl);
        }
      } catch (error) {
        console.error("Error loading git remote URL:", error);
        setGitRemoteUrl(null);
      }
    };

    loadGitStatus();
    loadGitRemoteUrl();
    // Refresh git status every 30 seconds
    const interval = setInterval(() => {
      loadGitStatus();
      loadGitRemoteUrl();
    }, 30000);
    return () => clearInterval(interval);
  }, [project.path]);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        if (window.dockevProject?.getDetails) {
          console.log("Loading project details for:", project.path);
          const details = await window.dockevProject.getDetails(project.path);
          console.log("Project details loaded:", details);
          setProjectDetails(details);
        } else {
          console.warn("window.dockevProject.getDetails is not available");
        }
      } catch (error) {
        console.error("Error loading project details:", error);
        setProjectDetails(null);
      }
    };

    loadProjectDetails();
  }, [project.path]);

  useEffect(() => {
    const loadProjectStats = async () => {
      try {
        if (window.dockevProject?.getStats) {
          const stats = await window.dockevProject.getStats(project.path);
          setProjectStats(stats);
        }
      } catch (error) {
        console.error("Error loading project stats:", error);
        setProjectStats(null);
      }
    };

    loadProjectStats();
  }, [project.path]);

  // Check node_modules status
  useEffect(() => {
    const checkNodeModules = async () => {
      try {
        if (window.dockevProject?.checkNodeModules) {
          // Get module paths if modules exist
          const modulePaths =
            modules.length > 0 ? modules.map((m) => m.path) : undefined;

          const status = await window.dockevProject.checkNodeModules(
            project.path,
            modulePaths
          );
          console.log("Node modules status:", status);
          setNodeModulesStatus(status);
        }
      } catch (error) {
        console.error("Error checking node_modules:", error);
        setNodeModulesStatus(null);
      }
    };

    checkNodeModules();
    // Refresh every 30 seconds
    const interval = setInterval(checkNodeModules, 30000);
    return () => clearInterval(interval);
  }, [project.path, modules]);

  const handleInstallPackages = async (
    packageManager: "npm" | "yarn" | "pnpm",
    modulePath?: string
  ) => {
    try {
      if (window.dockevProject?.installPackages) {
        // Use modulePath parameter if provided, otherwise fall back to pendingModuleInstall
        const actualModulePath = modulePath || pendingModuleInstall;
        console.log("handleInstallPackages - modulePath param:", modulePath);
        console.log(
          "handleInstallPackages - pendingModuleInstall:",
          pendingModuleInstall
        );
        console.log(
          "handleInstallPackages - actualModulePath:",
          actualModulePath
        );
        console.log("Installing packages for module:", actualModulePath);
        console.log("Project path:", project.path);
        const result = await window.dockevProject.installPackages(
          project.path,
          packageManager,
          actualModulePath
        );
        if (result.success) {
          // Refresh node_modules status
          if (window.dockevProject?.checkNodeModules) {
            const modulePaths =
              modules.length > 0 ? modules.map((m) => m.path) : undefined;
            const status = await window.dockevProject.checkNodeModules(
              project.path,
              modulePaths
            );
            console.log("Node modules status:", status);
            setNodeModulesStatus(status);
          }
          alert("Packages installed successfully!");
          setIsInstallPackagesModalOpen(false);
          setPendingModuleInstall(undefined);
          setPendingModuleName(undefined);
        } else {
          alert(`Failed to install packages: ${result.error}`);
        }
      }
    } catch (error) {
      console.error("Error installing packages:", error);
      alert(
        `Failed to install packages: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const detectModules = async () => {
    setIsDetectingModules(true);
    try {
      if (window.dockevDetect?.modules) {
        const detected = await window.dockevDetect.modules(project.path);
        // Filter out modules that are already added
        const existingModulePaths = new Set(
          modules.map((m) => m.path.toLowerCase())
        );
        const filteredDetected = detected.filter(
          (d) => !existingModulePaths.has(d.path.toLowerCase())
        );
        setDetectedModules(filteredDetected);
      }
    } catch (error) {
      console.error("Error detecting modules:", error);
    } finally {
      setIsDetectingModules(false);
    }
  };

  const handleAddModule = (detectedModule: {
    name: string;
    path: string;
    techStack: string[];
  }) => {
    const newModule: Module = {
      id: Date.now().toString(),
      name: detectedModule.name,
      path: detectedModule.path,
      techStack: detectedModule.techStack,
      defaultIde: project.defaultIde,
    };
    const updatedModules = [...modules, newModule];
    setModules(updatedModules);
    // Remove from detected modules list using path comparison
    setDetectedModules(
      detectedModules.filter(
        (m) => m.path.toLowerCase() !== detectedModule.path.toLowerCase()
      )
    );
    // Update project with new modules
    if (onUpdateProject) {
      onUpdateProject({ modules: updatedModules });
    }
  };

  const handleRemoveModule = (moduleId: string) => {
    const updatedModules = modules.filter((m) => m.id !== moduleId);
    setModules(updatedModules);
    // Update project
    if (onUpdateProject) {
      onUpdateProject({ modules: updatedModules });
    }
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setIsEditModuleModalOpen(true);
  };

  const handleSaveModule = (updatedModule: Module) => {
    const updatedModules = modules.map((m) =>
      m.id === updatedModule.id ? updatedModule : m
    );
    setModules(updatedModules);
    // Update project
    if (onUpdateProject) {
      onUpdateProject({ modules: updatedModules });
    }
  };

  const handleRunModuleDevServer = async (module: Module) => {
    try {
      // Construct full module path
      let modulePath = module.path;
      if (
        module.path.startsWith(".") ||
        (!module.path.includes(":") && navigator.platform.includes("Win"))
      ) {
        const separator = project.path.includes("\\") ? "\\" : "/";
        const cleanModulePath = module.path
          .replace(/^\.\//, "")
          .replace(/^\./, "");
        modulePath = `${project.path}${separator}${cleanModulePath}`;
      }

      // Get default package manager from settings
      const { settingsStorage } = await import("../../utils/settingsStorage");
      const settings = settingsStorage.getSettings();
      const packageManager = settings.defaultPackageManager || "npm";

      // If module has custom dev server command, use it
      if (module.devServerCommand && window.dockevWindow?.run?.devServer) {
        await window.dockevWindow.run.devServer(
          modulePath,
          module.devServerCommand,
          undefined,
          packageManager
        );
      } else if (window.dockevWindow?.run?.devServer) {
        // Use default dev server with package manager from settings
        await window.dockevWindow.run.devServer(
          modulePath,
          undefined,
          undefined,
          packageManager
        );
      } else if (onRunDevServer) {
        // Fallback to parent handler
        await onRunDevServer(modulePath);
      }
    } catch (error) {
      console.error("Error running module dev server:", error);
      alert(
        `Failed to start dev server for ${module.name}. Make sure you have npm/yarn/pnpm installed.`
      );
    }
  };

  const handleMergeModules = (
    sourceModuleId: string,
    targetModuleId: string
  ) => {
    const sourceModule = modules.find((m) => m.id === sourceModuleId);
    const targetModule = modules.find((m) => m.id === targetModuleId);

    if (!sourceModule || !targetModule) return;

    // Merge tech stacks (unique values)
    const mergedTechStack = [
      ...new Set([...targetModule.techStack, ...sourceModule.techStack]),
    ];

    // Create merged module (keep target's properties, merge tech stack, use source's dev server if target doesn't have one)
    const mergedModule: Module = {
      ...targetModule,
      techStack: mergedTechStack,
      devServerCommand:
        targetModule.devServerCommand || sourceModule.devServerCommand,
    };

    // Remove source module and update target module
    const updatedModules = modules
      .filter((m) => m.id !== sourceModuleId)
      .map((m) => (m.id === targetModuleId ? mergedModule : m));

    setModules(updatedModules);
    if (onUpdateProject) {
      onUpdateProject({ modules: updatedModules });
    }
  };

  const handleOpenModuleIDE = async (module: Module, ide: string) => {
    // Construct full path - if relative, join with project path
    let modulePath = module.path;
    if (
      module.path.startsWith(".") ||
      (!module.path.includes(":") && navigator.platform.includes("Win"))
    ) {
      // Relative path - join with project path
      // Simple path joining (avoiding Node.js path module in renderer)
      const separator = project.path.includes("\\") ? "\\" : "/";
      const cleanModulePath = module.path
        .replace(/^\.\//, "")
        .replace(/^\./, "");
      modulePath = `${project.path}${separator}${cleanModulePath}`;
    }
    await onOpenIDE(modulePath, ide);
  };

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "Never";
    const diff = currentTime - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const copyPath = () => {
    navigator.clipboard.writeText(project.path);
    // Show toast notification (can be enhanced later)
  };

  // Convert git remote URL to GitHub web URL
  const getGitHubUrl = (remoteUrl: string | null): string | null => {
    if (!remoteUrl) return null;

    // Handle SSH format: git@github.com:user/repo.git
    let url = remoteUrl;
    if (url.startsWith("git@")) {
      url = url.replace("git@", "https://").replace(":", "/");
    }
    // Handle HTTPS format: https://github.com/user/repo.git
    if (
      url.startsWith("https://github.com") ||
      url.startsWith("http://github.com")
    ) {
      // Remove .git suffix if present
      url = url.replace(/\.git$/, "");
      return url;
    }
    // Handle other Git hosting services (GitLab, Bitbucket, etc.)
    // For now, only support GitHub
    return null;
  };

  const handleOpenInGitHub = () => {
    const githubUrl = getGitHubUrl(gitRemoteUrl);
    if (githubUrl) {
      if (window.dockevWindow?.openExternal) {
        window.dockevWindow.openExternal(githubUrl);
      } else {
        window.open(githubUrl, "_blank");
      }
    }
  };

  const handleRunDevServer = async () => {
    if (onRunDevServer) {
      try {
        await onRunDevServer(project.path);
      } catch (error) {
        console.error("Error running dev server:", error);
        alert(
          "Failed to start dev server. Make sure you have npm/yarn installed."
        );
      }
    }
  };

  const handleConfig = () => {
    onOpenConfig?.();
  };

  const handleManageTechStack = () => {
    onManageTechStack?.();
  };

  const handleViewAllChanges = () => {
    onViewAllChanges?.();
  };

  // Get tech stack from modules
  const getTechStackFromModules = () => {
    const techMap = new Map<
      string,
      { name: string; icon: string; color: string }
    >();

    // Tech name to icon/color mapping
    const techConfig: Record<string, { icon: string; color: string }> = {
      React: { icon: "uil:react", color: "#61DAFB" },
      "React Native / Expo": { icon: "cib:expo", color: "#61DAFB" },
      "Tailwind CSS": { icon: "mdi:tailwind", color: "#38B2AC" },
      TypeScript: { icon: "lineicons:typescript", color: "#3178C6" },
      "Node.js": { icon: "bxl:nodejs", color: "#8CC84B" },
      "Next.js": { icon: "material-icon-theme:next", color: "#000000" },
      Vue: { icon: "mingcute:vue-fill", color: "#4FC08D" },
      Angular: { icon: "teenyicons:angular-outline", color: "#DD0031" },
      Python: { icon: "akar-icons:python-fill", color: "#3776AB" },
      Django: { icon: "akar-icons:django-fill", color: "#092E20" },
      Flask: { icon: "mdi:flask", color: "#000000" },
      Go: { icon: "file-icons:go", color: "#00ADD8" },
      Rust: { icon: "teenyicons:rust-outline", color: "#000000" },
    };

    // Collect all unique tech stacks from modules
    modules.forEach((module) => {
      module.techStack.forEach((tech) => {
        if (!techMap.has(tech)) {
          const config = techConfig[tech] || {
            icon: "code",
            color: "#6366F1",
          };
          techMap.set(tech, {
            name: tech,
            ...config,
          });
        }
      });
    });

    // Always include project-level tags (from ManageTechStackModal)
    project.tags.forEach((tag) => {
      if (!techMap.has(tag)) {
        const config = techConfig[tag] || {
          icon: "code",
          color: "#6366F1",
        };
        techMap.set(tag, {
          name: tag,
          ...config,
        });
      }
    });

    return Array.from(techMap.values());
  };

  const techStack = getTechStackFromModules();
  const [showAllTechs, setShowAllTechs] = useState(false);
  const displayedTechStack = showAllTechs ? techStack : techStack.slice(0, 4);

  // Default git status if not available
  const displayGitStatus = gitStatus || {
    branch: "main",
    lastCommit: "No commits yet",
    lastCommitTime: "",
    pendingChanges: 0,
    files: [],
  };

  return (
    <div className="bg-background-dark text-text-primary font-display antialiased min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex justify-center py-10 px-4 md:px-8">
        <div className="flex flex-col max-w-7xl w-full gap-8">
          {/* Project Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-xs font-medium text-emerald-500 tracking-wide uppercase">
                  Active Development
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                {projectDetails?.name || project.name}
              </h1>
              {projectDetails?.description && (
                <p className="text-text-secondary text-sm max-w-2xl">
                  {projectDetails.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-text-secondary text-sm flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    folder
                  </span>
                  <span className="font-mono text-xs">{project.path}</span>
                </div>
                {projectDetails?.version && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        label
                      </span>
                      <span>v{projectDetails.version}</span>
                    </div>
                  </>
                )}
                {projectDetails?.author && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        person
                      </span>
                      <span>{projectDetails.author}</span>
                    </div>
                  </>
                )}
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  <span>Edited {formatTimeAgo(project.lastOpenedAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  try {
                    if (window.dockevShell?.openFolder) {
                      await window.dockevShell.openFolder(project.path);
                    }
                  } catch (error) {
                    console.error("Error opening folder:", error);
                    alert("Failed to open folder in file explorer.");
                  }
                }}
                className="flex items-center gap-2 px-4 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors"
                title="Open Folder"
              >
                <span className="material-symbols-outlined text-[18px]">
                  folder_open
                </span>
                <span>Open Folder</span>
              </button>
              {gitRemoteUrl && getGitHubUrl(gitRemoteUrl) && (
                <button
                  onClick={handleOpenInGitHub}
                  className="flex items-center gap-2 px-4 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors"
                  title="Open in GitHub"
                >
                  <Icon icon="mdi:github" width="24" height="24" />
                  <span>Open in GitHub</span>
                </button>
              )}
              <button
                onClick={handleConfig}
                className="flex items-center gap-2 px-4 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>
                <span>Config</span>
              </button>
              {onMoveProject && (
                <button
                  onClick={onMoveProject}
                  className="flex items-center gap-2 px-4 h-10 rounded-md border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-colors"
                  title="Move Project Folder (Experimental)"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    drive_file_move
                  </span>
                  <span>Move Folder</span>
                </button>
              )}
              <button
                onClick={handleRunDevServer}
                className="flex items-center gap-2 px-5 h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  (nodeModulesStatus?.root.hasPackageJson &&
                    !nodeModulesStatus?.root.hasNodeModules) ||
                  (nodeModulesStatus?.modules &&
                    nodeModulesStatus?.modules.length > 0 &&
                    nodeModulesStatus?.modules.some(
                      (module) =>
                        module.hasPackageJson && !module.hasNodeModules
                    ))
                }
              >
                <span className="material-symbols-outlined text-[18px]">
                  play_arrow
                </span>
                <span>Run Dev Server</span>
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-border-dark to-transparent"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Project Description / README */}
              {projectDetails?.readme && (
                <div className="rounded-xl border border-border-dark bg-surface-dark p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-text-secondary">
                      description
                    </span>
                    <h3 className="text-white text-base font-semibold">
                      README
                    </h3>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-text-secondary text-sm whitespace-pre-wrap">
                      {projectDetails.readme}
                      {projectDetails.readme.length >= 500 && "..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Folder Path Card */}
              <div className="group relative rounded-xl border border-border-dark bg-surface-dark p-1">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <span className="material-symbols-outlined text-text-secondary">
                      folder_open
                    </span>
                    <code className="font-mono text-sm text-gray-300 truncate">
                      {project.path}
                    </code>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={async () => {
                        try {
                          if (window.dockevShell?.openFolder) {
                            await window.dockevShell.openFolder(project.path);
                          }
                        } catch (error) {
                          console.error("Error opening folder:", error);
                          alert("Failed to open folder in file explorer.");
                        }
                      }}
                      className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-colors"
                      title="Open Folder"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        folder_open
                      </span>
                    </button>
                    <button
                      onClick={copyPath}
                      className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-colors"
                      title="Copy Path"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        content_copy
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modules */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-base font-semibold">
                    Modules
                  </h3>
                  <div className="flex items-center gap-3">
                    {modules.length > 1 && (
                      <button
                        onClick={() => setIsMergeModulesModalOpen(true)}
                        className="text-xs text-primary hover:underline"
                        title="Merge Modules"
                      >
                        Merge Modules
                      </button>
                    )}
                    <button
                      onClick={detectModules}
                      disabled={isDetectingModules}
                      className="text-xs text-primary hover:underline disabled:opacity-50"
                    >
                      {isDetectingModules ? "Detecting..." : "Detect Modules"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {modules.length > 0 ? (
                    modules.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border-dark bg-surface-dark hover:border-primary/30 transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px]">
                              folder
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-semibold text-white truncate">
                              {module.name}
                            </span>
                            <span className="text-xs text-text-secondary font-mono truncate">
                              {module.path}
                            </span>
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              {module.techStack.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {module.devServerCommand && (
                            <button
                              onClick={() => handleRunModuleDevServer(module)}
                              className="p-2 rounded hover:bg-green-500/10 text-text-secondary hover:text-green-400 transition-colors"
                              title="Run Dev Server"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                play_arrow
                              </span>
                            </button>
                          )}
                          <button
                            onClick={() => handleEditModule(module)}
                            className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-colors"
                            title="Edit Module"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              handleOpenModuleIDE(module, project.defaultIde)
                            }
                            className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-colors"
                            title="Open in IDE"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              code
                            </span>
                          </button>
                          <button
                            onClick={() => handleRemoveModule(module.id)}
                            className="p-2 rounded hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
                            title="Remove Module"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              close
                            </span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-border-dark bg-surface-dark p-8 flex flex-col items-center justify-center gap-3 text-center">
                      <span className="material-symbols-outlined text-[48px] text-text-secondary">
                        folder_off
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-white">
                          No modules detected
                        </span>
                        <span className="text-xs text-text-secondary">
                          Click "Detect Modules" to scan for sub-projects
                        </span>
                      </div>
                    </div>
                  )}
                  {detectedModules.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-border-dark">
                      <p className="text-xs text-text-secondary font-medium">
                        Detected Modules (Click to add):
                      </p>
                      {detectedModules.map((detected, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddModule(detected)}
                          className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border-dark bg-surface-dark/50 hover:border-primary/50 hover:bg-surface-dark transition-colors text-left"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                              {detected.name}
                            </span>
                            <span className="text-xs text-text-secondary font-mono">
                              {detected.path}
                            </span>
                            <div className="flex gap-1 mt-1">
                              {detected.techStack.map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-text-secondary">
                            add
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Technology Stack */}
              {techStack.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-base font-semibold">
                      Technology Stack
                    </h3>
                    <button
                      onClick={handleManageTechStack}
                      className="text-xs text-primary hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {displayedTechStack.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex flex-col p-4 rounded-xl border border-border-dark bg-surface-dark transition-all group"
                        style={
                          {
                            borderColor: "rgb(39, 39, 42)", // border-border-dark default
                            "--tech-color": tech.color,
                          } as React.CSSProperties & { "--tech-color": string }
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = tech.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgb(39, 39, 42)";
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="size-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                            style={{
                              backgroundColor: `${tech.color}10`,
                              color: tech.color,
                            }}
                          >
                            <Icon icon={tech.icon} width="24" height="24" />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {tech.name}
                        </span>
                        {project.config?.techStackVersions?.[tech.name] && (
                          <span className="text-xs font-mono text-primary mt-0.5">
                            {project.config.techStackVersions[tech.name]}
                          </span>
                        )}
                        <span className="text-xs text-text-secondary mt-1">
                          {tech.name === "React" && "Frontend Framework"}
                          {tech.name === "React Native / Expo" &&
                            "Mobile Framework"}
                          {tech.name === "Tailwind CSS" && "Utility-first CSS"}
                          {tech.name === "TypeScript" && "Strict Syntactical"}
                          {tech.name === "Node.js" && "Runtime Env"}
                          {tech.name === "Next.js" && "React Framework"}
                          {tech.name === "Vue" && "Progressive Framework"}
                          {tech.name === "Angular" && "Platform"}
                          {tech.name === "Python" && "Programming Language"}
                          {tech.name === "Django" && "Web Framework"}
                          {tech.name === "Flask" && "Micro Framework"}
                          {tech.name === "Go" && "Programming Language"}
                          {tech.name === "Rust" && "Systems Language"}
                        </span>
                      </div>
                    ))}
                  </div>
                  {techStack.length > 4 && (
                    <button
                      onClick={() => setShowAllTechs(!showAllTechs)}
                      className="text-sm text-primary hover:text-primary-hover font-medium flex items-center justify-center gap-2 py-2 transition-colors"
                    >
                      <span>
                        {showAllTechs
                          ? "Show Less"
                          : `Show All (${techStack.length - 4} more)`}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[18px] transition-transform ${
                          showAllTechs ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* Version Control */}
              <div className="flex flex-col gap-4">
                <h3 className="text-white text-base font-semibold">
                  Version Control
                </h3>
                {isLoadingGit ? (
                  <div className="rounded-xl border border-border-dark bg-surface-dark p-8 flex items-center justify-center">
                    <span className="text-text-secondary text-sm">
                      Loading git status...
                    </span>
                  </div>
                ) : gitStatus === null ? (
                  <div className="rounded-xl border border-border-dark bg-surface-dark p-8 flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[32px] text-text-secondary">
                      folder_off
                    </span>
                    <span className="text-text-secondary text-sm">
                      Not a git repository
                    </span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border-dark bg-surface-dark overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border-dark bg-surface-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-8 rounded bg-orange-500/10 text-orange-500">
                          <span className="material-symbols-outlined text-[20px]">
                            call_split
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-bold text-white">
                            {displayGitStatus.branch}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {displayGitStatus.lastCommitTime
                              ? `Last commit ${displayGitStatus.lastCommitTime}`
                              : displayGitStatus.lastCommit}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {displayGitStatus.pendingChanges > 0 && (
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                              <div className="size-6 rounded-full ring-2 ring-background-dark bg-gray-300"></div>
                              <div className="size-6 rounded-full ring-2 ring-background-dark bg-gray-400"></div>
                            </div>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                              {displayGitStatus.pendingChanges} pending
                            </span>
                          </div>
                        )}
                        {displayGitStatus.files.length > 0 && (
                          <button
                            onClick={handleViewAllChanges}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-medium transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              code
                            </span>
                            <span>View Diff</span>
                          </button>
                        )}
                      </div>
                    </div>
                    {displayGitStatus.files.length > 0 && (
                      <>
                        <div className="divide-y divide-border-dark">
                          {displayGitStatus.files
                            .slice(0, 10)
                            .map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 px-4 hover:bg-surface-dark/30 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`material-symbols-outlined text-[16px] w-4 ${
                                      file.status === "added"
                                        ? "text-green-500"
                                        : file.status === "deleted"
                                        ? "text-red-500"
                                        : "text-yellow-500"
                                    }`}
                                  >
                                    {file.status === "added"
                                      ? "add"
                                      : file.status === "deleted"
                                      ? "delete"
                                      : "edit"}
                                  </span>
                                  <span className="text-sm text-gray-300 font-mono group-hover:text-primary transition-colors truncate flex-1">
                                    {file.name}
                                  </span>
                                </div>
                                <span className="text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity capitalize ml-2">
                                  {file.status}
                                </span>
                              </div>
                            ))}
                        </div>
                        {displayGitStatus.files.length > 10 && (
                          <div className="bg-surface-dark/30 p-2 text-center border-t border-border-dark">
                            <button
                              onClick={handleViewAllChanges}
                              className="text-xs font-medium text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-1 w-full py-1"
                            >
                              <span>
                                View all {displayGitStatus.pendingChanges}{" "}
                                changes
                              </span>
                              <span className="material-symbols-outlined text-[14px]">
                                arrow_forward
                              </span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    {displayGitStatus.pendingChanges === 0 &&
                      displayGitStatus.files.length === 0 && (
                        <div className="p-4 text-center">
                          <span className="text-xs text-text-secondary">
                            No pending changes
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Node Modules Warning */}
              {nodeModulesStatus && (
                <div className="space-y-3">
                  {/* Root warning */}
                  {nodeModulesStatus.root.hasPackageJson &&
                    !nodeModulesStatus.root.hasNodeModules && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-yellow-400 text-[24px]">
                            warning
                          </span>
                          <div className="flex-1">
                            <h3 className="text-yellow-400 font-semibold mb-1">
                              Root Dependencies Not Installed
                            </h3>
                            <p className="text-yellow-300/80 text-sm mb-3">
                              The project root directory has a{" "}
                              <code className="bg-surface-darker px-1 py-0.5 rounded text-xs">
                                package.json
                              </code>{" "}
                              but{" "}
                              <code className="bg-surface-darker px-1 py-0.5 rounded text-xs">
                                node_modules
                              </code>{" "}
                              is missing. Install dependencies to run the
                              project.
                            </p>
                            <button
                              onClick={() => {
                                setPendingModuleInstall(undefined);
                                setPendingModuleName(undefined);
                                setIsInstallPackagesModalOpen(true);
                              }}
                              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                download
                              </span>
                              <span>Install Root Dependencies</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Module warnings */}
                  {nodeModulesStatus.modules &&
                    nodeModulesStatus.modules.length > 0 &&
                    nodeModulesStatus.modules
                      .filter(
                        (module) =>
                          module.hasPackageJson && !module.hasNodeModules
                      )
                      .map((module) => (
                        <div
                          key={module.path}
                          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-yellow-400 text-[24px]">
                              warning
                            </span>
                            <div className="flex-1">
                              <h3 className="text-yellow-400 font-semibold text-sm mb-1">
                                {module.name} Module - Dependencies Not
                                Installed
                              </h3>
                              <p className="text-yellow-300/80 text-xs mb-3">
                                The{" "}
                                <code className="bg-surface-darker px-1 py-0.5 rounded text-xs">
                                  {module.name}
                                </code>{" "}
                                module has a{" "}
                                <code className="bg-surface-darker px-1 py-0.5 rounded text-xs">
                                  package.json
                                </code>{" "}
                                but{" "}
                                <code className="bg-surface-darker px-1 py-0.5 rounded text-xs">
                                  node_modules
                                </code>{" "}
                                is missing. Install dependencies to run this
                                module.
                              </p>
                              <button
                                onClick={() => {
                                  console.log(
                                    "Button clicked - module.path:",
                                    module.path
                                  );
                                  console.log(
                                    "Button clicked - module.name:",
                                    module.name
                                  );
                                  // Set state and open modal - use a callback to ensure state is set
                                  setPendingModuleInstall(module.path);
                                  setPendingModuleName(module.name);
                                  // Use setTimeout to ensure state is updated before modal opens
                                  setTimeout(() => {
                                    setIsInstallPackagesModalOpen(true);
                                  }, 0);
                                }}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors flex items-center gap-2 text-xs"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  download
                                </span>
                                <span>Install {module.name} Dependencies</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              )}
              {/* Environment Card */}
              <div className="rounded-xl p-1 border border-border-dark bg-surface-dark shadow-lg shadow-black/20">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                      Environment
                    </h3>
                    <span className="flex size-2 rounded-full bg-green-500"></span>
                  </div>
                  <button
                    onClick={() => onOpenIDE(project.path, project.defaultIde)}
                    className="relative group flex items-center justify-between w-full p-4 rounded-lg bg-primary hover:bg-primary-hover text-white transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <Icon
                        icon={
                          project.defaultIde === "vscode"
                            ? "simple-icons:vscode"
                            : project.defaultIde === "cursor"
                            ? "material-icon-theme:cursor"
                            : "simple-icons:webstorm"
                        }
                        width="24"
                        height="24"
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold">
                          Open in{" "}
                          {project.defaultIde === "vscode"
                            ? "VS Code"
                            : project.defaultIde === "cursor"
                            ? "Cursor"
                            : "WebStorm"}
                        </span>
                        <span className="text-[10px] opacity-80">
                          Default Editor
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform relative z-10">
                      arrow_forward
                    </span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenIDE(project.path, "cursor")}
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-border-dark bg-surface-dark hover:bg-surface-dark/80 transition-all group"
                    >
                      <Icon
                        icon="material-icon-theme:cursor"
                        width="32"
                        height="32"
                      />
                      <span className="text-xs font-medium text-text-secondary group-hover:text-white">
                        Cursor
                      </span>
                    </button>
                    <button
                      onClick={() => onOpenIDE(project.path, "webstorm")}
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-border-dark bg-surface-dark hover:bg-surface-dark/80 transition-all group"
                    >
                      <Icon
                        icon="simple-icons:webstorm"
                        width="24"
                        height="24"
                      />
                      <span className="text-xs font-medium text-text-secondary group-hover:text-white">
                        WebStorm
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={() => onOpenIDE(project.path, "terminal")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border-dark text-text-secondary hover:text-white hover:border-primary transition-all text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      terminal
                    </span>
                    <span>Open Terminal</span>
                  </button>
                </div>
              </div>

              {/* Project Details */}
              <div className="rounded-xl border border-border-dark bg-surface-dark p-5">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-opacity-80">
                  Project Details
                </h3>
                <div className="space-y-4">
                  {projectStats?.language && (
                    <div className="flex justify-between items-center text-sm py-1 border-b border-border-dark/50 pb-2">
                      <span className="text-text-secondary flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">
                          language
                        </span>
                        Language
                      </span>
                      <span className="font-medium text-white bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs">
                        {projectStats.language}
                      </span>
                    </div>
                  )}
                  {projectStats && (
                    <>
                      <div className="flex flex-col gap-1 py-1 border-b border-border-dark/50 pb-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">
                              hard_drive
                            </span>
                            Size
                          </span>
                          <span className="font-mono text-xs text-white">
                            {formatBytes(projectStats.size)}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-secondary/70 pl-7">
                          Excluding node_modules, .git, dist, build, .next,
                          .cache, .vscode, .idea
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1 border-b border-border-dark/50 pb-2">
                        <span className="text-text-secondary flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">
                            description
                          </span>
                          Files
                        </span>
                        <span className="font-medium text-white">
                          {projectStats.fileCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1 border-b border-border-dark/50 pb-2">
                        <span className="text-text-secondary flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">
                            folder
                          </span>
                          Folders
                        </span>
                        <span className="font-medium text-white">
                          {projectStats.folderCount.toLocaleString()}
                        </span>
                      </div>
                      {projectStats.created > 0 && (
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-text-secondary flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">
                              calendar_today
                            </span>
                            Created
                          </span>
                          <span className="font-medium text-white">
                            {new Date(projectStats.created).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Remove Project */}
              <div className="rounded-xl border border-red-900/30 bg-red-900/10 p-4">
                <button
                  onClick={onDelete}
                  className="w-full flex items-center justify-center gap-2 py-1 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete
                  </span>
                  Remove Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <InstallPackagesModal
        isOpen={isInstallPackagesModalOpen}
        projectPath={project.path}
        moduleName={pendingModuleName}
        modulePath={pendingModuleInstall}
        onClose={() => {
          setIsInstallPackagesModalOpen(false);
          setPendingModuleInstall(undefined);
          setPendingModuleName(undefined);
        }}
        onInstall={handleInstallPackages}
      />
      <EditModuleModal
        isOpen={isEditModuleModalOpen}
        module={editingModule}
        onClose={() => {
          setIsEditModuleModalOpen(false);
          setEditingModule(null);
        }}
        onSave={handleSaveModule}
      />
      <MergeModulesModal
        isOpen={isMergeModulesModalOpen}
        modules={modules}
        onClose={() => setIsMergeModulesModalOpen(false)}
        onMerge={handleMergeModules}
      />
    </div>
  );
}
