import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { PageTransition } from "./components/PageTransition";
import type { Project } from "./types/Project";
import { storage } from "./utils/storage";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadedProjects = storage.getProjects();
    setProjects(loadedProjects);
    setIsLoading(false);
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      storage.saveProjects(projects);
    }
  }, [projects, isLoading]);

  const handleAddProject = (projectData: {
    name: string;
    path: string;
    category: string;
    defaultIde: string;
    tags: string[];
  }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      path: projectData.path,
      category: projectData.category,
      tags: projectData.tags,
      defaultIde: projectData.defaultIde as "vscode" | "cursor" | "webstorm",
      lastOpenedAt: undefined,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    // storage.saveProjects will be called by useEffect
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    setProjects(updatedProjects);
    // storage.saveProjects will be called by useEffect
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    // storage.saveProjects will be called by useEffect
  };

  const handleOpenIDE = async (projectPath: string, ide: string) => {
    try {
      if (window.dockevWindow?.launch?.ide) {
        await window.dockevWindow.launch.ide(projectPath, ide);
      } else {
        console.error("dockevWindow.launch.ide is not available");
        alert(
          "IDE launch functionality is not available. Please restart the application."
        );
      }
    } catch (error) {
      console.error("Error launching IDE:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(
        `Failed to launch ${ide}.\n\n${errorMessage}\n\nMake sure it's installed and available in PATH.`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background-dark text-text-primary font-display antialiased overflow-hidden selection:bg-primary/20 selection:text-primary flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="bg-background-dark text-text-primary font-display antialiased overflow-hidden selection:bg-primary/20 selection:text-primary">
        <PageTransition>
          <Routes>
            <Route
              path="/"
              element={
                <ProjectsPage
                  projects={projects}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onOpenIDE={handleOpenIDE}
                />
              }
            />
            <Route
              path="/project/:id"
              element={
                <ProjectDetailPage
                  projects={projects}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onOpenIDE={handleOpenIDE}
                />
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
    </div>
    </BrowserRouter>
  );
}
