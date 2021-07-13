import { observable, action, runInAction, computed, makeObservable } from 'mobx';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { IOrder, IProductOrder } from '../models/order';
import { IProduct } from '../models/product';

import moment from 'moment-timezone'
const LIMIT = 5;
const NOLIMIT=999;
export default class OrderStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;
  }

  //Observable map
  @observable orderRegistry = new Map();

  //List
  @observable loadingInitial = false;

  //Details
  @observable selectedOrder: IOrder | null = null;

  //Dropdown options
  @observable selectedProduct: IProduct | null = null;
  @observable quantity: number = 0;

  //Set product
  @action setSelectedProduct = async (product: IProduct) => {
    try {
      runInAction( () => {
        this.selectedProduct = product;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem setting product options');
    } finally {
      runInAction( () => {});
    }
  };
  //Set quantity
  @action setQuantity = async (input: number) => {
    try {
      runInAction( () => {
        this.quantity = input;
      });
    } catch (error) {
      console.log(error);
      toast.error('Quantity is not valid');
    } finally {
      runInAction( () => {});
    }
  };

  @computed get totalMoney()
  {
    return this.totalPriceCurrentOrder;
  }
  //Create
  @observable submitting = false;

  //Edit productOrder
  @observable editable = false;

  //Delete
  @observable targetDelete = '';

  @observable totalPriceCurrentOrder = 0;
  //Paging
  @observable orderCount = 0;
  @observable page = 1;

  @computed get orderCountReturn()
  {
   
    return  Array.from(this.orderRegistry.keys()).pop();
  }
  //  export const getLastItemInMap = map => Array.from(map)[map.size-1]
// export const getLastKeyInMap = map => Array.from(map)[map.size-1][0]
// export const getLastValueInMap = map => Array.from(map)[map.size-1][1]

  @computed get LatestOrderID()
  {
    if(this.orderRegistry.size>1){
      return Array.from(this.orderRegistry)[this.orderRegistry.size-1][0];
    }
    else
    {
      return "0";
    }
  }

  @computed get currentOrder()
  {
    return this.selectedOrder;
  }

  @computed get totalPages() {
    return Math.ceil(this.orderCount / LIMIT);
  }

  @action setPages = (page: number) => {
    this.page = page;
  };

  //Filtering
  @observable predicate = new Map();
  @action setPredicate = (predicate: string, value: string | number) => {
    //this.predicate.clear();
    this.predicate.set(predicate, value);
  };
  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.page ? (this.page - 1) * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key !== 'final') params.append(key, value);
    });
    return params;
  }
  @computed get noLimitAxiosParams() {
    const params = new URLSearchParams();
    params.append('limit', String(NOLIMIT));
    params.append('offset', `${this.page ? (this.page - 1) * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key !== 'final') params.append(key, value);
    });
    return params;
  }

  //Filtering option
  @action loadFilters = (isReset: boolean) => {
    this.page = 1;
    if (isReset) {
      this.predicate.clear();
    }
    this.orderRegistry.clear();
    this.loadOrders();
  };


//   //List
  @action loadOrders = async () => {
    this.loadingInitial = true;

    try {
      const orderEnvelope = await agent.Orders.list(this.axiosParams);
      const { orders, resultCount } = orderEnvelope;
      runInAction( () => {
        this.orderRegistry.clear();
        this.orderCount = resultCount;
        orders.forEach((order) => {
          this.orderRegistry.set(order.id, order);
        });
      });
    } catch (error) {
      toast.error('Problem loading orders');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };
//999 orders
  @action loadOrders999 = async () => {
    this.loadingInitial = true;

    try {
      const orderEnvelope = await agent.Orders.list(this.noLimitAxiosParams);
      const { orders, resultCount } = orderEnvelope;
      runInAction( () => {
        this.orderRegistry.clear();
       
        this.orderCount = resultCount;
        orders.forEach((order) => {
          this.orderRegistry.set(order.id, order);
        });
      });
    } catch (error) {
      toast.error('Problem loading orders');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };



  //Detail
  @action loadOrder = async (id: string) => {
    let order = this.getOrder(id);
    if (order) {
      runInAction( () => {
      
        this.selectedOrder = order;
        this.totalPriceCurrentOrder=0;
        // this.CountCart(this.selectedCart?.id!);
        this.selectedOrder?.products?.map((product,i)=>{
          this.totalPriceCurrentOrder+=product.product.price*product.quantity ;
        })
        this.orderRegistry.set(order.id, order);
      });
      return order;
    } else {
      this.loadingInitial = true;
      try {
        order = await agent.Orders.details(id);
        runInAction( () => {
          console.log("Stuck 2");
          this.selectedOrder = order;
          this.totalPriceCurrentOrder=0;
          // this.CountCart(this.selectedCart?.id!);
          this.selectedOrder?.products?.map((product,i)=>{
            this.totalPriceCurrentOrder+=product.product.price*product.quantity ;
          })
          console.log(this.totalPriceCurrentOrder);
          this.orderRegistry.set(order.id, order);
        });
        return order;
      } catch (error) {
        toast.error('Problem load order');
        console.log(error);
      } finally {
        runInAction( () => {
          if (order.products.length == 0) this.editable = true;
          else this.editable = false;
          this.loadingInitial = false;
        });
      }
    }
  };

  getOrder = (id: string) => {
    return this.orderRegistry.get(id);
  };

  //Create
  @action createOrder = async (order: IOrder) => {
    this.submitting = true;
    try {
      order.products.forEach((product)=>{
        product.product.dateAdded= moment(product.product.dateAdded).tz('Asia/Bangkok').utc().toDate();
      })
      await agent.Orders.create(order);
      runInAction( () => {
       
        this.orderRegistry.set(order.id, order);
      });
     // history.push(`/orders/${order.id}`);
    } catch (error) {
      toast.error('Problem submitting data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };

  //Edit
  @action editOrder = async (order: IOrder) => {
    this.submitting = true;
    try {
      order.placementDate=moment(order.placementDate).tz('Asia/Bangkok').utc().toDate();
 
      order.products.forEach((product)=>{
      product.product.dateAdded= moment(product.product.dateAdded).tz('Asia/Bangkok').utc().toDate();
    })
      await agent.Orders.update(order);
      runInAction( () => {
        this.selectedOrder = order;
        this.orderRegistry.set(order.id, order);
      });
      history.push(`/orders/${order.id}`);
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };

  //Delete
  @action deleteOrder = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.targetDelete = event.currentTarget.name;
    //console.log(this.targetDelete);
    //console.log(this.submitting);
    try {
      await agent.Orders.delete(id);
      runInAction( () => {
        this.orderRegistry.delete(id);
      });
    } catch (error) {
      toast.error('Problem deleting data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
        this.targetDelete = '';
      });
    }
  };

  //Add OrderProduct
  @action addProductOrder = async () => {
    if (this.quantity > this.selectedProduct?.stock!)
      toast.error('Quantity is bigger than product stock:' + this.selectedProduct?.stock!);
    else if (this.quantity <= 0) toast.error('Quantity is not valid');
    else if (this.selectedProduct === null) toast.error('Must select a product before adding');
    else {
      try {
        runInAction( () => {
          let productOrder: IProductOrder = {
            product: this.selectedProduct!,
            quantity: this.quantity,
          };
          let isProductContained: boolean = false;
          if (this.selectedOrder!.products.length == 0)
            this.selectedOrder?.products.push(productOrder);
          else {
            for (let iterator of this.selectedOrder!.products) {
              if (iterator.product.id === productOrder.product.id) {
                iterator.quantity += productOrder.quantity;
                isProductContained = true;
              }
            }
            if (!isProductContained) this.selectedOrder?.products.push(productOrder);
          }
        });
      } catch (error) {
        toast.error('Problem adding data');
        console.log(error);
      } finally {
        runInAction( () => {});
      }
    }
  };

  //Remove OrderProduct
  @action removeProductOrder = async () => {
    try {
      runInAction( () => {
        this.selectedOrder!.products = this.selectedOrder!.products.filter(
          (p) => p.product.id !== this.selectedProduct?.id
        );
      });
    } catch (error) {
      toast.error('Problem remove data');
      console.log(error);
    } finally {
      runInAction( () => {});
    }
  };
}
//export default createContext(new ActivityStore());
