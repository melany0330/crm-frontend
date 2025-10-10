import React from 'react'
import SignInFormView from '../forms/SignInFormView'

const AuthenticationView = () => {
  return (
    <section className="fz-account-form-section">
        <div className="container">
            <div className="row g-4 justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-9 col-10 col-xxs-12">
                    <h3 className="single-form-title">Iniciar Sesión</h3>
                    <SignInFormView />
                </div>
            </div>
        </div>
    </section>
  )
}

export default AuthenticationView