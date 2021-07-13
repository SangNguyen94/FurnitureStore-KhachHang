import { IProduct } from './product';

export interface ICart {
  id?: string;
  userID:string;
  products?: ICartProduct[];
}

export function createCart(config: ICart): {  userID: string } {
  let newSquare = { userID: "1" };
  if (config.userID) {
    newSquare.userID = config.userID;
  }
  
  return newSquare;
}

export interface ICartProduct {
  product: IProduct;
  quantity: number;
}

export interface ICartEnvelope {
  imports: ICart[];
  resultCount: number;
}

export interface ICartFormValues extends Partial<ICart> {}

export class CartFormValues implements ICartFormValues {
  id?: string = undefined;
  userID?: string = undefined;

  constructor(init?: ICartFormValues) {
    Object.assign(this, init);
  }
}
