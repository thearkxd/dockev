// Default color palette for projects
export const DEFAULT_COLOR_PALETTE = [
  "#6366F1", // indigo
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#F43F5E", // rose
  "#EF4444", // red
  "#F59E0B", // amber
  "#10B981", // emerald
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#14B8A6", // teal
  "#F97316", // orange
  "#84CC16", // lime
];

// Default color (indigo)
export const DEFAULT_PROJECT_COLOR = "#6366F1";

/**
 * Generates a random color from the default palette
 * @param excludeColors Optional array of colors to exclude from selection
 * @returns A random color hex string
 */
export function getRandomColor(excludeColors: string[] = []): string {
  const availableColors = DEFAULT_COLOR_PALETTE.filter(
    (color) => !excludeColors.includes(color)
  );
  
  if (availableColors.length === 0) {
    return DEFAULT_PROJECT_COLOR;
  }
  
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
}

/**
 * Gets a color for a project, using the provided color or generating a random one
 * @param color Optional color string
 * @param existingColors Optional array of existing project colors to avoid duplicates
 * @returns A color hex string
 */
export function getProjectColor(
  color?: string,
  existingColors: string[] = []
): string {
  if (color && color.trim()) {
    return color.trim();
  }
  return getRandomColor(existingColors);
}

