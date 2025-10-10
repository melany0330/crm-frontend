import React from 'react'

const FeaturedSection2 = () => {
  return (
    <div className="fz-3-features-section">
        <div className="container">
            <div className="features-container align-items-center">
                <div className="fz-single-feature">
                    <div className="fz-3-single-feature__img">
                        <img src="assets/images/fz-feature-1.png" alt="Feature Icon"/>
                    </div>
                    <div className="fz-3-single-feature__txt">
                        <h4 className="fz-3-single-feature__title">Envío Gratis</h4>
                        <h6 className="fz-3-single-feature__sub-title">Unicamente por Q50</h6>
                    </div>
                </div>


                <div className="fz-single-feature">
                    <div className="fz-3-single-feature__img">
                        <img src="assets/images/fz-feature-3.png" alt="Feature Icon"/>
                    </div>
                    <div className="fz-3-single-feature__txt">
                        <h4 className="fz-3-single-feature__title">Politica de devolución</h4>
                        <h6 className="fz-3-single-feature__sub-title">Por mal estado</h6>
                    </div>
                </div>

                <div className="fz-single-feature">
                    <div className="fz-3-single-feature__img">
                        <img src="assets/images/fz-feature-4.png" alt="Feature Icon"/>
                    </div>
                    <div className="fz-3-single-feature__txt">
                        <h4 className="fz-3-single-feature__title">Pago Seguro</h4>
                        <h6 className="fz-3-single-feature__sub-title">Sistema</h6>
                    </div>
                </div>
            </div>
            <br></br>
        </div>
    </div>
  )
}

export default FeaturedSection2