// src/service/crm/activities.service.js
import ServerService from "../../core/service/ServerService";

function toArray(x) {
  const d = x?.data ?? x;
  if (Array.isArray(d)) return d;            // [ ... ]
  if (Array.isArray(d?.data)) return d.data; // { data:[ ... ] }
  if (Array.isArray(d?.rows)) return d.rows;
  if (Array.isArray(d?.content)) return d.content;
  if (Array.isArray(d?.items)) return d.items;
  if (d && typeof d === "object" && (d.idActivity || d.id || d.idActividad)) return [d];
  return [];
}

class ActivitiesService {
  ss = new ServerService();

  list() {
    return this.ss.authSend("/api/activities/list", "GET")
      .then((r) => toArray(r.data));
  }

  listByClient(clientId) {
    const id = Number(clientId);
    return this.ss.authSend(`/api/activities/listByClient/${id}`, "GET")
      .then((r) => toArray(r.data));
  }

  getById(id) {
    return this.ss.authSend(`/api/activities/listById/${Number(id)}`, "GET")
      .then((r) => r?.data?.data ?? r?.data ?? r);
  }

  create(dto) {
    return this.ss.authSend("/api/activities/create", "POST", dto)
      .then((r) => r?.data?.data ?? r?.data ?? r);
  }

  update(id, dto) {
    return this.ss.authSend(`/api/activities/update/${Number(id)}`, "PUT", dto)
      .then((r) => r?.data?.data ?? r?.data ?? r);
  }

  deactivate(id) {
    return this.ss.authSend(`/api/activities/delete/${Number(id)}`, "DELETE")
      .then((r) => r?.data?.data ?? r?.data ?? r);
  }
}

export default new ActivitiesService();
