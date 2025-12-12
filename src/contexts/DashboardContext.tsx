import React, { createContext, useContext, useState, ReactNode } from "react";
import { TimePeriod } from "../components-v2";

interface DashboardContextType {
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  return (
    <DashboardContext.Provider value={{ timePeriod, setTimePeriod }}>
      {children}
    </DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
