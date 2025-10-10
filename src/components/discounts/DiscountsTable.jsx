import React, { useEffect, useState } from 'react';
import DiscountService from '../../service/discount/DiscountService';
import { getProducts } from '../../service/products/productService';
import DiscountModal from './DiscountModal';
import { MdEditSquare } from 'react-icons/md';
import { toast } from 'react-toastify';

const DiscountsTable = () => {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchDiscounts = async (status = "all") => {
  setLoading(true);
  try {
    let res;
    if (status === "all") {
      
      res = await DiscountService.listAllDiscounts();
    } else if (status === "active") {
      
      res = await DiscountService.listDiscounts();
    } else if (status === "inactive") {
      
      res = await DiscountService.listAllDiscounts();
    }

    const data = (res && Array.isArray(res)) ? res :
                 (res?.data && Array.isArray(res.data)) ? res.data :
                 (res?.data?.data && Array.isArray(res.data.data)) ? res.data.data : [];

    setDiscounts(data);
  } catch (error) {
    toast.error('Error cargando descuentos');
    console.error(error);
    setDiscounts([]);
  } finally {
    setLoading(false);
  }
};

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error('Error cargando productos');
    }
  };

  
  useEffect(() => {
    fetchDiscounts(filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductName = (id) => {
    const found = products.find(p => p.idProduct === id);
    return found ? found.name : 'Producto no encontrado';
  };

  
  const filteredDiscounts = discounts.filter(discount => {
  if (filterStatus === "active") return discount.estado === true;
  if (filterStatus === "inactive") return discount.estado === false; 
  return true;
});

  return (
    <div className="discounts-table">
      <div className="discounts-header">
        
        <div className="filter-wrapper">
          <label className="filter-label" htmlFor="status-filter">Filtro por estado:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        <button
          className="fz-1-banner-btn"
          onClick={() => {
            setEditingDiscount(null);
            setModalOpen(true);
          }}
        >
          + Nuevo Descuento
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad Mínima</th>
            <th>Porcentaje</th>
            <th>Producto</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6">Cargando descuentos...</td></tr>
          ) : filteredDiscounts.length === 0 ? (
            <tr><td colSpan="6">No hay descuentos disponibles.</td></tr>
          ) : (
            filteredDiscounts.map(discount => (
              <tr key={discount.idDescuento}>
                <td>{discount.nombreDescuento}</td>
                <td>{discount.cantidadMin}</td>
                <td>{discount.porcentaje}%</td>
                <td>{getProductName(discount.idProducto)}</td>
                <td>
                  <span className={`status-badge ${discount.estado ? 'active' : 'inactive'}`}>
                    {discount.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn edit"
                    onClick={() => {
                      setEditingDiscount(discount);
                      setModalOpen(true);
                    }}
                  >
                    <MdEditSquare size={22} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <DiscountModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDiscount(null);
        }}
        onSaved={() => {
          setModalOpen(false);
          setEditingDiscount(null);
          fetchDiscounts(filterStatus);
        }}
        editingDiscount={editingDiscount}
      />

      <style>{`
        .discounts-table {
          padding: 1.5rem;
          background: #fff0f5;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 0 20px rgba(255,192,203,0.15);
        }

        .discounts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        
        .filter-wrapper {
          position: relative;
        }

        .status-filter {
          padding: 8px 36px 8px 14px;
          border-radius: 8px;
          border: 1px solid #e2c4d9;
          background: #fff6fa;
          color: #5c2a3d;
          font-weight: 500;
          font-size: 0.95rem;
          appearance: none;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .status-filter:hover {
          border-color: #d69db3;
          box-shadow: 0 0 6px rgba(214, 157, 179, 0.3);
        }

        .status-filter:focus {
          border-color: #b95f82;
          box-shadow: 0 0 8px rgba(185, 95, 130, 0.4);
        }

        
        .filter-wrapper::after {
          content: '▾';
          font-size: 0.8rem;
          color: #b95f82;
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }

        thead tr {
          background: linear-gradient(to right, #f8c8dc, #ffe0b2);
          color: #5c2a3d;
          font-weight: 600;
        }

        thead th {
          padding: 0.8rem 1rem;
          text-align: left;
        }

        tbody tr:hover {
          background-color: #ffebf0;
          transform: scale(1.003);
          transition: all 0.2s ease;
        }

        tbody td:last-child {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: #fff;
          border: 1px solid rgba(125, 91, 166, 0.15);
          border-radius: 50%;
          padding: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
        }

        .action-btn.edit {
          color: #7d5ba6;
        }

        .action-btn.edit:hover {
          background-color: #ede5f7;
          border-color: #7d5ba6;
          transform: scale(1.15);
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.active {
          background-color: #d4f4dd;
          color: #2d8a4b;
        }

        .status-badge.inactive {
          background-color: #fce0e0;
          color: #cc4b4b;
        }
      `}</style>
    </div>
  );
};

export default DiscountsTable;
