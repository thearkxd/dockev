import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOption: string;
  onFilterChange: (option: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
}

export const Header = ({
  searchQuery,
  onSearchChange,
  filterOption,
  onFilterChange,
  sortOption,
  onSortChange,
}: HeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = [
    { value: "all", label: "All Projects" },
    { value: "recent", label: "Recently Opened" },
    { value: "favorites", label: "Favorites" },
    { value: "archived", label: "Archived" },
  ];

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "recent", label: "Recently Opened" },
    { value: "oldest", label: "Oldest First" },
    { value: "category", label: "Category" },
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark/60 px-8 py-5 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-white text-lg font-medium tracking-tight">
          Overview
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-3 items-center">
        <div className="relative w-full max-w-sm group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors text-[18px]">
              search
            </span>
          </div>
          <input
            className="block w-full pl-10 pr-12 py-2 bg-surface-dark/50 border border-border-dark rounded-lg text-sm text-white placeholder-text-secondary/70 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-light"
            placeholder="Search projects..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-10 pr-3 flex items-center text-text-secondary hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                close
              </span>
            </button>
          )}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] text-text-secondary bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>
        </div>
        <div className="w-px h-6 bg-border-dark mx-1"></div>
        <div className="flex gap-2">
          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className={`flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-white/5 border transition-all text-text-secondary hover:text-white ${
                filterOption !== "all"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-transparent hover:border-white/10"
              }`}
              title="Filter"
            >
              <span className="material-symbols-outlined text-[20px]">
                tune
              </span>
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark border border-border-dark rounded-lg shadow-2xl py-1 z-50">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterChange(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                      filterOption === option.value
                        ? "bg-primary/10 text-primary"
                        : "text-white hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        filterOption === option.value ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      check
                    </span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Button */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className={`flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-white/5 border transition-all text-text-secondary hover:text-white ${
                sortOption !== "recent"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-transparent hover:border-white/10"
              }`}
              title="Sort"
            >
              <span className="material-symbols-outlined text-[20px]">sort</span>
            </button>
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark border border-border-dark rounded-lg shadow-2xl py-1 z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                      sortOption === option.value
                        ? "bg-primary/10 text-primary"
                        : "text-white hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        sortOption === option.value ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      check
                    </span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

