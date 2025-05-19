import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import DnsIcon from "@mui/icons-material/Dns";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import { OutputParams } from "../types";

interface ResultsDisplayProps {
  results: OutputParams;
}

interface ResultItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

const ResultItem = ({ icon, label, value, color = "primary.main" }: ResultItemProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      width: { xs: '100%', sm: '100%', md: '50%' }, // На мобильных всегда в один столбец
      p: { xs: 1, sm: 1.25 }
    }}>
      <Card
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          height: "100%",
          border: "1px solid",
          borderColor: "divider",
          transition: "all 0.2s ease-in-out",
          // Заменяем hover на active для мобильных
          ...(isMobile 
            ? { 
                "&:active": {
                  transform: "translateY(-2px)",
                  boxShadow: 2,
                  borderColor: "transparent" 
                }
              } 
            : { 
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                  borderColor: "transparent"
                }
              }
          )
        }}
      >
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={{ xs: 1.5, sm: 2 }} 
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box
            sx={{
              bgcolor: `${color}15`,
              borderRadius: 2,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: { xs: "flex-start", sm: "center" }
            }}
          >
            {icon}
          </Box>
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              {label}
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h6"} 
              fontWeight="medium" 
              sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
            >
              {value}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const resultItems = [
    {
      icon: <ComputerIcon color="primary" />,
      label: "Тип хоста",
      value: results.host_type
    },
    {
      icon: <DnsIcon color="primary" />,
      label: "Количество хостов",
      value: results.host_count
    },
    {
      icon: <DeviceHubIcon color="primary" />,
      label: "Сегментов на хост",
      value: results.segments_per_host
    },
    {
      icon: <MemoryIcon color="primary" />,
      label: "Всего vCPU",
      value: results.total_vcpu
    },
    {
      icon: <DeviceHubIcon color="primary" />,
      label: "Всего сегментов",
      value: results.total_segments
    },
    {
      icon: <StorageIcon color="primary" />,
      label: "Размер дисков на хост (ТБ)",
      value: results.disks_per_host_tb
    },
    {
      icon: <StorageIcon color="primary" />,
      label: "Тип дисков",
      value: results.disk_type
    },
    {
      icon: <SpeedIcon color="primary" />,
      label: "Рекомендуемая конфигурация VM",
      value: results.master_recommendation
    }
  ];

  return (
    <Card 
      elevation={2} 
      sx={{ 
        overflow: "hidden",
        borderRadius: { xs: 2, sm: 3 } 
      }}
    >
      <Box 
        sx={{ 
          bgcolor: "primary.main", 
          color: "primary.contrastText", 
          py: { xs: 1.5, sm: 2 }, 
          px: { xs: 2, sm: 3 } 
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="medium"
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
        >
          Результаты расчета
        </Typography>
      </Box>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          mx: { xs: -1, sm: -1.25 },
          // На мобильных большие отступы между карточками
          gap: { xs: 1, sm: 0 }
        }}>
          {resultItems.map((item, index) => (
            <ResultItem
              key={index}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
