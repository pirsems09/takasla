import { useThemeStore } from "../store/themeStore";
import light from "../theme/light";
import dark from "../theme/dark";
import { ThemeColors, Theme } from "../theme/types";

export const useTheme = (): {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
} => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const colors: ThemeColors = theme === "light" ? light : dark;

  return { theme, colors, toggleTheme };
};
