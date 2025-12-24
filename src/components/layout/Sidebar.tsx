import { useState, useMemo } from "react";
import { settingsStorage } from "../../utils/settingsStorage";
import type { Project } from "../../types/Project";

interface SidebarProps {
	onNewProjectClick?: () => void;
	activeCategory?: string;
	onCategoryChange?: (category: string) => void;
	projects?: Project[];
}

export const Sidebar = ({
	onNewProjectClick,
	activeCategory = "all",
	onCategoryChange,
	projects = []
}: SidebarProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const categories = settingsStorage.getCategories();

	const handleCategoryClick = (category: string) => {
		onCategoryChange?.(category);
	};

	// Calculate project counts for each category
	const categoryCounts = useMemo(() => {
		const counts: Record<string, number> = { all: projects.length };
		categories.forEach((cat) => {
			if (cat.id === "archived") {
				counts[cat.name] = projects.filter(
					(p) => p.category.toLowerCase() === "archived"
				).length;
			} else {
				counts[cat.name] = projects.filter(
					(p) => p.category === cat.name
				).length;
			}
		});
		return counts;
	}, [categories, projects]);

	return (
		<aside
			className={`flex flex-col justify-between bg-sidebar-dark border-r border-border-dark/50 flex-shrink-0 h-full relative z-30 transition-all duration-300 ${
				isCollapsed ? "w-[72px]" : "w-[280px]"
			}`}
		>
			<div
				className={`flex flex-col gap-8 p-6 ${
					isCollapsed ? "items-center" : ""
				}`}
			>
				<div
					className={`flex items-center gap-3.5 relative ${
						isCollapsed ? "flex-col" : ""
					}`}
				>
					<div className="relative flex items-center justify-center rounded-lg size-9 bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
						<span className="material-symbols-outlined text-[20px]">
							terminal
						</span>
						<div className="absolute -bottom-1 -right-1 size-2.5 bg-green-500 rounded-full border-2 border-sidebar-dark"></div>
					</div>
					{!isCollapsed && (
						<div className="flex flex-col min-w-0 flex-1">
							<h1 className="text-white text-[15px] font-semibold tracking-tight">
								Dockev
							</h1>
							<p className="text-text-secondary text-[11px] font-medium tracking-wide opacity-80">
								WORKSPACE
							</p>
						</div>
					)}
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className={`p-1.5 rounded-md hover:bg-white/5 text-text-secondary hover:text-white transition-colors ${
							isCollapsed ? "mt-2" : "absolute top-0 right-0"
						}`}
						title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						<span className="material-symbols-outlined text-[18px]">
							{isCollapsed ? "chevron_right" : "chevron_left"}
						</span>
					</button>
				</div>
				<nav className="flex flex-col gap-1.5">
					{!isCollapsed && (
						<p className="px-2 text-[11px] font-semibold text-text-secondary/60 uppercase tracking-wider mb-2">
							Projects
						</p>
					)}
					<button
						onClick={() => handleCategoryClick("all")}
						className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
							activeCategory === "all"
								? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
								: "text-text-secondary hover:bg-white/5 hover:text-white"
						} ${isCollapsed ? "justify-center w-full" : ""}`}
						title={isCollapsed ? "All Projects" : undefined}
					>
						<span
							className={`material-symbols-outlined flex-shrink-0 ${
								isCollapsed ? "text-[24px]" : "text-[20px]"
							}`}
						>
							dashboard
						</span>
						{!isCollapsed && (
							<>
								<p className="text-[13px] font-medium">All Projects</p>
								<span className="ml-auto text-[10px] font-bold bg-primary/20 px-1.5 py-0.5 rounded text-primary">
									{categoryCounts.all || 0}
								</span>
							</>
						)}
						{isCollapsed && (
							<span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
								All Projects
							</span>
						)}
					</button>
					{categories
						.filter((cat) => cat.id !== "archived")
						.map((category) => (
							<button
								key={category.id}
								onClick={() => handleCategoryClick(category.name)}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
									activeCategory === category.name
										? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
										: "text-text-secondary hover:bg-white/5 hover:text-white"
								} ${isCollapsed ? "justify-center w-full" : ""}`}
								title={isCollapsed ? category.name : undefined}
								style={
									activeCategory === category.name
										? {
												borderColor: `${category.color}40`,
												backgroundColor: `${category.color}10`,
												color: category.color
										  }
										: {}
								}
							>
								<span
									className={`material-symbols-outlined flex-shrink-0 transition-colors ${
										isCollapsed ? "text-[24px]" : "text-[20px]"
									}`}
									style={
										activeCategory === category.name
											? { color: category.color }
											: {}
									}
								>
									{category.icon}
								</span>
								{!isCollapsed && (
									<>
										<p className="text-[13px] font-medium">{category.name}</p>
										<span
											className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded"
											style={{
												backgroundColor: `${category.color}20`,
												color: category.color
											}}
										>
											{categoryCounts[category.name] || 0}
										</span>
									</>
								)}
								{isCollapsed && (
									<span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
										{category.name}
									</span>
								)}
							</button>
						))}
					{!isCollapsed && (
						<div className="h-px bg-border-dark/50 my-2 mx-2"></div>
					)}
					{categories
						.filter((cat) => cat.id === "archived")
						.map((category) => (
							<button
								key={category.id}
								onClick={() => handleCategoryClick("Archived")}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
									activeCategory === "Archived"
										? "bg-primary/10 text-primary border border-primary/10 shadow-glow"
										: "text-text-secondary hover:bg-white/5 hover:text-white"
								} ${isCollapsed ? "justify-center w-full" : ""}`}
								title={isCollapsed ? category.name : undefined}
								style={
									activeCategory === "Archived"
										? {
												borderColor: `${category.color}40`,
												backgroundColor: `${category.color}10`,
												color: category.color
										  }
										: {}
								}
							>
								<span
									className={`material-symbols-outlined flex-shrink-0 transition-colors ${
										isCollapsed ? "text-[24px]" : "text-[20px]"
									}`}
									style={
										activeCategory === "Archived"
											? { color: category.color }
											: {}
									}
								>
									{category.icon}
								</span>
								{!isCollapsed && (
									<>
										<p className="text-[13px] font-medium">{category.name}</p>
										<span
											className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded"
											style={{
												backgroundColor: `${category.color}20`,
												color: category.color
											}}
										>
											{categoryCounts[category.name] || 0}
										</span>
									</>
								)}
								{isCollapsed && (
									<span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
										{category.name}
									</span>
								)}
							</button>
						))}
				</nav>
			</div>
			<div
				className={`p-6 border-t border-border-dark/50 flex flex-col gap-6 ${
					isCollapsed ? "items-center" : ""
				}`}
			>
				<button
					onClick={onNewProjectClick}
					className={`group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-9 px-4 bg-white text-black hover:bg-gray-200 transition-colors text-[13px] font-semibold shadow-md relative ${
						isCollapsed ? "px-2" : ""
					}`}
					title={isCollapsed ? "New Project" : undefined}
				>
					<span className="material-symbols-outlined text-[18px]">add</span>
					{!isCollapsed && <span>New Project</span>}
					{isCollapsed && (
						<span className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border-dark">
							New Project
						</span>
					)}
				</button>
			</div>
		</aside>
	);
};
