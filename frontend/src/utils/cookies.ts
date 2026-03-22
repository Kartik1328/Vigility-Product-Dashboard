import Cookies from "js-cookie";
import { Filters } from "../types";

const COOKIE_KEY = "vigility_filters";
const COOKIE_EXPIRY = 7; // days

export const saveFiltersToCookies = (filters: Partial<Filters>): void => {
  Cookies.set(COOKIE_KEY, JSON.stringify(filters), { expires: COOKIE_EXPIRY });
};

export const loadFiltersFromCookies = (): Partial<Filters> => {
  const raw = Cookies.get(COOKIE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const clearFilterCookies = (): void => {
  Cookies.remove(COOKIE_KEY);
};
