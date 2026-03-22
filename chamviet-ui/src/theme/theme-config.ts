import type { CommonColors } from "@mui/material/styles";

import type { ThemeCssVariables } from "./types";
import type { PaletteColorNoChannels } from "./core/palette";

// ----------------------------------------------------------------------

type ThemeConfig = {
    classesPrefix: string;
    cssVariables: ThemeCssVariables;
    fontFamily: Record<"primary" | "secondary", string>;
    palette: Record<"primary" | "secondary" | "info" | "success" | "warning" | "error", PaletteColorNoChannels> & {
        common: Pick<CommonColors, "black" | "white">;
        grey: Record<"50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900", string>;
    };
};

export const themeConfig: ThemeConfig = {
    /** **************************************
     * Base
     *************************************** */
    classesPrefix: "minimal",
    /** **************************************
     * Typography
     *************************************** */
    fontFamily: {
        primary: "Be Vietnam Pro, sans-serif",
        secondary: "Be Vietnam Pro, sans-serif"
    },
    /** **************************************
     * Palette
     *************************************** */
    palette: {
        primary: {
            lighter: "#FDE8E8",
            light: "#F08A8A",
            main: "#a83232",
            dark: "#8a2828",
            darker: "#5C1515",
            contrastText: "#FFFFFF"
        },
        secondary: {
            lighter: "#FDF5E6",
            light: "#EAD09D",
            main: "#d9a441",
            dark: "#7a5230",
            darker: "#3b291a",
            contrastText: "#FFFFFF"
        },
        info: {
            lighter: "#CAFDF5",
            light: "#61F3F3",
            main: "#00B8D9",
            dark: "#006C9C",
            darker: "#003768",
            contrastText: "#FFFFFF"
        },
        success: {
            lighter: "#D3FCD2",
            light: "#77ED8B",
            main: "#22C55E",
            dark: "#118D57",
            darker: "#065E49",
            contrastText: "#ffffff"
        },
        warning: {
            lighter: "#FFF5CC",
            light: "#FFD666",
            main: "#FFAB00",
            dark: "#B76E00",
            darker: "#7A4100",
            contrastText: "#1C252E"
        },
        error: {
            lighter: "#FFE9D5",
            light: "#FFAC82",
            main: "#FF5630",
            dark: "#B71D18",
            darker: "#7A0916",
            contrastText: "#FFFFFF"
        },
        grey: {
            "50": "#fdfbf7",
            "100": "#f8f6f6",
            "200": "#F4F6F8",
            "300": "#DFE3E8",
            "400": "#C4CDD5",
            "500": "#919EAB",
            "600": "#64748b",
            "700": "#475569",
            "800": "#334155",
            "900": "#0f172a"
        },
        common: { black: "#000000", white: "#FFFFFF" }
    },
    /** **************************************
     * Css variables
     *************************************** */
    cssVariables: {
        cssVarPrefix: "",
        colorSchemeSelector: "data-color-scheme"
    }
};
