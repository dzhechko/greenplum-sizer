import { Card, CardContent, Divider, Grid, Paper, Typography } from "@mui/material";
import { OutputParams } from "../types";

interface ResultsDisplayProps {
  results: OutputParams;
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const resultItems = [
    { label: "Тип хоста", value: results.host_type },
    { label: "Количество хостов", value: results.host_count },
    { label: "Сегментов на хост", value: results.segments_per_host },
    { label: "Всего vCPU", value: results.total_vcpu },
    { label: "Всего сегментов", value: results.total_segments },
    { label: "Размер дисков на хост (ТБ)", value: results.disks_per_host_tb },
    { label: "Тип дисков", value: results.disk_type },
    { label: "Рекомендуемая конфигурация VM", value: results.master_recommendation }
  ];

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Результаты расчета
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {resultItems.map((item, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  {item.label}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {item.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
