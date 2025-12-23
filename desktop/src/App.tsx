import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ProjectCard } from "./components/ProjectCard";
import type { Project } from "./types/Project";
import { TitleBar } from "./components/TitleBar";

// Mock data - later will be replaced with actual state management
const mockProjects: Project[] = [
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
  return (
    <div className="bg-background-dark text-text-primary font-display antialiased overflow-hidden selection:bg-primary/20 selection:text-primary">
      <TitleBar />
      <div className="relative flex h-screen w-full flex-row overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col h-full min-w-0 bg-background-dark relative">
          <Header />
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto pb-20">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              <button className="flex flex-col items-center justify-center rounded-2xl bg-surface-dark border border-dashed border-border-dark p-6 gap-3 hover:border-primary/50 hover:bg-surface-dark/80 transition-all cursor-pointer group min-h-[300px]">
                <div className="size-14 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors text-[28px]">
                    add
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-white text-[15px] font-semibold">
                    New Project
                  </h3>
                  <p className="text-text-secondary text-xs mt-1">
                    Initialize a new repository
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
