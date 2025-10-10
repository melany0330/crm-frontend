import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MovementService from '../../service/movement/MmovementService';
import { MdEditSquare } from 'react-icons/md';
import MovementModal from './MovementModal';
import AdminModal from '../admin/AdminModal';

const MovementTable = () => {
    const [dataBody, setDataBody] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [dataToDeactivate, setDataToDeactivate] = useState(null);

    useEffect(() => {
        getTransaction();
    }, []);

    const getTransaction = () => {
        setLoading(true);
        const apiRoles = new MovementService();
        apiRoles.listMovements()
            .then(res => {
                setDataBody(res.data || []);
            })
            .catch((err) => {
                toast.error('Error cargando movimientos');
                console.error(err);
            })
            .finally(() => setLoading(false));
    };

    const updateTransaction = (id, data) => {
        const apiRoles = new MovementService();
        console.log('updateTransaction', id, data);
        apiRoles.updateMovement(id, data)
            .then(() => {
                toast.success('Movimiento actualizado exitosamente');
                getTransaction();
            })
            .catch(() => {
                toast.error('Error actualizando el movimiento');
            });
    };

    return (
        <div className="clients-table">
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button
                    className="fz-1-banner-btn"
                    onClick={getTransaction}
                >
                    Actualizar
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Inventario</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Razón</th>
                        <th>Usuario</th>
                        <th>Tipo</th>
                        <th>Venta</th>
                        <th>Compra</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="9">Cargando movimientos...</td></tr>
                    ) : dataBody.length === 0 ? (
                        <tr><td colSpan="9">No hay movimientos disponibles.</td></tr>
                    ) : (
                        dataBody.map((item, index) => (
                            <tr key={index}>
                                <td>{item.inventory?.myProduct?.name || '-'}</td>
                                <td>{item.amount || 0}</td>
                                <td>{item.movementDate || '-'}</td>
                                <td>{item.reason || '-'}</td>
                                <td>{item.user?.name || '-'}</td>
                                <td>{item.typeMovement?.name || '-'}</td>
                                <td>{item.sale?.idSale || '-'}</td>
                                <td>{item.purchase?.idPurchase || '-'}</td>
                                <td>
                                    <button
                                        className="action-btn edit"
                                        onClick={() => {
                                            setEditingData(item);
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

            <MovementModal
    isOpen={modalOpen}
    templateData={{
        inventory: { id: 0 },
        amount: 0,
        movementDate: '',
        reason: '',
        user: { id: 0 },
        typeMovement: { name: '' },
        sale: { idSale: 0 },
        purchase: { idPurchase: 0 }
    }}
    title='Transacción'
    onCancel={() => {
        setModalOpen(false);
        setEditingData(null);
    }}
    onSaved={(id, body) => {
        if (id) {
            updateTransaction(id, body); 
        } 
        setModalOpen(false);
        setEditingData(null);
    }}
    editingData={editingData}
/>

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

export default MovementTable;
