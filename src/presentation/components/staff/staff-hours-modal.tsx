"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  NumberInput, 
  Group, 
  Stack, 
  Text, 
  SimpleGrid, 
  Paper,
  Divider,
  Box 
} from "@mantine/core";
import { IconCalculator, IconCurrencyDollar } from "@tabler/icons-react"; // O lucide-react si prefieres
import type { Staff } from "@/src/core/entities";

interface StaffHoursModalProps {
  staff: Staff | null;
  onClose: () => void;
  onSave: (data: any) => void; // Aquí pasaremos los datos al padre/backend
}

export const StaffHoursModal = ({ staff, onClose, onSave }: StaffHoursModalProps) => {
  // Estado para las horas de cada día
  const [hours, setHours] = useState({
    lunes: 0,
    martes: 0,
    miercoles: 0,
    jueves: 0,
    viernes: 0,
    sabado: 0,
    domingo: 0,
  });

  // Estado para el valor hora
  const [hourlyRate, setHourlyRate] = useState<number | string>(0);
  const [totalPay, setTotalPay] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  // Calcular totales cada vez que cambian las horas o el valor
  useEffect(() => {
    const sumHours = Object.values(hours).reduce((acc, curr) => acc + curr, 0);
    const rate = typeof hourlyRate === 'number' ? hourlyRate : 0;
    
    setTotalHours(sumHours);
    setTotalPay(sumHours * rate);
  }, [hours, hourlyRate]);

  const handleHourChange = (day: keyof typeof hours, value: number | string) => {
    setHours(prev => ({
      ...prev,
      [day]: typeof value === 'number' ? value : 0
    }));
  };

  const handleSave = () => {
    const summary = {
      staffId: staff?.id,
      weekData: hours,
      hourlyRate,
      totalHours,
      totalPay
    };
    onSave(summary);
  };

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Cargando horas para: <Text span fw={700} c="white">{staff?.firstName} {staff?.lastName}</Text>
      </Text>

      {/* Grid para los días de la semana */}
      <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
        {Object.keys(hours).map((day) => (
          <NumberInput
            key={day}
            label={day.charAt(0).toUpperCase() + day.slice(1)}
            placeholder="0"
            min={0}
            max={24}
            allowNegative={false}
            value={hours[day as keyof typeof hours]}
            onChange={(val) => handleHourChange(day as keyof typeof hours, val)}
            styles={{
              input: { backgroundColor: "#0f0f0f", borderColor: "#2d2d2d", color: "white" },
              label: { color: "#9ca3af", textTransform: 'capitalize' }
            }}
          />
        ))}
      </SimpleGrid>

      <Divider my="sm" color="#2d2d2d" />

      {/* Input de Valor Hora */}
      <NumberInput
        label="Valor por Hora ($)"
        placeholder="Ej: 2500"
        min={0}
        allowNegative={false}
        thousandSeparator="."
        decimalSeparator=","
        leftSection={<Text size="xs">$</Text>}
        value={hourlyRate}
        onChange={setHourlyRate}
        size="md"
        styles={{
          input: { backgroundColor: "#0f0f0f", borderColor: "#2d2d2d", color: "white", fontWeight: 'bold' },
          label: { color: "#orange" }
        }}
      />

      {/* Resumen de Pago (Tarjeta destacada) */}
      <Paper p="md" radius="md" style={{ backgroundColor: "#25262b", border: "1px solid #373a40" }}>
        <Group justify="space-between" mb={5}>
          <Text c="dimmed" size="sm">Total Horas:</Text>
          <Text fw={700} c="white">{totalHours} hs</Text>
        </Group>
        <Divider mb={10} color="#373a40" />
        <Group justify="space-between" align="center">
          <Text size="lg" fw={700} c="orange">TOTAL A PAGAR:</Text>
          <Text size="xl" fw={900} c="green" style={{ fontSize: '1.8rem' }}>
            $ {totalPay.toLocaleString('es-AR')}
          </Text>
        </Group>
      </Paper>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose} styles={{ root: { backgroundColor: "transparent", borderColor: "#2d2d2d", color: "white" } }}>
          Cancelar
        </Button>
        <Button color="green" onClick={handleSave}>
          Confirmar y Guardar
        </Button>
      </Group>
    </Stack>
  );
};