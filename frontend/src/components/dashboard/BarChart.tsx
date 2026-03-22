import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Brush, } from "recharts";
import { BarChartData } from "../../types";
import { useFilterStore } from "../../store/filterStore";
import api from "../../api/axios";

interface Props {
  data: BarChartData[];
}

const COLORS = {
  default: "#3b82f6",
  active: "#1d4ed8",
};

const track = async (feature_name: string) => {
  try {
    await api.post("/track", { feature_name });
  } catch {
    // silent fail
  }
};

const BarChart = ({ data }: Props) => {
  const { selectedFeature, setSelectedFeature } = useFilterStore();

const handleBarClick = (entry: any) => {
  if (entry?.feature_name) {
    setSelectedFeature(entry.feature_name);
    track("bar_chart_click");
  }
};

const handleBrushChange = () => {
  track("bar_chart_zoom");
};

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Total Clicks by Feature
      </h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          No data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ReBarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="feature_name"
              type="category"
              tick={{ fontSize: 12 }}
              width={120}
            />
            <Tooltip formatter={(value: any) => [`${value} clicks`, "Count"]} />
            <Brush dataKey="feature_name" height={20} stroke="#3b82f6" onChange={handleBrushChange} />
            <Bar
              dataKey="total_clicks"
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              onClick={handleBarClick}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.feature_name}
                  fill={
                    entry.feature_name === selectedFeature
                      ? COLORS.active
                      : COLORS.default
                  }
                />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      )}
      {selectedFeature && (
        <p className="text-xs text-blue-500 mt-2 text-center">
          Showing trend for: <strong>{selectedFeature}</strong>
        </p>
      )}
    </div>
  );
};

export default BarChart;
