import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Category } from "../../types/Category";
import { DEFAULT_COLOR_PALETTE } from "../../utils/colorUtils";

interface CategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
  existingCategories: Category[];
}

const iconOptions = [
  "language",
  "smartphone",
  "database",
  "science",
  "archive",
  "work",
  "code",
  "folder",
  "web",
  "dns",
  "storage",
  "terminal",
  "settings",
  "extension",
  "widgets",
];

export function CategoryModal({
  isOpen,
  category,
  onClose,
  onSave,
  existingCategories,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("folder");
  const [color, setColor] = useState("#6366F1");
  const [isAnimating, setIsAnimating] = useState(false);

  const colorPalette = DEFAULT_COLOR_PALETTE;

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setIcon(category.icon);
        setColor(category.color);
      } else {
        setName("");
        setIcon("folder");
        setColor("#6366F1");
      }
      setTimeout(() => {
        setIsAnimating(true);
      }, 0);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, category]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    // Check if name already exists (excluding current category)
    const nameExists = existingCategories.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== category?.id
    );

    if (nameExists) {
      toast.error("A category with this name already exists");
      return;
    }

    const categoryData: Category = {
      id: category?.id || `category-${Date.now()}`,
      name: name.trim(),
      icon,
      color,
    };

    onSave(categoryData);
    toast.success(
      category ? `Category "${name.trim()}" updated!` : `Category "${name.trim()}" added!`
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative w-full max-w-md flex flex-col rounded-2xl bg-surface-dark shadow-2xl border border-border-dark/50 pointer-events-auto transition-all duration-300 ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 py-6 pb-2">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-white">
                {category ? "Edit Category" : "Add Category"}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {category
                  ? "Update category details"
                  : "Create a new project category"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="group rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">
                close
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            <div className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border-dark bg-surface-darker text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/5"
                  placeholder="e.g., Work, Personal, Open Source"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave();
                    }
                  }}
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((iconOption) => (
                    <button
                      key={iconOption}
                      onClick={() => setIcon(iconOption)}
                      className={`p-3 rounded-lg border transition-all ${
                        icon === iconOption
                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                          : "border-border-dark bg-surface-darker hover:border-primary/50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-white text-[20px]">
                        {iconOption}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Color
                </label>
                <div className="space-y-3">
                  {/* Predefined Palette */}
                  <div className="grid grid-cols-6 gap-2">
                    {colorPalette.map((paletteColor) => (
                      <button
                        key={paletteColor}
                        onClick={() => setColor(paletteColor)}
                        className={`aspect-square rounded-lg border-2 transition-all ${
                          color === paletteColor
                            ? "border-white scale-110 ring-2 ring-primary"
                            : "border-border-dark hover:border-white/50"
                        }`}
                        style={{ backgroundColor: paletteColor }}
                        title={paletteColor}
                      />
                    ))}
                  </div>

                  {/* Custom Color Input */}
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 rounded-lg border border-border-dark cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-border-dark bg-surface-darker text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/5"
                      placeholder="#6366F1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-8 py-6 pt-2">
            <button
              onClick={onClose}
              className="px-5 h-10 rounded-md border border-border-dark bg-surface-dark text-white text-sm font-medium hover:bg-surface-dark/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-5 h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {category ? "save" : "add"}
              </span>
              <span>{category ? "Save Changes" : "Add Category"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

