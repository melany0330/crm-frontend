import React, { useState, useRef } from "react";
import { toast } from "react-toastify";

const SaleFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const lastFilter = useRef({ startDate: "", endDate: "" });

  
  const parseDateToUTC = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate?.trim() || !endDate?.trim()) {
      toast.warning("Por favor selecciona ambas fechas");
      return;
    }

    const start = parseDateToUTC(startDate);
    const end = parseDateToUTC(endDate);

    if (start > end) {
      toast.warning("La fecha de inicio no puede ser mayor que la fecha de fin");
      return;
    }

    if (
      lastFilter.current.startDate === startDate &&
      lastFilter.current.endDate === endDate
    ) {
      console.log("Mismo filtro, no se actualiza");
      return;
    }

    
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    lastFilter.current = { startDate, endDate };

    onFilter({ startDate: start.toISOString(), endDate: end.toISOString() });
  };

  return (
    <>
      <form className="sale-filter" onSubmit={handleSubmit}>
        <label>
          Fecha Inicio:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Fecha Fin:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button type="submit">Filtrar</button>
      </form>

      <style>{`
        .sale-filter {
          margin-bottom: 1rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          background: #fff0f5;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(255,192,203,0.15);
          font-family: 'Poppins', sans-serif;
        }
        .sale-filter label {
          display: flex;
          flex-direction: column;
          color: #5c2a3d;
          font-weight: 500;
        }
        .sale-filter input[type="date"] {
          padding: 0.4rem 0.6rem;
          border: 1px solid #f8c8dc;
          border-radius: 6px;
          font-family: inherit;
        }
        .sale-filter button {
          background: linear-gradient(to right, #f8c8dc, #ffe0b2);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          color: #5c2a3d;
          transition: 0.2s ease;
        }
        .sale-filter button:hover {
          background: linear-gradient(to right, #ffe0b2, #f8c8dc);
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default SaleFilter;
