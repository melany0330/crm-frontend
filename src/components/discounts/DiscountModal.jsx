import React, { useEffect, useState } from 'react';
import DiscountService from '../../service/discount/DiscountService';
import { getProducts } from '../../service/products/productService';
import { toast } from 'react-toastify';
import { MdClose } from 'react-icons/md';

const DiscountModal = ({ isOpen, onClose, onSaved, editingDiscount }) => {
  const [form, setForm] = useState({
    nombreDescuento: '',
    cantidadMin: '',
    porcentaje: '',
    estado: true,
    idProducto: ''
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(() => toast.error('Error cargando productos'));
  }, []);

  useEffect(() => {
    if (editingDiscount) {
      setForm({
        nombreDescuento: editingDiscount.nombreDescuento || '',
        cantidadMin: editingDiscount.cantidadMin?.toString() || '',
        porcentaje: editingDiscount.porcentaje?.toString() || '',
        estado: editingDiscount.estado === 1 || editingDiscount.estado === true, 
        idProducto: editingDiscount.idProducto?.toString() || ''
      });
    } else {
      setForm({
        nombreDescuento: '',
        cantidadMin: '',
        porcentaje: '',
        estado: true,
        idProducto: ''
      });
    }
  }, [editingDiscount, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if ((name === 'cantidadMin' || name === 'idProducto') && newValue.length > 8) {
      newValue = newValue.slice(0, 8);
    }

    if (name === 'porcentaje' && parseFloat(newValue) > 100) {
      newValue = '100';
    }

    setForm(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const discountPayload = {
      nombreDescuento: form.nombreDescuento,
      cantidadMin: parseInt(form.cantidadMin),
      porcentaje: parseFloat(form.porcentaje),
      estado: form.estado ? 1 : 0,
      idProducto: parseInt(form.idProducto)
    };

    try {
      if (editingDiscount) {
        await DiscountService.updateDiscount(editingDiscount.idDescuento, discountPayload);
        toast.success('Descuento actualizado');
      } else {
        await DiscountService.registerDiscount(discountPayload);
        toast.success('Descuento creado exitosamente');
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error('No fue posible guardar el descuento');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-container">
          <div className="modal-header">
            <h4>{editingDiscount ? 'Editar Descuento' : 'Nuevo Descuento'}</h4>
            <button className="close-btn" onClick={onClose}><MdClose size={20} /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="modal-input"
              type="text"
              name="nombreDescuento"
              placeholder="Nombre del Descuento"
              value={form.nombreDescuento}
              onChange={handleChange}
              required
            />
            <input
              className="modal-input"
              type="number"
              name="cantidadMin"
              placeholder="Cantidad Mínima"
              value={form.cantidadMin}
              onChange={handleChange}
              required
              inputMode="numeric"
            />
            <input
              className="modal-input"
              type="number"
              name="porcentaje"
              step="0.01"
              placeholder="Porcentaje (%)"
              value={form.porcentaje}
              onChange={handleChange}
              required
              inputMode="decimal"
            />

            <select
              className="modal-input"
              name="idProducto"
              value={form.idProducto}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un producto</option>
              {products.map(product => (
                <option key={product.idProduct} value={product.idProduct.toString()}>
                  {product.name}
                </option>
              ))}
            </select>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
              />
              Activo
            </label>

            <div className="modal-actions">
              <button type="submit" className="fz-1-banner-btn">
                {editingDiscount ? 'Actualizar' : 'Guardar'}
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

export default DiscountModal;
