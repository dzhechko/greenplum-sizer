import { useState } from "react";
import { Alert, Box, Container, Paper, Snackbar, Typography } from "@mui/material";
import InputForm from "../components/InputForm";
import ResultsDisplay from "../components/ResultsDisplay";
import { greenplumApi } from "../services/api";
import { InputParams, OutputParams } from "../types";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OutputParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (params: InputParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await greenplumApi.calculateStorage(params);
      setResults(response.data);
    } catch (err) {
      setError("Ошибка при расчете параметров. Пожалуйста, попробуйте еще раз.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Калькулятор параметров хранилища Greenplum
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
          Введите параметры для расчета оптимальной конфигурации
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
        </Paper>

        {results && (
          <Box sx={{ mt: 4 }}>
            <ResultsDisplay results={results} />
          </Box>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default HomePage;
