import React from 'react';
import { MdClose } from 'react-icons/md';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop">
        <div className="confirm-modal">
          <div className="confirm-header">
            <h4>¿Estás seguro?</h4>
            <button onClick={onClose} className="close-btn"><MdClose size={20} /></button>
          </div>
          <p className="confirm-message">{message || 'Esta acción no se puede deshacer.'}</p>
          <div className="confirm-actions">
            <button className="fz-1-banner-btn" onClick={onConfirm}>Confirmar</button>
            <button className="fz-1-banner-btn cancel-btn" onClick={onClose}>Cancelar</button>
          </div>
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

        .confirm-modal {
          background: #fff7f5;
          padding: 2rem;
          border-radius: 16px;
          width: 400px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
          font-family: 'Poppins', sans-serif;
        }

        .confirm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .confirm-header h4 {
          margin: 0;
          color: #5c2a3d;
          font-size: 1.3rem;
        }

        .confirm-message {
          color: #6b4b4b;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .confirm-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
        }
      `}</style>
    </>
  );
};

export default ConfirmModal;