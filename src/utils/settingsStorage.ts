import type { Settings, IDE } from "../types/Settings";
import type { Category } from "../types/Category";

const SETTINGS_KEY = "dockev_settings";

const defaultCategories: Category[] = [
  {
    id: "web",
    name: "Web",
    icon: "language",
    color: "#3B82F6", // blue
  },
  {
    id: "mobile",
    name: "Mobile",
    icon: "smartphone",
    color: "#8B5CF6", // purple
  },
  {
    id: "backend",
    name: "Backend",
    icon: "database",
    color: "#10B981", // emerald
  },
  {
    id: "experiments",
    name: "Experiments",
    icon: "science",
    color: "#F59E0B", // amber
  },
  {
    id: "archived",
    name: "Archived",
    icon: "archive",
    color: "#6B7280", // gray
  },
];

const defaultSettings: Settings = {
  defaultIde: "vscode",
  autoTechStackDetection: true,
  theme: "dark",
  customIdes: [],
  defaultPackageManager: "npm",
  categories: defaultCategories,
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

  /**
   * Get all categories
   */
  getCategories(): Category[] {
    const settings = this.getSettings();
    return settings.categories;
  },

  /**
   * Add a category
   */
  addCategory(category: Category): void {
    const settings = this.getSettings();
    settings.categories.push(category);
    this.saveSettings(settings);
  },

  /**
   * Update a category
   */
  updateCategory(categoryId: string, updates: Partial<Category>): void {
    const settings = this.getSettings();
    const index = settings.categories.findIndex((c) => c.id === categoryId);
    if (index !== -1) {
      settings.categories[index] = { ...settings.categories[index], ...updates };
      this.saveSettings(settings);
    }
  },

  /**
   * Remove a category
   */
  removeCategory(categoryId: string): void {
    const settings = this.getSettings();
    settings.categories = settings.categories.filter((c) => c.id !== categoryId);
    this.saveSettings(settings);
  },

  /**
   * Get default categories (for reset)
   */
  getDefaultCategories(): Category[] {
    return defaultCategories;
  },
};

