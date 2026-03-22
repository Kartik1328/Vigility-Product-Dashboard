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

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    track("date_filter");
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
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

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-wrap gap-4 items-end">
      {/* Date Range */}
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
        onClick={resetFilters}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md transition"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
