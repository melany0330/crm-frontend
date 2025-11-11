// src/components/dashboard/DashboardDetailStats.jsx
import React from 'react';
import { StatCard, StatsGrid } from './DashboardComponents';

/**
 * Componente para mostrar estadísticas detalladas adicionales
 * Útil para expandir los dashboards con más información específica
 */
export const DetailedSalesStats = ({ salesData, loading = false }) => {
    if (loading || !salesData) return null;

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '3px solid #10b981'
        }}>
            <h3>💹 Estadísticas Detalladas de Ventas</h3>
            <StatsGrid columns={3}>
                <StatCard
                    title="Total Ventas"
                    value={salesData.totalVentas || 0}
                    color="#10b981"
                    icon="💰"
                    format="currency"
                    subtitle="Histórico completo"
                />
                <StatCard
                    title="Total Órdenes"
                    value={salesData.totalOrdenes || 0}
                    color="#10b981"
                    icon="📋"
                    format="number"
                    subtitle="Todas las órdenes"
                />
                <StatCard
                    title="Promedio por Venta"
                    value={salesData.totalOrdenes > 0 ? (salesData.totalVentas / salesData.totalOrdenes) : 0}
                    color="#10b981"
                    icon="📊"
                    format="currency"
                    subtitle="Ticket promedio"
                />
            </StatsGrid>
        </div>
    );
};

/**
 * Componente para mostrar estadísticas de inventario
 */
export const InventoryStats = ({ inventoryData, loading = false }) => {
    if (loading || !inventoryData) return null;

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '3px solid #f59e0b'
        }}>
            <h3>📦 Estadísticas de Inventario</h3>
            <StatsGrid columns={3}>
                <StatCard
                    title="Productos"
                    value={inventoryData.totalProductos || 0}
                    color="#f59e0b"
                    icon="📦"
                    format="number"
                    subtitle="Total en catálogo"
                />
                <StatCard
                    title="Stock Bajo"
                    value={inventoryData.stockBajo || 0}
                    color="#ef4444"
                    icon="⚠️"
                    format="number"
                    subtitle="Requieren reposición"
                />
                <StatCard
                    title="Valor Total"
                    value={inventoryData.valorTotal || 0}
                    color="#f59e0b"
                    icon="💎"
                    format="currency"
                    subtitle="Valor total inventario"
                />
            </StatsGrid>
        </div>
    );
};

/**
 * Componente para mostrar estadísticas de clientes
 */
export const ClientsStats = ({ clientsData, loading = false }) => {
    if (loading || !clientsData) return null;

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '3px solid #8b5cf6'
        }}>
            <h3>👥 Estadísticas de Clientes</h3>
            <StatsGrid columns={3}>
                <StatCard
                    title="Total Clientes"
                    value={clientsData.totalClientes || 0}
                    color="#8b5cf6"
                    icon="👥"
                    format="number"
                    subtitle="Clientes registrados"
                />
                <StatCard
                    title="Clientes Activos"
                    value={clientsData.clientesActivos || 0}
                    color="#10b981"
                    icon="✅"
                    format="number"
                    subtitle="Con estado activo"
                />
                <StatCard
                    title="Tasa Actividad"
                    value={clientsData.totalClientes > 0 ?
                        Math.round((clientsData.clientesActivos / clientsData.totalClientes) * 100) : 0}
                    color="#8b5cf6"
                    icon="📈"
                    format="percentage"
                    subtitle="% de clientes activos"
                />
            </StatsGrid>
        </div>
    );
};

/**
 * Componente para mostrar resumen rápido de KPIs principales
 */
export const KPISummary = ({ data, type = 'admin' }) => {
    if (!data) return null;

    const getKPIs = () => {
        switch (type) {
            case 'admin':
                return [
                    {
                        title: 'Ingresos Totales',
                        value: data.sales?.totalVentas || 0,
                        format: 'currency',
                        icon: '💰',
                        color: '#667eea'
                    },
                    {
                        title: 'Clientes',
                        value: data.clients?.totalClientes || 0,
                        format: 'number',
                        icon: '👥',
                        color: '#667eea'
                    },
                    {
                        title: 'Productos',
                        value: data.inventory?.totalProductos || 0,
                        format: 'number',
                        icon: '📦',
                        color: '#667eea'
                    },
                    {
                        title: 'Órdenes',
                        value: data.sales?.totalOrdenes || 0,
                        format: 'number',
                        icon: '📋',
                        color: '#667eea'
                    }
                ];

            case 'vendedor':
                return [
                    {
                        title: 'Ventas Hoy',
                        value: data.ventasHoy || 0,
                        format: 'currency',
                        icon: '📅',
                        color: '#4ecdc4'
                    },
                    {
                        title: 'Ventas Mes',
                        value: data.ventasMes || 0,
                        format: 'currency',
                        icon: '📈',
                        color: '#4ecdc4'
                    },
                    {
                        title: 'Órdenes Hoy',
                        value: data.ordenesHoy || 0,
                        format: 'number',
                        icon: '🛒',
                        color: '#4ecdc4'
                    }
                ];

            case 'gerente':
                return [
                    {
                        title: 'Clientes Activos',
                        value: data.clientesActivos || 0,
                        format: 'number',
                        icon: '👥',
                        color: '#f093fb'
                    },
                    {
                        title: 'Nuevos Leads',
                        value: data.nuevosLeads || 0,
                        format: 'number',
                        icon: '🎯',
                        color: '#f093fb'
                    },
                    {
                        title: 'Conversión',
                        value: data.tasaConversion || 0,
                        format: 'percentage',
                        icon: '📊',
                        color: '#f093fb'
                    }
                ];

            default:
                return [];
        }
    };

    const kpis = getKPIs();

    return (
        <div style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '2px solid #dee2e6'
        }}>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center', color: '#495057' }}>
                📊 Resumen de KPIs
            </h3>
            <StatsGrid columns={Math.min(kpis.length, 4)}>
                {kpis.map((kpi, index) => (
                    <StatCard
                        key={index}
                        title={kpi.title}
                        value={kpi.value}
                        color={kpi.color}
                        icon={kpi.icon}
                        format={kpi.format}
                    />
                ))}
            </StatsGrid>
        </div>
    );
};

export default {
    DetailedSalesStats,
    InventoryStats,
    ClientsStats,
    KPISummary
};