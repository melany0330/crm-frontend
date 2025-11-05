// src/components/checkout/CheckoutSection.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { CartContext } from "../../context/CartContext";
import RegisterClient from "./RegisterClient";
import InvoiceDisplay from "./InvoiceDisplay";
import SaleService from "../../service/sale/SaleService";

// ✅ servicio correcto (carpeta crm)
import QuotesService from "../../service/crm/quotes.service";

// Logger de actividades para el CRM
import { logActivity } from "../../core/system/activityLogger";

const CheckoutSection = () => {
  const { cart, totalItems, getDiscountForItem, clearCart } =
    useContext(CartContext);

  const [clientConfirmed, setClientConfirmed] = useState(null);
  const [clientEditing, setClientEditing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saleResult, setSaleResult] = useState(null);

  // ===== Totales =====
  const subTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const totalConDescuento = cart.reduce((sum, item) => {
    const p = Number(item.price);
    const q = Number(item.quantity);
    const discountPercent = getDiscountForItem
      ? Number(getDiscountForItem(item.productId, q) || 0)
      : 0;
    const priceAfterDiscount = p * (1 - discountPercent / 100);
    return sum + priceAfterDiscount * q;
  }, 0);

  const totalDescuento = subTotal - totalConDescuento;

  // ===== Venta =====
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!clientConfirmed?.idClient) {
      toast.error("Por favor, confirma o registra un cliente antes de continuar.");
      return;
    }
    if (clientEditing) {
      toast.warn("Debes confirmar la información del cliente antes de realizar el pedido.");
      return;
    }
    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }

    setLoading(true);

    // Fecha ISO
    const saleDate = new Date().toISOString();

    // Detalle para VENTA (el backend calcula total/estado)
    const details = cart.map((item) => {
      const p = Number(item.price);
      const q = Number(item.quantity);
      const discountPercent = getDiscountForItem
        ? Number(getDiscountForItem(item.productId, q) || 0)
        : 0;
      const discountAmount = Number((p * (discountPercent / 100)).toFixed(2));

      return {
        idProduct: Number(item.productId),
        amount: q,           // ← Venta usa amount
        unitPrice: p,
        discount: discountAmount,
      };
    });

    const saleDto = {
      idClient: Number(clientConfirmed.idClient),
      saleDate,
      details,
    };

    try {
      const data = await SaleService.create(saleDto);
      setSaleResult(data);
      toast.success("Venta realizada con éxito.");

      await logActivity({
        clientId: Number(clientConfirmed.idClient),
        activityType: "SALE",
        description: `Venta por $${totalConDescuento.toFixed(2)} con ${cart.length} producto(s).`,
        activityDate: new Date().toISOString(),
      });

      clearCart();
      setClientConfirmed(null);
      setClientEditing(true);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error al procesar la venta.";
      console.error("Sales create error:", error?.response || error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ===== Cotización =====
  const handleCreateQuote = async () => {
    if (!clientConfirmed?.idClient) {
      toast.error("Por favor, confirma o registra un cliente antes de continuar.");
      return;
    }
    if (clientEditing) {
      toast.warn("Debes confirmar la información del cliente antes de generar la cotización.");
      return;
    }
    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }

    setLoading(true);

    // MUY IMPORTANTE: el backend espera `quantity` (no amount)
    const details = cart.map((item) => {
      const p = Number(item.price);
      const q = Number(item.quantity);
      const discountPercent = getDiscountForItem
        ? Number(getDiscountForItem(item.productId, q) || 0)
        : 0;
      const discountAmount = Number((p * (discountPercent / 100)).toFixed(2));

      return {
        idProduct: Number(item.productId),
        quantity: q,        // ← aquí está el cambio clave
        unitPrice: p,
        discount: discountAmount,
      };
    });

    const quoteDto = {
      idClient: Number(clientConfirmed.idClient),
      quoteDate: new Date().toISOString(),
      details,
      // No enviamos total ni status; los calcula el backend
    };

    try {
      const data = await QuotesService.create(quoteDto);
      toast.success("Cotización creada con éxito.");
      clearCart();
setClientConfirmed(null);
setClientEditing(true);
setSaleResult(null);

      await logActivity({
        clientId: Number(clientConfirmed.idClient),
        activityType: "QUOTE",
        description: `Cotización por $${totalConDescuento.toFixed(2)} con ${cart.length} producto(s).`,
        activityDate: new Date().toISOString(),
      });

      // Si quieres limpiar el carrito al cotizar, descomenta:
      // clearCart();
    } catch (error) {
      console.error("Quote create error:", error?.response || error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error al crear la cotización.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCheckout = () => setSaleResult(null);

  // Mostrar factura si ya hay venta
  if (saleResult) {
    return <InvoiceDisplay sale={saleResult} onBack={handleBackToCheckout} />;
  }

  return (
    <div className="container">
      <div className="fz-checkout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          {/* Datos de facturación */}
          <div className="fz-billing-details">
            <div className="row gy-0 gx-3 gx-md-4">
              <h3 className="fz-checkout-title">Detalles de Facturación</h3>

              <RegisterClient
                layout="checkout"
                onSuccess={(client) => setClientConfirmed(client)}
                onEditingChange={(isEditing) => setClientEditing(isEditing)}
              />
            </div>
          </div>

          {/* Resumen y botones */}
          <div className="fz-checkout-sidebar">
            <div className="billing-summery">
              <h4 className="fz-checkout-title">Resumen de Facturación</h4>

              <div className="cart-checkout-area">
                <ul className="checkout-summary">
                  <li>
                    <span className="checkout-summary__key">
                      Productos en carrito
                    </span>
                    <span className="checkout-summary__value">
                      {totalItems} items
                    </span>
                  </li>

                  <li>
                    <span className="checkout-summary__key">Subtotal</span>
                    <span className="checkout-summary__value">
                      <span>$</span>
                      {subTotal.toFixed(2)}
                    </span>
                  </li>

                  {totalDescuento > 0 && (
                    <li>
                      <span className="checkout-summary__key">Descuento</span>
                      <span
                        className="checkout-summary__value"
                        style={{ color: "green" }}
                      >
                        - <span>$</span>
                        {totalDescuento.toFixed(2)}
                      </span>
                    </li>
                  )}

                  <li className="cart-checkout-total">
                    <span className="checkout-summary__key">Total</span>
                    <span className="checkout-summary__value">
                      <span>$</span>
                      {totalConDescuento.toFixed(2)}
                    </span>
                  </li>
                </ul>

                <Link to="/cart" className="fz-1-banner-btn cart-checkout-btn">
                  Editar pedido
                </Link>
              </div>
            </div>

            <div className="flex gap-2" style={{ display: "grid", gap: 8 }}>
              <button
                type="button"
                className="fz-1-banner-btn cart-checkout-btn"
                disabled={loading || !clientConfirmed?.idClient || clientEditing}
                onClick={handleCreateQuote}
              >
                {loading ? "Procesando..." : "Generar cotización"}
              </button>

              <button
                type="submit"
                className="fz-1-banner-btn cart-checkout-btn checkout-form-btn"
                disabled={loading || !clientConfirmed?.idClient || clientEditing}
              >
                {loading ? "Procesando..." : "Realizar pedido"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutSection;
