import React, { useEffect, useState } from "react";
import SaleService from "../../service/sale/SaleService";
import ClientService from "../../service/client/ClientService";
import { getProducts } from "../../service/products/productService";
import { MdReceiptLong } from "react-icons/md"
import InvoiceModal from "./InvoiceModal"; 
import { generateSalesPDF } from "./SalesReport";
import SaleFilter from "./SaleFilter";
import { toast } from "react-toastify";

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedSaleInvoice, setSelectedSaleInvoice] = useState(null);

  const [clientsMap, setClientsMap] = useState({});
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    fetchAllSales();
    fetchAllProducts();
  }, []);

  const fetchClientsForSales = async (salesData) => {
    const clientIdsToFetch = [
      ...new Set(
        salesData
          .map((sale) => sale.idClient)
          .filter((id) => id && !clientsMap[id])
      ),
    ];

    if (clientIdsToFetch.length > 0) {
      try {
        const clientsResponses = await Promise.all(
          clientIdsToFetch.map((id) => ClientService.getClientById(id))
        );

        const newClients = {};
        clientsResponses.forEach((clientResponse) => {
          const client = clientResponse?.data;
          if (client && client.idClient) {
            newClients[client.idClient] = client;
          }
        });
        setClientsMap((prev) => ({ ...prev, ...newClients }));
      } catch (err) {
        toast.error("Error cargando clientes");
      }
    }
  };

  const fetchAllSales = async () => {
    setLoading(true);
    try {
      const res = await SaleService.listAll();
      const salesData = Array.isArray(res) ? res : res?.data || [];
      setSales(salesData);
      await fetchClientsForSales(salesData);
    } catch (err) {
      toast.error("Error cargando ventas");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const products = await getProducts();
      const map = {};
      products.forEach((p) => {
        map[p.idProduct] = p;
      });
      setProductsMap(map);
    } catch (error) {
      toast.error("Error cargando productos");
    }
  };

  const handleFilter = async ({ startDate, endDate }) => {
    setLoading(true);
    try {
      const payload = { startDate, endDate };
      const res = await SaleService.reportByDate(payload);
      const salesData = Array.isArray(res) ? res : res?.data || [];
      setSales(salesData);
      await fetchClientsForSales(salesData);
    } catch (err) {
      toast.error("Error filtrando ventas");
    } finally {
      setLoading(false);
    }
  };

  
  const openInvoiceModal = (sale) => {
    setSelectedSaleInvoice(sale);
    setInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setSelectedSaleInvoice(null);
    setInvoiceModalOpen(false);
  };

  const handleGeneratePDF = () => {
    if (!sales || sales.length === 0) {
      toast.warning("No hay ventas para generar reporte");
      return;
    }
    generateSalesPDF(sales, clientsMap, productsMap);
  };

  return (
    <>
      <SaleFilter onFilter={handleFilter} />

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={handleGeneratePDF}
          style={{
            backgroundColor: "#f48db1",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            color: "#5c2a3d",
            cursor: "pointer",
            fontWeight: "600",
            fontFamily: "'Poppins', sans-serif",
          }}
          title="Generar Reporte PDF"
        >
          Generar Reporte PDF
        </button>
      </div>

      <div className="clients-table">
        <table>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Cargando ventas...</td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan="6">No hay ventas.</td>
              </tr>
            ) : (
              sales.map((sale) => {
                let clientName = "Sin cliente";
                const clientId = sale.idClient;

                if (clientId && clientsMap[clientId]) {
                  const client = clientsMap[clientId];
                  clientName = `${client.nombre ?? client.firstName ?? ""} ${
                    client.apellido ?? client.lastName ?? ""
                  }`.trim();
                }

                return (
                  <tr key={sale.idSale}>
                    <td>{sale.idSale}</td>
                    <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleString() : "Sin fecha"}</td>
                    <td>{sale.total?.toFixed(2) ?? "0.00"}</td>
                    <td>{sale.status ? "Activa" : "Inactiva"}</td>
                    <td>{clientName || "Sin cliente"}</td>
                    <td>
                      <button
                        className="action-btn invoice"
                        onClick={() => openInvoiceModal(sale)}
                        title="Ver Factura"
                        >
                        <MdReceiptLong size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={closeInvoiceModal}
        sale={selectedSaleInvoice}
        clientsMap={clientsMap}
        productsMap={productsMap}
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
        tbody tr {
          background: white;
        }
        tbody tr:hover {
          background-color: #ffebf0;
          transform: scale(1.003);
          transition: all 0.2s ease;
        }
        tbody td {
          padding: 0.8rem 1rem;
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
          font-size: 1rem;
        }
        .action-btn.invoice {
          color: #ba5d07;
        }
        .action-btn.invoice:hover {
          background-color: #f0d8b0;
          border-color: #ba5d07;
          transform: scale(1.15);
        }
      `}</style>
    </>
  );
};

export default SalesTable;
