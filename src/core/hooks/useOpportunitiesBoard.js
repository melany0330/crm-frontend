import { useCallback, useEffect, useMemo, useState } from "react";
import OpportunitiesService from "../../service/crm/opportunities.service.js";
import ClientsService from "../../service/crm/clients.service.js";
import QuotesService from "../../service/crm/quotes.service.js";
import UserService from "../../service/admin/UserService.js";

const DEFAULT_STAGES = ["ABIERTA", "EN_PROCESO", "GANADA", "PERDIDA"];
const FILTER_STAGES = ["TODOS", ...DEFAULT_STAGES];
const userService = new UserService();

const normalize = (value) => (value ?? "").toString().toLowerCase();

export default function useOpportunitiesBoard(initialFilters = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [stageFilter, setStageFilter] = useState("TODOS");
  const [form, setForm] = useState({
    clientId: "",
    userId: "",
    quoteId: "",
    status: "ABIERTA",
    probability: 50,
    estimatedValue: 0,
    expectedCloseDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [quoteOptions, setQuoteOptions] = useState([]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await OpportunitiesService.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "No se pudo cargar oportunidades");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const optionFromClient = (client) => {
      const id =
        Number(
          client?.clientId ??
            client?.idClient ??
            client?.idCliente ??
            client?.id
        ) || null;
      const name =
        [
          client?.nombreCliente ?? client?.name ?? client?.nombre ?? "",
          client?.apellidoCliente ?? client?.lastName ?? "",
        ]
          .filter(Boolean)
          .join(" ")
          .trim() || client?.nitCliente || `Cliente ${id}`;
      return id ? { id, label: name } : null;
    };

    ClientsService.list()
      .then((list) =>
        setClientOptions(
          (Array.isArray(list) ? list : []).map(optionFromClient).filter(Boolean)
        )
      )
      .catch(() => setClientOptions([]));

    userService
      .listUsers()
      .then((res) => res?.data?.data ?? res?.data ?? [])
      .then((list) =>
        setUserOptions(
          (Array.isArray(list) ? list : [])
            .map((user) => {
              const id = Number(user?.idUsuario ?? user?.id ?? user?.userId);
              const label = user?.nombreUsuario ?? user?.name ?? `Usuario ${id}`;
              return id ? { id, label } : null;
            })
            .filter(Boolean)
        )
      )
      .catch(() => setUserOptions([]));

    QuotesService.list()
      .then((list) => {
        const options = (Array.isArray(list) ? list : [])
          .map((quote) => {
            const id = quote?.idQuote ?? quote?.id;
            if (!id) return null;
            const clientLabel =
              quote?.client?.nombreCliente ??
              quote?.client?.name ??
              quote?.clientName ??
              "Cliente";
            return { id, label: `#${id} - ${clientLabel}` };
          })
          .filter(Boolean);
        setQuoteOptions(options);
      })
      .catch(() => setQuoteOptions([]));
  }, []);

  const filteredRows = useMemo(() => {
    const term = normalize(search);
    return rows.filter((row) => {
      const stage = (row?.status || "ABIERTA").toUpperCase();
      const matchesStage = stageFilter === "TODOS" || stage === stageFilter;
      if (!matchesStage) return false;
      if (!term) return true;
      const clientName = normalize(row?.client?.nombreCliente ?? row?.clientName ?? "");
      const sellerName = normalize(row?.user?.name ?? row?.userName ?? "");
      return (
        clientName.includes(term) ||
        sellerName.includes(term) ||
        normalize(row?.idOpportunity).includes(term)
      );
    });
  }, [rows, search, stageFilter]);

  const changeStatus = useCallback(
    async (idOpportunity, status) => {
      if (!idOpportunity || !status) return;
      await OpportunitiesService.changeStatus(idOpportunity, { status });
      await refresh();
    },
    [refresh]
  );

  const setFormField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({
      clientId: "",
      userId: "",
      quoteId: "",
      status: "ABIERTA",
      probability: 50,
      estimatedValue: 0,
      expectedCloseDate: "",
    });
    setEditingId(null);
  }, []);

  const startEdit = useCallback((row) => {
    if (!row) return;
    setEditingId(row.idOpportunity ?? row.id);
    setForm({
      clientId: row.clientId ?? row.client?.idClient ?? "",
      userId: row.userId ?? row.user?.id ?? "",
      quoteId: row.quoteId ?? row.quote?.idQuote ?? "",
      status: row.status ?? "ABIERTA",
      probability: row.probability ?? 50,
      estimatedValue: row.estimatedValue ?? row.valorEstimado ?? 0,
      expectedCloseDate: row.expectedCloseDate
        ? row.expectedCloseDate.slice(0, 10)
        : "",
    });
  }, []);

  const submitForm = useCallback(async () => {
    const payload = {
      clientId: Number(form.clientId),
      userId: Number(form.userId),
      quoteId: form.quoteId ? Number(form.quoteId) : null,
      status: form.status,
      probability: Number(form.probability) || 0,
      estimatedValue: Number(form.estimatedValue) || 0,
      expectedCloseDate: form.expectedCloseDate ? new Date(form.expectedCloseDate) : null,
    };
    setSaving(true);
    try {
      if (editingId) {
        await OpportunitiesService.update(editingId, payload);
      } else {
        await OpportunitiesService.create(payload);
      }
      await refresh();
      resetForm();
    } finally {
      setSaving(false);
    }
  }, [editingId, form, refresh, resetForm]);

  const deleteOpportunity = useCallback(
    async (id) => {
      if (!id) return;
      await OpportunitiesService.deactivate(id);
      await refresh();
      if (editingId === id) {
        resetForm();
      }
    },
    [editingId, refresh, resetForm]
  );

  return {
    loading,
    error,
    rows: filteredRows,
    refresh,
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    changeStatus,
    form,
    setFormField,
    submitForm,
    saving,
    editingId,
    startEdit,
    resetForm,
    deleteOpportunity,
    clientOptions,
    userOptions,
    quoteOptions,
    stageOptions: FILTER_STAGES,
  };
}
