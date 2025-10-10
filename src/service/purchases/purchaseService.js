import ServerService from '../../core/service/ServerService';

const server = new ServerService();
const PURCHASES_PATH = '/api/purchases';

export async function getPurchases() {
  const res = await server.authSend(`${PURCHASES_PATH}/list`, 'GET');
  return res.data.data;
}

export async function deactivatePurchase(id) {
  const res = await server.authSend(`${PURCHASES_PATH}/deactivate/${id}`, 'PUT');
  return res.data.data;
}

export async function getPurchaseReportByDates(startDate, endDate) {
  const res = await server.authSend(`${PURCHASES_PATH}/reportByDates`, 'POST', {
    startDate,
    endDate,
  });
  return res.data.data;
}

export async function createPurchase(purchaseData) {
  const res = await server.authSend(`${PURCHASES_PATH}/create`, 'POST', purchaseData);
  return res.data;
}