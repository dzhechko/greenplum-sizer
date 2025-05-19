import { useState } from "react";
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { InputParams, LoadLevel } from "../types";

interface InputFormProps {
  onSubmit: (params: InputParams) => void;
  isLoading?: boolean;
}

const InputForm = ({ onSubmit, isLoading = false }: InputFormProps) => {
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
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="h6">Параметры хранилища Greenplum</Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Размер хранилища (ТБ)"
            value={sizeTb}
            onChange={handleSizeChange}
            error={!!sizeError}
            helperText={sizeError || "Введите размер хранилища в ТБ (несжатые данные)"}
            type="number"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Уровень нагрузки</InputLabel>
            <Select
              value={loadLevel}
              onChange={(e) => setLoadLevel(e.target.value as LoadLevel)}
              label="Уровень нагрузки"
            >
              <MenuItem value="низкая">Низкая</MenuItem>
              <MenuItem value="средняя">Средняя</MenuItem>
              <MenuItem value="высокая">Высокая</MenuItem>
            </Select>
            <FormHelperText>
              Выберите ожидаемый уровень нагрузки на хранилище
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading || !sizeTb || !!sizeError}
          >
            {isLoading ? "Расчет..." : "Рассчитать параметры"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default InputForm;
