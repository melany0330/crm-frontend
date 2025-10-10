import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InventoryService from '../../service/inventory/InventoryService';

const InventoryTable = () => {
    const [dataBody, setDataBody] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {        
        getInventory();
    }, []);

    const getInventory = () => {
        setLoading(true);
        const apiRoles = new InventoryService();
        apiRoles.listInventory()
            .then(res => {
                setDataBody(res.data || []);
            })
            .catch((err) => {
                toast.error('Error cargando roles');
                console.error(err);
            })
            .finally(() => setLoading(false));
    };


    return (
        <div className="clients-table">
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button
                className="fz-1-banner-btn"
                onClick={() => {
                    getInventory();
                }}
                >
                Actualizar
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Existencia</th>
                        <th>Fecha de expiración</th>
                        <th>Lote</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="7">Cargando usuario...</td></tr>
                    ) : dataBody.length === 0 ? (
                        <tr><td colSpan="7">No hay usuarios disponibles.</td></tr>
                    ) : (
                        dataBody.map((item, index) => (
                            <tr key={index}>
                                <td>{item.myProduct.name}</td>
                                <td>{item.currentQuantity}</td>
                                <td>{item.expirationDate}</td>
                                <td>{item.batch}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <style>{`
        .clients-table {
          padding: 1.5rem;
          background: #fff0f5;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 0 20px rgba(255,192,203,0.15);
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
      `}</style>
        </div>
    );
};

export default InventoryTable;
