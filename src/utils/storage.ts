import type { Project } from "../types/Project";

const STORAGE_KEY = "dockev_projects";

export const storage = {
  /**
   * Get all projects from localStorage
   */
  getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error reading projects from localStorage:", error);
    }
    return [];
  },

  /**
   * Save all projects to localStorage
   */
  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("Error saving projects to localStorage:", error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        alert(
          "Storage quota exceeded. Please remove some projects or clear browser data."
        );
      }
    }
  },

  /**
   * Add a new project
   */
  addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  },

  /**
   * Update an existing project
   */
  updateProject(id: string, updates: Partial<Project>): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      this.saveProjects(projects);
    }
  },

  /**
   * Delete a project
   */
  deleteProject(id: string): void {
    const projects = this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    this.saveProjects(filtered);
  },

  /**
   * Export projects as JSON
   */
  exportProjects(): string {
    const projects = this.getProjects();
    return JSON.stringify(projects, null, 2);
  },

  /**
   * Import projects from JSON string
   */
  importProjects(jsonString: string): Project[] {
    try {
      const projects = JSON.parse(jsonString) as Project[];
      if (Array.isArray(projects)) {
        this.saveProjects(projects);
        return projects;
      }
      throw new Error("Invalid projects format");
    } catch (error) {
      console.error("Error importing projects:", error);
      throw new Error("Failed to import projects. Invalid JSON format.");
    }
  },

  /**
   * Clear all projects
   */
  clearProjects(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

