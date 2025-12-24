import { describe, it, expect, beforeEach } from "vitest";
import { storage } from "../storage";
import type { Project } from "../../types/Project";

describe("storage", () => {
	beforeEach(() => {
		storage.clearProjects();
	});

	describe("getProjects", () => {
		it("should return empty array when no projects exist", () => {
			expect(storage.getProjects()).toEqual([]);
		});

		it("should return saved projects", () => {
			const project: Project = {
				id: "1",
				name: "Test Project",
				path: "/test/path",
				category: "Web",
				tags: [],
				defaultIde: "vscode"
			};
			storage.saveProjects([project]);
			expect(storage.getProjects()).toEqual([project]);
		});
	});

	describe("saveProjects", () => {
		it("should save projects to localStorage", () => {
			const projects: Project[] = [
				{
					id: "1",
					name: "Project 1",
					path: "/path1",
					category: "Web",
					tags: [],
					defaultIde: "vscode"
				},
				{
					id: "2",
					name: "Project 2",
					path: "/path2",
					category: "Mobile",
					tags: [],
					defaultIde: "cursor"
				}
			];
			storage.saveProjects(projects);
			expect(storage.getProjects()).toEqual(projects);
		});
	});

	describe("addProject", () => {
		it("should add a new project", () => {
			const project: Project = {
				id: "1",
				name: "New Project",
				path: "/new/path",
				category: "Web",
				tags: [],
				defaultIde: "vscode"
			};
			storage.addProject(project);
			const projects = storage.getProjects();
			expect(projects).toHaveLength(1);
			expect(projects[0]).toEqual(project);
		});
	});

	describe("updateProject", () => {
		it("should update an existing project", () => {
			const project: Project = {
				id: "1",
				name: "Original Name",
				path: "/path",
				category: "Web",
				tags: [],
				defaultIde: "vscode"
			};
			storage.addProject(project);
			storage.updateProject("1", { name: "Updated Name" });
			const projects = storage.getProjects();
			expect(projects[0].name).toBe("Updated Name");
			expect(projects[0].id).toBe("1");
		});

		it("should not update if project does not exist", () => {
			storage.updateProject("999", { name: "Updated" });
			expect(storage.getProjects()).toEqual([]);
		});
	});

	describe("deleteProject", () => {
		it("should delete a project", () => {
			const project: Project = {
				id: "1",
				name: "To Delete",
				path: "/path",
				category: "Web",
				tags: [],
				defaultIde: "vscode"
			};
			storage.addProject(project);
			storage.deleteProject("1");
			expect(storage.getProjects()).toEqual([]);
		});

		it("should not delete if project does not exist", () => {
			const project: Project = {
				id: "1",
				name: "Project",
				path: "/path",
				category: "Web",
				tags: [],
				defaultIde: "vscode"
			};
			storage.addProject(project);
			storage.deleteProject("999");
			expect(storage.getProjects()).toHaveLength(1);
		});
	});

	describe("exportProjects", () => {
		it("should export projects as JSON string", () => {
			const project: Project = {
				id: "1",
				name: "Export Test",
				path: "/path",
				category: "Web",
				tags: [],
				defaultIde: "vscode"
			};
			storage.addProject(project);
			const exported = storage.exportProjects();
			expect(() => JSON.parse(exported)).not.toThrow();
			const parsed = JSON.parse(exported);
			expect(parsed).toEqual([project]);
		});
	});

	describe("importProjects", () => {
		it("should import projects from JSON string", () => {
			const projects: Project[] = [
				{
					id: "1",
					name: "Imported 1",
					path: "/path1",
					category: "Web",
					tags: [],
					defaultIde: "vscode"
				}
			];
			const json = JSON.stringify(projects);
			const imported = storage.importProjects(json);
			expect(imported).toEqual(projects);
			expect(storage.getProjects()).toEqual(projects);
		});

		it("should throw error for invalid JSON", () => {
			expect(() => storage.importProjects("invalid json")).toThrow();
		});

		it("should throw error for non-array JSON", () => {
			expect(() => storage.importProjects('{"not": "array"}')).toThrow();
		});
	});

	describe("clearProjects", () => {
		it("should clear all projects", () => {
			const project: Project = {
				id: "1",
				name: "To Clear",
				path: "/path",
				category: "Web",
				tags: [],
				defaultIde: "vscode"
			};
			storage.addProject(project);
			storage.clearProjects();
			expect(storage.getProjects()).toEqual([]);
		});
	});
});
