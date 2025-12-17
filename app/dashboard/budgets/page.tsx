"use client";

import { useEffect } from "react";
import { Header } from "@/src/presentation/components/layout/header";
import { useBudgetsStore } from "@/src/presentation/stores/budget.store";
import { 
  Grid, 
  Card, 
  Text, 
  Box, 
  LoadingOverlay 
} from "@mantine/core";
import { BudgetForm } from "@/src/presentation/components/budgets/budget-form";
import { BudgetHistory } from "@/src/presentation/components/budgets/budget-history";

export default function BudgetsPage() {
  const { fetchBudgets, isLoading } = useBudgetsStore();

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return (
    <Box>
      <Header title="Gestión de Presupuestos" /> 

      <Box p="md">
        <Grid gutter="md">
          
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Box pos="relative">
                <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                
                <Text fw={700} size="lg" mb="md" c="dimmed">
                  Nuevo Presupuesto
                </Text>
                
                <BudgetForm />
              </Box>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Text fw={700} size="lg" mb="md" c="dimmed">
                Historial Reciente
              </Text>
              
              <BudgetHistory />
            </Card>
          </Grid.Col>

        </Grid>
      </Box>
    </Box>
  );
}