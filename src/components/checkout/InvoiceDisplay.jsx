import React, { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";

const InvoiceDisplay = ({ sale, onBack }) => {
  const { products } = useContext(ProductContext);

  if (!sale || !sale.invoice) return <p>No hay factura para mostrar.</p>;

  if (!products || products.length === 0) {
    return <p>Cargando productos para la factura...</p>;
  }

  const {
    invoiceSeries,
    invoiceNumber,
    invoiceDate,
    totalAmount,
  } = sale.invoice;

  const { saleDate, details } = sale;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const styles = {
    container: {
      maxWidth: 600,
      margin: "2rem auto",
      padding: "2rem",
      borderRadius: 16,
      backgroundColor: "#fff7f5",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Poppins', sans-serif",
      color: "#6b4b4b",
    },
    header: {
      color: "#5c2a3d",
      fontSize: "1.8rem",
      marginBottom: "1rem",
      fontWeight: "600",
    },
    label: {
      fontWeight: "600",
      color: "#5c2a3d",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "1rem",
    },
    th: {
      borderBottom: "1px solid #d7b8b4",
      textAlign: "left",
      padding: "0.5rem",
      color: "#5c2a3d",
    },
    td: {
      borderBottom: "1px solid #d7b8b4",
      padding: "0.5rem",
      textAlign: "right",
    },
    tdFirst: {
      textAlign: "left",
    },
    total: {
      textAlign: "right",
      marginTop: "2rem",
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#5c2a3d",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Factura</h2>

      <p>
        <span style={styles.label}>Serie:</span> {invoiceSeries}
      </p>
      <p>
        <span style={styles.label}>Número:</span> {invoiceNumber}
      </p>
      <p>
        <span style={styles.label}>Fecha factura:</span> {formatDate(invoiceDate)}
      </p>
      <p>
        <span style={styles.label}>Fecha venta:</span> {formatDate(saleDate)}
      </p>

      <h3 style={{ ...styles.header, fontSize: "1.4rem", marginTop: "1.5rem" }}>
        Detalles
      </h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Producto</th>
            <th style={styles.th}>Cantidad</th>
            <th style={styles.th}>Precio unitario</th>
            <th style={styles.th}>Descuento</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, idx) => {
            const product = products.find(p => p.idProduct === item.idProduct);
            const productName = product ? product.name : "Producto no encontrado";

            return (
              <tr key={idx}>
                <td style={{ ...styles.td, ...styles.tdFirst }}>{productName}</td>
                <td style={styles.td}>{item.amount}</td>
                <td style={styles.td}>${item.unitPrice.toFixed(2)}</td>
                <td style={styles.td}>${item.discount.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 style={styles.total}>Total: ${totalAmount.toFixed(2)}</h3>

      <button
        onClick={onBack}
        style={{ marginTop: 20 }}
        className="fz-1-banner-btn cart-checkout-btn"
      >
        Realizar otra compra
      </button>
    </div>
  );
};

export default InvoiceDisplay;
