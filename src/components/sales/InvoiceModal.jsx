import React from "react";

const InvoiceModal = ({ isOpen, onClose, sale, clientsMap, productsMap }) => {
  if (!isOpen || !sale) return null;

  const client = sale.idClient ? clientsMap[sale.idClient] : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "1.5rem",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2>Factura Venta #{sale.idSale}</h2>
        <p>
          <strong>Fecha:</strong>{" "}
          {sale.saleDate ? new Date(sale.saleDate).toLocaleString() : "Sin fecha"}
        </p>
        <p>
          <strong>Cliente:</strong>{" "}
          {client
            ? `${client.nombre ?? client.firstName ?? ""} ${
                client.apellido ?? client.lastName ?? ""
              }`.trim()
            : "Sin cliente"}
        </p>
        <p>
          <strong>Total:</strong> ${sale.total?.toFixed(2) ?? "0.00"}
        </p>

        <h3>Detalles</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>
                Producto
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>
                Cantidad
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>
                Precio Unitario
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>
                Descuento
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {sale.details?.map((item, idx) => {
              const product = productsMap[item.idProduct];
              const subtotal =
                item.unitPrice * item.amount - (item.discount || 0);
              return (
                <tr key={idx}>
                  <td style={{ padding: "0.5rem" }}>
                    {product?.name ?? "Producto desconocido"}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    {item.amount}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    ${item.discount?.toFixed(2) ?? "0.00"}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#f48db1",
            border: "none",
            borderRadius: "8px",
            color: "#5c2a3d",
            cursor: "pointer",
            fontWeight: "600",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default InvoiceModal;
