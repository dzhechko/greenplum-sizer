import { CssBaseline, ThemeProvider } from "@mui/material";
import HomePage from "./pages/HomePage";
import theme from "./utils/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
