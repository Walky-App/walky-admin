import React from "react";
import "./PopularitySelector.css";

type PopularityOption = "least" | "most";

interface PopularitySelectorProps {
  selected: PopularityOption;
  onChange: (option: PopularityOption) => void;
}

const PopularitySelector: React.FC<PopularitySelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div
      className="popularity-selector"
      role="radiogroup"
      aria-label="Popularity filter"
    >
      <button
        data-testid="popularity-selector-least"
        role="radio"
        aria-checked={selected === "least"}
        className={`popularity-option ${
          selected === "least" ? "" : "selected"
        }`}
        onClick={() => onChange("least")}
      >
        Least popular
      </button>
      <button
        data-testid="popularity-selector-most"
        role="radio"
        aria-checked={selected === "most"}
        className={`popularity-option popularity-option-right ${
          selected === "most" ? "selected" : ""
        }`}
        onClick={() => onChange("most")}
      >
        Most popular
      </button>
    </div>
  );
};

export default PopularitySelector;
