import React, { useState, useEffect } from 'react';
import ClientService from "../../service/client/ClientService";
import { toast } from 'react-toastify';
import { MdClose } from 'react-icons/md';

const ClientModal = ({ isOpen, onClose, onSaved, editingClient }) => {
  const [form, setForm] = useState({
    idClient: null,
    nit: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (editingClient) {
      setForm({
        idClient: editingClient.idClient || null,
        nit: editingClient.nit || '',
        firstName: editingClient.firstName || '',
        lastName: editingClient.lastName || '',
        email: editingClient.email || '',
        phone: editingClient.phone || '',
        address: editingClient.address || '',
      });
    } else {
      setForm({
        idClient: null,
        nit: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [editingClient, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'firstName' && value.length > 40) return;
    if (name === 'lastName' && value.length > 40) return;
    if (name === 'email' && value.length > 50) return;
    if (name === 'address' && value.length > 50) return;

    if (name === 'nit' || name === 'phone') {
      newValue = value.replace(/\D/g, '');
      if (name === 'phone' && newValue.length > 8) newValue = newValue.slice(0, 8);
      if (name === 'nit' && newValue.length > 9) newValue = newValue.slice(0, 9);
    }

    setForm(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.idClient) {
        await ClientService.updateClient(form.idClient, form);
        toast.success('Cliente actualizado');
      } else {
        await ClientService.registerClient(form);
        toast.success('Cliente creado exitosamente');
      }
      onSaved();
      onClose();
    } catch {
      toast.error('No fue posible guardar el cliente');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-container">
          <div className="modal-header">
            <h4>{form.idClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h4>
            <button className="close-btn" onClick={onClose}><MdClose size={20} /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="modal-input"
              type="text"
              name="nit"
              placeholder="NIT"
              value={form.nit}
              onChange={handleChange}
              required
              inputMode="numeric"
            />
            <input
              className="modal-input"
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              className="modal-input"
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <input
              className="modal-input"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="modal-input"
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={form.phone}
              onChange={handleChange}
              required
              inputMode="numeric"
            />
            <input
              className="modal-input"
              type="text"
              name="address"
              placeholder="Dirección"
              value={form.address}
              onChange={handleChange}
              required
            />
            <div className="modal-actions">
              <button type="submit" className="fz-1-banner-btn">
                {form.idClient ? 'Actualizar' : 'Guardar'}
              </button>
              <button type="button" className="fz-1-banner-btn cancel-btn" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .modal-container {
          background: linear-gradient(to bottom right, #f8c8dc, #ffe0b2);
          padding: 2.5rem 3rem;
          border-radius: 18px;
          width: 500px;
          max-width: 95%;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
          font-family: 'Poppins', sans-serif;
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          color: #5c2a3d;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #5c2a3d;
          font-size: 1.4rem;
        }
        .modal-input {
          width: 100%;
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
          border-radius: 10px;
          border: 1px solid #e0d8d0;
          font-size: 1rem;
          background: #fff;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);
          transition: border-color 0.2s ease;
        }
        .modal-input:focus {
          outline: none;
          border-color: #ffb3c1;
          box-shadow: 0 0 0 3px rgba(255,179,193,0.3);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        .cancel-btn {
          background: white !important;
          color: #5c2a3d !important;
          border: 1px solid #ccc !important;
        }
        .cancel-btn:hover {
          background: #f3f3f3 !important;
          color: #5c2a3d !important;
        }
        .fz-1-banner-btn {
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          border: none;
          background: #ffb3c1;
          color: #5c2a3d;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .fz-1-banner-btn:hover {
          background: #ff99a7;
        }
      `}</style>
    </>
  );
};

export default ClientModal;
