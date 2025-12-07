import { useThemeStore } from "../store/themeStore";
import light from "../theme/light";
import dark from "../theme/dark";

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));
  const colors = theme === "light" ? light : dark;

  return { theme, colors, toggleTheme };
};
