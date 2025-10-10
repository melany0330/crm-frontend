import ServerService from '../../core/service/ServerService';

const server = new ServerService();
const PROVIDERS_PATH = '/api/providers';

export async function getProviders() {
  
  const res = await server.authSend(`${PROVIDERS_PATH}/list`, 'GET');
  return res.data.data;
}

export async function createProvider(data) {
  const res = await server.authSend(`${PROVIDERS_PATH}/create`, 'POST', data);
  return res.data.data;
}

export async function updateProvider(id, data) {
  const res = await server.authSend(`${PROVIDERS_PATH}/update/${id}`, 'PUT', data);
  return res.data.data;
}

export async function deactivateProvider(id) {
  const res = await server.authSend(`${PROVIDERS_PATH}/deactivate/${id}`, 'PUT');
  return res.data.data;
}