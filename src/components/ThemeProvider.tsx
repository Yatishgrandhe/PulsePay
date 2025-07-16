"use client";

import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

// Custom Material Design theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1E3A8A",
      light: "#3B82F6",
      dark: "#1E40AF",
    },
    secondary: {
      main: "#9CA3AF",
      light: "#D1D5DB",
      dark: "#6B7280",
    },
    background: {
      default: "#FAFBFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: "3.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.125rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 28,
          padding: "12px 32px",
        },
        contained: {
          boxShadow: "0 4px 20px rgba(30, 58, 138, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 25px rgba(30, 58, 138, 0.4)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.04)",
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
} 