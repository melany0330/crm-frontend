import { useCallback, useEffect, useMemo, useState } from "react";
import ReportsService from "../../service/crm/reports.service";
import { downloadBlob } from "../utils/download";

const BASE_FILTERS = Object.freeze({
  startDate: "",
  endDate: "",
  clientId: "",
  categoryId: "",
});

const sanitize = (raw = {}) => ({
  startDate: raw?.startDate ?? "",
  endDate: raw?.endDate ?? "",
  clientId: raw?.clientId ?? "",
  categoryId: raw?.categoryId ?? "",
});

export default function useClientReport(initialFilters = {}) {
  const initialSnapshot = useMemo(
    () => sanitize({ ...BASE_FILTERS, ...initialFilters }),
    [initialFilters]
  );

  const [filters, setFilters] = useState(initialSnapshot);
  const [appliedFilters, setAppliedFilters] = useState(initialSnapshot);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchReport = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const payload = await ReportsService.getClientInsights(currentFilters);
      setData(payload);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(appliedFilters);
  }, [appliedFilters, fetchReport]);

  const handleInputChange = useCallback((eventOrName, value) => {
    if (typeof eventOrName === "string") {
      setFilters((prev) => ({ ...prev, [eventOrName]: value }));
      return;
    }
    const { name, value: nextValue } = eventOrName?.target ?? {};
    if (!name) return;
    setFilters((prev) => ({ ...prev, [name]: nextValue }));
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(sanitize(filters));
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(BASE_FILTERS);
    setAppliedFilters(BASE_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setAppliedFilters((prev) => ({ ...prev }));
  }, []);

  const exportReport = useCallback(async (filename = "client-insights.csv") => {
    setExporting(true);
    try {
      const blob = await ReportsService.exportClientInsights(appliedFilters);
      downloadBlob(blob, filename);
    } finally {
      setExporting(false);
    }
  }, [appliedFilters]);

  const errorMessage = useMemo(() => {
    if (!error) return "";
    return (
      error?.response?.data?.message ||
      error?.message ||
      "No se pudo cargar el reporte"
    );
  }, [error]);

  return {
    data,
    loading,
    exporting,
    error,
    errorMessage,
    lastUpdated,
    filters,
    handleInputChange,
    applyFilters,
    resetFilters,
    refresh,
    exportReport,
  };
}
