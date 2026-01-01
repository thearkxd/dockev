import { useEffect, useState } from "react";
import { WidgetLayout } from "../components/widget/WidgetLayout";
import { QuickActions } from "../components/widget/QuickActions";
import type { Project } from "../types/Project";
import { storage } from "../utils/storage";

export function WidgetPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Load projects initially
        const loaded = storage.getProjects();
        setProjects(loaded);

        // Listen for storage events (if multiple windows share same localStorage, this works)
        const handleStorage = () => {
            setProjects(storage.getProjects());
        };

        window.addEventListener("storage", handleStorage);
        // Also custom event mechanism if needed
        window.addEventListener("dockev:projects-updated", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("dockev:projects-updated", handleStorage);
        };
    }, []);

    const handleOpenIDE = async (path: string, ide: string) => {
        if (window.dockevWindow?.launch?.ide) {
            await window.dockevWindow.launch.ide(path, ide);
        }
    };

    const handleOpenDashboard = () => {
        if (window.dockevWindow?.widget?.openDashboard) {
            window.dockevWindow.widget.openDashboard();
        }
    };

    return (
        <WidgetLayout
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenDashboard={handleOpenDashboard}
        >
            <QuickActions
                projects={projects}
                searchQuery={searchQuery}
                onOpenIDE={handleOpenIDE}
            />
        </WidgetLayout>
    );
}
