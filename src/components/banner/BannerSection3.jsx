import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getCatalog } from '../../service/products/productService'

const BASE_URL = `${import.meta.env.VITE_WMS_PROTOCOL}://${import.meta.env.VITE_WMS_NAME}`
const getImageUrl = (path) => `${BASE_URL}${path}`

const CATEGORY_MAP = [
  { idCategory: 1, title: 'Donas' },
  { idCategory: 2, title: 'Cupcakes' },
  { idCategory: 3, title: 'Pasteles' },
]

const categoryDescriptions = {
  Donas: 'Sabores irresistibles que alegran tu día.',
  Cupcakes: 'Pequeñas delicias para grandes momentos.',
  Pasteles: 'Crea recuerdos dulces con nuestros pasteles artesanales.',
}

const BannerSection3 = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getCatalog()
        setProducts(data)
      } catch (error) {
        console.error('Error cargando productos del banner:', error)
      }
    }
    loadProducts()
  }, [])

  const slidesData = CATEGORY_MAP.map(({ idCategory, title }) => {
    const filteredProducts = products.filter(p => p.idCategory === idCategory).slice(0, 2)
    return { title, products: filteredProducts }
  }).filter(slide => slide.products.length > 0)

  return (
    <>
      <style>{`
        .fz-3-single-product img {
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, filter 0.3s ease;
          object-fit: cover;
        }
        .fz-3-single-product:hover img {
          transform: scale(1.1);
          filter: brightness(1.1);
        }
        .fz-3-single-product__title {
          font-weight: 600;
          font-size: 1.1rem;
          margin-top: 10px;
          color: #3a3a3a;
          transition: color 0.3s ease;
        }
        .fz-3-single-product:hover .fz-3-single-product__title {
          color: #d97706;
        }
        .fz-3-single-product__price {
          font-weight: 700;
          color: #444;
          margin-top: 4px;
        }
        .fz-3-banner-txt p {
          font-size: 1.1rem;
          color: #666;
          margin-top: 12px;
          font-style: italic;
        }
      `}</style>

      <section className="fz-3-banner-section">
        <div className="container position-relative">
          <div className="fz-3-banner-left-actions">
            <div className="fz-3-banner-search-box">

            </div>
          </div>

          <Swiper
            slidesPerView={1}
            autoplay={{ delay: 3500 }}
            modules={[Autoplay]}
            className="fz-3-banner-slider owl-carousel"
          >
            {slidesData.map(({ title, products }, idx) => (
              <SwiperSlide className="fz-3-banner-single-slide" key={idx}>
                <div className="row align-items-center justify-content-center">
                  <div className="col-xl-7 col-lg-10">
                    <div className="fz-3-banner-txt">
                      <img
                        src="assets/images/fz-1-banner-sticker.png"
                        alt="Company trademark"
                      />
                      <h1>{title}</h1>
                      <p>{categoryDescriptions[title]}</p>

                      <div className="fz-def_btn_wrapper">
                        <Link to="/shopProducts" className="fz-def-btn">
                          <span></span>
                          Comprar
                          <i className="fa-light fa-arrow-up-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fz-3-banner-product-cards">
                  {products.map((item, i) => (
                    <div
                      key={item.idProduct}
                      className={`fz-3-single-product ${i === 1 ? 'fz-3-single-product-2' : ''}`}
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <h5 className="fz-3-single-product__title">
                        <Link to={`/shopDetails/${item.idProduct}`}>
                          {item.name}
                        </Link>
                      </h5>
                      <p className="fz-3-single-product__price">
                        Q{item.salePrice?.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  )
}

export default BannerSection3