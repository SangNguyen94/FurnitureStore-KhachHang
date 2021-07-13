import axios, { AxiosResponse } from 'axios';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IProduct, IProductEnvelope, IPhoto } from '../models/product';
import { IProductOption, IShipmentOption } from '../common/sample/productOptions';
import { IUser, IUserFormValues, IUserOrder } from '../models/user';
import { IOrderEnvelope, IOrder } from '../models/order';
import { IImportEnvelope, IImport } from '../models/import';
import { IShipment, IShipmentEnvelope } from '../models/shipment';
import { IIncomeEnvelope } from '../models/income';
import { IRevenueEnvelope } from '../models/revenue';
import { ICart } from '../models/cart';
import { request } from 'http';
import qs from 'qs';
import dayjs from 'dayjs'
import { parseISO } from 'date-fns';
// import { IUser, IUserFormValues } from '../models/user';
// import { IProfile, IPhoto } from '../models/profile';

axios.defaults.baseURL = 'http://ec2-13-228-71-245.ap-southeast-1.compute.amazonaws.com:8080/FurnitureStore-1.0/rest';
//axios.defaults.baseURL = 'http://localhost:14640/FurnitureStore/rest';

//add token to request header
// axios.interceptors.request.use(
//   (config) => {
//     const token = window.localStorage.getItem('jwt');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// axios.interceptors.request.use((config) => {
//   config.paramsSerializer = (params) => qs.stringify(params, {
//     serializeDate: (date: Date) => dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ') });
//   return config;
// })

// axios.interceptors.response.use(originalResponse => {
//   handleDates(originalResponse.data);
//   return originalResponse;
// });

// const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?$/;

// function isIsoDateString(value: any): boolean {
//   return value && typeof value === "string" && isoDateFormat.test(value);
// }

// export function handleDates(body: any) {
//   if (body === null || body === undefined || typeof body !== "object")
//     return body;

//   for (const key of Object.keys(body)) {
//     const value = body[key];
//     if (isIsoDateString(value)) body[key] = parseISO(value);
//     else if (typeof value === "object") handleDates(value);
//   }
// }
//error handle from response
axios.interceptors.response.use(undefined, (error) => {
  console.log(error);
  if (error.message === 'Network Error' && !error.response) {
    toast.error('NETWORK ERROR-can not connect to sever network!');
  }
  const { status, config } = error.response;
  if (status === 404) {
    history.push('/notfound');
  }
  if (status === 400 && config.method === 'get' /*&& data.errors.hasOwnProperty('id')*/) {
    history.push('/notfound');
  }
  if (status === 500) {
    toast.error('SEVER ERROR-check the terminal error for more info!');
  }
  if (status === 403) {
    toast.error('Your action is forbidden, please contact site admin for more info!');
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) => setTimeout(() => resolve(response), ms));

// const requests = {
//   get: (url: string) => axios.get(url).then(responseBody),
//   post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
//   put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
//   delete: (url: string) => axios.delete(url).then(responseBody),
// };

const requests = {
  get: (url: string) => axios.get(url).then(sleep(100)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(100)).then(responseBody),
  postCP: (url: string) => axios.post(url).then(sleep(100)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(100)).then(responseBody),
  putCP: (url: string) => axios.put(url).then(sleep(100)).then(responseBody),
  delete: (url: string) => axios.delete(url).then(sleep(100)).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios
      .post(url, formData, { headers: { 'Content-type': 'multipart/form-data' } })
      .then(responseBody);
  },
};

const Product = {
  list: (params: URLSearchParams): Promise<IProductEnvelope> =>
    axios.get('/products', { params: params }).then(sleep(250)).then(responseBody),
  details: (id: string) => requests.get(`/products/${id}`),
  create: (product: IProduct) => requests.post('/products', product),
  update: (product: IProduct) => requests.put(`/products/${product.id}`, product),
  delete: (id: string) => requests.delete(`/products/${id}`),
};

const Photo = {
  uploadPhoto: (photo: Blob, productId: string): Promise<IPhoto> =>
    requests.postForm(`/photo/${productId}`, photo),
  setMainPhoto: (id: string) => requests.put(`/photo/${id}`, {}),
  deletePhoto: (id: string) => requests.delete(`/photo/${id}`),
};

const ProductOptions = {
  list: (): Promise<IProductOption> => requests.get('/productOptions'),
};

