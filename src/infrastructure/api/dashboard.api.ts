import apiClient from "./client";
import type { ApiResponse, DashboardData } from "@/src/core/entities";

/**
 * Get dashboard data with stats and recent projects
 */
export async function getDashboard(): Promise<DashboardData> {
  const response = await apiClient.get<ApiResponse<DashboardData>>(
    "/projects/dashboard"
  );
  return response.data.data;
}

