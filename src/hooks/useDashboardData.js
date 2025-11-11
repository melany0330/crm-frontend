// src/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import DashboardService from '../service/dashboard/DashboardService';

/**
 * Hook personalizado para manejar datos del dashboard
 * @param {string} dashboardType - Tipo de dashboard: 'admin', 'vendedor', 'gerente'
 * @param {boolean} autoRefresh - Si debe refrescar automáticamente los datos
 * @param {number} refreshInterval - Intervalo de refresco en milisegundos (default: 5 minutos)
 */
export const useDashboardData = (dashboardType, autoRefresh = false, refreshInterval = 300000) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    /**
     * Carga los datos según el tipo de dashboard
     */
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let result = null;

            switch (dashboardType) {
                case 'admin':
                    result = await DashboardService.getAdminStats();
                    break;
                case 'vendedor':
                    result = await DashboardService.getVendedorStats();
                    break;
                case 'gerente':
                    result = await DashboardService.getGerenteStats();
                    break;
                default:
                    throw new Error(`Tipo de dashboard no válido: ${dashboardType}`);
            }

            setData(result);
            setLastUpdated(new Date());

        } catch (err) {
            console.error(`Error cargando datos del dashboard ${dashboardType}:`, err);
            setError(err.message || 'Error al cargar los datos');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [dashboardType]);

    /**
     * Recarga los datos manualmente
     */
    const refresh = useCallback(() => {
        loadData();
    }, [loadData]);

    // Cargar datos iniciales
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Auto-refresh si está habilitado
    useEffect(() => {
        if (!autoRefresh) return;

        const intervalId = setInterval(() => {
            loadData();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [autoRefresh, refreshInterval, loadData]);

    return {
        data,
        loading,
        error,
        lastUpdated,
        refresh,
        isStale: lastUpdated && Date.now() - lastUpdated.getTime() > refreshInterval
    };
};

/**
 * Hook específico para alertas del sistema (solo admin)
 */
export const useSystemAlerts = (autoRefresh = false, refreshInterval = 300000) => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAlerts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const systemAlerts = await DashboardService.getSystemAlerts();
            setAlerts(systemAlerts);

        } catch (err) {
            console.error('Error cargando alertas del sistema:', err);
            setError(err.message || 'Error al cargar las alertas');
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshAlerts = useCallback(() => {
        loadAlerts();
    }, [loadAlerts]);

    // Cargar alertas iniciales
    useEffect(() => {
        loadAlerts();
    }, [loadAlerts]);

    // Auto-refresh si está habilitado
    useEffect(() => {
        if (!autoRefresh) return;

        const intervalId = setInterval(() => {
            loadAlerts();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [autoRefresh, refreshInterval, loadAlerts]);

    return {
        alerts,
        loading,
        error,
        refresh: refreshAlerts
    };
};

/**
 * Hook para datos específicos de ventas (usado por vendedores)
 */
export const useSalesData = (timeRange = 'today', autoRefresh = false) => {
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSalesData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener datos de ventas según el rango de tiempo
            const data = await DashboardService.getVendedorStats();
            setSalesData(data);

        } catch (err) {
            console.error('Error cargando datos de ventas:', err);
            setError(err.message || 'Error al cargar datos de ventas');
            setSalesData(null);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    const refreshSalesData = useCallback(() => {
        loadSalesData();
    }, [loadSalesData]);

    useEffect(() => {
        loadSalesData();
    }, [loadSalesData]);

    // Auto-refresh si está habilitado
    useEffect(() => {
        if (!autoRefresh) return;

        const intervalId = setInterval(() => {
            loadSalesData();
        }, 60000); // Refresh cada minuto para ventas

        return () => clearInterval(intervalId);
    }, [autoRefresh, loadSalesData]);

    return {
        salesData,
        loading,
        error,
        refresh: refreshSalesData
    };
};

/**
 * Hook para datos CRM (usado por gerentes)
 */
export const useCRMData = (autoRefresh = false) => {
    const [crmData, setCrmData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCRMData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await DashboardService.getGerenteStats();
            setCrmData(data);

        } catch (err) {
            console.error('Error cargando datos CRM:', err);
            setError(err.message || 'Error al cargar datos CRM');
            setCrmData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshCRMData = useCallback(() => {
        loadCRMData();
    }, [loadCRMData]);

    useEffect(() => {
        loadCRMData();
    }, [loadCRMData]);

    // Auto-refresh si está habilitado
    useEffect(() => {
        if (!autoRefresh) return;

        const intervalId = setInterval(() => {
            loadCRMData();
        }, 120000); // Refresh cada 2 minutos para CRM

        return () => clearInterval(intervalId);
    }, [autoRefresh, loadCRMData]);

    return {
        crmData,
        loading,
        error,
        refresh: refreshCRMData
    };
};

export default useDashboardData;