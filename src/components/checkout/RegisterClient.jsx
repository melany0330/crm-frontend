import React, { useState, useEffect, useRef } from "react";
import ClientService from "../../service/client/ClientService";
import { toast } from "react-toastify";

const RegisterClient = ({ onSuccess, onError, onEditingChange, layout }) => {
  const normalizeClient = (client) => ({
    nit: client.nit || "",
    firstName: client.firstName || "",
    lastName: client.lastName || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "",
    idClient: client.idClient || client.id || client.clientId || null,
  });

  const [client, setClient] = useState(normalizeClient({}));
  const [originalClient, setOriginalClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isNewClient, setIsNewClient] = useState(true);
  const [formDisabled, setFormDisabled] = useState(false);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (onEditingChange) onEditingChange(!formDisabled);
  }, [formDisabled, onEditingChange]);

  useEffect(() => {
    const nit = client.nit?.trim() || "";

    if (nit.length >= 4) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => searchClientByNit(nit), 500);
    } else {
      setMessage(null);
      setShowForm(false);
      setOriginalClient(null);
      setIsNewClient(true);
      setFormDisabled(false);
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [client.nit]);

  const resetForm = () => {
    setShowForm(false);
    setMessage(null);
    setOriginalClient(null);
    setIsNewClient(true);
    setFormDisabled(false);
    setClient((prev) => normalizeClient({ ...prev, nit: prev.nit }));
  };

  const searchClientByNit = async (nit) => {
    if (!nit) return;
    setSearching(true);
    try {
      const existingClient = await ClientService.getClientByNit(nit);

      if (existingClient) {
        const normalized = normalizeClient(existingClient);
        
        setClient({
          nit: normalized.nit,
          firstName: normalized.firstName,
          lastName: normalized.lastName,
          email: "",
          phone: "",
          address: "",
          idClient: normalized.idClient,
        });
        setOriginalClient(normalized);
        setIsNewClient(false);
        setFormDisabled(true);
        setMessage("Cliente ya registrado. Nombre y apellido cargados.");
        onSuccess?.(normalized);
      } else {
        
        setClient({
          nit,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          idClient: null,
        });
        setOriginalClient(null);
        setIsNewClient(true);
        setFormDisabled(false);
        setMessage("NIT no registrado. Ingrese los datos completos.");
      }
      setShowForm(true);
    } catch (error) {
      toast.error("Error al buscar cliente.");
      setMessage("Error al buscar cliente.");
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => normalizeClient({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let savedClient;

      if (isNewClient) {
        const response = await ClientService.registerClient(client);
        savedClient = response.data;
        setMessage("Cliente registrado con éxito.");
        toast.success("Cliente registrado con éxito.");
      } else {
        
        savedClient = originalClient;
        setMessage("Información confirmada.");
        toast.success("Información confirmada.");
      }

      const normalized = normalizeClient(savedClient);

      if (!normalized.idClient) {
        throw new Error("No se recibió idClient tras guardar el cliente.");
      }

      setOriginalClient(normalized);
      setClient(normalized);
      setIsNewClient(false);
      setFormDisabled(true);

      onSuccess?.(normalized);
    } catch (error) {
      toast.error("Error al procesar cliente.");
      setMessage("Error al procesar cliente.");
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {layout === "checkout" && (
        <div className="row gy-3 gx-0">
          <div className="col-12">
            <input
              name="nit"
              value={client.nit}
              onChange={handleChange}
              placeholder="Ingrese NIT"
              required
              disabled={searching}
            />
            {message && (
              <p className="mt-1" style={{ fontSize: "14px", color: "#666" }}>
                {message}
              </p>
            )}
          </div>

          {showForm && (
            <>
              <div className="col-12">
                <input
                  name="firstName"
                  value={client.firstName}
                  readOnly={!isNewClient}
                  placeholder="Nombre"
                  required
                  onChange={isNewClient ? handleChange : undefined}
                />
              </div>
              <div className="col-12">
                <input
                  name="lastName"
                  value={client.lastName}
                  readOnly={!isNewClient}
                  placeholder="Apellido"
                  required
                  onChange={isNewClient ? handleChange : undefined}
                />
              </div>

              {isNewClient && (
                <>
                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      value={client.email}
                      onChange={handleChange}
                      placeholder="Correo electrónico"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <input
                      name="phone"
                      value={client.phone}
                      onChange={handleChange}
                      placeholder="Teléfono"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <input
                      name="address"
                      value={client.address}
                      onChange={handleChange}
                      placeholder="Dirección"
                      required
                    />
                  </div>
                </>
              )}

              <div className="col-12">
                <button
                  type="button"
                  className="fz-1-banner-btn cart-checkout-btn checkout-form-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? "Procesando..."
                    : isNewClient
                    ? "Registrar Cliente"
                    : "Confirmar Información"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default RegisterClient;
