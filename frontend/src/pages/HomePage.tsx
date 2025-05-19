import { useState } from "react";
import { 
  Alert, 
  Box, 
  Container, 
  Paper, 
  Snackbar, 
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import InputForm from "../components/InputForm";
import ResultsDisplay from "../components/ResultsDisplay";
import { greenplumApi } from "../services/api";
import { InputParams, OutputParams } from "../types";
import StorageIcon from "@mui/icons-material/Storage";

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OutputParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (params: InputParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await greenplumApi.calculateStorage(params);
      setResults(response.data);
      // Прокрутка к результатам на мобильных устройствах
      if (isMobile && window) {
        setTimeout(() => {
          window.scrollTo({
            top: window.innerHeight * 0.6,
            behavior: 'smooth'
          });
        }, 500);
      }
    } catch (err) {
      setError("Ошибка при расчете параметров. Пожалуйста, попробуйте еще раз.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header with gradient background - адаптирован для мобильных */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          pt: { xs: 3, sm: 4, md: 6 },
          pb: { xs: 6, sm: 8, md: 12 },
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: { xs: "15%", sm: "25%", md: "30%" },
            background: `linear-gradient(to top, ${theme.palette.background.default}, transparent)`,
            pointerEvents: "none"
          }
        }}
      >
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" }, 
              alignItems: { xs: "flex-start", sm: "center" }, 
              mb: { xs: 1.5, sm: 2 } 
            }}
          >
            <StorageIcon sx={{ fontSize: { xs: 28, sm: 32 }, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }} />
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" } }}
            >
              Greenplum Sizer
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.85, 
              maxWidth: "800px", 
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: "1.1rem", sm: "1.25rem" }
            }}
          >
            Калькулятор параметров хранилища Greenplum
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              opacity: 0.7, 
              maxWidth: "600px",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}
          >
            Введите параметры для расчета оптимальной конфигурации хранилища данных
          </Typography>
        </Container>
      </Box>

      {/* Content with elevated position - адаптирован для мобильных */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: { xs: -4, sm: -6, md: -8 }, 
          position: "relative", 
          zIndex: 1,
          pb: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            mb: { xs: 3, sm: 4 }, 
            borderRadius: { xs: 2, sm: 3 },
            overflow: "hidden",
            position: "relative"
          }}
        >
          <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
        </Paper>

        {results && (
          <Box sx={{ mt: { xs: 3, sm: 4 } }}>
            <ResultsDisplay results={results} />
          </Box>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ 
            vertical: 'bottom', 
            horizontal: isMobile ? 'center' : 'right' 
          }}
          sx={{
            bottom: { xs: 16, sm: 24 }
          }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default HomePage;
