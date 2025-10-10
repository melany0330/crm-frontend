import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createProduct, updateProduct } from '../../service/products/productService';

const AdminModal = ({
  isOpen,
  onCancel,
  templateData,
  placeholderData,
  typeData,
  onSaved,
  editingData,
  title = 'Modal'
}) => {
  const [form, setForm] = useState(templateData);

  useEffect(() => {
    if (editingData) {
      setForm(JSON.parse(JSON.stringify(editingData)));
    } else {
      setForm(templateData);
    }
  }, [editingData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in form) {
      if (!form[key]) {
        toast.error('Todos los campos son obligatorios');
        return;
      }
    }

    try {
      if (editingData) {
        onSaved(editingData, form);
      } else {
        onSaved(null, form);
      }
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
            {editingData ? 'Editar ' + title : 'Nuevo ' + title}
          </h4>
          <form onSubmit={handleSubmit}>
            {
              typeData.map((type, index) => {
                if (type === 'text' || type === 'password' || type === 'date' || type === 'number') {
                  return (
                    <input
                      key={index}
                      className="modal-input"
                      type={type}
                      name={Object.keys(templateData)[index]}
                      placeholder={placeholderData[index]}
                      value={form[Object.keys(templateData)[index]]}
                      onChange={handleChange}
                      required
                    />
                  );
                } else if (type === 'select') {
                  return (
                    <select
                      className="modal-input"
                      onChange={handleChange}
                      name={Object.keys(templateData)[index]}
                      value={form[Object.keys(templateData)[index]]}
                      multiple={false}
                    >

                      <option value="">Seleccione {placeholderData[index]}</option>
                      {
                        templateData[Object.keys(templateData)[index]]
                        .map((option, idx) => (
                          <option value={option[Object.keys(option)[0]]}>
                            {option[Object.keys(option)[1]]}
                          </option>
                        ))
                      }
                    </select>
                  );
                }
                return null;
              })
            }

            <div className="modal-actions">
              <button type="submit" className="fz-1-banner-btn">
                {editingData ? 'Actualizar' : 'Guardar'}
              </button>
              <button type="button" className="fz-1-banner-btn cancel-btn" onClick={onCancel}>
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

export default AdminModal;

