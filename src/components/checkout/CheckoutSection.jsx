import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import RegisterClient from "./RegisterClient";
import SaleService from '../../service/sale/SaleService';
import { toast } from 'react-toastify';
import InvoiceDisplay from './InvoiceDisplay'; 

const CheckoutSection = () => {
  const { cart, totalItems, getDiscountForItem, clearCart } = useContext(CartContext);
  const [clientConfirmed, setClientConfirmed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientEditing, setClientEditing] = useState(true); 
  const [saleResult, setSaleResult] = useState(null); 

  
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalConDescuento = cart.reduce((sum, item) => {
    const discountPercent = getDiscountForItem ? getDiscountForItem(item.productId, item.quantity) : 0;
    const priceAfterDiscount = item.price * (1 - discountPercent / 100);
    return sum + priceAfterDiscount * item.quantity;
  }, 0);
  const totalDescuento = subTotal - totalConDescuento;

  
  function getGuatemalaISODate() {
    const now = new Date();

    const dtf = new Intl.DateTimeFormat("es-GT", {
      timeZone: "America/Guatemala",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = dtf.formatToParts(now);

    const year = parts.find(p => p.type === "year").value;
    const month = parts.find(p => p.type === "month").value;
    const day = parts.find(p => p.type === "day").value;
    const hour = parts.find(p => p.type === "hour").value;
    const minute = parts.find(p => p.type === "minute").value;
    const second = parts.find(p => p.type === "second").value;

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!clientConfirmed?.idClient) {
      toast.error("Por favor, confirma o registra un cliente antes de continuar.");
      return;
    }

    if (clientEditing) {
      toast.warn("Debe confirmar la información del cliente antes de realizar el pedido.");
      return;
    }

    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }

    setLoading(true);

    const currentDate = getGuatemalaISODate();

    const details = cart.map(item => {
      const discountPercent = getDiscountForItem ? getDiscountForItem(item.productId, item.quantity) : 0;
      const discountAmount = item.price * (discountPercent / 100);

      return {
        idProduct: item.productId,
        amount: item.quantity,
        unitPrice: item.price,
        discount: discountAmount,
        status: 1
      };
    });

    const saleDto = {
      saleDate: currentDate,
      total: totalConDescuento,
      status: 1,
      idClient: clientConfirmed.idClient,
      details,
    };

    try {
      const response = await SaleService.create(saleDto); 
      setSaleResult(response.data);
      toast.success("Venta realizada con éxito.");
      clearCart();
      setClientConfirmed(null);
      setClientEditing(true);
    } catch (error) {
      toast.error("Error al procesar la venta.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCheckout = () => {
    setSaleResult(null);
  };

  if (saleResult) {
    return <InvoiceDisplay sale={saleResult} onBack={handleBackToCheckout} />;
  }

  return (
    <div className="container">
      <div className="fz-checkout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>

          <div className="fz-billing-details">
            <div className="row gy-0 gx-3 gx-md-4">
              <h3 className="fz-checkout-title">Detalles de Facturación</h3>

              <RegisterClient
                layout="checkout"
                onSuccess={(client) => {
                  setClientConfirmed(client);
                }}
                onEditingChange={(isEditing) => {
                  setClientEditing(isEditing);
                }}
              />
            </div>
          </div>

          <div className="fz-checkout-sidebar">
            <div className="billing-summery">
              <h4 className="fz-checkout-title">Resumen de Facturación</h4>
              <div className="cart-checkout-area">
                <ul className="checkout-summary">
                  <li>
                    <span className="checkout-summary__key">Productos en carrito</span>
                    <span className="checkout-summary__value">{totalItems} items</span>
                  </li>

                  <li>
                    <span className="checkout-summary__key">Subtotal</span>
                    <span className="checkout-summary__value"><span>$</span>{subTotal.toFixed(2)}</span>
                  </li>

                  {totalDescuento > 0 && (
                    <li>
                      <span className="checkout-summary__key">Descuento</span>
                      <span className="checkout-summary__value" style={{ color: "green" }}>
                        - <span>$</span>{totalDescuento.toFixed(2)}
                      </span>
                    </li>
                  )}

                  <li className="cart-checkout-total">
                    <span className="checkout-summary__key">Total</span>
                    <span className="checkout-summary__value"><span>$</span>{totalConDescuento.toFixed(2)}</span>
                  </li>
                </ul>

                <Link to="/cart" className="fz-1-banner-btn cart-checkout-btn">Editar pedido</Link>
              </div>
            </div>

            <button
              type="submit"
              className="fz-1-banner-btn cart-checkout-btn checkout-form-btn"
              disabled={loading || !clientConfirmed?.idClient || clientEditing}
            >
              {loading ? "Procesando..." : "Realizar pedido"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CheckoutSection;
