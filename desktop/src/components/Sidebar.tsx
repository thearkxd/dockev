import { useState } from "react";

interface SidebarProps {
  onNewProjectClick?: () => void;
}

export const Sidebar = ({ onNewProjectClick }: SidebarProps) => {
  const [activeNav, setActiveNav] = useState("all");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col justify-between bg-sidebar-dark border-r border-border-dark/50 flex-shrink-0 h-full relative z-30 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[280px]"
      }`}
    >
      <div
        className={`flex flex-col gap-8 p-6 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3.5 relative ${
            isCollapsed ? "flex-col" : ""
          }`}
        >
          <div className="relative flex items-center justify-center rounded-lg size-9 bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              terminal
            </span>
            <div className="absolute -bottom-1 -right-1 size-2.5 bg-green-500 rounded-full border-2 border-sidebar-dark"></div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-white text-[15px] font-semibold tracking-tight">
                Dockev
              </h1>
              <p className="text-text-secondary text-[11px] font-medium tracking-wide opacity-80">
                WORKSPACE
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-md hover:bg-white/5 text-text-secondary hover:text-white transition-colors ${
              isCollapsed ? "mt-2" : "absolute top-0 right-0"
            }`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isCollapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </div>
        <nav className="flex flex-col gap-1.5">
          {!isCollapsed && (
            <p className="px-2 text-[11px] font-semibold text-text-secondary/60 uppercase tracking-wider mb-2">
              Projects
            </p>
          )}
          <button
            onClick={() => setActiveNav("all")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
              activeNav === "all"
                ? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
                : "text-text-secondary hover:bg-white/5 hover:text-white"
            } ${isCollapsed ? "justify-center w-full" : ""}`}
            title={isCollapsed ? "All Projects" : undefined}
          >
            <span
              className={`material-symbols-outlined flex-shrink-0 ${
                isCollapsed ? "text-[24px]" : "text-[20px]"
              }`}
            >
              dashboard
            </span>
            {!isCollapsed && (
              <>
                <p className="text-[13px] font-medium">All Projects</p>
                <span className="ml-auto text-[10px] font-bold bg-primary/20 px-1.5 py-0.5 rounded text-primary">
                  12
                </span>
              </>
            )}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
                All Projects
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveNav("mobile")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
              activeNav === "mobile"
                ? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
                : "text-text-secondary hover:bg-white/5 hover:text-white"
            } ${isCollapsed ? "justify-center w-full" : ""}`}
            title={isCollapsed ? "Mobile" : undefined}
          >
            <span
              className={`material-symbols-outlined text-text-secondary group-hover:text-white transition-colors flex-shrink-0 ${
                isCollapsed ? "text-[24px]" : "text-[20px]"
              }`}
            >
              smartphone
            </span>
            {!isCollapsed && <p className="text-[13px] font-medium">Mobile</p>}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
                Mobile
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveNav("web")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
              activeNav === "web"
                ? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
                : "text-text-secondary hover:bg-white/5 hover:text-white"
            } ${isCollapsed ? "justify-center w-full" : ""}`}
            title={isCollapsed ? "Web" : undefined}
          >
            <span
              className={`material-symbols-outlined text-text-secondary group-hover:text-white transition-colors flex-shrink-0 ${
                isCollapsed ? "text-[24px]" : "text-[20px]"
              }`}
            >
              language
            </span>
            {!isCollapsed && <p className="text-[13px] font-medium">Web</p>}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
                Web
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveNav("backend")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
              activeNav === "backend"
                ? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
                : "text-text-secondary hover:bg-white/5 hover:text-white"
            } ${isCollapsed ? "justify-center w-full" : ""}`}
            title={isCollapsed ? "Backend" : undefined}
          >
            <span
              className={`material-symbols-outlined text-text-secondary group-hover:text-white transition-colors flex-shrink-0 ${
                isCollapsed ? "text-[24px]" : "text-[20px]"
              }`}
            >
              database
            </span>
            {!isCollapsed && <p className="text-[13px] font-medium">Backend</p>}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
                Backend
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveNav("experiments")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
              activeNav === "experiments"
                ? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
                : "text-text-secondary hover:bg-white/5 hover:text-white"
            } ${isCollapsed ? "justify-center w-full" : ""}`}
            title={isCollapsed ? "Experiments" : undefined}
          >
            <span
              className={`material-symbols-outlined text-text-secondary group-hover:text-white transition-colors flex-shrink-0 ${
                isCollapsed ? "text-[24px]" : "text-[20px]"
              }`}
            >
              science
            </span>
            {!isCollapsed && (
              <p className="text-[13px] font-medium">Experiments</p>
            )}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
                Experiments
              </span>
            )}
          </button>
          {!isCollapsed && (
            <div className="h-px bg-border-dark/50 my-2 mx-2"></div>
          )}
          <button
            onClick={() => setActiveNav("archived")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
              activeNav === "archived"
                ? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
                : "text-text-secondary hover:bg-white/5 hover:text-white"
            } ${isCollapsed ? "justify-center w-full" : ""}`}
            title={isCollapsed ? "Archived" : undefined}
          >
            <span
              className={`material-symbols-outlined text-text-secondary group-hover:text-white transition-colors flex-shrink-0 ${
                isCollapsed ? "text-[24px]" : "text-[20px]"
              }`}
            >
              archive
            </span>
            {!isCollapsed && (
              <p className="text-[13px] font-medium">Archived</p>
            )}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
                Archived
              </span>
            )}
          </button>
        </nav>
      </div>
      <div
        className={`p-6 border-t border-border-dark/50 flex flex-col gap-6 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        <button
          onClick={onNewProjectClick}
          className={`group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-9 px-4 bg-white text-black hover:bg-gray-200 transition-colors text-[13px] font-semibold shadow-md relative ${
            isCollapsed ? "px-2" : ""
          }`}
          title={isCollapsed ? "New Project" : undefined}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {!isCollapsed && <span>New Project</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
              New Project
            </span>
          )}
        </button>
        <div
          className={`flex items-center gap-3 ${isCollapsed ? "flex-col" : ""}`}
        >
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-border-dark shadow-sm flex-shrink-0"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaGC1sxB2MW_15sOJ0cY5Mfq3pZAQNcfgcaVdwzHa0Z6X8VJv7xS5I_Gpvda6lgKTCx-z_uct3H5EKyWMN5kvbglRCxeo_fVw4QQLFBLsjS96OY-7rylGGMMhAoIzT1s8zPRalDEKZ97lqrE-UoYWdqAVu0Vto40lz5rVaVZ0JNg1yZeNPPGMg65WCHUNe0O9EI7d90rnCp5jgs8RcVHNAeNLHvuQxQ6jhXlhTQPjIBs7QKu_MkM7OZIB2ufeU5I6DRYaJG6HL7N6u')",
            }}
          ></div>
          {!isCollapsed && (
            <>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  Alex Developer
                </p>
                <p className="text-text-secondary text-[11px] truncate">
                  Pro Plan
                </p>
              </div>
              <button className="text-text-secondary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  settings
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
