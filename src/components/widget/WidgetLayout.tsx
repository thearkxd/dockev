import { useState } from "react";
import type { ReactNode } from "react";
import { Search, LayoutGrid, Pin } from "lucide-react";

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

    const handlePinToggle = () => {
        const newPinnedState = !isPinned;
        setIsPinned(newPinnedState);
        window.dockevWindow?.widget?.setPinned?.(newPinnedState);
    };

    return (
        <div className="w-full h-screen bg-black/40 backdrop-blur-2xl border border-white/5 overflow-hidden flex flex-col rounded-xl shadow-2xl">
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
                        onClick={handlePinToggle}
                        className={`p-1.5 rounded-md transition-colors ${isPinned
                            ? "bg-white/10 text-primary"
                            : "hover:bg-white/10 text-text-secondary hover:text-white"
                            }`}
                        title={isPinned ? "Unpin (Unlock Resize)" : "Pin (Lock Resize)"}
                    >
                        <Pin size={14} className={isPinned ? "fill-current" : ""} />
                    </button>
                    {isPinned && (
                        <span className="text-[10px] text-text-secondary ml-1 bg-white/5 px-1.5 py-0.5 rounded">Locked</span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-2 custom-scrollbar">
                {children}
            </div>
        </div>
    );
}
