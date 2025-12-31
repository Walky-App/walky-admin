import React from "react";
import { useTheme } from "../../../../hooks/useTheme";
import "./TimeSelector.css";

type TimePeriod = "all-time" | "week" | "month";

interface TimeSelectorProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selected,
  onChange,
}) => {
  const { theme } = useTheme();
  const options: { value: TimePeriod; label: string }[] = [
    { value: "all-time", label: "All time" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  const selectorStyle: React.CSSProperties = {
    // Themed CSS vars so the component respects light/dark
    ["--time-selector-bg" as string]: theme.colors.cardBg,
    ["--time-selector-border" as string]: theme.colors.borderColor,
    ["--time-selector-text" as string]: theme.colors.bodyColor,
    ["--time-selector-hover-bg" as string]: theme.colors.bgHover,
    ["--time-selector-selected-bg" as string]: "#546fd9",
    ["--time-selector-selected-text" as string]: theme.colors.white,
    ["--time-selector-focus" as string]: theme.colors.focusRing,
  };

  return (
    <div
      className="ts-time-selector"
      role="tablist"
      aria-label="Time period selector"
      style={selectorStyle}
    >
      {options.map((option, index) => {
        const isSelected = selected === option.value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <button
            key={option.value}
            data-testid={`time-selector-${option.value}`}
            role="tab"
            aria-selected={isSelected}
            aria-label={`${option.label} period`}
            className={`ts-time-option ${isFirst ? "first" : ""} ${
              isLast ? "last" : ""
            } ${isSelected ? "selected" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
