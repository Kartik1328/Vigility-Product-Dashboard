import { useEffect } from "react";
import Navbar from "../components/ui/Navbar";
import Filters from "../components/dashboard/Filters";
import BarChart from "../components/dashboard/BarChart";
import LineChart from "../components/dashboard/LineChart";
import Loader from "../components/ui/Loader";
import useAnalytics from "../hooks/useAnalytics";
import { useFilterStore } from "../store/filterStore";

const DashboardPage = () => {
  const { barChart, lineChart, loading, error } = useAnalytics();
  const { loadFromCookies } = useFilterStore();

  // Restore filters from cookies on page load
  useEffect(() => {
    loadFromCookies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Filters */}
        <Filters />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Charts */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart data={barChart} />
            <LineChart data={lineChart} />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
