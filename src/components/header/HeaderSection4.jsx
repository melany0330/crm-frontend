import React, { useContext } from "react";
import HeaderNav from "../navigation/HeaderNav";
import WishlistModal from "../modal/WishlistModal";
import CartModal from "../modal/CartModal";
import { FarzaaContext } from "../../context/FarzaaContext";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import HeaderAuthArea from "../authentication/HeaderAuthArea";

const HeaderSection4 = () => {
  
  const {
    handleWishlistShow,
    isHeaderFixed,
    wishlistCakes,
    handleRemoveCakeWishlist,
    handleSidebarOpen,
  } = useContext(FarzaaContext);


  const {
    cart,
    totalItems,
    removeItem,
    updateQuantity,
    isCartVisible,
    showCart,
    hideCart,
  } = useContext(CartContext);

  return (
    <header className={`fz-3-header-section to-be-fixed ${isHeaderFixed ? "fixed" : ""}`}>
      <div className="row m-0 align-items-center">
        <div className="col-lg-3 col-md-6 col-9">
          <div className="fz-3-header-left-content d-flex align-items-center">
            <div className="fz-3-logo-container">
              <Link to="/">
               <img 
  src="assets/images/bakerylogo.png" 
  alt="logo" 
  className="fz-3-logo" 
  style={{ maxWidth: "200px", height: "auto" }} 
/>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-6 header-nav-container order-3 order-lg-2">
          <HeaderNav position={"justify-content-center"} />
        </div>

        <div className="col-lg-3 col-md-6 col-3 order-2 order-lg-3">
          <div className="fz-header-right-content">
            <ul className="fz-header-right-actions d-flex align-items-center justify-content-end">

              <li>
  <Link
    to="/aboutUs"
    className="fz-header-about-btn d-none d-lg-block"
  >
    <i className="fa-light fa-info-circle"></i>
  </Link>
</li>

              <li>
                <a
                  role="button"
                  className="fz-header-cart-btn d-none d-lg-block"
                  onClick={showCart}
                >
                  <i className="fa-light fa-basket-shopping"></i>
                  <span className="count">{totalItems}</span>
                </a>
              </li>
              <li>
                <a
                  role="button"
                  onClick={handleSidebarOpen}
                  className="fz-hamburger d-block d-lg-none"
                >
                  <i className="fa-light fa-bars-sort"></i>
                </a>
              </li>
            </ul>

            <HeaderAuthArea header={"fz-3-category-area"} title={"d-none"} />
          </div>
        </div>
      </div>

      <WishlistModal wishlistArray={wishlistCakes} removeItem={handleRemoveCakeWishlist} />

      <CartModal
        cartArray={cart}
        remove={removeItem}
        quantity={updateQuantity}
        isVisible={isCartVisible}
        onClose={hideCart}
      />
    </header>
  );
};

export default HeaderSection4;