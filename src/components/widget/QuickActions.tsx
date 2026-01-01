import type { Project } from "../../types/Project";
import { Terminal, Folder } from "lucide-react";

interface QuickActionsProps {
    projects: Project[];
    searchQuery: string;
    onOpenIDE: (path: string, ide: string) => void;
}

export function QuickActions({ projects, searchQuery, onOpenIDE }: QuickActionsProps) {
    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort alphabetically
    filteredProjects.sort((a, b) => a.name.localeCompare(b.name));

    const handleOpenTerminal = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        if (window.dockevWindow?.launch?.ide) {
            window.dockevWindow.launch.ide(path, "terminal");
        }
    };

    const handleOpenFolder = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        if (window.dockevShell?.openFolder) {
            window.dockevShell.openFolder(path);
        }
    };

    return (
        <div className="space-y-2">
            <div className="space-y-1">
                {filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                        onClick={() => onOpenIDE(project.path, project.defaultIde)}
                    >
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                            <div
                                className="w-1 h-6 rounded-full flex-shrink-0"
                                style={{ backgroundColor: project.color }}
                            />
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-text-primary truncate">
                                    {project.name}
                                </span>
                                <span className="text-[10px] text-text-secondary truncate text-opacity-70">
                                    {project.path.split(/[\\/]/).pop()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => handleOpenTerminal(e, project.path)}
                                className="p-1.5 hover:bg-white/10 rounded text-text-secondary hover:text-primary transition-colors"
                                title="Open in Terminal"
                            >
                                <Terminal size={16} />
                            </button>
                            <button
                                onClick={(e) => handleOpenFolder(e, project.path)}
                                className="p-1.5 hover:bg-white/10 rounded text-text-secondary hover:text-blue-400 transition-colors"
                                title="Open Folder"
                            >
                                <Folder size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-8 text-text-secondary text-xs">
                        No projects found
                    </div>
                )}
            </div>
        </div>
    );
}
