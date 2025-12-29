import { describe, it, expect, beforeEach } from "vitest";
import { settingsStorage } from "../settingsStorage";
import type { Category } from "../../types/Category";
import type { IDE } from "../../types/Settings";

describe("settingsStorage", () => {
	beforeEach(() => {
		// Reset to default settings
		const defaultSettings = settingsStorage.getSettings();
		settingsStorage.saveSettings(defaultSettings);
	});

	describe("getSettings", () => {
		it("should return default settings when none exist", () => {
			localStorage.removeItem("dockev_settings");
			const settings = settingsStorage.getSettings();
			expect(settings.defaultIde).toBe("vscode"); // Default IDE can still be set, but not in getAllIDEs
			expect(settings.autoTechStackDetection).toBe(true);
			expect(settings.theme).toBe("dark");
			expect(settings.categories).toHaveLength(5);
			expect(settings.customIdes).toEqual([]); // No default IDEs, only custom ones
		});
	});

	describe("saveSettings", () => {
		it("should save settings to localStorage", () => {
			const settings = settingsStorage.getSettings();
			settings.defaultIde = "cursor";
			settingsStorage.saveSettings(settings);
			const loaded = settingsStorage.getSettings();
			expect(loaded.defaultIde).toBe("cursor");
		});
	});

	describe("updateSetting", () => {
		it("should update a specific setting", () => {
			settingsStorage.updateSetting("defaultIde", "webstorm");
			const settings = settingsStorage.getSettings();
			expect(settings.defaultIde).toBe("webstorm");
		});

		it("should update theme setting", () => {
			settingsStorage.updateSetting("theme", "light");
			const settings = settingsStorage.getSettings();
			expect(settings.theme).toBe("light");
		});
	});

	describe("getCategories", () => {
		it("should return default categories", () => {
			const categories = settingsStorage.getCategories();
			expect(categories.length).toBeGreaterThan(0);
			expect(categories[0]).toHaveProperty("id");
			expect(categories[0]).toHaveProperty("name");
			expect(categories[0]).toHaveProperty("icon");
			expect(categories[0]).toHaveProperty("color");
		});
	});

	describe("addCategory", () => {
		it("should add a new category", () => {
			const category: Category = {
				id: "test-category",
				name: "Test Category",
				icon: "folder",
				color: "#FF0000"
			};
			settingsStorage.addCategory(category);
			const categories = settingsStorage.getCategories();
			expect(categories).toContainEqual(category);
		});
	});

	describe("updateCategory", () => {
		it("should update an existing category", () => {
			const category: Category = {
				id: "test-category",
				name: "Original Name",
				icon: "folder",
				color: "#FF0000"
			};
			settingsStorage.addCategory(category);
			settingsStorage.updateCategory("test-category", { name: "Updated Name" });
			const categories = settingsStorage.getCategories();
			const updated = categories.find((c) => c.id === "test-category");
			expect(updated?.name).toBe("Updated Name");
		});
	});

	describe("removeCategory", () => {
		it("should remove a category", () => {
			const category: Category = {
				id: "to-remove",
				name: "To Remove",
				icon: "folder",
				color: "#FF0000"
			};
			settingsStorage.addCategory(category);
			settingsStorage.removeCategory("to-remove");
			const categories = settingsStorage.getCategories();
			expect(categories.find((c) => c.id === "to-remove")).toBeUndefined();
		});
	});

	describe("getAllIDEs", () => {
		it("should return empty array when no custom IDEs are added", () => {
			// Clear any existing custom IDEs
			const settings = settingsStorage.getSettings();
			settings.customIdes = [];
			settingsStorage.saveSettings(settings);

			const ides = settingsStorage.getAllIDEs();
			expect(ides).toEqual([]);
		});

		it("should return only custom IDEs", () => {
			// Clear any existing custom IDEs
			const settings = settingsStorage.getSettings();
			settings.customIdes = [];
			settingsStorage.saveSettings(settings);

			const customIDE: IDE = {
				id: "custom-ide",
				name: "Custom IDE",
				command: "custom"
			};
			settingsStorage.addCustomIDE(customIDE);
			const ides = settingsStorage.getAllIDEs();
			expect(ides).toHaveLength(1);
			expect(ides).toContainEqual(customIDE);
		});

		it("should not include default IDEs", () => {
			const ides = settingsStorage.getAllIDEs();
			expect(ides.some((ide) => ide.id === "vscode")).toBe(false);
			expect(ides.some((ide) => ide.id === "cursor")).toBe(false);
			expect(ides.some((ide) => ide.id === "webstorm")).toBe(false);
		});
	});

	describe("addCustomIDE", () => {
		it("should add a custom IDE", () => {
			const ide: IDE = {
				id: "test-ide",
				name: "Test IDE",
				command: "test-ide"
			};
			settingsStorage.addCustomIDE(ide);
			const settings = settingsStorage.getSettings();
			expect(settings.customIdes).toContainEqual(ide);
		});
	});

	describe("removeCustomIDE", () => {
		it("should remove a custom IDE", () => {
			const ide: IDE = {
				id: "to-remove",
				name: "To Remove",
				command: "remove"
			};
			settingsStorage.addCustomIDE(ide);
			settingsStorage.removeCustomIDE("to-remove");
			const settings = settingsStorage.getSettings();
			expect(
				settings.customIdes.find((i) => i.id === "to-remove")
			).toBeUndefined();
		});
	});

	describe("updateCustomIDE", () => {
		it("should update a custom IDE", () => {
			const ide: IDE = {
				id: "to-update",
				name: "Original",
				command: "original"
			};
			settingsStorage.addCustomIDE(ide);
			settingsStorage.updateCustomIDE("to-update", { name: "Updated" });
			const settings = settingsStorage.getSettings();
			const updated = settings.customIdes.find((i) => i.id === "to-update");
			expect(updated?.name).toBe("Updated");
		});
	});
});
