import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title="Toggle Day/Night Mode"
      className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border)]"
      style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
