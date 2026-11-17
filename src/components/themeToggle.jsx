import { useEffect, useState } from "react";

function ThemeToggle({ flotante = false }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );

    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={() => setDarkMode((prev) => !prev)}
      aria-label="Cambiar tema"
      className={`
        flex h-8 w-8 shrink-0 items-center justify-center
        border border-line bg-panel text-ink
        transition-colors hover:bg-hover
        ${flotante ? "fixed right-4 top-4 z-50" : ""}
      `}
    >
      <span className="text-[0.6rem] font-semibold uppercase tracking-widest">
        {darkMode ? "LIGHT" : "DARK"}
      </span>
    </button>
  );
}

export default ThemeToggle;
