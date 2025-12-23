import { useState } from 'react';

export const Sidebar = () => {
  const [activeNav, setActiveNav] = useState('all');

  return (
    <aside className="flex w-[280px] flex-col justify-between bg-sidebar-dark border-r border-border-dark/50 flex-shrink-0 h-full relative z-30">
      <div className="flex flex-col gap-8 p-6">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center rounded-lg size-9 bg-primary/10 text-primary border border-primary/20">
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            <div className="absolute -bottom-1 -right-1 size-2.5 bg-green-500 rounded-full border-2 border-sidebar-dark"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-[15px] font-semibold tracking-tight">
              Dockev
            </h1>
            <p className="text-text-secondary text-[11px] font-medium tracking-wide opacity-80">
              WORKSPACE
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1.5">
          <p className="px-2 text-[11px] font-semibold text-text-secondary/60 uppercase tracking-wider mb-2">
            Projects
          </p>
          <button
            onClick={() => setActiveNav('all')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeNav === 'all'
                ? 'bg-primary/10 text-primary border border-primary/10 shadow-glow'
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <p className="text-[13px] font-medium">All Projects</p>
            <span className="ml-auto text-[10px] font-bold bg-primary/20 px-1.5 py-0.5 rounded text-primary">
              12
            </span>
          </button>
          <button
            onClick={() => setActiveNav('mobile')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              activeNav === 'mobile'
                ? 'bg-primary/10 text-primary border border-primary/10 shadow-glow'
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-text-secondary group-hover:text-white transition-colors">
              smartphone
            </span>
            <p className="text-[13px] font-medium">Mobile</p>
          </button>
          <button
            onClick={() => setActiveNav('web')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              activeNav === 'web'
                ? 'bg-primary/10 text-primary border border-primary/10 shadow-glow'
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-text-secondary group-hover:text-white transition-colors">
              language
            </span>
            <p className="text-[13px] font-medium">Web</p>
          </button>
          <button
            onClick={() => setActiveNav('backend')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              activeNav === 'backend'
                ? 'bg-primary/10 text-primary border border-primary/10 shadow-glow'
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-text-secondary group-hover:text-white transition-colors">
              database
            </span>
            <p className="text-[13px] font-medium">Backend</p>
          </button>
          <button
            onClick={() => setActiveNav('experiments')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              activeNav === 'experiments'
                ? 'bg-primary/10 text-primary border border-primary/10 shadow-glow'
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-text-secondary group-hover:text-white transition-colors">
              science
            </span>
            <p className="text-[13px] font-medium">Experiments</p>
          </button>
          <div className="h-px bg-border-dark/50 my-2 mx-2"></div>
          <button
            onClick={() => setActiveNav('archived')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              activeNav === 'archived'
                ? 'bg-primary/10 text-primary border border-primary/10 shadow-glow'
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-text-secondary group-hover:text-white transition-colors">
              archive
            </span>
            <p className="text-[13px] font-medium">Archived</p>
          </button>
        </nav>
      </div>
      <div className="p-6 border-t border-border-dark/50 flex flex-col gap-6">
        <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-9 px-4 bg-white text-black hover:bg-gray-200 transition-colors text-[13px] font-semibold shadow-md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Project</span>
        </button>
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-border-dark shadow-sm"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaGC1sxB2MW_15sOJ0cY5Mfq3pZAQNcfgcaVdwzHa0Z6X8VJv7xS5I_Gpvda6lgKTCx-z_uct3H5EKyWMN5kvbglRCxeo_fVw4QQLFBLsjS96OY-7rylGGMMhAoIzT1s8zPRalDEKZ97lqrE-UoYWdqAVu0Vto40lz5rVaVZ0JNg1yZeNPPGMg65WCHUNe0O9EI7d90rnCp5jgs8RcVHNAeNLHvuQxQ6jhXlhTQPjIBs7QKu_MkM7OZIB2ufeU5I6DRYaJG6HL7N6u')"
            }}
          ></div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">
              Alex Developer
            </p>
            <p className="text-text-secondary text-[11px] truncate">Pro Plan</p>
          </div>
          <button className="text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

