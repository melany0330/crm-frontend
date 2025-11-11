// src/service/crm/segmentation.service.js
import ClientsService from './clients.service.js';
import SalesService from './sales.service.js';
import ActivitiesService from './activities.service.js';

class SegmentationService {
    /**
     * Segmentación por comportamiento de compra
     * Combina datos de clientes, ventas y actividades para crear segmentos
     */
    async segmentClientsByPurchaseBehavior() {
        try {
            const clients = await ClientsService.list();
            const segmentedClients = [];

            for (const client of clients) {
                try {
                    // Obtener ventas y actividades del cliente
                    const sales = await SalesService.listByClient(client.idClient || client.id);
                    const activities = await ActivitiesService.listByClient(client.idClient || client.id);

                    // Calcular métricas
                    const totalPurchases = sales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);
                    const purchaseCount = sales.length;
                    const lastActivity = activities.length > 0 ? activities[0]?.activityDate : null;
                    const lastPurchase = sales.length > 0 ? sales[0]?.saleDate : null;

                    // Calcular días desde última actividad/compra
                    const daysSinceLastActivity = lastActivity
                        ? Math.floor((new Date() - new Date(lastActivity)) / (1000 * 60 * 60 * 24))
                        : null;

                    const daysSinceLastPurchase = lastPurchase
                        ? Math.floor((new Date() - new Date(lastPurchase)) / (1000 * 60 * 60 * 24))
                        : null;

                    // Promedio de compra
                    const avgPurchaseValue = purchaseCount > 0 ? totalPurchases / purchaseCount : 0;

                    segmentedClients.push({
                        ...client,
                        metrics: {
                            totalPurchases: totalPurchases,
                            purchaseCount: purchaseCount,
                            avgPurchaseValue: avgPurchaseValue,
                            activitiesCount: activities.length,
                            lastActivity: lastActivity,
                            lastPurchase: lastPurchase,
                            daysSinceLastActivity: daysSinceLastActivity,
                            daysSinceLastPurchase: daysSinceLastPurchase
                        },
                        segment: this.categorizeClient(totalPurchases, purchaseCount, daysSinceLastPurchase),
                        priority: this.calculateClientPriority(totalPurchases, purchaseCount, daysSinceLastActivity)
                    });
                } catch (clientError) {
                    console.warn(`Error processing client ${client.idClient}:`, clientError);
                    // Agregar cliente sin métricas si hay error
                    segmentedClients.push({
                        ...client,
                        metrics: {
                            totalPurchases: 0,
                            purchaseCount: 0,
                            avgPurchaseValue: 0,
                            activitiesCount: 0,
                            lastActivity: null,
                            lastPurchase: null,
                            daysSinceLastActivity: null,
                            daysSinceLastPurchase: null
                        },
                        segment: 'Prospecto',
                        priority: 'Baja'
                    });
                }
            }

            return segmentedClients;
        } catch (error) {
            console.error('Error segmenting clients by purchase behavior:', error);
            throw error;
        }
    }

    /**
     * Categorizar cliente según su comportamiento de compra
     */
    categorizeClient(totalPurchases, purchaseCount, daysSinceLastPurchase) {
        // Cliente VIP: Compras altas y frecuentes
        if (totalPurchases > 10000 && purchaseCount > 5) {
            return 'VIP';
        }

        // Cliente Premium: Compras moderadas regulares
        if (totalPurchases > 5000 && purchaseCount > 2) {
            return 'Premium';
        }

        // Cliente en Riesgo: Tenía compras pero hace tiempo que no compra
        if (purchaseCount > 0 && daysSinceLastPurchase > 180) {
            return 'En Riesgo';
        }

        // Cliente Regular: Ha comprado pero montos/frecuencia bajos
        if (purchaseCount > 0) {
            return 'Regular';
        }

        // Prospecto: Sin compras registradas
        return 'Prospecto';
    }

    /**
     * Calcular prioridad del cliente para campañas
     */
    calculateClientPriority(totalPurchases, purchaseCount, daysSinceLastActivity) {
        let score = 0;

        // Puntaje por valor de compras
        if (totalPurchases > 10000) score += 3;
        else if (totalPurchases > 5000) score += 2;
        else if (totalPurchases > 1000) score += 1;

        // Puntaje por frecuencia
        if (purchaseCount > 5) score += 2;
        else if (purchaseCount > 2) score += 1;

        // Puntaje por actividad reciente
        if (daysSinceLastActivity !== null) {
            if (daysSinceLastActivity < 30) score += 2;
            else if (daysSinceLastActivity < 90) score += 1;
            else if (daysSinceLastActivity > 365) score -= 1;
        }

        if (score >= 5) return 'Alta';
        if (score >= 3) return 'Media';
        return 'Baja';
    }

    /**
     * Segmentación por demografía y ubicación
     */
    async segmentClientsByDemographics(clients = null) {
        try {
            const clientList = clients || await ClientsService.list();

            const segments = {
                byLocation: {},
                byEmailDomain: {},
                byPhoneArea: {}
            };

            clientList.forEach(client => {
                // Segmentación por dirección (extraer ciudad/zona)
                if (client.address) {
                    const location = this.extractLocationFromAddress(client.address);
                    segments.byLocation[location] = (segments.byLocation[location] || 0) + 1;
                }

                // Segmentación por dominio de email
                if (client.email) {
                    const domain = client.email.split('@')[1] || 'unknown';
                    segments.byEmailDomain[domain] = (segments.byEmailDomain[domain] || 0) + 1;
                }

                // Segmentación por área telefónica
                if (client.phone) {
                    const area = this.extractPhoneArea(client.phone);
                    segments.byPhoneArea[area] = (segments.byPhoneArea[area] || 0) + 1;
                }
            });

            return segments;
        } catch (error) {
            console.error('Error segmenting clients by demographics:', error);
            throw error;
        }
    }

    /**
     * Extraer ubicación de la dirección
     */
    extractLocationFromAddress(address) {
        // Buscar patrones comunes en Guatemala
        const zonaMatch = address.match(/zona\s*(\d+)/i);
        if (zonaMatch) return `Zona ${zonaMatch[1]}`;

        const ciudadMatch = address.match(/(guatemala|antigua|escuintla|quetzaltenango|chimaltenango)/i);
        if (ciudadMatch) return ciudadMatch[1];

        return 'Otros';
    }

    /**
     * Extraer área telefónica
     */
    extractPhoneArea(phone) {
        // Remover espacios y caracteres especiales
        const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');

        // Si empieza con 502 (código de Guatemala)
        if (cleanPhone.startsWith('502')) {
            return 'Guatemala';
        }

        // Otros patrones de área telefónica
        if (cleanPhone.match(/^[234567]/)) {
            return 'Nacional';
        }

        return 'Internacional';
    }

    /**
     * Filtrar clientes por segmento específico
     */
    filterClientsBySegment(segmentedClients, segment) {
        return segmentedClients.filter(client => client.segment === segment);
    }

    /**
     * Obtener clientes recomendados para una campaña específica
     */
    getRecommendedClientsForCampaign(segmentedClients, campaignType) {
        switch (campaignType) {
            case 'Promocional':
                // Clientes VIP y Premium que han comprado recientemente
                return segmentedClients.filter(client =>
                    ['VIP', 'Premium'].includes(client.segment) ||
                    (client.metrics.daysSinceLastPurchase && client.metrics.daysSinceLastPurchase < 60)
                );

            case 'Retención':
                // Clientes en riesgo o que no han comprado en un tiempo
                return segmentedClients.filter(client =>
                    client.segment === 'En Riesgo' ||
                    (client.metrics.daysSinceLastPurchase && client.metrics.daysSinceLastPurchase > 90)
                );

            case 'Adquisición':
                // Prospectos y clientes con pocas compras
                return segmentedClients.filter(client =>
                    client.segment === 'Prospecto' ||
                    client.metrics.purchaseCount <= 1
                );

            case 'Fidelización':
                // Clientes regulares y premium
                return segmentedClients.filter(client =>
                    ['Regular', 'Premium', 'VIP'].includes(client.segment)
                );

            default:
                return segmentedClients;
        }
    }

    /**
     * Generar reporte de segmentación
     */
    generateSegmentationReport(segmentedClients) {
        const report = {
            totalClients: segmentedClients.length,
            segments: {},
            priorities: {},
            averageMetrics: {
                totalPurchases: 0,
                purchaseCount: 0,
                avgPurchaseValue: 0
            }
        };

        // Contar por segmentos
        segmentedClients.forEach(client => {
            report.segments[client.segment] = (report.segments[client.segment] || 0) + 1;
            report.priorities[client.priority] = (report.priorities[client.priority] || 0) + 1;
        });

        // Calcular promedios
        const totalPurchases = segmentedClients.reduce((sum, client) => sum + client.metrics.totalPurchases, 0);
        const totalPurchaseCount = segmentedClients.reduce((sum, client) => sum + client.metrics.purchaseCount, 0);

        report.averageMetrics.totalPurchases = totalPurchases / segmentedClients.length;
        report.averageMetrics.purchaseCount = totalPurchaseCount / segmentedClients.length;
        report.averageMetrics.avgPurchaseValue = totalPurchaseCount > 0 ? totalPurchases / totalPurchaseCount : 0;

        return report;
    }
}

export default new SegmentationService();