const Users = {
  current: (): Promise<IUser> => requests.get('/users'),
  getUserOrders: (id:String): Promise<IUserOrder[]> => requests.get(`/users/${id}`).then((result)=>{
    console.log(result);
    return result;
  }),
  login: (user: IUserFormValues): Promise<IUser> => requests.post(`/users/login`, user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post(`/users/register`, user),
  edit: (user: IUserFormValues): Promise<IUser> => requests.put(`/users/`, user),
  delete: (email: String) => requests.delete(`/users/${email}`),
  getEmployee: (): Promise<IUser[]> => requests.get('/users/getEmployees'),
  deleteUserOrder: (id: string,orderID:string) => requests.delete(`/users/${id}/${orderID}`),
  createUserOrder: (id: string,orderID:string,quantity:number) => requests.postCP(`/users/${id}/${orderID}/${quantity}`),
  setRole: (email: String, role: String): Promise<IUser> =>
    requests.put(`/users/${email}?role=${role}`, {}),
};

const Orders = {
  list: (params: URLSearchParams): Promise<IOrderEnvelope> =>
    axios.get('/orders', { params: params }).then(sleep(250)).then(responseBody),
  details: (id: string) => requests.get(`/orders/${id}`),
  create: (order: IOrder) => requests.post('/orders', order),
  update: (order: IOrder) => requests.put(`/orders/${order.id}`, order),
  delete: (id: string) => requests.delete(`/orders/${id}`),
};

const Imports = {
  list: (params: URLSearchParams): Promise<IImportEnvelope> =>
    axios.get('/imports', { params: params }).then(sleep(250)).then(responseBody),
  details: (id: string) => requests.get(`/imports/${id}`),
  create: (importDTO: IImport) => requests.post('/imports', importDTO),
  update: (importDTO: IImport) => requests.put(`/imports/${importDTO.id}`, importDTO),
  delete: (id: string) => requests.delete(`/imports/${id}`),
};

const ImportShipment = {
  list: (params: URLSearchParams): Promise<IShipmentEnvelope> =>
    axios.get('/importShipment', { params: params }).then(sleep(250)).then(responseBody),
  details: (id: string) => requests.get(`/importShipment/${id}`),
  create: (imShipment: IShipment) => requests.post('/importShipment', imShipment),
  update: (imShipment: IShipment) => requests.put(`/importShipment/${imShipment.id}`, imShipment),
  delete: (id: string) => requests.delete(`/importShipment/${id}`),
};

const OrderShipment = {
  list: (params: URLSearchParams): Promise<IShipmentEnvelope> =>
    axios.get('/orderShipment', { params: params }).then(sleep(250)).then(responseBody),
  details: (id: string) => requests.get(`/orderShipment/${id}`),
  create: (orShipment: IShipment) => requests.post('/orderShipment', orShipment),
  update: (orShipment: IShipment) => requests.put(`/orderShipment/${orShipment.id}`, orShipment),
  delete: (id: string) => requests.delete(`/orderShipment/${id}`),
  
};
const Cart={
  details: (id: string) => requests.get(`/cart/${id}`),
  count: (id: string) => requests.get(`/cart/count/${id}`),
  detailsByUser:(id: string) => requests.get(`/cart/${id}`),
  create: (cart:ICart) => requests.post('/cart', cart),
  createWithUser:(userID:string, quantity:string)=> requests.postCP(`/cart/${userID}/${quantity}`),
  update: (cart:ICart) => requests.put(`/cart/${cart.id}`, cart),
  deleteAllCP: (id: string) => requests.delete(`/cart/CPremove/${id}`),
  delete: (id: string) => requests.delete(`/cart/${id}`),
  deleteCartProduct: (id: string,productID:string) => requests.delete(`/cart/${id}/${productID}`),
  updateCartProduct: (id: string,productID:string,quantity:number) => requests.putCP(`/cart/${id}/${productID}/${quantity}`),
  createCartProduct: (id: string,productID:string,quantity:number) => requests.postCP(`/cart/${id}/${productID}/${quantity}`),
};

const ShipmentOptions = {
  list: (): Promise<IShipmentOption> => requests.get('/shipmentOptions'),
};

const Income = {
  list: (params: URLSearchParams): Promise<IIncomeEnvelope> =>
    axios.get('/statistics/income', { params: params }).then(sleep(250)).then(responseBody),
};

const Revenue = {
  list: (params: URLSearchParams): Promise<IRevenueEnvelope> =>
    axios.get('/statistics/revenue', { params: params }).then(sleep(250)).then(responseBody),
};

export default {
  Product,
  ProductOptions,
  Photo,
  Users,
  Orders,
  Imports,
  ImportShipment,
  OrderShipment,
  ShipmentOptions,
  Income,
  Revenue,
  Cart,
};
