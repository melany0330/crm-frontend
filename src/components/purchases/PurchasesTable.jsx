import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdExpandMore, MdExpandLess, MdOutlineDeleteOutline } from 'react-icons/md';
import ConfirmModal from '../modals/confirmModal';
import { toast } from 'react-toastify';
import { getPurchases, deactivatePurchase } from '../../service/purchases/purchaseService';
import { useNavigate } from 'react-router-dom';

const BASE_URL = `${import.meta.env.VITE_WMS_PROTOCOL}://${import.meta.env.VITE_WMS_NAME}:${import.meta.env.VITE_WMS_PORT}`;

const PurchasesTable = () => {
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [purchaseToDeactivate, setPurchaseToDeactivate] = useState(null);

const fetchPurchases = async () => {
  try {
    const data = await getPurchases();
    setPurchases(data);
  } catch {
    toast.error('Error al cargar compras');
  }
};

  useEffect(() => {
    fetchPurchases();
  }, []);

const handleDeactivate = async () => {
  try {
    await deactivatePurchase(purchaseToDeactivate);
    toast.success('Compra desactivada correctamente');
    fetchPurchases();
  } catch {
    toast.error('No fue posible desactivar la compra');
  } finally {
    setConfirmOpen(false);
    setPurchaseToDeactivate(null);
  }
};

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="purchases-container">
            <div className="d-flex justify-content-end mb-3">
        <button
          className="fz-1-banner-btn"
          onClick={() => navigate('/newPurchase')}
        >
          + Nueva Compra
        </button>
      </div>
      {purchases.map(purchase => (
        <div key={purchase.idPurchaseBill} className="purchase-card">
          <div className="purchase-header" onClick={() => toggleExpand(purchase.idPurchaseBill)}>
            <div>
              <strong>Factura:</strong> {purchase.series}-{purchase.billNumber}
              <br />
              <strong>Proveedor:</strong> {purchase.purchase.provider.name}
              <br />
              <strong>Total Factura:</strong> Q{purchase.billTotal.toFixed(2)}
              <br />
              <strong>Total Compra:</strong> Q{purchase.purchase.totalAmount.toFixed(2)}

            </div>
            <div className="icon-group">
              <button
                className="action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setPurchaseToDeactivate(purchase.purchase.idPurchase);
                  setConfirmOpen(true);
                }}
              >
                <MdOutlineDeleteOutline size={22} />
              </button>
              <button className="expand-btn">
                {expanded === purchase.idPurchaseBill ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
              </button>
            </div>
          </div>

          {expanded === purchase.idPurchaseBill && (
            <div className="purchase-details">
              <p><strong>Fecha de Emisión:</strong> {new Date(purchase.issueDate).toLocaleDateString()}</p>
              <p><strong>Fecha de Compra:</strong> {new Date(purchase.purchase.purchaseDate).toLocaleDateString()}</p>
              <br/>
              <p><strong>NIT:</strong> {purchase.purchase.provider.nit}</p>
              <p><strong>Email:</strong> {purchase.purchase.provider.email}</p>
              <p><strong>Teléfono:</strong> {purchase.purchase.provider.phone}</p>
              <p><strong>Dirección:</strong> {purchase.purchase.provider.address}</p>

              <div className="purchase-products">
                <br></br>
                <h5>Productos comprados:</h5>
                <ul>
                  {purchase.purchase.details.map((d, idx) => (
                    <li key={idx}>
                      <strong>{d.product.name}</strong> — Cantidad: {d.amount} — Precio de venta: Q{d.product.salePrice.toFixed(2)} — Categoría: {d.product.category.categoryName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeactivate}
        message="¿Seguro que deseas desactivar esta compra?"
      />

      <style>{`
        .purchases-container {
          padding: 2rem;
          font-family: 'Poppins', sans-serif;
        }

        .purchase-card {
          background: #fff0f5;
          border-radius: 16px;
          box-shadow: 0 0 25px rgba(255, 192, 203, 0.15);
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .purchase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .purchase-header:hover {
          background: #ffeaf0;
          border-radius: 12px;
        }

        .icon-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .expand-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #5c2a3d;
        }

        .purchase-details {
          margin-top: 1rem;
          font-size: 0.95rem;
          color: #444;
        }

        .purchase-products ul {
          padding-left: 1rem;
          margin: 0.5rem 0 0;
        }

        .purchase-products li {
          margin-bottom: 0.4rem;
        }

        .action-btn.delete {
          background-color: #ffffff;
          border: 1px solid rgba(207, 91, 91, 0.2); 
          border-radius: 50%;
          padding: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease-in-out;
          color: #cf5b5b;
        }

        .action-btn.delete:hover {
          background-color: #fbe6e6;
          border-color: #cf5b5b;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default PurchasesTable;