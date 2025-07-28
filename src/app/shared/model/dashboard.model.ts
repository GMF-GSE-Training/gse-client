export interface MonthlyStats {
  month: number;
  akanDatang: number;
  sedangBerjalan: number;
  selesai: number;
  total: number;
}

export interface DashboardStatsResponse {
  year: number;
  monthlyStats: MonthlyStats[];
  totalStats: {
    akanDatang: number;
    sedangBerjalan: number;
    selesai: number;
    total: number;
  };
  availableYears: number[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  barThickness: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}
