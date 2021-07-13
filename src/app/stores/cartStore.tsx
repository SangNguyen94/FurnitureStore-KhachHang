import { observable, action, runInAction, computed, makeObservable } from 'mobx';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { ICart, ICartProduct } from '../models/cart';
import { IProduct } from '../models/product';

const LIMIT = 5;

export default class CartStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;
  }

  //Observable map
  @observable cartRegistry = new Map();

  //Observable map
  @observable productRegistry = new Map();

  //List
  @observable loadingcart = false;

  //Details
  @observable selectedCart: ICart | undefined ;

  @observable currentID:string ="";

  @computed get cartID()
  {
    if(this.selectedCart)
    {
      return this.selectedCart.id;
    }
    else
    {
      return "1";
    }
  }

  @computed get  currID()
  {
    console.log("Changing curr id");
    return this.currentID;
  }
  @computed get currentCart()
  {
    if(this.selectedCart)
    {
      console.log("Returning this current cart");
      return this.selectedCart;
    }
    else
    {
      return ;
    }
  }

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

  //Create
  @observable submitting = false;

  //Total price
  @observable totalPrice = 0;

  //Edit productCart
  @observable editable = false;

  //Delete
  @observable targetDelete = '';

  //Paging
  @observable cartCount = 0;
  @observable page = 1;

  @computed get totalPages() {
    return Math.ceil(this.cartCount / LIMIT);
  }

  @computed get totalMoney()
  {
    return this.totalPrice;
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

  @action setCount= async(count:number)=>
  {
    try {
      runInAction( () => {
        this.cartCount = count;
      });
  
    } catch (error) {
      toast.error('Problem set count');
      console.log(error);
    }
   
  }
  //Filtering option
//   @action loadFilters = (isReset: boolean) => {
//     this.page = 1;
//     if (isReset) {
//       this.predicate.clear();
//     }
//     this.cartRegistry.clear();
//     this.loadCart();
//   };

  //List
//   @action loadCarts = async () => {
//     this.loadingcart = true;

//     try {
//       const cartEnvelope = await agent.Cart.list(this.axiosParams);
//       const { carts, resultCount } = cartEnvelope;
//       runInAction('loading carts', () => {
//         this.cartRegistry.clear();
//         this.cartCount = resultCount;
//         carts.forEach((cartDTO) => {
//           this.cartRegistry.set(cartDTO.id, cartDTO);
//         });
//       });
//     } catch (error) {
//       toast.error('Problem loading carts');
//       console.log(error);
//     } finally {
//       runInAction('finished loading', () => {
//         this.loadingcart = false;
//       });
//     }
//   };

  //Detail
  @action loadCart = async (id: string) => {
   
    let cartDTO = this.getCart(id);
    if (cartDTO) {
      this.selectedCart = cartDTO;
      return cartDTO;
    } else {
      this.loadingcart = true;
      try {
        cartDTO = await agent.Cart.details(id);
        const cartcount= await this.CountCart(id);
        runInAction( () => {
          this.selectedCart = cartDTO;
          this.cartCount=cartcount;
          this.totalPrice=0;
          // this.CountCart(this.selectedCart?.id!);
          this.selectedCart?.products?.map((product,i)=>{
            this.totalPrice+=product.product.price*product.quantity ;
          }
          
          );
          this.currentID=this.selectedCart?.id!;
          this.cartRegistry.set(cartDTO.id, cartDTO);
          
        });
        console.log("currentID: "+this.currentID);
        return cartDTO;
      } catch (error) {
        toast.error('Problem load cart');
        console.log(error);
      } finally {
          runInAction( () => {
            this.loadingcart = false;
          });
      }
    }
  };

  getCart = (id: string) => {
    return this.cartRegistry.get(id);
  };

  //Create
//   @action createCart = async (cartDTO: ICart) => {
//     this.submitting = true;
//     try {
//       await agent.Cart.create(cartDTO);
//       runInAction('creating cart', () => {
//         this.cartRegistry.set(cartDTO.id, cartDTO);
//       });
//       history.push(`/carts/${cartDTO.id}`);
//     } catch (error) {
//       toast.error('Problem submitting data');
//       console.log(error);
//     } finally {
//       runInAction('finished creating', () => {
//         this.submitting = false;
//       });
//     }
//   };

  //Edit
  @action editCart = async (cartDTO: ICart) => {
    this.submitting = true;
    try {
      await agent.Cart.update(cartDTO);
      runInAction( () => {
        this.selectedCart = cartDTO;
        this.cartRegistry.set(cartDTO.id, cartDTO);
      });
      history.push(`/carts/${cartDTO.id}`);
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };
   
  @computed get count()
  {
    return this.cartCount;
  }
    //Count
    @action CountCart = async (cartID:string) => {
      this.submitting = true;
      try {
         const Count =await agent.Cart.count(cartID);
        runInAction( () => {
          
          this.cartCount=Count;
        });
        
        console.log('ID: '+cartID);
        console.log('count: '+Count);
        return Count;
        // history.push(`/carts/${cartDTO.id}`);
      } catch (error) {
        toast.error('Problem editing data');
        console.log(error);
      } finally {
        runInAction( () => {
          this.submitting = false;
        });
      }
    };
  //Edit cart product
  @action editCartProduct = async (id:string) => {
    this.submitting = true;
    id=this.selectedCart?.id!;
    try {
      await agent.Cart.updateCartProduct(id,this.selectedProduct?.id!,this.quantity);
      runInAction( () => {
        let productCart: ICartProduct = {
          product: this.selectedProduct!,
          quantity: this.quantity,
        };
        let isProductContained: boolean = false;
        if (this.selectedCart!.products?.length == 0)
          this.selectedCart?.products.push(productCart);
        else {
          for (let iterator of this.selectedCart!.products!) {
            if (iterator.product.id === productCart.product.id) {
              iterator.quantity = productCart.quantity;
              isProductContained = true;
            }
          }
          if (!isProductContained) this.selectedCart?.products?.push(productCart);
        }
      });
    //   history.push(`/carts/${cartDTO.id}`);
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };

  @action editCartProductNormal = async (id:string,prodcutID:string,quantity:number) => {
    this.submitting = true;
    // id=this.selectedCart?.id!;
    try {
      await agent.Cart.updateCartProduct(id,prodcutID,quantity);
      await this.loadCart(this.currentID);
      runInAction( () => {
        
      
          for (let iterator of this.selectedCart!.products!) {
            if (iterator.product.id === prodcutID) {
              console.log((iterator.quantity));
              this.totalPrice+=(quantity-iterator.quantity)*iterator.product.price;
              console.log("price change in update: "+this.totalPrice);
              iterator.quantity = quantity;
             
            }
          }
       
        
      });
    //   history.push(`/carts/${cartDTO.id}`);
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };

  //Create cart product
  @action createCartProduct = async (id:string) => {
    this.submitting = true;
    id=this.selectedCart?.id!;
    try {
      await agent.Cart.createCartProduct(id,this.selectedProduct?.id!,this.quantity);
      runInAction( () => {
        let productCart: ICartProduct = {
          product: this.selectedProduct!,
          quantity: this.quantity,
        };
        let isProductContained: boolean = false;
        if (this.selectedCart!.products!.length == 0)
          this.selectedCart?.products?.push(productCart);
        else {
          for (let iterator of this.selectedCart!.products!) {
            if (iterator.product.id === productCart.product.id) {
              iterator.quantity = productCart.quantity;
              isProductContained = true;
            }
          }
          if (!isProductContained) this.selectedCart?.products?.push(productCart);
        }
      });
    //   history.push(`/carts/${cartDTO.id}`);
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };

  //Create cart product
  @action createCartProductNormal = async (id:string,prodcutID:string,quantity:number) => {
    this.submitting = true;
    //id=this.selectedCart?.id!;
    try {
      await agent.Cart.createCartProduct(id,prodcutID,quantity);
      await this.loadCart(this.selectedCart?.id!);
      const newProduct= await agent.Product.details(prodcutID);
      runInAction( () => {
        
      
        if(this.selectedCart)
        {
          this.selectedCart.products?.push(newProduct);
          this.cartCount++;
        }
           
        
     
      
    });
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };

  //Create cart product
  @action removeCartProductNormal = async (id:string,prodcutID:string) => {
    this.submitting = true;
    //id=this.selectedCart?.id!;
    try {
      await agent.Cart.deleteCartProduct(id,prodcutID);
      await this.loadCart(id);
      history.go(0)
    //   runInAction('adding product cart', () => {
    //     let productCart: ICartProduct = {
    //       product: this.selectedProduct!,
    //       quantity: this.quantity,
    //     };
    //     let isProductContained: boolean = false;
    //     if (this.selectedCart!.products.length == 0)
    //       this.selectedCart?.products.push(productCart);
    //     else {
    //       for (let iterator of this.selectedCart!.products) {
    //         if (iterator.product.id === productCart.product.id) {
    //           iterator.quantity = productCart.quantity;
    //           isProductContained = true;
    //         }
    //       }
    //       if (!isProductContained) this.selectedCart?.products.push(productCart);
    //     }
    //   });
    //   history.push(`/carts/${cartDTO.id}`);
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };

  @action removeCartProductAll = async (cartID:string) => {
    this.submitting = true;
    //id=this.selectedCart?.id!;
    try {
      await agent.Cart.deleteAllCP(cartID);
      await this.loadCart(cartID);
      runInAction( () => {
        this.cartCount = 0;
      });
      
    //   runInAction('adding product cart', () => {
    //     let productCart: ICartProduct = {
    //       product: this.selectedProduct!,
    //       quantity: this.quantity,
    //     };
    //     let isProductContained: boolean = false;
    //     if (this.selectedCart!.products.length == 0)
    //       this.selectedCart?.products.push(productCart);
    //     else {
    //       for (let iterator of this.selectedCart!.products) {
    //         if (iterator.product.id === productCart.product.id) {
    //           iterator.quantity = productCart.quantity;
    //           isProductContained = true;
    //         }
    //       }
    //       if (!isProductContained) this.selectedCart?.products.push(productCart);
    //     }
    //   });
    //   history.push(`/carts/${cartDTO.id}`);
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.cartCount=0;
        this.submitting = false;
      });
    }
  };

  //Delete
//   @action deleteCart = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
//     this.submitting = true;
//     this.targetDelete = event.currentTarget.name;
//     //console.log(this.targetDelete);
//     //console.log(this.submitting);
//     try {
//       await agent.Cart.delete(id);
//       runInAction('deleting cart', () => {
//         this.cartRegistry.delete(id);
//       });
//     } catch (error) {
//       toast.error('Problem deleting data');
//       console.log(error);
//     } finally {
//       runInAction('finished deleting', () => {
//         this.submitting = false;
//         this.targetDelete = '';
//       });
//     }
//   };

  //Add CartProduct
//   @action addProductCart = async () => {
//     if (this.quantity <= 0) toast.error('Quantity is not valid');
//     else if (this.selectedProduct === null) toast.error('Must select a product before adding');
//     else {
//       try {
//         runInAction('adding product cart', () => {
//           let productCart: ICartProduct = {
//             product: this.selectedProduct!,
//             quantity: this.quantity,
//           };
//           let isProductContained: boolean = false;
//           if (this.selectedCart!.products.length == 0)
//             this.selectedCart?.products.push(productCart);
//           else {
//             for (let iterator of this.selectedCart!.products) {
//               if (iterator.product.id === productCart.product.id) {
//                 iterator.quantity += productCart.quantity;
//                 isProductContained = true;
//               }
//             }
//             if (!isProductContained) this.selectedCart?.products.push(productCart);
//           }
//         });
//       } catch (error) {
//         toast.error('Problem adding data');
//         console.log(error);
//       } finally {
//         runInAction('finished adding', () => {});
//       }
//     }
//   };

  //Remove CartProduct
  @action removeProductCart = async () => {
    try {
      runInAction( () => {
        this.selectedCart!.products = this.selectedCart!.products!.filter(
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
