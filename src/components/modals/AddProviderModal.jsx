import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdClose } from 'react-icons/md';
import { createProvider, updateProvider } from '../../service/providers/providerService';

const AddProviderModal = ({ isOpen, onClose, onCreated, editingData }) => {
  const [form, setForm] = useState({
    name: '',
    nit: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (editingData) {
      setForm({ ...editingData });
    } else {
      setForm({
        name: '',
        nit: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [editingData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'name' && value.length > 40) return;

    if (name === 'email' && value.length > 50) return;

    if (name === 'address' && value.length > 50) return;

    if (name === 'nit' || name === 'phone') {
      newValue = value.replace(/\D/g, '');
      if (name === 'phone' && newValue.length > 8) newValue = newValue.slice(0, 8);
      if (name === 'nit' && newValue.length > 9) newValue = newValue.slice(0, 9);
    }

    setForm({ ...form, [name]: newValue });
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingData) {
      await updateProvider(editingData.idProvider, form);
      toast.success('Proveedor actualizado');
    } else {
      await createProvider(form);
      toast.success('Proveedor creado exitosamente');
    }
    onCreated();
    onClose();
  } catch (err) {
    toast.error('No fue posible guardar el proveedor');
  }
};

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-container">
          <h4 className="modal-title">
            {editingData ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h4>
          <form onSubmit={handleSubmit}>
            <input className="modal-input" type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
            <input className="modal-input" type="text" name="nit" inputMode="numeric" placeholder="NIT" value={form.nit} onChange={handleChange} required />
            <input className="modal-input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input className="modal-input" type="text" name="phone" inputMode="numeric" placeholder="Teléfono" value={form.phone} onChange={handleChange} required />
            <input className="modal-input" type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} required />
            <div className="modal-actions">
              <button type="submit" className="fz-1-banner-btn">
                {editingData ? 'Actualizar' : 'Guardar'}
              </button>
              <button type="button" className="fz-1-banner-btn cancel-btn" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <style>
        {`
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
            padding: 2.8rem;
            border-radius: 18px;
            width: 500px;
            max-width: 95%;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.4s ease;
            font-family: 'Poppins', sans-serif;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .modal-title {
            text-align: center;
            font-size: 1.8rem;
            font-weight: 600;
            color: #5c2a3d;
            margin-bottom: 1.8rem;
          }

          .modal-input {
            width: 100%;
            margin-bottom: 1.1rem;
            padding: 0.85rem 1rem;
            border-radius: 10px;
            border: 1px solid #e0d8d0;
            font-size: 1rem;
            background: #ffffff;
            transition: all 0.2s;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);
          }

          .modal-input:focus {
            border-color: #ffb3c1;
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 179, 193, 0.3);
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .cancel-btn {
            background-color: white !important;
            color: #5c2a3d !important;
            border: 1px solid #ccc !important;
          }

          .cancel-btn:hover {
            background-color: #f3f3f3 !important;
            color: #5c2a3d !important;
          }
        `}
      </style>
    </>
  );
};

export default AddProviderModal;