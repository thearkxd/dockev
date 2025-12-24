import type { Settings, IDE } from "../types/Settings";

const SETTINGS_KEY = "dockev_settings";

const defaultSettings: Settings = {
  defaultIde: "vscode",
  autoTechStackDetection: true,
  theme: "dark",
  customIdes: [],
  defaultPackageManager: "npm",
  categories: [
    {
      id: "work",
      name: "Work Projects",
      icon: "work",
      color: "blue",
    },
    {
      id: "personal",
      name: "Personal",
      icon: "person",
      color: "emerald",
    },
    {
      id: "opensource",
      name: "Open Source",
      icon: "code",
      color: "purple",
    },
  ],
};

export const settingsStorage = {
  /**
   * Get settings from localStorage
   */
  getSettings(): Settings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all fields exist
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error("Error reading settings from localStorage:", error);
    }
    return defaultSettings;
  },

  /**
   * Save settings to localStorage
   */
  saveSettings(settings: Settings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        alert("Storage quota exceeded. Please clear some data.");
      }
    }
  },

  /**
   * Update a specific setting
   */
  updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): void {
    const settings = this.getSettings();
    settings[key] = value;
    this.saveSettings(settings);
  },

  /**
   * Add a custom IDE
   */
  addCustomIDE(ide: IDE): void {
    const settings = this.getSettings();
    settings.customIdes.push(ide);
    this.saveSettings(settings);
  },

  /**
   * Remove a custom IDE
   */
  removeCustomIDE(ideId: string): void {
    const settings = this.getSettings();
    settings.customIdes = settings.customIdes.filter((ide) => ide.id !== ideId);
    this.saveSettings(settings);
  },

  /**
   * Update a custom IDE
   */
  updateCustomIDE(ideId: string, updates: Partial<IDE>): void {
    const settings = this.getSettings();
    const index = settings.customIdes.findIndex((ide) => ide.id === ideId);
    if (index !== -1) {
      settings.customIdes[index] = { ...settings.customIdes[index], ...updates };
      this.saveSettings(settings);
    }
  },

  /**
   * Get all available IDEs (default + custom)
   */
  getAllIDEs(): IDE[] {
    const settings = this.getSettings();
    const defaultIdes: IDE[] = [
      { id: "vscode", name: "VS Code", command: "code" },
      { id: "cursor", name: "Cursor", command: "cursor" },
      { id: "webstorm", name: "WebStorm", command: "webstorm" },
    ];
    return [...defaultIdes, ...settings.customIdes];
  },
};

