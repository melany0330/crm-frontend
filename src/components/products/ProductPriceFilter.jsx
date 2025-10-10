import { useContext } from 'react';
import { ProductContext } from '../../context/ProductContext';
import { Slider } from '@mui/material';

const ProductPriceFilter = () => {
    const { price, handlePriceChange, handlePriceFilter } = useContext(ProductContext);

    return (
        <section className="sidebar-single-area price-filter-area">
            <h3 className="sidebar-single-area__title">Filtrar por precio</h3>
            <div className="slider-keypress">
                <Slider
                    getAriaLabel={() => 'Price range'}
                    value={price}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(price) => `Q${price}`}
                    min={0}
                    max={1000}
                    sx={{
                        color: "#B8860B",
                        '& .MuiSlider-thumb': {
                            border: '1px solid #B8860B',
                            color:'#fff',
                        },
                    }}
                />
            </div>
            <div className="price-filter d-flex align-items-center justify-content-between">
                <div className="filtered-price d-flex align-items-center">
                    <h6 className="filtered-price__title">price:</h6>
                    <div className="filtered-price__number">
                        <div className="range-start d-flex align-items-center">
                            <span className="currency-sign">Q</span>
                            <span>{price[0]}</span>
                        </div>
                        <span className="hyphen">-</span>
                        <div className="range-end d-flex align-items-center">
                            <span className="currency-sign">Q</span>
                            <span>{price[1]}</span>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="filter-price-btn fz-1-banner-btn"
                    onClick={handlePriceFilter}
                >
                    Filtrar
                </button>
            </div>
        </section>
    );
};

export default ProductPriceFilter;