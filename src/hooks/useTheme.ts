import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

// Hook to use theme context
export const useTheme = () => useContext(ThemeContext);
