import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Layout from "./components/Layout";

export default function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0f172a",
        paper: "rgba(30,41,59,0.85)",
      },
      primary: {
        main: "#60a5fa",
      },
      text: {
        primary: "#e2e8f0",
      },
    },
    typography: {
      fontFamily: "'Inter','Poppins',sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          transition: "background-color 0.4s linear",
        }}
      >
        <Layout />
      </Box>
    </ThemeProvider>
  );
}
