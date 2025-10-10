import React, { useContext } from 'react';
import { ProductContext } from '../../context/ProductContext'; 

const ProductPagination = () => {
  const {
    currentPage,
    handlePageChange,
    totalPages
  } = useContext(ProductContext);

  return (
    <nav className="fz-shop-pagination">
      <ul className="page-numbers">
        <li>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className='page-number-btn'
          >
            <span aria-current="page" className="last-page">
              <i className="fa-light fa-angle-double-left"> </i>
            </span>
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button
              className={`page-number-btn ${currentPage === index + 1 ? 'current' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}

        <li>
          <button
            disabled={currentPage === totalPages}
            className='page-number-btn'
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <span aria-current="page" className="last-page">
              <i className="fa-light fa-angle-double-right"> </i>
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default ProductPagination;