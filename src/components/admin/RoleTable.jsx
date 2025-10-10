import React, { useEffect, useState } from 'react';
import { MdEditSquare, MdOutlineDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import RoleService from '../../service/admin/RoleService';
import AdminModal from './AdminModal';
import ConfirmModal from '../modals/confirmModal';

const RoleTable = () => {
  const [dataBody, setDataBody] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dataToDeactivate, setDataToDeactivate] = useState(null);

  const roleService = new RoleService();
  const fetchClients = () => {
    setLoading(true);

    roleService.listRoles()
    .then(res => {
        setDataBody(res.data || []);
    })
    .catch(() => {
        toast.error('Error cargando roles');
    })
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const createRole = (data) => {
    roleService.createRole(data)
    .then(() => {
        toast.success('Rol creado exitosamente');
        fetchClients();
    })
    .catch(() => {
        toast.error('Error creando el rol');
    });
  };

  const updateRole = (id, data) => {
    roleService.updateRole(id, data)
    .then(() => {
        toast.success('Rol actualizado exitosamente');
        fetchClients();
    })
    .catch(() => {
        toast.error('Error actualizando el rol');
    });
  };

  const handleDeactivate = () => {
    roleService.deleteRole(dataToDeactivate.id)
    .then(() => {
        toast.success('Rol desactivado exitosamente');
        fetchClients();
    })
    .catch(() => {
        toast.error('Error desactivando el rol');
    });
  };

  return (
    <div className="clients-table">
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button
          className="fz-1-banner-btn"
          onClick={() => {
            setEditingData(null);
            setModalOpen(true);
          }}
        >
          + Nuevo Rol
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7">Cargando roles...</td></tr>
          ) : dataBody.length === 0 ? (
            <tr><td colSpan="7">No hay roles disponibles.</td></tr>
          ) : (
            dataBody.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
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
                  <button
                        className="action-btn delete"
                        onClick={() => {
                            setDataToDeactivate(item);
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

      <AdminModal
        isOpen={modalOpen}
        templateData={{ name: '' }}
        placeholderData={['Nombre del Rol']}
        typeData={['text']}
        title='Rol'
        onCancel={() => {
          setModalOpen(false);
          setEditingData(null);
        }}
        onSaved={(resource, body) => {
            if (resource) {
                updateRole(resource.id, body);
            } else {
                createRole(body);
            }

            setModalOpen(false);
            setEditingData(null);
        }}
        editingData={editingData}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setDataToDeactivate(null);
        }}
        onConfirm={() => {
            handleDeactivate()
            setConfirmOpen(false);  
        }}
        message={`¿Seguro que deseas desactivar a "${dataToDeactivate?.name}"?`}
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

export default RoleTable;
