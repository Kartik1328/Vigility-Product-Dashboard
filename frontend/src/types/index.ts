export interface User {
  id: number;
  username: string;
  age: number;
  gender: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BarChartData {
  feature_name: string;
  total_clicks: number;
}

export interface LineChartData {
  date: string;
  count: number;
}

export interface AnalyticsResponse {
  barChart: BarChartData[];
  lineChart: LineChartData[];
}

export interface Filters {
  startDate: string;
  endDate: string;
  age: string;
  gender: string;
  selectedFeature: string;
}
