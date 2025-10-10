import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MovementModal = ({
    isOpen,
    onCancel,
    templateData,
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
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.amount || !form.reason) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        try {
            if (editingData) {
                onSaved(editingData.id, { amount: form.amount, reason: form.reason });
            } else {
                onSaved(null, form);
            }
        } catch (err) {
            toast.error('No fue posible guardar el movimiento');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop">
                <div className="modal-container">
                    <h4 className="modal-title">
                        {editingData ? `Editar ${title}` : `Nuevo ${title}`}
                    </h4>
                    <form onSubmit={handleSubmit}>
                       
                        <input
                            className="modal-input"
                            type="text"
                            name="amount"
                            value={form.amount || ''}
                            onChange={handleChange}
                            placeholder="Cantidad"
                            required
                        />
                        <input
                            className="modal-input"
                            type="text"
                            name="reason"
                            value={form.reason || ''}
                            onChange={handleChange}
                            placeholder="Razón"
                            required
                        />

                        <div className="modal-actions">
                            <button type="submit" className="fz-1-banner-btn">
                                {editingData ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                className="fz-1-banner-btn cancel-btn"
                                onClick={onCancel}
                            >
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
            `}</style>
        </>
    );
};

export default MovementModal;
