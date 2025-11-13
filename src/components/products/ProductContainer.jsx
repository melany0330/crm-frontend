import React, { useContext } from 'react';
import { ProductContext } from '../../context/ProductContext';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const BASE_URL = `${import.meta.env.VITE_WMS_PROTOCOL}://${import.meta.env.VITE_WMS_NAME}`;
const getImageUrl = (path) => path ? `${BASE_URL}${path}` : '/placeholder.png'; const ProductContainer = () => {
  const { paginatedProducts, loading, isListView } = useContext(ProductContext);
  const { addItem } = useContext(CartContext);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className={`fz-inner-products-container ${isListView ? 'list-view-on' : ''}`}>
      <div className="row justify-content-center">
        {paginatedProducts.length === 0 ? (
          <div className='no-product-area'>
            <h3 className='no-product-text'>No hay productos</h3>
            <p className='no-product-desc'>No hay productos que cumplan con sus especificaciones</p>
          </div>
        ) : (
          paginatedProducts.map(item => {
            const priceNumber = Number(item.salePrice ?? item.price ?? 0);
            return (
              <div className="col-xl-4 col-md-4 col-6 col-xxs-12" key={item.idProduct}>
                <div className="fz-1-single-product">
                  <div className="fz-single-product__img">
                    <img src={getImageUrl(item.image)} alt={item.name} />
                    <div className="fz-single-product__actions">
                      <button
                        className="fz-add-to-cart-btn"
                        onClick={() => addItem(item, 1)}
                      >
                        <span className="btn-txt">add To cart</span>
                        <span className="btn-icon"><i className="fa-light fa-cart-shopping"></i></span>
                      </button>
                    </div>
                  </div>

                  <div className="fz-single-product__txt">
                    <span className="fz-single-product__category list-view-text">{item.categoryName || item.category}</span>
                    <Link to={`/producto/${item.idProduct}`} className="fz-single-product__title">{item.name}</Link>
                    <div className="fz-single-product__price-rating">
                      <p className="fz-single-product__price">
                        <span className="current-price">Q{priceNumber.toFixed(2)}</span>
                      </p>
                      <div className="rating list-view-text">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-light fa-star"></i>
                      </div>
                    </div>
                    <p className="fz-single-product__desc list-view-text">
                      {item.description || 'Descripción no disponible.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductContainer;
