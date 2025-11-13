import { useEffect, useState } from "react";
import CampaignsService from "../../service/crm/campaigns.service.js";
import SegmentationService from "../../service/crm/segmentation.service.js";
import ClientsService from "../../service/crm/clients.service.js";

const v = (o, list) => list.map(k => o?.[k]).find(x => x !== undefined && x !== null);

export default function Campaigns() {
  // Estados principales
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('list'); // 'list', 'create', 'analytics', 'segmentation'
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Estados para creación/edición
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    type: 'Promocional',
    objective: '',
    channel: 'Email',
    status: 'Planificada',
    conversionRate: 0
  });

  // Estados para segmentación
  const [showSegmentationModal, setShowSegmentationModal] = useState(false);
  const [filteredSegments, setFilteredSegments] = useState([]);
  const [segmentationStatus, setSegmentationStatus] = useState(null);
  const [segmentedClients, setSegmentedClients] = useState([]);
  const [segmentationLoading, setSegmentationLoading] = useState(false);

  // Estados para analytics
  const [campaignAnalytics, setCampaignAnalytics] = useState(null);
  const [overviewStats, setOverviewStats] = useState(null);

  // Estados para gestión de campaña
  const [isEditing, setIsEditing] = useState(false);
  const [campaignClients, setCampaignClients] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadCampaigns();
    loadOverviewStats();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await CampaignsService.list();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOverviewStats = async () => {
    try {
      const stats = await CampaignsService.getCampaignsOverview();
      setOverviewStats(stats);
    } catch (error) {
      console.error('Error loading overview stats:', error);
    }
  };

  const loadSegmentedClients = async () => {
    try {
      setSegmentationLoading(true);
      const segmented = await SegmentationService.segmentClientsByPurchaseBehavior();
      setSegmentedClients(segmented);
    } catch (error) {
      console.error('Error loading segmented clients:', error);
    } finally {
      setSegmentationLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await CampaignsService.create(campaignForm);
      alert('Campaña creada exitosamente');
      setCampaignForm({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        type: 'Promocional',
        objective: '',
        channel: 'Email',
        status: 'Planificada',
        conversionRate: 0
      });
      setActiveView('list');
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error al crear la campaña');
    }
  };

  const handleAnalyzeCampaign = async (campaign) => {
    try {
      const analytics = await CampaignsService.analyzeCampaignEffectiveness(campaign.idCampaign);
      setCampaignAnalytics(analytics);
      setSelectedCampaign(campaign);
      setActiveView('analytics');
    } catch (error) {
      console.error('Error analyzing campaign:', error);
      alert('Error al analizar la campaña');
    }
  };

  // Función para activar campaña
  const handleActivateCampaign = async (campaign) => {
    if (confirm(`¿Deseas activar la campaña "${campaign.name}"?`)) {
      try {
        setActionLoading(true);
        await CampaignsService.update(campaign.idCampaign, { status: 'Activa' });
        alert('Campaña activada exitosamente');
        loadCampaigns();
      } catch (error) {
        console.error('Error activating campaign:', error);
        alert('Error al activar la campaña');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Función para pausar campaña
  const handlePauseCampaign = async (campaign) => {
    if (confirm(`¿Deseas pausar la campaña "${campaign.name}"?`)) {
      try {
        setActionLoading(true);
        await CampaignsService.update(campaign.idCampaign, { status: 'Pausada' });
        alert('Campaña pausada exitosamente');
        loadCampaigns();
      } catch (error) {
        console.error('Error pausing campaign:', error);
        alert('Error al pausar la campaña');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Función para completar campaña
  const handleCompleteCampaign = async (campaign) => {
    if (confirm(`¿Deseas marcar como completada la campaña "${campaign.name}"?`)) {
      try {
        setActionLoading(true);
        await CampaignsService.update(campaign.idCampaign, { status: 'Completada' });
        alert('Campaña marcada como completada');
        loadCampaigns();
      } catch (error) {
        console.error('Error completing campaign:', error);
        alert('Error al completar la campaña');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Función para desactivar campaña
  const handleDeactivateCampaign = async (campaign) => {
    if (confirm(`¿Deseas desactivar permanentemente la campaña "${campaign.name}"? Esta acción no se puede deshacer.`)) {
      try {
        setActionLoading(true);
        await CampaignsService.deactivate(campaign.idCampaign);
        alert('Campaña desactivada exitosamente');
        loadCampaigns();
      } catch (error) {
        console.error('Error deactivating campaign:', error);
        alert('Error al desactivar la campaña');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Función para editar campaña
  const handleEditCampaign = (campaign) => {
    setCampaignForm({
      name: campaign.name || '',
      description: campaign.description || '',
      startDate: campaign.startDate ? campaign.startDate.substring(0, 16) : '',
      endDate: campaign.endDate ? campaign.endDate.substring(0, 16) : '',
      budget: campaign.budget || '',
      type: campaign.type || 'Promocional',
      objective: campaign.objective || '',
      channel: campaign.channel || 'Email',
      status: campaign.status || 'Planificada',
      conversionRate: campaign.conversionRate || 0
    });
    setSelectedCampaign(campaign);
    setIsEditing(true);
    setActiveView('create');
  };

  // Función para actualizar campaña
  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await CampaignsService.update(selectedCampaign.idCampaign, campaignForm);
      alert('Campaña actualizada exitosamente');
      setCampaignForm({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        type: 'Promocional',
        objective: '',
        channel: 'Email',
        status: 'Planificada',
        conversionRate: 0
      });
      setIsEditing(false);
      setSelectedCampaign(null);
      setActiveView('list');
      loadCampaigns();
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Error al actualizar la campaña');
    } finally {
      setActionLoading(false);
    }
  };

  // Función para gestionar clientes de campaña
  const handleManageClients = async (campaign) => {
    try {
      setActionLoading(true);
      const clients = await CampaignsService.getCampaignClients(campaign.idCampaign);
      const allClients = await ClientsService.list();

      setCampaignClients(clients);
      setAvailableClients(allClients);
      setSelectedCampaign(campaign);
      setShowClientModal(true);
    } catch (error) {
      console.error('Error loading campaign clients:', error);
      alert('Error al cargar los clientes de la campaña');
    } finally {
      setActionLoading(false);
    }
  };

  // Función para agregar cliente a campaña
  const handleAddClientToCampaign = async (clientId) => {
    try {
      await CampaignsService.addClientToCampaign(selectedCampaign.idCampaign, clientId);
      alert('Cliente agregado exitosamente a la campaña');
      // Recargar clientes de la campaña
      const updatedClients = await CampaignsService.getCampaignClients(selectedCampaign.idCampaign);
      setCampaignClients(updatedClients);
    } catch (error) {
      console.error('Error adding client to campaign:', error);
      alert('Error al agregar cliente a la campaña');
    }
  };

  // Función para remover cliente de campaña
  const handleRemoveClientFromCampaign = async (campaignClientId) => {
    if (confirm('¿Deseas remover este cliente de la campaña?')) {
      try {
        await CampaignsService.removeClientFromCampaign(campaignClientId);
        alert('Cliente removido exitosamente de la campaña');
        // Recargar clientes de la campaña
        const updatedClients = await CampaignsService.getCampaignClients(selectedCampaign.idCampaign);
        setCampaignClients(updatedClients);
      } catch (error) {
        console.error('Error removing client from campaign:', error);
        alert('Error al remover cliente de la campaña');
      }
    }
  };

  // Función para actualizar estado de cliente en campaña
  const handleUpdateClientStatus = async (campaignClientId, newStatus, comments) => {
    try {
      await CampaignsService.updateCampaignClient(campaignClientId, {
        result: newStatus,
        comments: comments
      });
      alert('Estado del cliente actualizado exitosamente');
      // Recargar clientes de la campaña
      const updatedClients = await CampaignsService.getCampaignClients(selectedCampaign.idCampaign);
      setCampaignClients(updatedClients);
    } catch (error) {
      console.error('Error updating client status:', error);
      alert('Error al actualizar el estado del cliente');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-GT');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Activa': '#10b981',
      'Planificada': '#f59e0b',
      'Pausada': '#ef4444',
      'Completada': '#6b7280',
      'Cancelada': '#ef4444',
      'Inactiva': '#9ca3af'
    };
    return colors[status] || '#6b7280';
  };

  const getSegmentColor = (segment) => {
    const colors = {
      'VIP': '#8b5cf6',
      'Premium': '#3b82f6',
      'Regular': '#10b981',
      'En Riesgo': '#f59e0b',
      'Prospecto': '#6b7280'
    };
    return colors[segment] || '#6b7280';
  };

  // Vista de lista de campañas
  const renderCampaignsList = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>📱 Gestión de Campañas</h2>
        <button
          onClick={() => setActiveView('create')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ➕ Nueva Campaña
        </button>
      </div>

      {/* Estadísticas generales */}
      {overviewStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>Total Campañas</h4>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{overviewStats.statistics.total}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>Activas</h4>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{overviewStats.statistics.active}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>Presupuesto Total</h4>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(overviewStats.statistics.totalBudget)}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6' }}>Conversión Promedio</h4>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{overviewStats.statistics.avgConversionRate}%</p>
          </div>
        </div>
      )}

      {/* Tabla de campañas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>🔄 Cargando campañas...</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#667eea', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Presupuesto</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Fechas</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Conversión</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    📭 No hay campañas registradas
                  </td>
                </tr>
              ) : campaigns.map((campaign) => {
                const id = v(campaign, ["idCampaign", "id"]);
                const name = v(campaign, ["name", "nombre"]) || "-";
                const type = v(campaign, ["type", "tipo"]) || "-";
                const status = v(campaign, ["status", "estado"]) || "-";
                const budget = v(campaign, ["budget", "presupuesto"]) || 0;
                const startDate = v(campaign, ["startDate", "fechaInicio"]);
                const endDate = v(campaign, ["endDate", "fechaFin"]);
                const conversionRate = v(campaign, ["conversionRate", "tasaConversion"]) || 0;

                return (
                  <tr key={id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>ID: {id}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{type}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        background: getStatusColor(status) + '20',
                        color: getStatusColor(status)
                      }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{formatCurrency(budget)}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.875rem' }}>
                        <div>📅 {formatDate(startDate)}</div>
                        <div>🏁 {formatDate(endDate)}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: conversionRate > 0 ? '#10b981' : '#666' }}>
                      {conversionRate}%
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* Botón Analizar */}
                        <button
                          onClick={() => handleAnalyzeCampaign(campaign)}
                          disabled={actionLoading}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            opacity: actionLoading ? 0.6 : 1
                          }}
                          title="Analizar campaña"
                        >
                          📊
                        </button>

                        {/* Botón Editar */}
                        <button
                          onClick={() => handleEditCampaign(campaign)}
                          disabled={actionLoading}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            opacity: actionLoading ? 0.6 : 1
                          }}
                          title="Editar campaña"
                        >
                          ✏️
                        </button>

                        {/* Botones condicionales según estado */}
                        {campaign.status === 'Planificada' && (
                          <button
                            onClick={() => handleActivateCampaign(campaign)}
                            disabled={actionLoading}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: actionLoading ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              opacity: actionLoading ? 0.6 : 1
                            }}
                            title="Activar campaña"
                          >
                            ▶️
                          </button>
                        )}

                        {campaign.status === 'Activa' && (
                          <>
                            <button
                              onClick={() => handlePauseCampaign(campaign)}
                              disabled={actionLoading}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: actionLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                opacity: actionLoading ? 0.6 : 1
                              }}
                              title="Pausar campaña"
                            >
                              ⏸️
                            </button>
                            <button
                              onClick={() => handleCompleteCampaign(campaign)}
                              disabled={actionLoading}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#8b5cf6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: actionLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                opacity: actionLoading ? 0.6 : 1
                              }}
                              title="Completar campaña"
                            >
                              ✅
                            </button>
                          </>
                        )}

                        {campaign.status === 'Pausada' && (
                          <button
                            onClick={() => handleActivateCampaign(campaign)}
                            disabled={actionLoading}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: actionLoading ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              opacity: actionLoading ? 0.6 : 1
                            }}
                            title="Reactivar campaña"
                          >
                            ▶️
                          </button>
                        )}

                        {/* Botón Gestionar Clientes */}
                        <button
                          onClick={() => handleManageClients(campaign)}
                          disabled={actionLoading}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            opacity: actionLoading ? 0.6 : 1
                          }}
                          title="Gestionar clientes"
                        >
                          �
                        </button>

                        {/* Botón Desactivar (solo para campañas completadas o pausadas) */}
                        {(campaign.status === 'Completada' || campaign.status === 'Pausada') && (
                          <button
                            onClick={() => handleDeactivateCampaign(campaign)}
                            disabled={actionLoading}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: actionLoading ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              opacity: actionLoading ? 0.6 : 1
                            }}
                            title="Desactivar campaña"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Vista de creación de campaña
  const renderCreateCampaign = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>
          {isEditing ? '✏️ Editar Campaña' : '➕ Nueva Campaña'}
        </h2>
        <button
          onClick={() => {
            setActiveView('list');
            setIsEditing(false);
            setSelectedCampaign(null);
            // Reset form
            setCampaignForm({
              name: '',
              description: '',
              startDate: '',
              endDate: '',
              budget: '',
              type: 'Promocional',
              objective: '',
              channel: 'Email',
              status: 'Planificada',
              conversionRate: 0
            });
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Volver
        </button>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <form onSubmit={isEditing ? handleUpdateCampaign : handleCreateCampaign}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Nombre de la Campaña *
              </label>
              <input
                type="text"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                placeholder="Ej: Campaña Black Friday 2025"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Tipo de Campaña *
              </label>
              <select
                value={campaignForm.type}
                onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                {CampaignsService.getCampaignTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Descripción
              </label>
              <textarea
                value={campaignForm.description}
                onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                placeholder="Describe el objetivo y contenido de la campaña..."
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Fecha de Inicio *
              </label>
              <input
                type="datetime-local"
                value={campaignForm.startDate}
                onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Fecha de Fin *
              </label>
              <input
                type="datetime-local"
                value={campaignForm.endDate}
                onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Presupuesto (GTQ) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={campaignForm.budget}
                onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Canal de Comunicación
              </label>
              <select
                value={campaignForm.channel}
                onChange={(e) => setCampaignForm({ ...campaignForm, channel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                {CampaignsService.getChannels().map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Objetivo de la Campaña
              </label>
              <input
                type="text"
                value={campaignForm.objective}
                onChange={(e) => setCampaignForm({ ...campaignForm, objective: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                placeholder="Ej: Incrementar ventas en 30%"
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setActiveView('list')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {isEditing ? '💾 Actualizar Campaña' : '✅ Crear Campaña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Vista de segmentación
  const renderSegmentation = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>🔍 Segmentación de Clientes</h2>
        <div>
          <button
            onClick={loadSegmentedClients}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          >
            🔄 Actualizar Segmentación
          </button>
          <button
            onClick={() => setActiveView('list')}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
        </div>
      </div>

      {segmentationLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>🔄 Analizando comportamiento de clientes...</p>
        </div>
      ) : segmentedClients.length > 0 ? (
        <div>
          {/* Resumen de segmentación */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {['VIP', 'Premium', 'Regular', 'En Riesgo', 'Prospecto'].map(segment => {
              const count = segmentedClients.filter(c => c.segment === segment).length;
              return (
                <div key={segment} style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: `2px solid ${getSegmentColor(segment)}20`
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: getSegmentColor(segment),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: getSegmentColor(segment) }}>
                    {segment}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabla de clientes segmentados */}
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#8b5cf6', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Cliente</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Segmento</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Total Compras</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Frecuencia</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Última Actividad</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {segmentedClients.slice(0, 50).map(client => {
                  const id = client.idClient || client.id;
                  const name = `${client.firstName || ''} ${client.lastName || ''}`.trim() || client.name || '-';
                  const email = client.email || '-';

                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '600' }}>{name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>{email}</div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          background: getSegmentColor(client.segment) + '20',
                          color: getSegmentColor(client.segment)
                        }}>
                          {client.segment}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>
                        {formatCurrency(client.metrics.totalPurchases)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {client.metrics.purchaseCount} compras
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {client.metrics.daysSinceLastActivity !== null
                          ? `${client.metrics.daysSinceLastActivity} días`
                          : 'Sin actividad'
                        }
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          background: client.priority === 'Alta' ? '#ef444420' :
                            client.priority === 'Media' ? '#f59e0b20' : '#6b728020',
                          color: client.priority === 'Alta' ? '#ef4444' :
                            client.priority === 'Media' ? '#f59e0b' : '#6b7280'
                        }}>
                          {client.priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>📊 Haz clic en "Actualizar Segmentación" para analizar los clientes</p>
        </div>
      )}
    </div>
  );

  // Vista de analytics
  const renderAnalytics = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>📊 Análisis de Campaña: {selectedCampaign?.name}</h2>
        <button
          onClick={() => setActiveView('list')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Volver
        </button>
      </div>

      {campaignAnalytics && (
        <div>
          {/* Métricas principales */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>Total Clientes</h4>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{campaignAnalytics.metrics.totalClients}</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>Convertidos</h4>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{campaignAnalytics.metrics.converted}</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>Interesados</h4>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{campaignAnalytics.metrics.interested}</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6' }}>Tasa de Conversión</h4>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{campaignAnalytics.metrics.conversionRate}%</p>
            </div>
          </div>

          {/* Detalles de clientes en la campaña */}
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0 }}>👥 Clientes en la Campaña</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#667eea', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Cliente</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Estado</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha Interacción</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {campaignAnalytics.clientDetails.map(client => (
                  <tr key={client.idCampaignClient} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>Cliente ID: {client.clientId}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        background: client.result === 'Convertido' ? '#10b98120' :
                          client.result === 'Interesado' ? '#f59e0b20' :
                            client.result === 'No interesado' ? '#ef444420' : '#6b728020',
                        color: client.result === 'Convertido' ? '#10b981' :
                          client.result === 'Interesado' ? '#f59e0b' :
                            client.result === 'No interesado' ? '#ef4444' : '#6b7280'
                      }}>
                        {client.result}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{formatDate(client.interactionDate)}</td>
                    <td style={{ padding: '1rem' }}>{client.comments || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Navegación principal
  const renderNavigation = () => (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
      padding: '0.5rem',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {[
        { key: 'list', label: '📋 Campañas', icon: '📋' },
        { key: 'create', label: '➕ Nueva', icon: '➕' },
        { key: 'segmentation', label: '🔍 Segmentación', icon: '🔍' }
      ].map(nav => (
        <button
          key={nav.key}
          onClick={() => setActiveView(nav.key)}
          style={{
            padding: '0.75rem 1rem',
            background: activeView === nav.key ? '#667eea' : 'transparent',
            color: activeView === nav.key ? 'white' : '#667eea',
            border: `1px solid ${activeView === nav.key ? '#667eea' : '#e5e7eb'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {nav.label}
        </button>
      ))}
    </div>
  );

  // Modal para gestionar clientes de campaña
  const renderClientModal = () => {
    if (!showClientModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflow: 'auto',
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ margin: 0, color: '#333' }}>
              👥 Gestionar Clientes - {selectedCampaign?.name}
            </h2>
            <button
              onClick={() => setShowClientModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              ✕
            </button>
          </div>

          {/* Clientes actuales en la campaña */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Clientes en la Campaña</h3>
            {campaignClients.length > 0 ? (
              <div style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#667eea', color: 'white' }}>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Cliente</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Estado</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignClients.map(cc => (
                      <tr key={cc.idCampaignClient} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem' }}>
                          {cc.Client?.firstName} {cc.Client?.lastName}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={cc.result || 'Pendiente'}
                            onChange={(e) => {
                              const comments = prompt('Comentarios (opcional):');
                              handleUpdateClientStatus(cc.idCampaignClient, e.target.value, comments);
                            }}
                            style={{
                              padding: '0.5rem',
                              border: '1px solid #ddd',
                              borderRadius: '4px'
                            }}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Contactado">Contactado</option>
                            <option value="Interesado">Interesado</option>
                            <option value="Convertido">Convertido</option>
                            <option value="No Interesado">No Interesado</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {cc.contactDate ? new Date(cc.contactDate).toLocaleDateString() : 'Sin contactar'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button
                            onClick={() => handleRemoveClientFromCampaign(cc.idCampaignClient)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No hay clientes asignados a esta campaña</p>
            )}
          </div>

          {/* Agregar nuevos clientes */}
          <div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Agregar Clientes</h3>
            <div style={{
              maxHeight: '300px',
              overflow: 'auto',
              background: '#f8f9fa',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              {availableClients
                .filter(client => !campaignClients.some(cc => cc.idClient === client.idClient))
                .map(client => (
                  <div key={client.idClient} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'white',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div>
                      <strong>{client.firstName} {client.lastName}</strong>
                      <br />
                      <span style={{ color: '#666', fontSize: '0.875rem' }}>
                        {client.email} | {client.phone}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddClientToCampaign(client.idClient)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderNavigation()}

      {activeView === 'list' && renderCampaignsList()}
      {activeView === 'create' && renderCreateCampaign()}
      {activeView === 'segmentation' && renderSegmentation()}
      {activeView === 'analytics' && renderAnalytics()}

      {renderClientModal()}
    </div>
  );
}
