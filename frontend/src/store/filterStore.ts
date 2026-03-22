import { create } from "zustand";
import { Filters } from "../types";
import { saveFiltersToCookies, loadFiltersFromCookies } from "../utils/cookies";

interface FilterState extends Filters {
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  setAge: (val: string) => void;
  setGender: (val: string) => void;
  setSelectedFeature: (val: string) => void;
  resetFilters: () => void;
  loadFromCookies: () => void;
}

const defaultFilters: Filters = {
  startDate: "",
  endDate: "",
  age: "",
  gender: "",
  selectedFeature: "",
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...defaultFilters,

  setStartDate: (val) => {
    set({ startDate: val });
    saveFiltersToCookies({ ...get(), startDate: val });
  },

  setEndDate: (val) => {
    set({ endDate: val });
    saveFiltersToCookies({ ...get(), endDate: val });
  },

  setAge: (val) => {
    set({ age: val });
    saveFiltersToCookies({ ...get(), age: val });
  },

  setGender: (val) => {
    set({ gender: val });
    saveFiltersToCookies({ ...get(), gender: val });
  },

  setSelectedFeature: (val) => {
    set({ selectedFeature: val });
  },

  resetFilters: () => {
    set(defaultFilters);
    saveFiltersToCookies(defaultFilters);
  },

  loadFromCookies: () => {
    const saved = loadFiltersFromCookies();
    if (saved) set({ ...defaultFilters, ...saved });
  },
}));
