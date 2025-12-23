import { useState, useEffect } from "react";
import type { Project } from "../types/Project";

interface ProjectDetailProps {
  project: Project;
  onOpenIDE: (ide: string) => void;
  onDelete: () => void;
}

export function ProjectDetail({
  project,
  onOpenIDE,
  onDelete,
}: ProjectDetailProps) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

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

  const copyPath = () => {
    navigator.clipboard.writeText(project.path);
  };

  // Mock tech stack data - later can be detected from project files
  const techStack = [
    { name: "React", version: "v18.2", icon: "code_blocks", color: "#61DAFB" },
    { name: "Tailwind CSS", version: "v3.4", icon: "brush", color: "#38B2AC" },
    {
      name: "TypeScript",
      version: "v5.3",
      icon: "data_object",
      color: "#3178C6",
    },
    { name: "Node.js", version: "v20.1", icon: "dns", color: "#8CC84B" },
  ];

  // Mock git status
  const gitStatus = {
    branch: "feature/user-auth-flow",
    lastCommit: "2 hours ago",
    pendingChanges: 3,
    files: [
      { name: "src/components/AuthModal.tsx", status: "modified" },
      { name: "src/utils/api.ts", status: "modified" },
      { name: "src/types/user.d.ts", status: "added" },
    ],
  };

  return (
    <div className="bg-background-dark text-text-primary font-display antialiased min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex justify-center py-10 px-4 md:px-8 overflow-y-auto">
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
                {project.name}
              </h1>
              <div className="flex items-center gap-4 text-text-secondary text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    folder
                  </span>
                  <span className="font-mono text-xs">{project.path}</span>
                </div>
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
              <button className="flex items-center gap-2 px-4 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>
                <span>Config</span>
              </button>
              <button className="flex items-center gap-2 px-5 h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95">
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
              {/* Folder Path Card */}
              <div className="group relative rounded-xl border border-border-dark bg-surface-dark p-1">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="material-symbols-outlined text-text-secondary">
                      folder_open
                    </span>
                    <code className="font-mono text-sm text-gray-300 truncate">
                      {project.path}
                    </code>
                  </div>
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

              {/* Technology Stack */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-base font-semibold">
                    Technology Stack
                  </h3>
                  <button className="text-xs text-primary hover:underline">
                    Manage
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {techStack.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex flex-col p-4 rounded-xl border border-border-dark bg-surface-dark hover:border-primary/30 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="size-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{
                            backgroundColor: `${tech.color}10`,
                            color: tech.color,
                          }}
                        >
                          <span className="material-symbols-outlined text-[24px]">
                            {tech.icon}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-text-secondary bg-surface-dark px-1.5 py-0.5 rounded">
                          {tech.version}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {tech.name}
                      </span>
                      <span className="text-xs text-text-secondary mt-1">
                        {tech.name === "React" && "Frontend Framework"}
                        {tech.name === "Tailwind CSS" && "Utility-first CSS"}
                        {tech.name === "TypeScript" && "Strict Syntactical"}
                        {tech.name === "Node.js" && "Runtime Env"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Version Control */}
              <div className="flex flex-col gap-4">
                <h3 className="text-white text-base font-semibold">
                  Version Control
                </h3>
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
                          {gitStatus.branch}
                        </span>
                        <span className="text-xs text-text-secondary">
                          Last commit {gitStatus.lastCommit}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        <div className="size-6 rounded-full ring-2 ring-background-dark bg-gray-300"></div>
                        <div className="size-6 rounded-full ring-2 ring-background-dark bg-gray-400"></div>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        {gitStatus.pendingChanges} pending
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-border-dark">
                    {gitStatus.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 px-4 hover:bg-surface-dark/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`material-symbols-outlined text-[16px] w-4 ${
                              file.status === "added"
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {file.status === "added" ? "add" : "edit"}
                          </span>
                          <span className="text-sm text-gray-300 font-mono group-hover:text-primary transition-colors">
                            {file.name}
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity capitalize">
                          {file.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-surface-dark/30 p-2 text-center border-t border-border-dark">
                    <button className="text-xs font-medium text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-1 w-full py-1">
                      <span>View all 12 changes</span>
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
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
                    onClick={() => onOpenIDE(project.defaultIde)}
                    className="relative group flex items-center justify-between w-full p-4 rounded-lg bg-primary hover:bg-primary-hover text-white transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="material-symbols-outlined text-[24px]">
                        code
                      </span>
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
                      onClick={() => onOpenIDE("cursor")}
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-border-dark bg-surface-dark hover:bg-surface-dark/80 transition-all group"
                    >
                      <span className="material-symbols-outlined text-[20px] text-text-secondary group-hover:text-white">
                        edit_square
                      </span>
                      <span className="text-xs font-medium text-text-secondary group-hover:text-white">
                        Cursor
                      </span>
                    </button>
                    <button
                      onClick={() => onOpenIDE("webstorm")}
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-border-dark bg-surface-dark hover:bg-surface-dark/80 transition-all group"
                    >
                      <span className="material-symbols-outlined text-[20px] text-text-secondary group-hover:text-white">
                        laptop_chromebook
                      </span>
                      <span className="text-xs font-medium text-text-secondary group-hover:text-white">
                        WebStorm
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={() => onOpenIDE("terminal")}
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
                  <div className="flex justify-between items-center text-sm py-1 border-b border-border-dark/50 pb-2">
                    <span className="text-text-secondary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">
                        language
                      </span>
                      Language
                    </span>
                    <span className="font-medium text-white bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs">
                      TypeScript
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-border-dark/50 pb-2">
                    <span className="text-text-secondary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">
                        hard_drive
                      </span>
                      Size
                    </span>
                    <span className="font-mono text-xs text-white">
                      124.5 MB
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-border-dark/50 pb-2">
                    <span className="text-text-secondary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">
                        calendar_today
                      </span>
                      Created
                    </span>
                    <span className="font-medium text-white">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-text-secondary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">
                        deployed_code
                      </span>
                      Docker
                    </span>
                    <span className="font-medium text-green-500 text-xs flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-green-500"></span>
                      Enabled
                    </span>
                  </div>
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
    </div>
  );
}
