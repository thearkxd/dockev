import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WidgetPage } from "./pages/WidgetPage";
import { PageTransition } from "./components/shared/PageTransition";
import { Spotlight } from "./components/shared/Spotlight";
import type { Project } from "./types/Project";
import { storage } from "./utils/storage";
import { getProjectColor } from "./utils/colorUtils";
import { settingsStorage } from "./utils/settingsStorage";

export default function App() {
	console.log("App component rendering...");
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// Error boundary effect
	useEffect(() => {
		const handleError = (event: ErrorEvent) => {
			console.error("Uncaught error:", event.error);
			setError(event.error);
		};

		const handleRejection = (event: PromiseRejectionEvent) => {
			console.error("Unhandled promise rejection:", event.reason);
			setError(
				event.reason instanceof Error
					? event.reason
					: new Error(String(event.reason))
			);
		};

		window.addEventListener("error", handleError);
		window.addEventListener("unhandledrejection", handleRejection);

		return () => {
			window.removeEventListener("error", handleError);
			window.removeEventListener("unhandledrejection", handleRejection);
		};
	}, []);

	// Handle Cmd/Ctrl+K shortcut globally and custom event
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setIsSpotlightOpen(true);
			}
		};

		const handleOpenSpotlight = () => {
			setIsSpotlightOpen(true);
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener(
			"openSpotlight",
			handleOpenSpotlight as EventListener
		);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener(
				"openSpotlight",
				handleOpenSpotlight as EventListener
			);
		};
	}, []);

	// Load projects from localStorage on mount and detect IDEs on first launch
	useEffect(() => {
		const loadData = async () => {
			const loadedProjects = storage.getProjects();
			setProjects(loadedProjects);

			// Check if this is first launch (no custom IDEs detected yet)
			const settings = settingsStorage.getSettings();
			const hasDetectedIDEs = localStorage.getItem("dockev_ides_detected");

			if (!hasDetectedIDEs && window.dockevDetect?.installedIDEs) {
				try {
					const detectedIDEs = await window.dockevDetect.installedIDEs();

					if (detectedIDEs.length > 0) {
						// Get all existing IDE IDs
						const existingIds = new Set(
							settings.customIdes.map((ide) => ide.id)
						);

						// Add all detected IDEs that don't already exist
						const newIDEs = detectedIDEs.filter(
							(ide) => !existingIds.has(ide.id)
						);

						if (newIDEs.length > 0) {
							newIDEs.forEach((ide) => {
								settingsStorage.addCustomIDE({
									id: ide.id,
									name: ide.name,
									command: ide.command
								});
							});

							// Set first detected IDE as default if no default is set
							if (!settings.defaultIde) {
								const firstDetected = detectedIDEs[0];
								if (firstDetected) {
									settingsStorage.updateSetting("defaultIde", firstDetected.id);
								}
							}
						} else if (detectedIDEs.length > 0 && !settings.defaultIde) {
							// If all IDEs already exist but no default is set, use first detected
							settingsStorage.updateSetting("defaultIde", detectedIDEs[0].id);
						}

						// Mark as detected
						localStorage.setItem("dockev_ides_detected", "true");
					}
				} catch (error) {
					console.error("Error detecting installed IDEs:", error);
				}
			}

			setIsLoading(false);
		};

		loadData();
	}, []);

	// Save projects to localStorage whenever they change
	useEffect(() => {
		if (!isLoading) {
			storage.saveProjects(projects);
		}
	}, [projects, isLoading]);

	const handleAddProject = (projectData: {
		name: string;
		path: string;
		category: string;
		defaultIde: string;
		tags: string[];
		color?: string;
		description?: string;
	}) => {
		// Get existing project colors to avoid duplicates
		const existingColors = projects
			.map((p) => p.color)
			.filter((c): c is string => !!c);

		// Use provided color or generate a random one
		const projectColor = getProjectColor(projectData.color, existingColors);

		const newProject: Project = {
			id: Date.now().toString(),
			name: projectData.name,
			path: projectData.path,
			category: projectData.category,
			tags: projectData.tags,
			defaultIde: projectData.defaultIde as "vscode" | "cursor" | "webstorm",
			lastOpenedAt: undefined,
			color: projectColor,
			description: projectData.description
		};
		const updatedProjects = [...projects, newProject];
		setProjects(updatedProjects);
		// storage.saveProjects will be called by useEffect
	};

	const handleUpdateProject = (id: string, updates: Partial<Project>) => {
		const updatedProjects = projects.map((p) =>
			p.id === id ? { ...p, ...updates } : p
		);
		setProjects(updatedProjects);
		// storage.saveProjects will be called by useEffect
	};

	const handleDeleteProject = (id: string) => {
		const updatedProjects = projects.filter((p) => p.id !== id);
		setProjects(updatedProjects);
		// storage.saveProjects will be called by useEffect
	};

	const handleOpenIDE = async (projectPath: string, ide: string) => {
		try {
			if (window.dockevWindow?.launch?.ide) {
				await window.dockevWindow.launch.ide(projectPath, ide);
			} else {
				console.error("dockevWindow.launch.ide is not available");
				alert(
					"IDE launch functionality is not available. Please restart the application."
				);
			}
		} catch (error) {
			console.error("Error launching IDE:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			alert(
				`Failed to launch ${ide}.\n\n${errorMessage}\n\nMake sure it's installed and available in PATH.`
			);
		}
	};

	if (error) {
		return (
			<div className="bg-background-dark text-text-primary font-display antialiased overflow-hidden selection:bg-primary/20 selection:text-primary flex items-center justify-center h-screen">
				<div className="text-center max-w-md mx-auto p-8">
					<div className="text-red-400 text-4xl mb-4">⚠️</div>
					<h2 className="text-white text-xl font-bold mb-2">Bir Hata Oluştu</h2>
					<p className="text-text-secondary mb-4">{error.message}</p>
					<button
						onClick={() => {
							setError(null);
							window.location.reload();
						}}
						className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors"
					>
						Sayfayı Yenile
					</button>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="bg-background-dark text-text-primary font-display antialiased overflow-hidden selection:bg-primary/20 selection:text-primary flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
					<p className="text-text-secondary">Loading projects...</p>
				</div>
			</div>
		);
	}

	return (
		<HashRouter>
			<div className="bg-background-dark text-text-primary font-display antialiased overflow-hidden selection:bg-primary/20 selection:text-primary">
				<PageTransition>
					<Routes>
						<Route
							path="/"
							element={
								<ProjectsPage
									projects={projects}
									onAddProject={handleAddProject}
									onUpdateProject={handleUpdateProject}
									onDeleteProject={handleDeleteProject}
									onOpenIDE={handleOpenIDE}
								/>
							}
						/>
						<Route
							path="/project/:id"
							element={
								<ProjectDetailPage
									projects={projects}
									onUpdateProject={handleUpdateProject}
									onDeleteProject={handleDeleteProject}
									onOpenIDE={handleOpenIDE}
								/>
							}
						/>
						<Route path="/settings" element={<SettingsPage />} />
						<Route path="/widget" element={<WidgetPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</PageTransition>
				<Spotlight
					isOpen={isSpotlightOpen}
					onClose={() => setIsSpotlightOpen(false)}
					projects={projects}
				/>
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 3000,
						style: {
							background: "#1a1a1a",
							color: "#fff",
							border: "1px solid rgba(255, 255, 255, 0.1)"
						},
						success: {
							iconTheme: {
								primary: "#10b981",
								secondary: "#fff"
							}
						},
						error: {
							iconTheme: {
								primary: "#ef4444",
								secondary: "#fff"
							}
						}
					}}
				/>
			</div>
		</HashRouter>
	);
}
