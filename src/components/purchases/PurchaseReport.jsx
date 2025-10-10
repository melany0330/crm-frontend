import React, { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getPurchaseReportByDates } from '../../service/purchases/purchaseService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PurchasesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.warning('Por favor selecciona ambas fechas');
      return;
    }

    const startDateTime = `${startDate}T00:00:00`;
    const endDateTime = `${endDate}T23:59:59`;

    try {
      const data = await getPurchaseReportByDates(startDateTime, endDateTime);
      setReportData(data);
      setExpanded(null);
    } catch (error) {
      toast.error('Error al obtener el reporte');
      console.error(error);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const generatePDF = () => {
    if (reportData.length === 0) {
      toast.info('No hay datos para generar el reporte.');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Reporte de Compras', 14, 22);
    let y = 30;

    reportData.forEach((purchase, index) => {
      if (index !== 0) y += 10; 

      
      doc.setFontSize(12);
      doc.setTextColor(92, 42, 61); 

      doc.text(`Factura: ${purchase.series}-${purchase.billNumber}`, 14, y);
      y += 7;
      doc.text(`Proveedor: ${purchase.purchase.provider.name}`, 14, y);
      y += 7;
      doc.text(`Total Factura: Q${purchase.billTotal.toFixed(2)}`, 14, y);
      y += 7;
      doc.text(`Total Compra: Q${purchase.purchase.totalAmount.toFixed(2)}`, 14, y);
      y += 10;

      doc.text(`Fecha de Emisión: ${new Date(purchase.issueDate).toLocaleDateString()}`, 14, y);
      y += 7;
      doc.text(`Fecha de Compra: ${new Date(purchase.purchase.purchaseDate).toLocaleDateString()}`, 14, y);
      y += 10;

      doc.text(`NIT: ${purchase.purchase.provider.nit}`, 14, y);
      y += 7;
      doc.text(`Email: ${purchase.purchase.provider.email}`, 14, y);
      y += 7;
      doc.text(`Teléfono: ${purchase.purchase.provider.phone}`, 14, y);
      y += 7;
      doc.text(`Dirección: ${purchase.purchase.provider.address}`, 14, y);
      y += 10;

      // Tabla de productos
      const columns = [
        { header: 'Producto', dataKey: 'producto' },
        { header: 'Cantidad', dataKey: 'cantidad' },
        { header: 'Precio Venta', dataKey: 'precio' },
        { header: 'Categoría', dataKey: 'categoria' },
      ];

      const rows = purchase.purchase.details.map(d => ({
        producto: d.product.name,
        cantidad: d.amount,
        precio: `Q${d.product.salePrice.toFixed(2)}`,
        categoria: d.product.category.categoryName,
      }));

      autoTable(doc, {
        startY: y,
        head: [columns.map(c => c.header)],
        body: rows.map(r => columns.map(c => r[c.dataKey])),
        theme: 'striped',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [244, 143, 177] },
        alternateRowStyles: { fillColor: [255, 230, 240] },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          y = data.cursor.y + 10; // actualizar y después de la tabla para el siguiente bloque
          // Si la posición y está cerca del final, agrega nueva página
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        }
      });
    });

    doc.save('reporte_compras_detallado.pdf');
  };

  return (
    <div className="purchases-container">
      <form onSubmit={handleSubmit} className="filter-form">
        <div>
          <label>Fecha inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div>
          <label>Fecha fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
        <button type="submit" className="btn-generate">
          Filtrar
        </button>
        <button type="button" className="btn-generate" onClick={generatePDF} style={{ marginLeft: '10px' }}>
          Generar PDF
        </button>
      </form>

      {reportData.length === 0 ? (
        <p className="no-data">No hay datos para mostrar.</p>
      ) : (
        reportData.map(purchase => (
          <div key={purchase.idPurchaseBill} className="purchase-card">
            <div className="purchase-header" onClick={() => toggleExpand(purchase.idPurchaseBill)}>
              <div>
                <strong>Factura:</strong> {purchase.series}-{purchase.billNumber}<br />
                <strong>Proveedor:</strong> {purchase.purchase.provider.name}<br />
                <strong>Total Factura:</strong> Q{purchase.billTotal.toFixed(2)}<br />
                <strong>Total Compra:</strong> Q{purchase.purchase.totalAmount.toFixed(2)}
              </div>
              <button className="expand-btn" onClick={e => { e.stopPropagation(); toggleExpand(purchase.idPurchaseBill); }}>
                {expanded === purchase.idPurchaseBill ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
              </button>
            </div>

            {expanded === purchase.idPurchaseBill && (
              <div className="purchase-details">
                <p><strong>Fecha de Emisión:</strong> {new Date(purchase.issueDate).toLocaleDateString()}</p>
                <p><strong>Fecha de Compra:</strong> {new Date(purchase.purchase.purchaseDate).toLocaleDateString()}</p>
                <br />
                <p><strong>NIT:</strong> {purchase.purchase.provider.nit}</p>
                <p><strong>Email:</strong> {purchase.purchase.provider.email}</p>
                <p><strong>Teléfono:</strong> {purchase.purchase.provider.phone}</p>
                <p><strong>Dirección:</strong> {purchase.purchase.provider.address}</p>

                <div className="purchase-products">
                  <br />
                  <h5>Productos comprados:</h5>
                  <ul>
                    {purchase.purchase.details.map((d, idx) => (
                      <li key={idx}>
                        <strong>{d.product.name}</strong> — Cantidad: {d.amount} — Precio de venta: Q{d.product.salePrice.toFixed(2)} — Categoría: {d.product.category.categoryName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <style>{`
        .purchases-container {
          padding: 2rem;
          font-family: 'Poppins', sans-serif;
        }

        .filter-form {
          margin-bottom: 1rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          background: #fff7fa;
          padding: 0.8rem 1.2rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(255, 182, 193, 0.15);
          font-family: 'Poppins', sans-serif;
        }

        .filter-form label {
          display: flex;
          flex-direction: column;
          color: #4a1f30;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .date-input {
          padding: 0.45rem 0.65rem;
          border: 1px solid #f4a6c1;
          border-radius: 6px;
          font-family: inherit;
          background-color: #fff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .date-input:focus {
          border-color: #f48fb1;
          box-shadow: 0 0 5px rgba(244, 143, 177, 0.4);
          outline: none;
        }

        .btn-generate {
          background: linear-gradient(to right, #f8c8dc, #ffe0b2);
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          color: #4a1f30;
          transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }

        .btn-generate:hover {
          background: linear-gradient(to right, #ffe0b2, #f8c8dc);
          transform: scale(1.07);
          box-shadow: 0 4px 8px rgba(244, 143, 177, 0.25);
        }

        .no-data {
          color: #999;
          font-style: italic;
        }

        .purchase-card {
          background: #fff0f5;
          border-radius: 16px;
          box-shadow: 0 0 25px rgba(255, 192, 203, 0.15);
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          cursor: default;
        }

        .purchase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .purchase-header:hover {
          background: #ffeaf0;
          border-radius: 12px;
        }

        .expand-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #5c2a3d;
          display: flex;
          align-items: center;
        }

        .purchase-details {
          margin-top: 1rem;
          font-size: 0.95rem;
          color: #444;
        }

        .purchase-products ul {
          padding-left: 1rem;
          margin: 0.5rem 0 0;
        }

        .purchase-products li {
          margin-bottom: 0.4rem;
        }
      `}</style>
    </div>
  );
};

export default PurchasesReport;