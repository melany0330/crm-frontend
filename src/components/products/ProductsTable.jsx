import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdEditSquare, MdOutlineDeleteOutline, MdReplay } from 'react-icons/md'
import { toast } from 'react-toastify'
import AddProductModal from '../modals/AddProductModal'
import ConfirmModal from '../modals/confirmModal'
import { getProducts, getCategories, changeProductStatus } from '../../service/products/productService';

const BASE_URL = `${import.meta.env.VITE_WMS_PROTOCOL}://${import.meta.env.VITE_WMS_NAME}`; const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToChangeStatus, setProductToChangeStatus] = useState(null);
  const [actionType, setActionType] = useState('deactivate');

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error('Error al cargar categorías');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const getCategoryName = (id) => {
    const found = categories.find(c => c.idCategory === id);
    return found ? found.categoryName : 'Sin categoría';
  };

  const handleStatusChange = async () => {
    try {
      await changeProductStatus(productToChangeStatus.idProduct, actionType);
      toast.success(`Producto ${actionType === 'deactivate' ? 'desactivado' : 'activado'}`);
      fetchProducts();
    } catch {
      toast.error(`No fue posible ${actionType === 'deactivate' ? 'desactivar' : 'activar'} el producto`);
    } finally {
      setConfirmOpen(false);
      setProductToChangeStatus(null);
    }
  };

  return (
    <div className="wishlist-table">
      <div className="d-flex justify-content-end mb-3">
        <button className="fz-1-banner-btn" onClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}>
          + Nuevo Producto
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio Venta</th>
            <th>Precio Compra</th>
            <th>Categoría</th>
            <th>Imagen</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="8">Cargando productos...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan="8">No hay productos disponibles.</td></tr>
          ) : (
            products.map((item) => (
              <tr key={item.idProduct}>
                <td>
                  <div className="multiline-cell name">{item.name}</div>
                </td>
                <td>
                  <div className="multiline-cell description">{item.description}</div>
                </td>
                <td>Q{item.salePrice}</td>
                <td>Q{item.purchasePrice}</td>
                <td>{getCategoryName(item.idCategory)}</td>
                <td>
                  {item.image && (
                    <img
                      src={`${BASE_URL}${item.image}`}
                      alt="Producto"
                      style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>
                  <span className={`status-badge ${item.status ? 'active' : 'inactive'}`}>
                    {item.status ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-group">
                    <button className="action-btn edit" onClick={() => {
                      setEditingProduct(item);
                      setModalOpen(true);
                    }}>
                      <MdEditSquare size={22} />
                    </button>

                    {item.status ? (
                      <button className="action-btn delete" onClick={() => {
                        setProductToChangeStatus(item);
                        setActionType('deactivate');
                        setConfirmOpen(true);
                      }}>
                        <MdOutlineDeleteOutline size={22} />
                      </button>
                    ) : (
                      <button className="action-btn activate" onClick={() => {
                        setProductToChangeStatus(item);
                        setActionType('activate');
                        setConfirmOpen(true);
                      }}>
                        <MdReplay size={22} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <AddProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onCreated={() => {
          setModalOpen(false);
          setEditingProduct(null);
          fetchProducts();
        }}
        editingData={editingProduct}
        categories={categories}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setProductToChangeStatus(null);
        }}
        onConfirm={handleStatusChange}
        message={`¿Seguro que deseas ${actionType === 'deactivate' ? 'desactivar' : 'activar'} "${productToChangeStatus?.name}"?`}
      />

      <style>
        {`
          .wishlist-table {
            padding: 2rem;
            border-radius: 20px;
            background: #fff0f5;
            box-shadow: 0 0 25px rgba(255, 192, 203, 0.2);
            margin-bottom: 2rem;
            font-family: 'Poppins', sans-serif;
          }

          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 14px;
          }

          thead tr {
            background: linear-gradient(to right, #f8c8dc, #ffe0b2);
            color: #5c2a3d;
            font-weight: 600;
            font-size: 1.05rem;
          }

          thead th {
            padding: 1.2rem 1.5rem;
          }


          tbody tr:hover {
            background-color: #ffebf0;
            transform: scale(1.003);
            transition: all 0.2s ease;
          }

          tbody td:last-child {
            display: flex;
            align-items: center;
            gap: 0.6rem;
          }

          .action-btn {
            background-color: #ffffff;
            border: 1px solid rgba(125, 91, 166, 0.15); 
            border-radius: 50%;
            padding: 10px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(92, 42, 61, 0.08); 
          }

          .action-btn svg {
            color: inherit;
            transition: color 0.2s ease;
          }

          .action-btn.edit {
            color: #7d5ba6; 
          }

          .action-btn.edit:hover {
            background-color: #ede5f7; 
            border-color: #7d5ba6;
            transform: scale(1.15);
          }

          .action-btn.delete {
            color: #cf5b5b;
          }

          .action-btn.delete:hover {
            background-color: #fbe6e6; 
            border-color: #cf5b5b;
            transform: scale(1.15);
          }

          .action-btn.activate {
            color: #3f51b5;
          }

          .action-btn.activate:hover {
            background-color: #e0e7ff; 
            border-color: #3f51b5;
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

          .wishlist-table img {
            width: 120px; 
            height: 120px; 
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
          }

          .wishlist-table img:hover {
            transform: scale(1.05);
          }

          .action-group {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
          }
          .multiline-cell {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }

          .name {
            max-width: 250px;
            -webkit-line-clamp: 2;
          }

          .description {
            max-width: 250px;
            -webkit-line-clamp: 3;
          }

        `}
      </style>
    </div>
  );
};

export default ProductsTable;