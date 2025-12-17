"use client";
import { useBudgetsStore } from "@/src/presentation/stores/budget.store";
import { BudgetPdfDocument } from "./budget-pdf";
import { Trash2, FileDown, FilePenLine, } from "lucide-react"; 
import { formatCurrency } from "@/src/presentation/utils/format-currency";
import { pdf } from "@react-pdf/renderer";
import { 
  Stack, 
  Text, 
  Group, 
  ActionIcon, 
  Badge, 
  ScrollArea, 
  Paper,
  Tooltip
} from "@mantine/core";

export const BudgetHistory = () => {
  const { budgetsList, deleteBudget, setSelectedBudget } = useBudgetsStore();

  const handleDownload = async (budget: any) => {
    try {
      const blob = await pdf(<BudgetPdfDocument budget={budget} />).toBlob();
      window.open(URL.createObjectURL(blob), '_blank');
    } catch (error) {
      console.error("Error al generar PDF", error);
    }
  }; 

  if (!budgetsList || budgetsList.length === 0) {
    return (
        <Text c="dimmed" size="sm" ta="center" py="xl">
            No hay historial reciente.
        </Text>
    );
  }

  return (
    <ScrollArea h={600} offsetScrollbars>
      <Stack gap="sm">
        {budgetsList.map((budget) => (
          <Paper key={budget.id} withBorder p="sm" radius="sm" shadow="xs" bg="gray.8">
            <Group justify="space-between" mb={4}>
                <Text size="sm" fw={600} lineClamp={1}>
                    {budget.client?.fullname || budget.manualClientName || "Sin Nombre"}
                </Text>
                <Badge variant="light" color="green">
                    {formatCurrency(budget.totalAmount)}
                </Badge>
            </Group>
            
            <Group justify="space-between" align="flex-end">
                <Text size="xs" c="dimmed">
                    {new Date(budget.date).toLocaleDateString()}
                </Text>
                
                <Group gap={4}>
                    <Tooltip label="Editar Presupuesto">
                        <ActionIcon 
                            variant="light" 
                            color="teal" 
                            size="md"
                            onClick={() => setSelectedBudget(budget)} // Carga los datos en el form
                        >
                            <FilePenLine size={16} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Descargar PDF">
                        <span>
                          <ActionIcon 
                          variant="light" 
                          color="blue" 
                          onClick={() => handleDownload(budget)} 
                          title="Descargar PDF"
                          >
                          <FileDown size={18} /> 
                          </ActionIcon>
                        </span>
                    </Tooltip>

                    <Tooltip label="Eliminar">
                        <ActionIcon 
                            variant="light" 
                            color="red" 
                            size="md"
                            onClick={() => {
                                if(confirm("¿Eliminar este presupuesto?")) deleteBudget(budget.id)
                            }}
                        >
                            <Trash2 size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    </ScrollArea>
  );
};