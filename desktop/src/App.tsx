import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { PageTransition } from "./components/PageTransition";
import type { Project } from "./types/Project";

// Mock data - later will be replaced with actual state management
const initialProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce API",
    path: "~/dev/backend/shop-api",
    category: "Backend",
    tags: ["Node", "Express"],
    defaultIde: "vscode",
    lastOpenedAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  },
  {
    id: "2",
    name: "Client Dashboard",
    path: "~/dev/web/dashboard-app",
    category: "Web",
    tags: ["React", "Tailwind"],
    defaultIde: "cursor",
    lastOpenedAt: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
  },
  {
    id: "3",
    name: "Fitness Tracker",
    path: "~/dev/mobile/fitness-tracker",
    category: "Mobile",
    tags: ["Expo", "TypeScript"],
    defaultIde: "vscode",
    lastOpenedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
  },
  {
    id: "4",
    name: "Image Classifier",
    path: "~/dev/experiments/ml-vision",
    category: "Experiments",
    tags: ["Python", "PyTorch"],
    defaultIde: "vscode",
    lastOpenedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
  },
  {
    id: "5",
    name: "Legacy CRM",
    path: "~/dev/archived/v1-crm",
    category: "Archived",
    tags: ["PHP", "MySQL"],
    defaultIde: "vscode",
    lastOpenedAt: Date.now() - 180 * 24 * 60 * 60 * 1000, // 6 months ago
  },
];

export default function App() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

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
    setProjects([...projects, newProject]);
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleOpenIDE = async (projectPath: string, ide: string) => {
    try {
      if (window.dockevWindow?.launch?.ide) {
        await window.dockevWindow.launch.ide(projectPath, ide);
      }
    } catch (error) {
      console.error("Error launching IDE:", error);
      alert(
        `Failed to launch ${ide}. Make sure it's installed and available in PATH.`
      );
    }
  };

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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </div>
    </BrowserRouter>
  );
}
