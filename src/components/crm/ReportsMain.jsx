import { useMemo, useState } from "react";
import "../../pages/crm/crm.css";
import BreadcrumbSection from "../breadcrumb/BreadcrumbSection";
import ClientReportView from "./reports/ClientReportView";
import SalesReportView from "./reports/SalesReportView";

const REPORT_VIEWS = [
  {
    id: "sales",
    title: "Ventas",
    description: "Productos destacados.",
    component: SalesReportView,
  },
  {
    id: "clients",
    title: "Clientes",
    description: "Clientes que mas compran.",
    component: ClientReportView,
  },
];

export default function ReportsMain() {
  const [activeView, setActiveView] = useState(REPORT_VIEWS[0].id);
  const ActiveComponent = useMemo(
    () =>
      REPORT_VIEWS.find((view) => view.id === activeView)?.component ??
      SalesReportView,
    [activeView]
  );

  return (
    <div className="crm-wrap nice-font">
      <BreadcrumbSection title="Reportes CRM" current="Reportes" />

      <div className="report-tabs">
        {REPORT_VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            className={`report-tab ${view.id === activeView ? "active" : ""}`}
            onClick={() => setActiveView(view.id)}
          >
            <span>{view.title}</span>
            <small>{view.description}</small>
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
}
