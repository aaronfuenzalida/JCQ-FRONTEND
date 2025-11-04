"use client";

import { useEffect } from "react";
import { Header } from "@/src/presentation/components/layout/header";
import {
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Box,
  Paper,
  Loader,
} from "@mantine/core";
import { useDashboardStore } from "@/src/presentation/stores";
import { FolderKanban, Users, CreditCard, TrendingUp } from "lucide-react";
import { formatARS } from "@/src/presentation/utils";

export default function DashboardPage() {
  const { dashboardData, isLoading, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    // Fetch dashboard data when entering the view
    fetchDashboard();
  }, [fetchDashboard]);

  // Use data from API or show loading
  const stats = dashboardData
    ? [
        {
          title: "Proyectos Activos",
          value: dashboardData.stats.activeProjects,
          icon: FolderKanban,
          color: "#ff6b35",
          bgColor: "#2d1810",
        },
        {
          title: "Total Clientes",
          value: dashboardData.stats.totalClients,
          icon: Users,
          color: "#3b82f6",
          bgColor: "#1e293b",
        },
        {
          title: "Cobrado Total",
          value: formatARS(dashboardData.stats.totalCollected),
          icon: TrendingUp,
          color: "#10b981",
          bgColor: "#064e3b",
        },
        {
          title: "Pendiente",
          value: formatARS(dashboardData.stats.totalPending),
          icon: CreditCard,
          color: "#f59e0b",
          bgColor: "#78350f",
        },
      ]
    : [];

  return (
    <Box>
      <Header
        title="Dashboard"
        description="Resumen general de proyectos y finanzas"
      />

      <Box p="xl">
        {isLoading ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "3rem 0",
            }}
          >
            <Loader size="lg" color="orange" />
          </Box>
        ) : (
          <>
            {/* Stats Grid */}
            <Grid gutter="lg" mb="xl">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Grid.Col
                    key={stat.title}
                    span={{ base: 12, xs: 6, sm: 6, md: 3 }}
                  >
                    <Card
                      padding="lg"
                      radius="md"
                      withBorder
                      style={{
                        backgroundColor: "#1a1a1a",
                        borderColor: "#2d2d2d",
                      }}
                    >
                      <Group justify="space-between" align="center">
                        <Stack gap={4}>
                          <Text size="sm" c="#9ca3af">
                            {stat.title}
                          </Text>
                          <Text size="xl" fw={700} c="white">
                            {stat.value}
                          </Text>
                        </Stack>
                        <div
                          style={{
                            backgroundColor: stat.bgColor,
                            color: stat.color,
                            padding: "12px",
                            borderRadius: "8px",
                          }}
                        >
                          <Icon size={24} />
                        </div>
                      </Group>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>

            {/* Recent Projects */}
            <Card
              padding="lg"
              radius="md"
              withBorder
              style={{
                backgroundColor: "#1a1a1a",
                borderColor: "#2d2d2d",
              }}
            >
              <Text size="lg" fw={600} c="white" mb="md">
                Proyectos Recientes
              </Text>

              {!dashboardData || dashboardData.recentProjects.length === 0 ? (
                <Text ta="center" c="#9ca3af" py="xl">
                  No hay proyectos recientes
                </Text>
              ) : (
                <Stack gap="md">
                  {dashboardData.recentProjects.map((project) => (
                    <Paper
                      key={project.id}
                      p="md"
                      radius="md"
                      withBorder
                      style={{
                        backgroundColor: "#0a0a0a",
                        borderColor: "#2d2d2d",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#0a0a0a";
                      }}
                    >
                      <Group justify="space-between" align="center">
                        <Stack gap={4}>
                          <Text fw={500} c="white">
                            {project.clientName}
                          </Text>
                          <Text size="sm" c="#9ca3af">
                            {project.locationAddress}
                          </Text>
                        </Stack>
                        <Stack gap={4} align="flex-end">
                          <Text fw={600} c="white">
                            {formatARS(project.amount)}
                          </Text>
                          <Text size="sm" c="#9ca3af">
                            Pagado: {formatARS(project.totalPaid)}
                          </Text>
                        </Stack>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
}
