import { useState } from "react";
import type { ReactNode } from "react";
import { X, Search, LayoutGrid, Pin } from "lucide-react";

interface WidgetLayoutProps {
    children: ReactNode;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenDashboard: () => void;
}

export function WidgetLayout({
    children,
    searchQuery,
    onSearchChange,
    onOpenDashboard
}: WidgetLayoutProps) {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const handleMinimize = () => {
        window.dockevWindow?.minimize();
    };

    const handleClose = () => {
        if (window.dockevWindow?.widget?.toggle) {
            window.dockevWindow.widget.toggle();
        } else {
            window.dockevWindow?.close();
        }
    };

    return (
        <div className="w-full h-screen bg-background/95 backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col rounded-xl">
            {/* Draggable Header */}
            <div className={`h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-3 select-none ${isPinned ? "" : "drag-region"}`}>

                {/* Left Side: Search or Title */}
                <div className="flex items-center flex-1 mr-2 no-drag">
                    {isSearchActive ? (
                        <div className="flex items-center w-full bg-white/10 rounded-md px-2 py-1">
                            <Search size={12} className="text-text-secondary mr-2" />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onBlur={() => {
                                    if (!searchQuery) setIsSearchActive(false);
                                }}
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none text-xs text-text-primary w-full placeholder:text-text-secondary"
                            />
                        </div>
                    ) : (
                        <div
                            className="flex items-center gap-2 cursor-text hover:bg-white/5 px-2 py-1 rounded transition-colors w-full"
                            onClick={() => setIsSearchActive(true)}
                        >
                            <Search size={12} className="text-text-secondary" />
                            <span className="text-xs font-medium text-text-secondary">Search projects...</span>
                        </div>
                    )}
                </div>

                {/* Right Side: Controls */}
                <div className="flex items-center gap-1 no-drag">
                    <button
                        onClick={onOpenDashboard}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-text-secondary hover:text-primary"
                        title="Open Dashboard"
                    >
                        <LayoutGrid size={14} />
                    </button>

                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className={`p-1.5 rounded-md transition-colors ${isPinned
                                ? "bg-white/10 text-primary"
                                : "hover:bg-white/10 text-text-secondary hover:text-white"
                            }`}
                        title={isPinned ? "Unpin Widget" : "Pin Widget"}
                    >
                        <Pin size={14} className={isPinned ? "fill-current" : ""} />
                    </button>

                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button
                        onClick={handleMinimize}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-text-secondary hover:text-white"
                        title="Minimize"
                    >
                        <div className="w-3 h-0.5 bg-current rounded-full" />
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-text-secondary hover:text-white"
                        title="Close"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-2 custom-scrollbar">
                {children}
            </div>
        </div>
    );
}
