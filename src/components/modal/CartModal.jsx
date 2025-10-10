import { useNavigate } from "react-router-dom"; 
import CartItemTable from "../cart/CartItemTable";

const CartModal = ({ cartArray, remove, quantity, isVisible, onClose }) => {
  const navigate = useNavigate();

  const closeAndNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div
        className={`overlay ${isVisible ? "open" : ""}`}
        role="button"
        onClick={onClose}
      ></div>
      <div
        className={`cart-area cart-area-modal ${isVisible ? "open" : ""}`}
        id="cart-area-modal"
      >
        <div className="cart__header">
          <h3 className="cart__title">Carrito de compras</h3>
          <button
            className="cart-area-modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar carrito"
            title="Cerrar carrito"
          >
            <i className="fa-regular fa-xmark"></i>
          </button>
        </div>
        <div className="cart__body">
          <div className="table-container">
            <CartItemTable
              cartArray={cartArray}
              remove={remove}
              quantity={quantity}
            />
          </div>

          {cartArray.length === 0 ? (
            
            <div className="cart-left-actions d-flex justify-content-end">
              <p>El carrito está vacío.</p>
            </div>
          ) : (
            <div className="cart-left-actions d-flex justify-content-between">
              <button
                onClick={() => closeAndNavigate("/cart")}
                className="fz-1-banner-btn update-cart-btn"
              >
                Ver carrito completo
              </button>
              <button
                className="fz-1-banner-btn update-cart-btn"
                onClick={() => closeAndNavigate("/checkout")}
              >
                Proceder al pago
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
