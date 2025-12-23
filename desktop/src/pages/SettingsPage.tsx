import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "../components/layout/TitleBar";
import { settingsStorage } from "../utils/settingsStorage";
import type { Settings, IDE, Theme } from "../types/Settings";
import { AddIDEModal } from "../components/modals/AddIDEModal";

export function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>(
    settingsStorage.getSettings()
  );
  const [isAddIDEModalOpen, setIsAddIDEModalOpen] = useState(false);
  const [editingIDE, setEditingIDE] = useState<IDE | null>(null);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setSettings(settingsStorage.getSettings());
    }, 0);
  }, []);

  const handleSave = () => {
    settingsStorage.saveSettings(settings);
    alert("Settings saved successfully!");
  };

  const handleDefaultIDEChange = (ideId: string) => {
    setSettings({ ...settings, defaultIde: ideId });
  };

  const handleAutoTechStackToggle = (enabled: boolean) => {
    setSettings({ ...settings, autoTechStackDetection: enabled });
  };

  const handleThemeChange = (theme: Theme) => {
    setSettings({ ...settings, theme });
    // Apply theme to document
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleAddIDE = (ide: IDE) => {
    const newIDE: IDE = {
      ...ide,
      id: Date.now().toString(),
    };
    setSettings({
      ...settings,
      customIdes: [...settings.customIdes, newIDE],
    });
    setIsAddIDEModalOpen(false);
  };

  const handleEditIDE = (ideId: string) => {
    const ide = settings.customIdes.find((i) => i.id === ideId);
    if (ide) {
      setEditingIDE(ide);
      setIsAddIDEModalOpen(true);
    }
  };

  const handleUpdateIDE = (updatedIDE: IDE) => {
    const updatedSettings = {
      ...settings,
      customIdes: settings.customIdes.map((ide) =>
        ide.id === updatedIDE.id ? updatedIDE : ide
      ),
    };
    setSettings(updatedSettings);
    settingsStorage.saveSettings(updatedSettings);
    setIsAddIDEModalOpen(false);
    setEditingIDE(null);
  };

  const handleDeleteIDE = (ideId: string) => {
    if (confirm("Are you sure you want to delete this IDE?")) {
      const updatedSettings = {
        ...settings,
        customIdes: settings.customIdes.filter((ide) => ide.id !== ideId),
      };
      setSettings(updatedSettings);
      settingsStorage.saveSettings(updatedSettings);
    }
  };

  const allIDEs = settingsStorage.getAllIDEs();

  return (
    <>
      <TitleBar
        breadcrumb={{
          label: "Projects",
          onClick: () => navigate("/"),
        }}
        projectName="Settings"
        showSearch={false}
        showActions={false}
      />
      <div className="pt-[49px]">
        <main className="flex-1 flex justify-center py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="w-full max-w-[720px] flex flex-col gap-10">
            <div className="flex flex-col gap-3 pb-4 border-b border-border-dark/50">
              <h1 className="text-white tracking-tight text-3xl font-bold">
                Settings
              </h1>
              <p className="text-text-secondary text-base font-normal max-w-lg">
                Customize your workspace environment, interface appearance, and
                project organization preferences.
              </p>
            </div>

            {/* Environment Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    computer
                  </span>
                  Environment
                </h3>
              </div>
              <div className="bg-surface-dark/40 rounded-2xl border border-border-dark p-1">
                <div className="p-5 border-b border-border-dark/50 last:border-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white text-base font-medium">
                      Default IDE
                    </span>
                    <p className="text-text-secondary text-sm">
                      Select the editor to launch when opening projects.
                    </p>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={settings.defaultIde}
                      onChange={(e) => handleDefaultIDEChange(e.target.value)}
                      className="w-full appearance-none rounded-lg bg-background-dark text-white border border-border-dark focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-3 pr-10 text-sm font-medium transition-all cursor-pointer hover:border-gray-500"
                    >
                      {allIDEs.map((ide) => (
                        <option key={ide.id} value={ide.id}>
                          {ide.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                      <span className="material-symbols-outlined text-lg">
                        unfold_more
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 p-5 last:border-none">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-white text-base font-medium">
                      Auto tech-stack detection
                    </p>
                    <p className="text-text-secondary text-sm">
                      Automatically identify frameworks and languages in new
                      projects.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <label className="relative flex h-7 w-12 cursor-pointer items-center rounded-full border border-transparent bg-surface-darker transition-colors duration-200 ease-in-out has-[:checked]:bg-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background-dark">
                      <input
                        type="checkbox"
                        checked={settings.autoTechStackDetection}
                        onChange={(e) =>
                          handleAutoTechStackToggle(e.target.checked)
                        }
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 translate-x-1 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.autoTechStackDetection
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* IDEs Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    code
                  </span>
                  IDEs
                </h3>
                <button
                  onClick={() => {
                    setEditingIDE(null);
                    setIsAddIDEModalOpen(true);
                  }}
                  className="text-primary text-sm font-semibold hover:text-primary-hover flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  New IDE
                </button>
              </div>
              <div className="bg-surface-dark/40 rounded-2xl border border-border-dark overflow-hidden flex flex-col">
                {allIDEs.map((ide) => (
                  <div
                    key={ide.id}
                    className="group flex items-center justify-between p-4 border-b border-border-dark/50 last:border-none hover:bg-surface-dark transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-xl">
                          code
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-semibold">
                          {ide.name}
                        </span>
                        <span className="text-text-secondary text-xs">
                          Command: {ide.command}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {settings.defaultIde === ide.id && (
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                          Default
                        </span>
                      )}
                      {settings.customIdes.some((c) => c.id === ide.id) && (
                        <>
                          <button
                            onClick={() => handleEditIDE(ide.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary opacity-0 hover:bg-surface-darker hover:text-white group-hover:opacity-100 transition-all"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteIDE(ide.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary opacity-0 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 transition-all"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Appearance Section */}
            <section className="flex flex-col gap-5">
              <h3 className="text-white text-lg font-semibold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  palette
                </span>
                Appearance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(["dark", "light", "system"] as Theme[]).map((theme) => (
                  <label key={theme} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="theme"
                      value={theme}
                      checked={settings.theme === theme}
                      onChange={() => handleThemeChange(theme)}
                      className="peer sr-only"
                    />
                    <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border-dark bg-surface-dark/40 hover:bg-surface-dark transition-all peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 h-full">
                      <div className="w-full aspect-video rounded-lg bg-surface-darker border border-border-dark flex items-center justify-center mb-1 overflow-hidden relative">
                        {theme === "dark" && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800"></div>
                            <div className="absolute left-2 top-2 right-2 h-2 bg-slate-700 rounded-full w-1/2"></div>
                            <div className="absolute left-2 top-6 bottom-2 w-8 bg-slate-700/50 rounded-sm"></div>
                            <div className="absolute left-12 top-6 right-2 bottom-2 bg-slate-800 rounded-sm border border-slate-700"></div>
                          </>
                        )}
                        {theme === "light" && (
                          <>
                            <div className="absolute inset-0 bg-white"></div>
                            <div className="absolute left-2 top-2 right-2 h-2 bg-gray-200 rounded-full w-1/2"></div>
                            <div className="absolute left-2 top-6 bottom-2 w-8 bg-gray-100 rounded-sm"></div>
                            <div className="absolute left-12 top-6 right-2 bottom-2 bg-white rounded-sm border border-gray-200 shadow-sm"></div>
                          </>
                        )}
                        {theme === "system" && (
                          <>
                            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 border-r border-border-dark"></div>
                            <div className="absolute inset-y-0 right-0 w-1/2 bg-white"></div>
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-primary rounded-full text-white shadow-lg z-10">
                              <span className="material-symbols-outlined text-sm">
                                auto_mode
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <span className="text-white text-sm font-medium peer-checked:text-primary capitalize">
                        {theme}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 text-primary transition-opacity bg-background-dark rounded-full">
                      <span className="material-symbols-outlined text-xl filled">
                        check_circle
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-4 pb-20 gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 rounded-lg text-text-secondary text-sm font-medium hover:text-white hover:bg-surface-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-primary-hover hover:shadow-blue-500/30 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background-dark"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </main>
      </div>
      <AddIDEModal
        isOpen={isAddIDEModalOpen}
        onClose={() => {
          setIsAddIDEModalOpen(false);
          setEditingIDE(null);
        }}
        onSave={editingIDE ? handleUpdateIDE : handleAddIDE}
        editingIDE={editingIDE}
      />
    </>
  );
}
