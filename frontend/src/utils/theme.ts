import { createTheme } from "@mui/material/styles";

// Custom theme for Greenplum Sizer application
const theme = createTheme({
  palette: {
    primary: {
      light: "#4caf50",
      main: "#2E7D32", // Greenplum green
      dark: "#1b5e20",
      contrastText: "#fff",
    },
    secondary: {
      light: "#64b5f6",
      main: "#0288d1", // Blue accent
      dark: "#01579b",
      contrastText: "#fff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "1.1rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "10px 20px",
          boxShadow: "none",
        },
        contained: {
          backgroundImage: "linear-gradient(to right, #2E7D32, #43a047)",
          "&:hover": {
            backgroundImage: "linear-gradient(to right, #1b5e20, #2E7D32)",
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.05)",
        },
        elevation3: {
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme; 