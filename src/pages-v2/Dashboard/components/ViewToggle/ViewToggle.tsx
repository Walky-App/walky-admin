import React from "react";
import { AssetIcon } from "../../../../components-v2";
import "./ViewToggle.css";

type ViewType = "grid" | "list";

interface ViewToggleProps {
  selected: ViewType;
  onChange: (view: ViewType) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ selected, onChange }) => {
  return (
    <div className="view-toggle" role="group" aria-label="View mode selector">
      <button
        data-testid="view-toggle-grid"
        className={`view-option ${selected === "grid" ? "selected" : ""}`}
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        aria-pressed={selected === "grid"}
      >
        <AssetIcon name="grid-icon" size={18} aria-hidden="true" />
      </button>
      <button
        data-testid="view-toggle-list"
        className={`view-option ${selected === "list" ? "selected" : ""}`}
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={selected === "list"}
      >
        <AssetIcon name="table-icon" size={18} aria-hidden="true" />
      </button>
    </div>
  );
};

export default ViewToggle;
