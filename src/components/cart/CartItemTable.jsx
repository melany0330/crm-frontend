import React from "react";
import { Link } from "react-router-dom";

const BASE_URL = `${import.meta.env.VITE_WMS_PROTOCOL}://${import.meta.env.VITE_WMS_NAME}:${import.meta.env.VITE_WMS_PORT}`;
const getImageUrl = (path) => (path ? `${BASE_URL}${path}` : "/placeholder.png");

const CartItemTable = ({ cartArray, remove, quantity, getDiscountForItem }) => {
  return (
    <table className="cart-page-table">
      <tbody>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Total</th>
          <th>Eliminar</th>
        </tr>
        {cartArray.length === 0 ? (
          <tr className="no-item-msg">
            <td className="no-item-msg-text" colSpan={5}>
              No hay productos en el carrito
            </td>
          </tr>
        ) : (
          cartArray.map((item) => {
            const discountPercent = getDiscountForItem ? getDiscountForItem(item.productId, item.quantity) : 0;
            const hasDiscount = discountPercent > 0;
            const discountedPrice = item.price * (1 - discountPercent / 100);
            return (
              <tr key={item.productId}>
                <td>
                  <div className="cart-product" style={{ display: "flex", alignItems: "center" }}>
                    <div className="cart-product__img" style={{ marginRight: 10 }}>
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                      />
                    </div>
                    <div className="cart-product__txt">
                      <h6>
                        <Link to={`/producto/${item.productId}`}>{item.name}</Link>
                      </h6>
                      {hasDiscount && (
                        <div style={{ color: "green", fontWeight: "bold", fontSize: "0.85rem" }}>
                          {discountPercent}% DE DESCUENTO
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {hasDiscount ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#888", marginRight: 6 }}>
                        Q{item.price.toFixed(2)}
                      </span>
                      <span>Q{discountedPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>Q{item.price.toFixed(2)}</span>
                  )}
                </td>
                <td>
                  <div className="cart-product__quantity">
                    <div className="cart-product__quantity-btns">
                      <button
                        className="cart-product__minus"
                        onClick={() => quantity(item.productId, Math.max(item.quantity - 1, 1))}
                        aria-label="Disminuir cantidad"
                      >
                        <i className="fa-light fa-minus"></i>
                      </button>
                      <button
                        className="cart-product__plus"
                        onClick={() => quantity(item.productId, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        <i className="fa-light fa-plus"></i>
                      </button>
                    </div>
                    <input
                      type="number"
                      name="product-quantity-input"
                      className="cart-product-quantity-input"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => {
                        const newQuantity = parseInt(event.target.value);
                        if (newQuantity >= 1) {
                          quantity(item.productId, newQuantity);
                        }
                      }}
                      aria-label="Cantidad del producto"
                    />
                  </div>
                </td>
                <td>
                  Q{(discountedPrice * item.quantity).toFixed(2)}
                </td>
                <td>
                  <button
                    className="item-remove-btn"
                    onClick={() => remove(item.productId)}
                    aria-label="Eliminar producto"
                    title="Eliminar producto"
                  >
                    <i className="fa-light fa-xmark"></i>
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default CartItemTable;
