import { useState } from "react";
import { useFilterStore } from "../../store/filterStore";
import api from "../../api/axios";

const AGE_OPTIONS = ["", "<18", "18-40", ">40"];
const GENDER_OPTIONS = ["", "Male", "Female", "Other"];

const track = async (feature_name: string) => {
  try {
    await api.post("/track", { feature_name });
  } catch {
    // silent fail — tracking should never break UI
  }
};

const toISODate = (date: Date): string => date.toISOString().split("T")[0];

type Preset = "today" | "yesterday" | "last7" | "thisMonth" | "custom";

const Filters = () => {
  const {
    startDate,
    endDate,
    age,
    gender,
    setStartDate,
    setEndDate,
    setAge,
    setGender,
    resetFilters,
  } = useFilterStore();

  const [activePreset, setActivePreset] = useState<Preset>("custom");
  const [dateError, setDateError] = useState<string | null>(null);

  const validateDates = (start: string, end: string) => {
    if (start && end && end < start) {
      setDateError("End date cannot be less than start date");
    } else {
      setDateError(null);
    }
  };

  const applyPreset = (preset: Preset) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (preset) {
      case "today": {
        const d = toISODate(today);
        setStartDate(d);
        setEndDate(d);
        break;
      }
      case "yesterday": {
        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        const d = toISODate(yest);
        setStartDate(d);
        setEndDate(d);
        break;
      }
      case "last7": {
        const from = new Date(today);
        from.setDate(from.getDate() - 6);
        setStartDate(toISODate(from));
        setEndDate(toISODate(today));
        break;
      }
      case "thisMonth": {
        const from = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(toISODate(from));
        setEndDate(toISODate(today));
        break;
      }
      case "custom":
        break;
    }

    setActivePreset(preset);
    setDateError(null);
    track("date_filter");
  };

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setActivePreset("custom");
    validateDates(e.target.value, endDate);
    track("date_filter");
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setActivePreset("custom");
    validateDates(startDate, e.target.value);
    track("date_filter");
  };

  const handleAge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAge(e.target.value);
    track("age_filter");
  };

  const handleGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
    track("gender_filter");
  };

  const handleReset = () => {
    resetFilters();
    setActivePreset("custom");
    setDateError(null);
  };

  const presets: { label: string; value: Preset }[] = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last7" },
    { label: "This Month", value: "thisMonth" },
    { label: "Custom Range", value: "custom" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-wrap gap-4 items-end">
      {/* Quick Date Presets */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Date Range
        </label>
        <div className="flex gap-1 flex-wrap">
          {presets.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => applyPreset(value)}
              className={`text-xs px-3 py-2 rounded-md border transition font-medium ${
                activePreset === value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Inputs — always visible */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDate}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDate}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Date validation error */}
      {dateError && (
        <div className="w-full text-sm text-red-600 -mt-2">
          {dateError}
        </div>
      )}

      {/* Age Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Age
        </label>
        <select
          value={age}
          onChange={handleAge}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {AGE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt || "All Ages"}
            </option>
          ))}
        </select>
      </div>

      {/* Gender Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Gender
        </label>
        <select
          value={gender}
          onChange={handleGender}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {GENDER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt || "All Genders"}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md transition"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
