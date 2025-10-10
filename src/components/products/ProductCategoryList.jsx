  import React, { useContext, useState } from 'react';
  import { ProductContext } from '../../context/ProductContext';

  const ProductCategoryList = () => {
    const { categories, products, handleCategoryFilter } = useContext(ProductContext);
    const [activeCategory, setActiveCategory] = useState(null);

    const handleClick = (categoryId) => {
      handleCategoryFilter(categoryId);
      setActiveCategory(categoryId);
    };

    return (
      <section className="sidebar-single-area product-categories-area">
        <h3 className="sidebar-single-area__title">Categorias de pasteles</h3>
        <ul className="product-categories">
          
          <li
            onClick={() => handleClick(null)}
            className={activeCategory === null ? 'active' : ''}
          >
            Todos ({products.length})
          </li>

          
          {categories.map(cat => (
            <li
              key={cat.idCategory}
              onClick={() => handleClick(cat.idCategory)}
              className={activeCategory === cat.idCategory ? 'active' : ''}
            >
              {cat.categoryName} (
                {products.filter(p => p.idCategory === cat.idCategory).length}
              )
            </li>
          ))}
        </ul>
      </section>
    );
  };

  export default ProductCategoryList;