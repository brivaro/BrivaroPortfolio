import { useContext } from "react";
import DarkModeContext from "../context/DarkModeContext";

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode debe usarse dentro de un DarkModeProvider");
  }
  return context;
}