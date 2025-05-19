import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import HomePage from "./pages/HomePage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32", // Green color for Greenplum theme
    },
    secondary: {
      main: "#0288d1",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
