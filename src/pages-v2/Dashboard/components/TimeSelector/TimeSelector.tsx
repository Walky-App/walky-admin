import React from "react";
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
  const options: { value: TimePeriod; label: string }[] = [
    { value: "all-time", label: "All time" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  return (
    <div
      className="ts-time-selector"
      role="tablist"
      aria-label="Time period selector"
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
