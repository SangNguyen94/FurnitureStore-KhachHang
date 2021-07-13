import ProductStore from './productStore';
import { createContext } from 'react';
//import { configure } from '../../../../../../../../../../Users/sangpck/Desktop/template/TTTN/website/Sport-Store-React-master/node_modules/mobx/lib/mobx';
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import ProductOptions from './productOptionsStore';
import UserStore from './userStore';
import OrderStore from './orderStore';
import OrderOptionsStore from './orderProductOptionsStore';
import ImportStore from './importStore';
import ShipmentOptionsStore from './shipmentOptionsStore';
import ImportShipmentStore from './importShipmentStore';
import OrderShipmentStore from './orderShipmentStore';
import IncomeStore from './incomeStore';
import RevenueStore from './revenueStore';
import CartStore from './cartStore';


export class RootStore {
  productStore: ProductStore;
  productOptions: ProductOptions;
  commonStore: CommonStore;
  modalStore: ModalStore;
  userStore: UserStore;
  orderStore: OrderStore;
  importStore: ImportStore;
  orderOptions: OrderOptionsStore;
  shipmentOptions: ShipmentOptionsStore;
  importShipmentStore: ImportShipmentStore;
  orderShipmentStore: OrderShipmentStore;
  incomeStore: IncomeStore;
  revenueStore: RevenueStore;
  cartStore: CartStore;

  constructor() {
    this.productStore = new ProductStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
    this.productOptions = new ProductOptions(this);
    this.userStore = new UserStore(this);
    this.orderStore = new OrderStore(this);
    this.orderOptions = new OrderOptionsStore(this);
    this.importStore = new ImportStore(this);
    this.shipmentOptions = new ShipmentOptionsStore(this);
    this.importShipmentStore = new ImportShipmentStore(this);
    this.orderShipmentStore = new OrderShipmentStore(this);
    this.incomeStore = new IncomeStore(this);
    this.revenueStore = new RevenueStore(this);
    this.cartStore = new CartStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
