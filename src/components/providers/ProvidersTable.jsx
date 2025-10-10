import React, { useEffect, useState, useContext } from 'react'
import { FarzaaContext } from '../../context/FarzaaContext'
import axios from 'axios'
import AddProviderModal from '../modals/AddProviderModal'
import ConfirmModal from '../modals/confirmModal'
import { MdEditSquare, MdOutlineDeleteOutline } from 'react-icons/md'
import { toast } from 'react-toastify'
import { getProviders, deactivateProvider } from '../../service/providers/providerService';


const ProvidersTable = () => {
  const { addToCartFromWishlist } = useContext(FarzaaContext)
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [providerToDeactivate, setProviderToDeactivate] = useState(null)

const fetchProviders = () => {
  getProviders()
    .then((response) => {
      setProviders(response);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error loading providers:', error);
      setLoading(false);
    });
};

  useEffect(() => {
    fetchProviders()
  }, [])


  const handleDeactivate = async () => {
  if (!providerToDeactivate) return;
  try {
    await deactivateProvider(providerToDeactivate.idProvider);
    toast.success('Proveedor desactivado');
    fetchProviders();
  } catch (error) {
    toast.error('No fue posible desactivar el proveedor');
  } finally {
    setConfirmOpen(false);
    setProviderToDeactivate(null);
  }
};

  return (
    <div className="wishlist-table">
      <div className="d-flex justify-content-end mb-3">
        <button className="fz-1-banner-btn" onClick={() => {
          setEditingProvider(null);
          setModalOpen(true);
        }}>
          + Nuevo Proveedor
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>NIT</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6">Cargando proveedores...</td></tr>
          ) : providers.length === 0 ? (
            <tr><td colSpan="6">No hay proveedores disponibles.</td></tr>
          ) : (
            providers.map((item) => (
              <tr key={item.idProvider}>
  <td>
    <div className="multiline-cell name">{item.name}</div>
  </td>
  <td>{item.nit}</td>
  <td>{item.email}</td>
  <td>{item.phone}</td>
  <td>{item.address}</td>
  <td>
    <button
      className="action-btn edit"
      onClick={() => {
        setEditingProvider(item);
        setModalOpen(true);
      }}
    >
      <MdEditSquare size={22} />
    </button>
    <button
      className="action-btn delete"
      onClick={() => {
        setProviderToDeactivate(item);
        setConfirmOpen(true);
      }}
    >
      <MdOutlineDeleteOutline size={22} />
    </button>
  </td>
</tr>
            ))
          )}
        </tbody>
      </table>

      <AddProviderModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingProvider(null)
        }}
        onCreated={() => {
          setModalOpen(false)
          setEditingProvider(null)
          fetchProviders()
        }}
        editingData={editingProvider}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setProviderToDeactivate(null)
        }}
        onConfirm={handleDeactivate}
        message={`¿Seguro que deseas desactivar a "${providerToDeactivate?.name}"?`}
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
          
        `}
      </style>
    </div>
  )
}

export default ProvidersTable