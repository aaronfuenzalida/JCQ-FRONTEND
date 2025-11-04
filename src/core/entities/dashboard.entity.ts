export interface DashboardStats {
  activeProjects: number;
  totalClients: number;
  totalCollected: number;
  totalPending: number;
}

export interface RecentProject {
  id: string;
  clientName: string;
  locationAddress: string;
  amount: number;
  totalPaid: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentProjects: RecentProject[];
}

