import React, { useContext } from 'react'
import ProductCategoryList from './ProductCategoryList'
import ProductContainer from './ProductContainer'
import ProductPagination from './ProductPagination'
import ProductPriceFilter from './ProductPriceFilter'
import { ProductProvider } from '../../context/ProductContext'

import { CartContext } from '../../context/CartContext'
import CartModal from '../modal/CartModal'

const styles = {
  sidebar: {
    background: '#fff',
    border: '1px solid #eee',
    padding: '20px'
  },
  categoryItem: {
    cursor: 'pointer',
    padding: '8px 0'
  },
  activeCategory: {
    fontWeight: 'bold',
    color: '#ff6600'
  },
  cartButtonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '15px',
  },
  cartButton: {
    backgroundColor: '#333333', 
    color: '#f5f5f5', 
    border: 'none',
    borderRadius: '30px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s ease',
  },
  cartButtonHover: {
    backgroundColor: '#555555', 
  }
}

const ShopAreaSection = () => {
  const { cart, showCart, hideCart, isCartVisible, removeItem, updateQuantity } = useContext(CartContext)

  return (
    <div className="shop-area">
      <div className="container">
        <div className="row gy-5 justify-content-center">
          <ProductProvider>

            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8 col-9 col-xxs-12 order-1 order-lg-0">
              <div className="fz-sidebar" style={styles.sidebar}>
                <ProductCategoryList />
                <ProductPriceFilter />
              </div>
            </div>

            <div className="col-xl-9 col-lg-8 order-0 order-lg-1">
              <div style={styles.cartButtonWrapper}>
                <button
                  type="button"
                  style={styles.cartButton}
                  onClick={showCart}
                  aria-label="Ver carrito"
                  title="Ver carrito"
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#555555'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#333333'}
                >
                  <i className="fa-light fa-cart-shopping" style={{ fontSize: '20px' }}></i>
                  Ver Carrito ({cart.length})
                </button>
              </div>

              <ProductContainer />
              <ProductPagination />
            </div>
          </ProductProvider>
        </div>
      </div>

      <CartModal
        cartArray={cart}
        remove={removeItem}
        quantity={updateQuantity}
        isVisible={isCartVisible}
        onClose={hideCart}
      />
    </div>
  )
}

export default ShopAreaSection
