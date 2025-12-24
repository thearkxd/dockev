import { describe, it, expect } from "vitest";
import {
	DEFAULT_COLOR_PALETTE,
	DEFAULT_PROJECT_COLOR,
	getRandomColor,
	getProjectColor
} from "../colorUtils";

describe("colorUtils", () => {
	describe("getRandomColor", () => {
		it("should return a color from the default palette", () => {
			const color = getRandomColor();
			expect(DEFAULT_COLOR_PALETTE).toContain(color);
		});

		it("should return default color when all colors are excluded", () => {
			const color = getRandomColor(DEFAULT_COLOR_PALETTE);
			expect(color).toBe(DEFAULT_PROJECT_COLOR);
		});

		it("should exclude specified colors from selection", () => {
			const excludeColors = [
				DEFAULT_COLOR_PALETTE[0],
				DEFAULT_COLOR_PALETTE[1]
			];
			const color = getRandomColor(excludeColors);
			expect(excludeColors).not.toContain(color);
			expect(DEFAULT_COLOR_PALETTE).toContain(color);
		});

		it("should return different colors on multiple calls (probabilistic)", () => {
			const colors = new Set();
			for (let i = 0; i < 20; i++) {
				colors.add(getRandomColor());
			}
			// With 12 colors in palette, we should get at least 2 different colors
			expect(colors.size).toBeGreaterThan(1);
		});
	});

	describe("getProjectColor", () => {
		it("should return provided color if it exists", () => {
			const color = "#FF0000";
			expect(getProjectColor(color)).toBe(color);
		});

		it("should trim whitespace from provided color", () => {
			const color = "  #FF0000  ";
			expect(getProjectColor(color)).toBe("#FF0000");
		});

		it("should return random color if no color provided", () => {
			const color = getProjectColor();
			expect(DEFAULT_COLOR_PALETTE).toContain(color);
		});

		it("should return random color if empty string provided", () => {
			const color = getProjectColor("");
			expect(DEFAULT_COLOR_PALETTE).toContain(color);
		});

		it("should avoid existing colors when generating random color", () => {
			const existingColors = [
				DEFAULT_COLOR_PALETTE[0],
				DEFAULT_COLOR_PALETTE[1]
			];
			const color = getProjectColor(undefined, existingColors);
			expect(existingColors).not.toContain(color);
			expect(DEFAULT_COLOR_PALETTE).toContain(color);
		});
	});

	describe("constants", () => {
		it("should have default color palette with 12 colors", () => {
			expect(DEFAULT_COLOR_PALETTE).toHaveLength(12);
		});

		it("should have valid hex colors in palette", () => {
			DEFAULT_COLOR_PALETTE.forEach((color) => {
				expect(color).toMatch(/^#[0-9A-F]{6}$/i);
			});
		});

		it("should have default project color in palette", () => {
			expect(DEFAULT_COLOR_PALETTE).toContain(DEFAULT_PROJECT_COLOR);
		});
	});
});
