import React from 'react'
import { Link } from 'react-router-dom'

const BreadcrumbSection = ({ title, current }) => {
  return (
    <div className="fz-inner-page-breadcrumb">
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-12">
            <div className="breadcrumb-txt">
              <h1>{title}</h1>
              <ul className="fz-inner-page-breadcrumb-nav">
                <li><Link to="/">Inicio</Link></li>
                <li className="current-page">{current}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .fz-inner-page-breadcrumb {
            background: linear-gradient(to right, #f8c8dc, #ffe0b2);
            padding: 2rem 0;
            margin-bottom: 2rem;
            border-radius: 0 0 20px 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          }

          .breadcrumb-txt h1 {
            font-size: 2.3rem;
            font-weight: 700;
            color: #5c2a3d;
            margin-bottom: 0.5rem;
          }

          .fz-inner-page-breadcrumb-nav {
            list-style: none;
            display: flex;
            gap: 1rem;
            padding: 0;
            margin: 0;
            font-size: 1rem;
            font-weight: 500;
          }

          .fz-inner-page-breadcrumb-nav li {
            color: #7a4e4e;
          }

          .fz-inner-page-breadcrumb-nav a {
            color: #a14d5a;
            text-decoration: none;
            transition: color 0.2s ease;
          }

          .fz-inner-page-breadcrumb-nav a:hover {
            color: #5c2a3d;
            text-decoration: underline;
          }

          .current-page {
            font-weight: bold;
            color: #5c2a3d;
          }
        `}
      </style>
    </div>
  )
}

export default BreadcrumbSection