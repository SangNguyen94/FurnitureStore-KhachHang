import { IOrder } from "./order";

export interface IUser {
  id: string;
  userName: string;
  email: string;
  role: string;
  token: string;
  orders: IUserOrder[];
}

export interface IUserOrder {
  order: IOrder;
  quantity: number;
}

export interface IUserFormValues {
  email: string;
  password: string;
  userName?: string;
  role: string;
}
