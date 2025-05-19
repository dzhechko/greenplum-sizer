import { useState } from "react";
import { 
  Box,
  Button, 
  FormControl, 
  FormHelperText, 
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  Select, 
  Stack, 
  TextField, 
  Typography,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";
import { InputParams, LoadLevel } from "../types";

interface InputFormProps {
  onSubmit: (params: InputParams) => void;
  isLoading?: boolean;
}

const InputForm = ({ onSubmit, isLoading = false }: InputFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sizeTb, setSizeTb] = useState<number | "">("");
  const [loadLevel, setLoadLevel] = useState<LoadLevel>("средняя");
  const [sizeError, setSizeError] = useState<string>("");

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSizeTb("");
      setSizeError("");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setSizeError("Пожалуйста, введите числовое значение");
      return;
    }

    if (numValue <= 0) {
      setSizeError("Значение должно быть больше 0");
      return;
    }

    setSizeTb(numValue);
    setSizeError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof sizeTb !== "number" || sizeError) {
      setSizeError("Пожалуйста, введите корректное значение");
      return;
    }

    onSubmit({
      size_tb: sizeTb,
      load_level: loadLevel,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={{ xs: 2.5, sm: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: { xs: 0.5, sm: 1 },
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            fontWeight: 600,
            color: "primary.main",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 3,
              bgcolor: "primary.main",
              borderRadius: 1.5,
              display: { xs: "none", sm: "block" }
            }
          }}
        >
          Параметры хранилища Greenplum
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap', 
          mx: { xs: -1, sm: -1.5 },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ 
            width: { xs: '100%', sm: '50%' }, 
            p: { xs: 1, sm: 1.5 }
          }}>
            <FormControl fullWidth variant="outlined">
              <TextField
                fullWidth
                label="Размер хранилища (ТБ)"
                value={sizeTb}
                onChange={handleSizeChange}
                error={!!sizeError}
                helperText={sizeError || "Введите размер хранилища в ТБ (несжатые данные)"}
                type="number"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <StorageIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: { xs: 56, sm: "auto" },
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(46, 125, 50, 0.1)",
                    }
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.95rem", sm: "1rem" }
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.8rem" }
                  }
                }}
              />
            </FormControl>
          </Box>

          <Box sx={{ 
            width: { xs: '100%', sm: '50%' }, 
            p: { xs: 1, sm: 1.5 }
          }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Уровень нагрузки</InputLabel>
              <Select
                value={loadLevel}
                onChange={(e) => setLoadLevel(e.target.value as LoadLevel)}
                label="Уровень нагрузки"
                startAdornment={
                  <InputAdornment position="start">
                    <SpeedIcon color="primary" />
                  </InputAdornment>
                }
                sx={{
                  height: { xs: 56, sm: "auto" },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 4px rgba(46, 125, 50, 0.1)",
                  },
                  ".MuiSelect-select": {
                    display: "flex",
                    alignItems: "center"
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 250,
                      "& .MuiMenuItem-root": {
                        minHeight: 48,
                        px: 2
                      }
                    }
                  }
                }}
              >
                <MenuItem value="низкая">Низкая</MenuItem>
                <MenuItem value="средняя">Средняя</MenuItem>
                <MenuItem value="высокая">Высокая</MenuItem>
              </Select>
              <FormHelperText sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
                Выберите ожидаемый уровень нагрузки на хранилище
              </FormHelperText>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 1, sm: 3 } }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading || !sizeTb || !!sizeError}
            sx={{ 
              py: { xs: 1.75, sm: 1.5 },
              fontSize: { xs: "0.95rem", sm: "1rem" },
              position: "relative",
              overflow: "hidden",
              "&:active": {
                transform: "scale(0.98)"
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.1)",
                transform: isLoading ? "translateX(0%)" : "translateX(-100%)",
                transition: "transform 0.6s ease",
              }
            }}
          >
            {isLoading ? "Выполняется расчет..." : "Рассчитать параметры"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default InputForm;
