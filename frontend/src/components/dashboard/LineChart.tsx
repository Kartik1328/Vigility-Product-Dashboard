import { useRef } from "react";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import { LineChartData } from "../../types";
import { useFilterStore } from "../../store/filterStore";
import api from "../../api/axios";

interface Props {
  data: LineChartData[];
}

const track = async (feature_name: string) => {
  try {
    await api.post("/track", { feature_name });
  } catch {
    // silent fail
  }
};

const LineChart = ({ data }: Props) => {
  const { selectedFeature } = useFilterStore();
  const hoverTracked = useRef(false);

  const handleMouseEnter = () => {
    if (!hoverTracked.current) {
      hoverTracked.current = true;
      track("line_chart_hover");
    }
  };

  const handleMouseLeave = () => {
    hoverTracked.current = false;
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        {selectedFeature
          ? `Daily Clicks — ${selectedFeature}`
          : "Click a bar to see daily trend"}
      </h2>
      {!selectedFeature ? (
        <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
          ← Select a feature from the bar chart
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          No trend data for this feature
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ReLineChart
            data={data}
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={(val) => val.slice(5)} // show MM-DD
            />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              formatter={(value: any) => [`${value} clicks`, "Count"]}
            />{" "}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ReLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LineChart;
