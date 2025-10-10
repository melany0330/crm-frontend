import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

export const generateSalesPDF = (sales, clientsMap, productsMap) => {
  if (!sales || sales.length === 0) {
    toast.warning('No hay datos para generar el reporte.');
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Reporte de Ventas', 14, 22);
  let y = 30;

  sales.forEach((sale, index) => {
    if (index !== 0) y += 10;

    const client = clientsMap[sale.idClient] || {};
    const clientName = client.firstName && client.lastName ? `${client.firstName} ${client.lastName}` : "Sin cliente";

    doc.setFontSize(12);
    doc.setTextColor(92, 42, 61); 

    doc.text(`ID Venta: ${sale.idSale}`, 14, y);
    y += 7;
    doc.text(`Fecha de Venta: ${sale.saleDate ? new Date(sale.saleDate).toLocaleString() : 'Sin fecha'}`, 14, y);
    y += 7;
    doc.text(`Cliente: ${clientName}`, 14, y);
    y += 7;
    doc.text(`Total: $${sale.total?.toFixed(2) ?? "0.00"}`, 14, y);
    y += 10;

    const columns = [
      { header: 'Producto', dataKey: 'producto' },
      { header: 'Cantidad', dataKey: 'cantidad' },
      { header: 'Precio Unitario', dataKey: 'precio' },
      { header: 'Descuento', dataKey: 'descuento' },
    ];

    const rows = (sale.details || []).map(detail => {
      const product = productsMap[detail.idProduct] || {};
      const productName = product.nombre || product.name || "Producto desconocido";

      return {
        producto: productName,
        cantidad: detail.amount,
        precio: `$${detail.unitPrice?.toFixed(2) ?? "0.00"}`,
        descuento: `$${detail.discount?.toFixed(2) ?? "0.00"}`
      };
    });

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
        y = data.cursor.y + 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }
    });
  });

  doc.save('reporte_ventas_detallado.pdf');
};
