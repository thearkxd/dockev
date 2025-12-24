/**
 * Get the icon identifier for an IDE based on its ID
 * @param ideId The ID of the IDE (e.g., "vscode", "cursor", "webstorm")
 * @returns The icon identifier string for use with Icon component
 */
export function getIDEIcon(ideId: string): string {
	if (ideId === "vscode") return "octicon:vscode-32";
	if (ideId === "cursor") return "material-icon-theme:cursor";
	if (ideId === "webstorm") return "simple-icons:webstorm";
	if (ideId === "idea") return "simple-icons:intellijidea";

	if (ideId === "pycharm") return "simple-icons:pycharm";
	if (ideId === "phpstorm") return "simple-icons:phpstorm";
	if (ideId === "rider") return "simple-icons:rider";
	if (ideId === "goland") return "simple-icons:goland";
	if (ideId === "clion") return "simple-icons:clion";
	if (ideId === "rubymine") return "simple-icons:rubymine";
	if (ideId === "android-studio") return "mdi:android-studio";
	if (ideId === "sublime") return "simple-icons:sublimetext";
	if (ideId === "atom") return "simple-icons:atom";
	if (ideId === "nvim") return "simple-icons:neovim";
	if (ideId === "vim") return "simple-icons:vim";
	return "material-symbols:code";
}

// ide.id === "cursor" ? "material-icon-theme:cursor" : ide.id === "webstorm" ? "simple-icons:webstorm" : "octicon:vscode-32"
