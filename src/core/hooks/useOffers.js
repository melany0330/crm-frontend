import { useCallback, useEffect, useMemo, useState } from "react";
import OffersService from "../../service/crm/offers.service.js";
import ProductsService from "../../service/crm/products.service.js";

const normalize = (value) => (value ?? "").toString().toLowerCase();

export default function useOffers(initialFilters = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [onlyActive, setOnlyActive] = useState(initialFilters.onlyActive ?? true);
  const [productOptions, setProductOptions] = useState([]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await OffersService.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "No se pudo cargar ofertas");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    ProductsService.getMap()
      .then((map) => {
        const options = Object.entries(map || {}).map(([id, label]) => ({
          id: Number(id),
          label: `#${id} - ${label}`,
        }));
        setProductOptions(options);
      })
      .catch(() => setProductOptions([]));
  }, []);

  const filtered = useMemo(() => {
    const term = normalize(search);
    return rows.filter((row) => {
      const active = row?.estado ?? row?.active ?? false;
      if (onlyActive && !active) return false;
      if (!term) return true;
      const label = normalize(row?.nombreDescuento || row?.name);
      const product = normalize(row?.product?.name || row?.productName || "");
      return label.includes(term) || product.includes(term);
    });
  }, [rows, search, onlyActive]);

  const create = useCallback(
    async (dto) => {
      await OffersService.create(dto);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id, dto) => {
      await OffersService.update(id, dto);
      await refresh();
    },
    [refresh]
  );

  const deactivate = useCallback(
    async (id) => {
      await OffersService.deactivate(id);
      await refresh();
    },
    [refresh]
  );

  return {
    rows: filtered,
    rawRows: rows,
    loading,
    error,
    search,
    setSearch,
    onlyActive,
    setOnlyActive,
    refresh,
    create,
    update,
    deactivate,
    productOptions,
  };
}
