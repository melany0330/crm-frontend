import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createProduct, updateProduct } from '../../service/products/productService';

const AddProductModal = ({ isOpen, onClose, onCreated, editingData, categories }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    salePrice: '',
    purchasePrice: '',
    idCategory: '',
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (editingData) {
      setForm({
        name: editingData.name,
        description: editingData.description,
        salePrice: editingData.salePrice,
        purchasePrice: editingData.purchasePrice,
        idCategory: editingData.idCategory,
      });
      setImageFile(null);
    } else {
      setForm({
        name: '',
        description: '',
        salePrice: '',
        purchasePrice: '',
        idCategory: '',
      });
      setImageFile(null);
    }
  }, [editingData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'name' && value.length > 50) return;
    if (name === 'description' && value.length > 150) return;

    if (name === 'salePrice' || name === 'purchasePrice') {
      newValue = value.replace(/[^0-9.]/g, '');
      if (!/^\d*\.?\d{0,2}$/.test(newValue)) return;
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.salePrice || !form.purchasePrice || !form.idCategory) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const sale = parseFloat(form.salePrice);
    const purchase = parseFloat(form.purchasePrice);
    if (isNaN(sale) || isNaN(purchase) || sale <= 0 || purchase <= 0) {
      toast.error('Los precios deben ser números positivos');
      return;
    }

    if (!imageFile && !editingData) {
      toast.error('La imagen es obligatoria');
      return;
    }

    try {
      if (editingData) {
        await updateProduct(editingData.idProduct, form, imageFile);
        toast.success('Producto actualizado');
      } else {
        await createProduct(form, imageFile);
        toast.success('Producto creado exitosamente');
      }

      onCreated();
      onClose();
    } catch (err) {
      toast.error('No fue posible guardar el producto');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-container">
          <h4 className="modal-title">
            {editingData ? 'Editar Producto' : 'Nuevo Producto'}
          </h4>
          <form onSubmit={handleSubmit}>
            <input
              className="modal-input"
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />

            <textarea
              className="modal-input"
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input
              className="modal-input"
              type="text"
              name="salePrice"
              placeholder="Precio de Venta"
              value={form.salePrice}
              onChange={handleChange}
              required
            />

            <input
              className="modal-input"
              type="text"
              name="purchasePrice"
              placeholder="Precio de Compra"
              value={form.purchasePrice}
              onChange={handleChange}
              required
            />

            <select
              className="modal-input"
              name="idCategory"
              value={form.idCategory}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.idCategory} value={cat.idCategory}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            <input
              className="modal-input"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="modal-actions">
              <button type="submit" className="fz-1-banner-btn">
                {editingData ? 'Actualizar' : 'Guardar'}
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

        textarea.modal-input {
          min-height: 100px;
          resize: vertical;
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
      `}</style>
    </>
  );
};

export default AddProductModal;

