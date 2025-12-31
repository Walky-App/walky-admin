import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./ChangeCategoryModal.css";

export interface CategoryOption {
  _id: string;
  name: string;
}

interface ChangeCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (categoryId: string) => void;
  currentCategory?: string;
  categories: CategoryOption[];
  spaceName: string;
  isLoading?: boolean;
}

const ChangeCategoryModal: React.FC<ChangeCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentCategory,
  categories,
  spaceName,
  isLoading = false,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    currentCategory || ""
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (currentCategory) {
      setSelectedCategoryId(currentCategory);
    }
  }, [currentCategory]);

  useEffect(() => {
    if (isDropdownOpen && categoryButtonRef.current) {
      const rect = categoryButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (selectedCategoryId) {
      onConfirm(selectedCategoryId);
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat._id === selectedCategoryId
  );
  const displayName = selectedCategory?.name || "Select a category";

  return (
    <div className="change-category-overlay" onClick={handleOverlayClick}>
      <div className="change-category-content" onClick={handleContentClick}>
        <button
          data-testid="change-category-close-btn"
          className="change-category-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AssetIcon name="close-button" size={16} />
        </button>

        <div className="change-category-body">
          <h2 className="change-category-title">Change category</h2>

          <p className="change-category-description">
            Update the category for <strong>{spaceName}</strong>. This will help
            users find the space more easily.
          </p>

          <div className="change-category-select-container">
            <label className="change-category-label">Select a category</label>
            <div className="change-category-dropdown-wrapper">
              <button
                ref={categoryButtonRef}
                data-testid="change-category-dropdown-btn"
                className="change-category-select"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{displayName}</span>
                <AssetIcon name="arrow-down" size={16} />
              </button>
              {isDropdownOpen &&
                createPortal(
                  <div
                    ref={categoryDropdownRef}
                    className="change-category-dropdown"
                    style={{
                      position: "absolute",
                      top: `${menuPosition.top}px`,
                      left: `${menuPosition.left}px`,
                      minWidth: `${menuPosition.width}px`,
                    }}
                  >
                    {categories.map((category) => (
                      <button
                        data-testid="change-category-option-btn"
                        key={category._id}
                        className={`change-category-option ${
                          category._id === selectedCategoryId ? "selected" : ""
                        }`}
                        onClick={() => handleCategorySelect(category._id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>,
                  document.body
                )}
            </div>
          </div>

          <div className="change-category-buttons">
            <button
              data-testid="change-category-cancel-btn"
              className="change-category-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              data-testid="change-category-confirm-btn"
              className="change-category-confirm"
              onClick={handleSave}
              disabled={!selectedCategoryId || isLoading}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCategoryModal;
