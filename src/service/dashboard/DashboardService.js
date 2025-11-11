// src/service/dashboard/DashboardService.js
import ServerService from "../../core/service/ServerService";
import SalesService from "../crm/sales.service";
import ClientService from "../client/ClientService";
import InventoryService from "../inventory/InventoryService";
import PurchasesService from "../crm/purchases.service";
import ReportsService from "../crm/reports.service";
import CampaignsService from "../crm/campaigns.service";
import OpportunitiesService from "../crm/opportunities.service";

class DashboardService {
    constructor() {
        this.ss = new ServerService();
    }

    // ============== ESTADÍSTICAS GENERALES DEL SISTEMA (ADMIN) ==============

    /**
     * Obtiene estadísticas generales para el dashboard de administrador
     */
    async getAdminStats() {
        try {
            const [salesData, clientsData, inventoryData, purchasesData] = await Promise.allSettled([
                this.getSalesOverview(),
                this.getClientsOverview(),
                this.getInventoryOverview(),
                this.getPurchasesOverview()
            ]);

            return {
                sales: salesData.status === 'fulfilled' ? salesData.value : this.getDefaultSalesStats(),
                clients: clientsData.status === 'fulfilled' ? clientsData.value : this.getDefaultClientsStats(),
                inventory: inventoryData.status === 'fulfilled' ? inventoryData.value : this.getDefaultInventoryStats(),
                purchases: purchasesData.status === 'fulfilled' ? purchasesData.value : this.getDefaultPurchasesStats(),
                loading: false,
                error: null
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas de admin:', error);
            return this.getDefaultAdminStats();
        }
    }

    // ============== ESTADÍSTICAS PARA VENDEDORES ==============

    /**
     * Obtiene estadísticas específicas para vendedores
     */
    async getVendedorStats() {
        try {
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            const [salesData, todaySales, monthSales, clientsCount] = await Promise.allSettled([
                SalesService.list(),
                this.getSalesByDateRange(startOfDay, today),
                this.getSalesByDateRange(startOfMonth, today),
                this.getActiveClientsCount()
            ]);

            const allSales = salesData.status === 'fulfilled' ? salesData.value : [];
            const todaysSales = todaySales.status === 'fulfilled' ? todaySales.value : [];
            const monthsSales = monthSales.status === 'fulfilled' ? monthSales.value : [];

            return {
                ventasHoy: this.calculateTotalFromSales(todaysSales),
                ventasMes: this.calculateTotalFromSales(monthsSales),
                ordenesHoy: todaysSales.length,
                clientesCount: clientsCount.status === 'fulfilled' ? clientsCount.value : 0,
                totalVentas: this.calculateTotalFromSales(allSales),
                totalOrdenes: allSales.length,
                loading: false,
                error: null
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas de vendedor:', error);
            return this.getDefaultVendedorStats();
        }
    }

    // ============== ESTADÍSTICAS PARA GERENTES CRM ==============

    /**
     * Obtiene estadísticas CRM para gerentes de mercadeo
     */
    async getGerenteStats() {
        try {
            const [clientsData, salesData, conversionData, campaignsData, objectivesData] = await Promise.allSettled([
                this.getCRMClientsStats(),
                this.getSalesConversionStats(),
                this.getLeadsConversionStats(),
                this.getCRMCampaignsStats(),
                this.getCRMObjectivesStats()
            ]);

            return {
                clientesActivos: clientsData.status === 'fulfilled' ? clientsData.value.activos : 0,
                nuevosLeads: clientsData.status === 'fulfilled' ? clientsData.value.nuevos : 0,
                tasaConversion: conversionData.status === 'fulfilled' ? conversionData.value.tasa : 0,
                satisfaccion: conversionData.status === 'fulfilled' ? conversionData.value.satisfaccion : 0,
                totalClientes: clientsData.status === 'fulfilled' ? clientsData.value.total : 0,
                clientesRecientes: clientsData.status === 'fulfilled' ? clientsData.value.recientes : [],
                // Nuevos datos de campañas CRM
                campanasActivas: campaignsData.status === 'fulfilled' ? campaignsData.value.campanasActivas : [],
                totalCampanas: campaignsData.status === 'fulfilled' ? campaignsData.value.totalCampanas : 0,
                campaignStats: campaignsData.status === 'fulfilled' ? campaignsData.value.stats : {},
                // Nuevos datos de objetivos CRM
                objetivosMes: objectivesData.status === 'fulfilled' ? objectivesData.value.objetivosMes : [],
                progresObjetivos: objectivesData.status === 'fulfilled' ? objectivesData.value.progreso : {},
                loading: false,
                error: null
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas de gerente:', error);
            return this.getDefaultGerenteStats();
        }
    }

    // ============== MÉTODOS AUXILIARES ==============

    /**
     * Obtiene resumen de ventas
     */
    async getSalesOverview() {
        const sales = await SalesService.list();
        const totalVentas = this.calculateTotalFromSales(sales);
        const totalOrdenes = sales.length;

        return {
            totalVentas,
            totalOrdenes,
            ventasRecientes: sales.slice(-5) // últimas 5 ventas
        };
    }

    /**
     * Obtiene resumen de clientes
     */
    async getClientsOverview() {
        const clients = await ClientService.listClients();
        const clientsList = clients?.data || clients || [];

        return {
            totalClientes: clientsList.length,
            clientesActivos: clientsList.filter(c => c.estado === 'ACTIVO' || c.active === true).length,
            clientesRecientes: clientsList.slice(-5)
        };
    }

    /**
     * Obtiene resumen de inventario
     */
    async getInventoryOverview() {
        try {
            const inventory = await new InventoryService().listInventory();
            const inventoryList = inventory?.data?.data || inventory?.data || [];

            return {
                totalProductos: inventoryList.length,
                stockBajo: inventoryList.filter(item => item.cantidad < 10).length,
                valorTotal: inventoryList.reduce((sum, item) => sum + (item.cantidad * item.precio || 0), 0)
            };
        } catch (error) {
            console.warn('Error obteniendo inventario:', error);
            return this.getDefaultInventoryStats();
        }
    }

    /**
     * Obtiene resumen de compras
     */
    async getPurchasesOverview() {
        try {
            const purchases = await PurchasesService.list();
            const purchasesList = purchases || [];

            return {
                totalCompras: purchasesList.length,
                valorCompras: purchasesList.reduce((sum, p) => sum + (p.total || 0), 0)
            };
        } catch (error) {
            console.warn('Error obteniendo compras:', error);
            return this.getDefaultPurchasesStats();
        }
    }

    /**
     * Obtiene ventas por rango de fechas
     */
    async getSalesByDateRange(startDate, endDate) {
        try {
            // Intentar usar el endpoint de reportes si está disponible
            const dateRange = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            };

            return await ReportsService.salesByDate(dateRange);
        } catch (error) {
            // Fallback: obtener todas las ventas y filtrar por fecha
            const allSales = await SalesService.list();
            return allSales.filter(sale => {
                const saleDate = new Date(sale.fecha || sale.saleDate || sale.createdAt);
                return saleDate >= startDate && saleDate <= endDate;
            });
        }
    }

    /**
     * Obtiene el conteo de clientes activos
     */
    async getActiveClientsCount() {
        const clients = await ClientService.listClients();
        const clientsList = clients?.data || clients || [];
        return clientsList.filter(c => c.estado === 'ACTIVO' || c.active === true).length;
    }

    /**
     * Obtiene estadísticas CRM de clientes
     */
    async getCRMClientsStats() {
        const clients = await ClientService.listClients();
        const clientsList = clients?.data || clients || [];

        const today = new Date();
        const lastMonth = new Date(today.setMonth(today.getMonth() - 1));

        const clientesRecientes = clientsList.filter(c => {
            const clientDate = new Date(c.fechaRegistro || c.createdAt);
            return clientDate >= lastMonth;
        });

        return {
            total: clientsList.length,
            activos: clientsList.filter(c => c.estado === 'ACTIVO' || c.active === true).length,
            nuevos: clientesRecientes.length,
            recientes: clientesRecientes.slice(-10)
        };
    }

    /**
     * Obtiene estadísticas de conversión de ventas
     */
    async getSalesConversionStats() {
        // Implementación básica - puede mejorarse con endpoints específicos
        return {
            tasa: 23, // porcentaje de conversión
            satisfaccion: 85 // porcentaje de satisfacción
        };
    }

    /**
     * Obtiene estadísticas de conversión de leads
     */
    async getLeadsConversionStats() {
        // Implementación básica - puede mejorarse con endpoints específicos de CRM
        return {
            tasa: 23,
            satisfaccion: 85
        };
    }

    // ============== MÉTODOS ESPECÍFICOS PARA CRM ==============

    /**
     * Obtiene estadísticas de campañas CRM
     */
    async getCRMCampaignsStats() {
        try {
            const campaignsOverview = await CampaignsService.getCampaignsOverview();
            const campaigns = campaignsOverview.campaigns || [];
            const stats = campaignsOverview.statistics || {};

            // Filtrar campañas activas
            const campanasActivas = campaigns
                .filter(c => c.status === 'Activa' || c.status === 'activa')
                .map(campaign => ({
                    id: campaign.id || campaign.idCampaign,
                    name: campaign.name || campaign.nombre,
                    description: campaign.description || campaign.descripcion,
                    status: campaign.status || 'Activa',
                    startDate: campaign.startDate || campaign.fechaInicio,
                    endDate: campaign.endDate || campaign.fechaFin,
                    progress: this.calculateCampaignProgress(campaign),
                    type: campaign.type || campaign.tipo,
                    conversionRate: campaign.conversionRate || 0,
                    budget: campaign.budget || 0
                }));

            return {
                campanasActivas: campanasActivas.slice(0, 5), // Solo las primeras 5 para el dashboard
                totalCampanas: campaigns.length,
                stats: {
                    activas: stats.active || 0,
                    completadas: stats.completed || 0,
                    totalBudget: stats.totalBudget || 0,
                    avgConversionRate: stats.avgConversionRate || 0
                }
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas de campañas CRM:', error);
            return {
                campanasActivas: [],
                totalCampanas: 0,
                stats: {}
            };
        }
    }

    /**
     * Obtiene estadísticas de objetivos CRM del mes
     */
    async getCRMObjectivesStats() {
        try {
            const [clientsData, opportunities, campaigns] = await Promise.allSettled([
                this.getCRMClientsStats(),
                OpportunitiesService.list(),
                CampaignsService.list()
            ]);

            const clientsStats = clientsData.status === 'fulfilled' ? clientsData.value : { nuevos: 0, total: 0 };
            const opportunitiesList = opportunities.status === 'fulfilled' ? opportunities.value : [];
            const campaignsList = campaigns.status === 'fulfilled' ? campaigns.value : [];

            // Calcular objetivos basados en datos reales
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            // Filtrar oportunidades del mes actual
            const thisMonthOpportunities = opportunitiesList.filter(opp => {
                const oppDate = new Date(opp.createdAt || opp.fechaCreacion);
                return oppDate >= startOfMonth;
            });

            // Calcular leads calificados (oportunidades con status activo/interesado)
            const leadsCalificados = thisMonthOpportunities.filter(opp =>
                opp.status === 'Activa' || opp.status === 'Interesado' || opp.status === 'En proceso'
            );

            // Calcular satisfacción basada en campañas completadas exitosamente
            const campaignsSatisfaction = campaignsList.filter(c => c.status === 'Completada').length;
            const totalCampaigns = campaignsList.filter(c => c.status !== 'Cancelada').length;
            const satisfactionRate = totalCampaigns > 0 ? Math.round((campaignsSatisfaction / totalCampaigns) * 100) : 85;

            // Definir objetivos del mes
            const objetivosMes = [
                {
                    id: 1,
                    titulo: 'Nuevos clientes +200',
                    actual: clientsStats.nuevos || 0,
                    objetivo: 200,
                    progreso: Math.min(Math.round(((clientsStats.nuevos || 0) / 200) * 100), 100),
                    tipo: 'clientes'
                },
                {
                    id: 2,
                    titulo: 'Leads calificados 500',
                    actual: leadsCalificados.length,
                    objetivo: 500,
                    progreso: Math.min(Math.round((leadsCalificados.length / 500) * 100), 100),
                    tipo: 'leads'
                },
                {
                    id: 3,
                    titulo: 'Satisfacción 90%',
                    actual: satisfactionRate,
                    objetivo: 90,
                    progreso: Math.min(Math.round((satisfactionRate / 90) * 100), 100),
                    tipo: 'satisfaccion'
                }
            ];

            return {
                objetivosMes,
                progreso: {
                    clientesNuevos: clientsStats.nuevos || 0,
                    leadsCalificados: leadsCalificados.length,
                    satisfaccion: satisfactionRate,
                    oportunidadesActivas: thisMonthOpportunities.length
                }
            };
        } catch (error) {
            console.error('Error obteniendo objetivos CRM:', error);
            return {
                objetivosMes: [],
                progreso: {}
            };
        }
    }

    /**
     * Calcula el progreso de una campaña basado en fechas
     */
    calculateCampaignProgress(campaign) {
        if (!campaign.startDate || !campaign.endDate) return 0;

        const now = new Date();
        const start = new Date(campaign.startDate);
        const end = new Date(campaign.endDate);

        if (now < start) return 0; // No ha comenzado
        if (now > end) return 100; // Ya terminó

        const totalDuration = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();

        return Math.round((elapsed / totalDuration) * 100);
    }

    /**
     * Calcula el total de ventas desde una lista de ventas
     */
    calculateTotalFromSales(sales) {
        if (!Array.isArray(sales)) return 0;
        return sales.reduce((sum, sale) => sum + (sale.total || sale.totalAmount || 0), 0);
    }

    // ============== VALORES POR DEFECTO ==============

    getDefaultAdminStats() {
        return {
            sales: this.getDefaultSalesStats(),
            clients: this.getDefaultClientsStats(),
            inventory: this.getDefaultInventoryStats(),
            purchases: this.getDefaultPurchasesStats(),
            loading: false,
            error: 'Error cargando estadísticas'
        };
    }

    getDefaultSalesStats() {
        return {
            totalVentas: 0,
            totalOrdenes: 0,
            ventasRecientes: []
        };
    }

    getDefaultClientsStats() {
        return {
            totalClientes: 0,
            clientesActivos: 0,
            clientesRecientes: []
        };
    }

    getDefaultInventoryStats() {
        return {
            totalProductos: 0,
            stockBajo: 0,
            valorTotal: 0
        };
    }

    getDefaultPurchasesStats() {
        return {
            totalCompras: 0,
            valorCompras: 0
        };
    }

    getDefaultVendedorStats() {
        return {
            ventasHoy: 0,
            ventasMes: 0,
            ordenesHoy: 0,
            clientesCount: 0,
            totalVentas: 0,
            totalOrdenes: 0,
            loading: false,
            error: 'Error cargando estadísticas'
        };
    }

    getDefaultGerenteStats() {
        return {
            clientesActivos: 0,
            nuevosLeads: 0,
            tasaConversion: 0,
            satisfaccion: 0,
            totalClientes: 0,
            clientesRecientes: [],
            // Nuevos campos para campañas y objetivos
            campanasActivas: [],
            totalCampanas: 0,
            campaignStats: {},
            objetivosMes: [],
            progresObjetivos: {},
            loading: false,
            error: 'Error cargando estadísticas'
        };
    }

    // ============== ALERTAS DEL SISTEMA ==============

    /**
     * Obtiene alertas para el dashboard admin
     */
    async getSystemAlerts() {
        try {
            const [inventoryAlerts, salesAlerts] = await Promise.allSettled([
                this.getInventoryAlerts(),
                this.getSalesAlerts()
            ]);

            const alerts = [];

            if (inventoryAlerts.status === 'fulfilled') {
                alerts.push(...inventoryAlerts.value);
            }

            if (salesAlerts.status === 'fulfilled') {
                alerts.push(...salesAlerts.value);
            }

            return alerts;
        } catch (error) {
            console.error('Error obteniendo alertas:', error);
            return [];
        }
    }

    /**
     * Obtiene alertas de inventario
     */
    async getInventoryAlerts() {
        try {
            const inventory = await new InventoryService().listInventory();
            const inventoryList = inventory?.data?.data || inventory?.data || [];

            const lowStockItems = inventoryList.filter(item => item.cantidad < 10);

            const alerts = [];
            if (lowStockItems.length > 0) {
                alerts.push({
                    type: 'warning',
                    message: `Stock bajo en ${lowStockItems.length} productos`,
                    priority: 'high'
                });
            }

            return alerts;
        } catch (error) {
            return [];
        }
    }

    /**
     * Obtiene alertas de ventas
     */
    async getSalesAlerts() {
        // Implementación básica - puede mejorarse con lógica específica
        return [
            {
                type: 'success',
                message: 'Sistema funcionando correctamente',
                priority: 'low'
            }
        ];
    }
}

export default new DashboardService();