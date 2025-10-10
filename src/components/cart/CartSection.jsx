import React, { useContext } from 'react';
import CartItemTable from './CartItemTable';
import { CartContext } from '../../context/CartContext';

const CartSection = () => {
  const { cart, removeItem, updateQuantity, getDiscountForItem } = useContext(CartContext);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalConDescuento = cart.reduce((sum, item) => {
    const discountPercent = getDiscountForItem ? getDiscountForItem(item.productId, item.quantity) : 0;
    const priceAfterDiscount = item.price * (1 - discountPercent / 100);
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container">
      <div className="cart-section">
        <div className="cart-left inner-cart">
          <div className="cart-area">
            <div className="cart__body">
              <div className="table-responsive">
                <CartItemTable
                  cartArray={cart}
                  remove={removeItem}
                  quantity={updateQuantity}
                  getDiscountForItem={getDiscountForItem}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="cart-checkout-area">
          <h4 className="cart-checkout-area__title">Resumen de Facturación</h4>

          <ul className="checkout-summary">
            <li>
              <span className="checkout-summary__key">Productos en carrito</span>
              <span className="checkout-summary__value">{totalItems} items</span>
            </li>

            <li>
              <span className="checkout-summary__key">Subtotal</span>
              <span className="checkout-summary__value">Q{subtotal.toFixed(2)}</span>
            </li>

            {subtotal !== totalConDescuento && (
              <li>
                <span className="checkout-summary__key">Descuentos</span>
                <span className="checkout-summary__value">- Q{(subtotal - totalConDescuento).toFixed(2)}</span>
              </li>
            )}

            <li className="cart-checkout-total">
              <span className="checkout-summary__key">Total</span>
              <span className="checkout-summary__value">Q{totalConDescuento.toFixed(2)}</span>
            </li>
          </ul>

          {cart.length > 0 && (
            <a href="/checkout" className="fz-1-banner-btn cart-checkout-btn">
              Continuar con la compra
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSection;
