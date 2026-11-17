import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Returns { theme, isDark, setTheme, toggleTheme }.
 * Must be used inside <ThemeProvider>.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return context;
}

export default useTheme;
