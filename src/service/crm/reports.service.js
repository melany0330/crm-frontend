// src/service/crm/reports.service.js
import ServerService from "../../core/service/ServerService";

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.append(key, value);
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

class ReportsService {
  ss = new ServerService();

  async getSalesReport(params = {}) {
    const suffix = buildQuery({
      startDate: params.startDate,
      endDate: params.endDate,
      clientId: params.clientId,
    });
    const response = await this.ss.authSend(`/api/reports/sales${suffix}`, "GET");
    return response.data?.data ?? response.data;
  }

  async exportSalesReport(params = {}) {
    const suffix = buildQuery({
      startDate: params.startDate,
      endDate: params.endDate,
      clientId: params.clientId,
      format: params.format ?? "csv",
    });
    return this.#download(`/api/reports/sales/export${suffix}`);
  }

  async getClientInsights(params = {}) {
    const suffix = buildQuery({
      startDate: params.startDate,
      endDate: params.endDate,
      clientId: params.clientId,
      categoryId: params.categoryId,
    });
    const response = await this.ss.authSend(`/api/reports/clients${suffix}`, "GET");
    return response.data?.data ?? response.data;
  }

  async exportClientInsights(params = {}) {
    const suffix = buildQuery({
      startDate: params.startDate,
      endDate: params.endDate,
      clientId: params.clientId,
      categoryId: params.categoryId,
      format: params.format ?? "csv",
    });
    return this.#download(`/api/reports/clients/export${suffix}`);
  }

  async #download(url) {
    const response = await this.ss.authSend(
      url,
      "GET",
      null,
      { Accept: "text/csv" },
      { responseType: "blob" }
    );
    return response.data;
  }
}

export default new ReportsService();
