// src/service/crm/campaigns.service.js
import ServerService from "../../core/service/ServerService";

class CampaignsService {
  ss = new ServerService();

  /**
   * Listar todas las campañas
   * GET /api/campaigns/list
   */
  list() {
    return this.ss.authSend("/api/campaigns/list", "GET")
      .then(r => r.data?.data ?? r.data)
      .catch(error => {
        console.error('Error fetching campaigns:', error);
        throw error;
      });
  }

  /**
   * Obtener campaña por ID
   * GET /api/campaigns/listById/{id}
   */
  getById(idCampaign) {
    return this.ss.authSend(`/api/campaigns/listById/${idCampaign}`, "GET")
      .then(r => r.data?.data ?? r.data)
      .catch(error => {
        console.error('Error fetching campaign:', error);
        throw error;
      });
  }

  /**
   * Crear nueva campaña
   * POST /api/campaigns/create
   * @param {Object} campaignData - Datos de la campaña
   * @param {string} campaignData.name - Nombre de la campaña
   * @param {string} campaignData.description - Descripción
   * @param {string} campaignData.startDate - Fecha de inicio (ISO string)
   * @param {string} campaignData.endDate - Fecha de fin (ISO string)
   * @param {number} campaignData.budget - Presupuesto
   * @param {string} campaignData.type - Tipo de campaña
   * @param {string} campaignData.objective - Objetivo
   * @param {string} campaignData.channel - Canal
   * @param {string} campaignData.status - Estado
   * @param {number} campaignData.conversionRate - Tasa de conversión
   */
  create(campaignData) {
    return this.ss.authSend("/api/campaigns/create", "POST", campaignData)
      .then(r => r.data?.data ?? r.data)
      .catch(error => {
        console.error('Error creating campaign:', error);
        throw error;
      });
  }

  /**
   * Actualizar campaña
   * PUT /api/campaigns/update/{id}
   */
  update(idCampaign, updateData) {
    return this.ss.authSend(`/api/campaigns/update/${idCampaign}`, "PUT", updateData)
      .then(r => r.data?.data ?? r.data)
      .catch(error => {
        console.error('Error updating campaign:', error);
        throw error;
      });
  }

  /**
   * Desactivar campaña
   * PUT /api/campaigns/deactivate/{id}
   */
  deactivate(idCampaign) {
    return this.ss.authSend(`/api/campaigns/deactivate/${idCampaign}`, "PUT")
      .then(r => r.data?.message ?? r.data)
      .catch(error => {
        console.error('Error deactivating campaign:', error);
        throw error;
      });
  }

  /**
   * Listar clientes de una campaña
   * GET /api/campaigns/{campaignId}/clients
   */
  getCampaignClients(campaignId) {
    return this.ss.authSend(`/api/campaigns/${campaignId}/clients`, "GET")
      .then(r => r.data?.data ?? r.data)
      .catch(error => {
        console.error('Error fetching campaign clients:', error);
        throw error;
      });
  }

  /**
   * Agregar cliente a campaña
   * POST /api/campaigns/clients/add
   * @param {number} campaignId - ID de la campaña
   * @param {number} clientId - ID del cliente
   * @param {string} comments - Comentarios adicionales
   */
  addClientToCampaign(campaignId, clientId, comments = "Cliente agregado a la campaña") {
    const payload = {
      campaignId: campaignId,
      clientId: clientId,
      result: "Pendiente",
      interactionDate: new Date().toISOString(),
      comments: comments
    };

    return this.ss.authSend("/api/campaigns/clients/add", "POST", payload)
      .then(r => r.data?.data ?? r.data)
      .catch(error => {
        console.error('Error adding client to campaign:', error);
        throw error;
      });
  }

  /**
   * Actualizar interacción cliente-campaña
   * PUT /api/campaigns/clients/update/{id}
   * @param {number} campaignClientId - ID de la relación campaña-cliente
   * @param {Object} updateData - Datos a actualizar
   * @param {string} updateData.result - Estado: "Pendiente", "Interesado", "Convertido", "No interesado"
   * @param {string} updateData.comments - Comentarios
   */
  updateCampaignClient(campaignClientId, updateData) {
    const payload = {
      result: updateData.result,
      interactionDate: new Date().toISOString(),
      comments: updateData.comments
    };

    return this.ss.authSend(`/api/campaigns/clients/update/${campaignClientId}`, "PUT", payload)
      .then(r => r.data?.data ?? r.data)
      .catch(error => {
        console.error('Error updating campaign client:', error);
        throw error;
      });
  }

  /**
   * Remover cliente de campaña
   * DELETE /api/campaigns/clients/remove/{id}
   */
  removeClientFromCampaign(campaignClientId) {
    return this.ss.authSend(`/api/campaigns/clients/remove/${campaignClientId}`, "DELETE")
      .then(r => r.data?.message ?? r.data)
      .catch(error => {
        console.error('Error removing client from campaign:', error);
        throw error;
      });
  }

  /**
   * Análisis de efectividad de campaña
   * Combina datos de campaña y clientes para generar métricas
   */
  async analyzeCampaignEffectiveness(campaignId) {
    try {
      const campaign = await this.getById(campaignId);
      const campaignClients = await this.getCampaignClients(campaignId);

      const results = {
        totalClients: campaignClients.length,
        converted: campaignClients.filter(c => c.result === 'Convertido').length,
        interested: campaignClients.filter(c => c.result === 'Interesado').length,
        notInterested: campaignClients.filter(c => c.result === 'No interesado').length,
        pending: campaignClients.filter(c => c.result === 'Pendiente').length
      };

      results.conversionRate = results.totalClients > 0
        ? ((results.converted / results.totalClients) * 100).toFixed(2)
        : 0;

      results.interestRate = results.totalClients > 0
        ? (((results.interested + results.converted) / results.totalClients) * 100).toFixed(2)
        : 0;

      return {
        campaign,
        metrics: results,
        clientDetails: campaignClients
      };
    } catch (error) {
      console.error('Error analyzing campaign effectiveness:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas generales de campañas
   */
  async getCampaignsOverview() {
    try {
      const campaigns = await this.list();

      const stats = {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'Activa').length,
        completed: campaigns.filter(c => c.status === 'Completada').length,
        inactive: campaigns.filter(c => c.status === 'Inactiva').length,
        totalBudget: campaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0),
        avgConversionRate: campaigns.length > 0
          ? (campaigns.reduce((sum, c) => sum + (parseFloat(c.conversionRate) || 0), 0) / campaigns.length).toFixed(2)
          : 0
      };

      return {
        campaigns,
        statistics: stats
      };
    } catch (error) {
      console.error('Error getting campaigns overview:', error);
      throw error;
    }
  }

  /**
   * Utilidades para categorización de campañas
   */
  getCampaignTypes() {
    return [
      'Promocional',
      'Educativa',
      'Retención',
      'Adquisición',
      'Fidelización',
      'Lanzamiento',
      'Seasonal'
    ];
  }

  getCampaignStatuses() {
    return [
      'Planificada',
      'Activa',
      'Pausada',
      'Completada',
      'Cancelada',
      'Inactiva'
    ];
  }

  getChannels() {
    return [
      'Email',
      'Redes Sociales',
      'SMS',
      'Llamadas',
      'Email + Redes Sociales',
      'Multichannel',
      'Presencial',
      'Digital'
    ];
  }

  getClientResultStates() {
    return [
      'Pendiente',
      'Interesado',
      'Convertido',
      'No interesado'
    ];
  }
}

export default new CampaignsService();
