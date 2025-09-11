import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toggleTheme } from "../../features/ui/theme";
import { useDispatch, useSelector } from "react-redux";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Apply the theme to <html> when mode changes
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
  }, [mode]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleTheme}
      className="gap-2">
      {mode === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
