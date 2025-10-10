import ServerService from '../../core/service/ServerService';

const server = new ServerService();
const PRODUCTS_PATH = '/api/products';
const CATEGORIES_PATH = '/api/categories';

export async function getProducts() {
  const res = await server.authSend(`${PRODUCTS_PATH}/list`, 'GET');
  return res.data.data;
}

export async function getCatalog() {
  const res = await server.send(`${PRODUCTS_PATH}/catalog`, 'GET'); 
  return res.data.data;
}

export async function getCategories() {
  const res = await server.send(`${CATEGORIES_PATH}/list`, 'GET');
  return res.data.data;
}

export async function createProduct(form, imageFile) {
  const data = new FormData();
  data.append('product', new Blob([JSON.stringify(form)], { type: 'application/json' }));
  if (imageFile) data.append('image', imageFile);


  const res = await server.authSend(
    `${PRODUCTS_PATH}/create`,
    'POST',
    data,
    { 'Content-Type': 'multipart/form-data' }
  );
  return res.data.data;
}

export async function updateProduct(id, form, imageFile) {
  const data = new FormData();
  data.append('product', new Blob([JSON.stringify(form)], { type: 'application/json' }));
  if (imageFile) data.append('image', imageFile);

  const res = await server.authSend(
    `${PRODUCTS_PATH}/update/${id}`,
    'PUT',
    data,
    { 'Content-Type': 'multipart/form-data' }
  );
  return res.data.data;
}

export async function changeProductStatus(id, actionType) {
  const endpoint = actionType === 'deactivate' ? 'deactivate' : 'activate';
  const res = await server.authSend(`${PRODUCTS_PATH}/${endpoint}/${id}`, 'PATCH');
  return res.data.data;
}