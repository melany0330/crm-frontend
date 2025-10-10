import React, { useEffect, useState } from 'react';
import ClientService from '../../service/client/ClientService';
import ClientModal from './ClientModal';
import { MdEditSquare } from 'react-icons/md';
import { toast } from 'react-toastify';

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = () => {
    setLoading(true);
    ClientService.listClients()
      .then(res => {
        setClients(res.data || []);
      })
      .catch(() => {
        toast.error('Error cargando clientes');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="clients-table">
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button
          className="fz-1-banner-btn"
          onClick={() => {
            setEditingClient(null);
            setModalOpen(true);
          }}
        >
          + Nuevo Cliente
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>NIT</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7">Cargando clientes...</td></tr>
          ) : clients.length === 0 ? (
            <tr><td colSpan="7">No hay clientes disponibles.</td></tr>
          ) : (
            clients.map(client => (
              <tr key={client.idClient}>
                <td>{client.nit}</td>
                <td>{client.firstName}</td>
                <td>{client.lastName}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
                <td>
                  <button
                    className="action-btn edit"
                    onClick={() => {
                      setEditingClient(client);
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

      <ClientModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingClient(null);
        }}
        onSaved={() => {
          setModalOpen(false);
          setEditingClient(null);
          fetchClients();
        }}
        editingClient={editingClient}
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

export default ClientsTable;
