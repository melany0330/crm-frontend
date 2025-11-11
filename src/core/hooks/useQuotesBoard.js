import { useCallback, useEffect, useMemo, useState } from "react";
import QuotesService from "../../service/crm/quotes.service.js";
import ClientsService from "../../service/crm/clients.service.js";
import ProductsService from "../../service/crm/products.service.js";
import UserService from "../../service/admin/UserService.js";
import OffersService from "../../service/crm/offers.service.js";

const STATUS_OPTIONS = ["TODOS", "PENDIENTE", "ENVIADA", "ACEPTADA", "RECHAZADA"];
const emptyDetail = () => ({ idProduct: "", quantity: 1, unitPrice: 0, discount: 0, offerId: "" });
const userService = new UserService();

const normalize = (value) => (value ?? "").toString().toLowerCase();

export default function useQuotesBoard(initialFilters = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialFilters.status ?? "TODOS");
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [detailsCache, setDetailsCache] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});
  const [form, setForm] = useState({
    idClient: "",
    idUser: "",
    quoteDate: new Date().toISOString().slice(0, 16),
    details: [emptyDetail()],
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [clientOptions, setClientOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [offersByProduct, setOffersByProduct] = useState({});
  const [offerCatalog, setOfferCatalog] = useState({});

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await QuotesService.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "No se pudo cargar las cotizaciones");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const toClientOption = (client) => {
      const id =
        Number(
          client?.clientId ??
            client?.idClient ??
            client?.idCliente ??
            client?.id
        ) || null;
      const nameParts = [
        client?.nombreCliente ?? client?.name ?? client?.nombre ?? "",
        client?.apellidoCliente ?? client?.lastName ?? "",
      ].filter(Boolean);
      const label = nameParts.join(" ").trim() || client?.nitCliente || `Cliente ${id}`;
      return id ? { id, label } : null;
    };

    ClientsService.list()
      .then((list) => {
        const options = (Array.isArray(list) ? list : [])
          .map(toClientOption)
          .filter(Boolean);
        setClientOptions(options);
      })
      .catch(() => setClientOptions([]));

    userService
      .listUsers()
      .then((res) => res?.data?.data ?? res?.data ?? [])
      .then((list) => {
        const options = (Array.isArray(list) ? list : []).map((user) => {
          const id = Number(user?.idUsuario ?? user?.id ?? user?.userId);
          const label = user?.nombreUsuario ?? user?.name ?? `Usuario ${id}`;
          return id ? { id, label } : null;
        }).filter(Boolean);
        setUserOptions(options);
      })
      .catch(() => setUserOptions([]));

    ProductsService.getMap()
      .then((map) => setProductMap(map || {}))
      .catch(() => setProductMap({}));

    OffersService.list()
      .then((list) => {
        const grouped = {};
        const catalog = {};
        (Array.isArray(list) ? list : []).forEach((offer) => {
          if (offer?.estado === false) return;
          const productId =
            Number(
              offer?.product?.idProduct ??
                offer?.product?.id ??
                offer?.idProducto ??
                offer?.idProduct
            ) || null;
          const offerId = offer?.idDescuento ?? offer?.id;
          if (!productId || !offerId) return;
          const percentage = Number(offer?.porcentaje ?? 0);
          catalog[offerId] = percentage;
          if (!grouped[productId]) grouped[productId] = [];
          grouped[productId].push({
            id: offerId,
            label: offer?.nombreDescuento ?? `Oferta ${offerId}`,
            porcentaje: percentage,
          });
        });
        setOffersByProduct(grouped);
        setOfferCatalog(catalog);
      })
      .catch(() => {
        setOffersByProduct({});
        setOfferCatalog({});
      });
  }, []);

  const filtered = useMemo(() => {
    const term = normalize(search);
    const status = statusFilter?.toUpperCase();
    return rows.filter((row) => {
      const currentStatus = (row?.status || "").toUpperCase();
      const clientName = `${row?.client?.name ?? ""} ${row?.client?.lastName ?? ""}`.trim();
      const userName = row?.user?.name ?? "";
      const matchesStatus = !status || status === "TODOS" || currentStatus === status;
      const matchesSearch =
        !term ||
        normalize(row?.idQuote).includes(term) ||
        normalize(clientName).includes(term) ||
        normalize(userName).includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [rows, search, statusFilter]);

  const loadDetails = useCallback(
    async (idQuote) => {
      if (!idQuote) return [];
      if (detailsCache[idQuote]) {
        return detailsCache[idQuote];
      }
      setDetailsLoading((prev) => ({ ...prev, [idQuote]: true }));
      try {
        const items = await QuotesService.getDetailsNormalized(idQuote);
        setDetailsCache((prev) => ({ ...prev, [idQuote]: items }));
        return items;
      } finally {
        setDetailsLoading((prev) => ({ ...prev, [idQuote]: false }));
      }
    },
    [detailsCache]
  );

  const updateStatus = useCallback(
    async (idQuote, nextStatus) => {
      if (!idQuote || !nextStatus) return;
      await QuotesService.updateStatus(idQuote, nextStatus);
      await refresh();
    },
    [refresh]
  );

  const setFormField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const computeDiscount = useCallback(
    (detail) => {
      if (!detail.offerId) return detail.discount ?? 0;
      const percentage = offerCatalog[detail.offerId];
      if (!percentage) return 0;
      const qty = Number(detail.quantity) || 0;
      const unit = Number(detail.unitPrice) || 0;
      return qty * unit * (percentage / 100);
    },
    [offerCatalog]
  );

  const setDetailField = useCallback(
    (index, field, value) => {
      setForm((prev) => {
        const nextDetails = prev.details.map((detail, idx) => {
          if (idx !== index) {
            return detail;
          }
          let updated = { ...detail, [field]: value };
          if (field === "idProduct") {
            updated = { ...updated, offerId: "", discount: 0 };
          }
          if (["offerId", "unitPrice", "quantity"].includes(field)) {
            updated = { ...updated, discount: computeDiscount({ ...updated, [field]: value }) };
          }
          return updated;
        });
        return { ...prev, details: nextDetails };
      });
    },
    [computeDiscount]
  );

  const addDetailRow = useCallback(() => {
    setForm((prev) => ({ ...prev, details: [...prev.details, emptyDetail()] }));
  }, []);

  const removeDetailRow = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== index),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({
      idClient: "",
      idUser: "",
      quoteDate: new Date().toISOString().slice(0, 16),
      details: [emptyDetail()],
    });
    setEditingId(null);
  }, []);

  const startEdit = useCallback((quote) => {
    if (!quote) return;
    setEditingId(quote.idQuote ?? quote.id);
    setForm({
      idClient: quote.idClient ?? quote.clientId ?? "",
      idUser: quote.idUser ?? quote.userId ?? "",
      quoteDate: quote.quoteDate ? quote.quoteDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
      details:
        quote.details?.map((d) => ({
          idProduct: d.idProduct ?? "",
          quantity: d.quantity ?? 1,
          unitPrice: d.unitPrice ?? 0,
          discount: d.discount ?? 0,
          offerId: "",
        })) ?? [emptyDetail()],
    });
  }, []);

  const submitForm = useCallback(async () => {
    const payload = {
      idClient: Number(form.idClient) || null,
      idUser: form.idUser ? Number(form.idUser) : null,
      quoteDate: form.quoteDate ? new Date(form.quoteDate) : new Date(),
      details: form.details
        .filter((d) => d.idProduct)
        .map((d) => ({
          idProduct: Number(d.idProduct),
          quantity: Number(d.quantity) || 0,
          unitPrice: Number(d.unitPrice) || 0,
          discount: Number(d.discount) || 0,
        })),
    };
    setSaving(true);
    try {
      if (editingId) {
        await QuotesService.update(editingId, payload);
      } else {
        await QuotesService.create(payload);
      }
      await refresh();
      resetForm();
    } finally {
      setSaving(false);
    }
  }, [editingId, form, refresh, resetForm]);

  const deleteQuote = useCallback(
    async (idQuote) => {
      if (!idQuote) return;
      await QuotesService.delete(idQuote);
      await refresh();
      if (editingId === idQuote) {
        resetForm();
      }
    },
    [editingId, refresh, resetForm]
  );

  return {
    rows: filtered,
    rawRows: rows,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    statusOptions: STATUS_OPTIONS,
    refresh,
    loadDetails,
    detailsCache,
    detailsLoading,
    updateStatus,
    form,
    setFormField,
    setDetailField,
    addDetailRow,
    removeDetailRow,
    editingId,
    startEdit,
    resetForm,
    submitForm,
    saving,
    deleteQuote,
    clientOptions,
    userOptions,
    productMap,
    offersByProduct,
  };
}
