import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { getCatalog } from "../../service/products/productService";

const BASE_URL = `${import.meta.env.VITE_WMS_PROTOCOL}://${import.meta.env.VITE_WMS_NAME}:${import.meta.env.VITE_WMS_PORT}`;

const LayerCakeSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getCatalog();
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    }
    loadProducts();
  }, []);

  const getImageUrl = (path) => `${BASE_URL}${path}`;

  return (
    <>
      <style>{`
        .fz-3-single-product__img img {
          transition: transform 0.3s ease;
        }
        .fz-3-single-product__img img:hover {
          transform: scale(1.1);
        }
      `}</style>

      <section className="fz-3-layer-cake-section">
        <div className="container">
          <div className="fz-3-section-heading">
            <div className="section-heading__txt">
              <h2 className="fz-section-title">Pasteles</h2>
              <p className="fz-section-sub-title">
                El pecado más dulce que amarás cometer
              </p>
            </div>

            <div className="section-heading__actions">
              <div className="fz-3-layer-cake-slider-nav fz-3-slider-nav">
                <button className="owl-prev">
                  <i className="fa-solid fa-angle-left"></i>
                </button>
                <button className="owl-next">
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
            </div>
          </div>

          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            loop={true}
            autoplay={{ delay: 3000 }}
            navigation={{
              prevEl: ".owl-prev",
              nextEl: ".owl-next",
            }}
            modules={[Navigation, Autoplay]}
            className="fz-3-layer-cake-slider owl-carousel"
            breakpoints={{
              0: { slidesPerView: 1, centeredSlides: true },
              480: { slidesPerView: 2, centeredSlides: false },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
          >
            {products.filter(item => item.idCategory === 3)
            .slice(0, 6).map((item) => (
              <SwiperSlide className="fz-3-single-product" key={item.idProduct}>
                <div className="fz-3-single-product__img">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    style={{
                      objectFit: "cover",
                      height: "250px",
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div className="fz-3-single-product__txt">
  <span
    className="fz-3-single-product__title"
    title={item.name}
    style={{ cursor: "default" }} 
  >
    {item.name}
  </span>
                  <p className="fz-3-single-product__price">
                    <span className="current-price">
                      Q{item.salePrice.toFixed(2)}
                    </span>
                  </p>
                  <p className="fz-3-single-product__description">
                    {item.description.length > 50
                      ? `${item.description.substring(0, 50)}...`
                      : item.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default LayerCakeSlider;