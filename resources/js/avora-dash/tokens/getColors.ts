import { lightColors, darkColors } from "./colors";

export type ThemeMode = "light" | "dark";

export function getColors(mode: ThemeMode) {
    return mode === "dark" ? darkColors : lightColors;
}
