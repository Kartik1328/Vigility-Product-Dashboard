import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { BarChartData, LineChartData } from "../types";
import { useFilterStore } from "../store/filterStore";

const useAnalytics = () => {
  const [barChart, setBarChart] = useState<BarChartData[]>([]);
  const [lineChart, setLineChart] = useState<LineChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startDate, endDate, age, gender, selectedFeature } = useFilterStore();

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (age) params.age = age;
      if (gender) params.gender = gender;
      if (selectedFeature) params.feature = selectedFeature;

      const res = await api.get("/analytics", { params });
      setBarChart(res.data.data.barChart);
      setLineChart(res.data.data.lineChart);
    } catch (err: any) {
      const data = err.response?.data;
      const specificMsg = data?.errors?.[0]?.message;
      setError(specificMsg || data?.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, age, gender, selectedFeature]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { barChart, lineChart, loading, error, refetch: fetchAnalytics };
};

export default useAnalytics;
