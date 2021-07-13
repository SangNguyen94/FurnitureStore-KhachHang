import { observable, action, runInAction, computed, makeObservable } from 'mobx';
import { SyntheticEvent } from 'react';
import { IProduct, IPhoto } from '../models/product';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import moment from 'moment-timezone'
const LIMIT = 10;

export default class ProductStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;

    // reaction(
    //   () => this.predicate.get('final'),
    //   () => {
    //     if (this.predicate.get('final') === 'true') {
    //       this.page = 1;
    //       this.productRegistry.clear();
    //       this.loadProducts();
    //       //this.predicate.clear();
    //     }
    //     if (this.predicate.get('final') === 'false') {
    //       this.page = 1;
    //       this.predicate.clear();
    //       this.productRegistry.clear();
    //       this.loadProducts();
    //     }
    //   } 
    // );
  }

  //Observable map
  @observable productRegistry = new Map();

  @observable allProductRegistry = new Map();

  //List
  @observable loadingInitial = false;

  //Details
  @observable selectedProduct: IProduct | null = null;

  //Create
  @observable submitting = false;

  //Delete
  @observable targetDelete = '';

  //Paging
  @observable productCount = 0;
  @observable page = 1;

  @observable allProductCount = 0;
  //Photo
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable setMainLoading = false;

  @computed get totalPages() {
    return Math.ceil(this.productCount / LIMIT);
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
    const params1 = new URLSearchParams();
    console.log(LIMIT);
    params1.append('limit', String(LIMIT));
    params1.append('offset', `${this.page ? (this.page - 1) * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      console.log("value: "+value+ " Key: "+key);
      if (key !== 'final') params1.append(key, value);
    });
    return params1;
  }

  @computed get axiosParamsNoLimit() {
    const params = new URLSearchParams();
    params.append('limit', String(999));
    params.append('offset', `${this.page ? (this.page - 1) * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      console.log("value: "+value+ " Key: "+key);
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
    this.productRegistry.clear();
    this.loadProducts();
  };

  //List
  @action loadProducts = async () => {
    this.loadingInitial = true;
    try {
      const productEnvelope = await agent.Product.list(this.axiosParams);
      console.log(productEnvelope.resultCount);
      const { products, resultCount } = productEnvelope;
      runInAction( () => {
        this.productRegistry.clear();
        console.log("limit: "+LIMIT);
        this.productCount = Number(resultCount);
        console.log("result count not all "+this.productCount);
        products.forEach((product) => {
          this.productRegistry.set(product.id, product);
        });
      });
    } catch (error) {
      toast.error('Problem load product');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };
//Load all
  @action loadProductsAll = async () => {
    this.loadingInitial = true;
    try {
      const productEnvelope = await agent.Product.list(this.axiosParamsNoLimit);
      console.log(productEnvelope.resultCount);
      const { products, resultCount } = productEnvelope;
      runInAction( () => {
        this.allProductRegistry.clear();
        
        this.allProductCount = Number(resultCount);
        console.log("result count "+this.allProductCount);
        products.forEach((product) => {
          this.allProductRegistry.set(product.id, product);
        });
      });
    } catch (error) {
      toast.error('Problem load product');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };

  //Detail
  @action loadProduct = async (id: string) => {
    let product = this.getProduct(id);
    if (product) {
      this.selectedProduct = product;
      return product;
    } else {
      this.loadingInitial = true;
      try {
        product = await agent.Product.details(id);
        runInAction( () => {
          this.selectedProduct = product;
          this.productRegistry.set(product.id, product);
        });
        return product;
      } catch (error) {
        toast.error('Problem load product');
        console.log(error);
      } finally {
        runInAction( () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  getProduct = (id: string) => {
    return this.productRegistry.get(id);
  };

  //Create
  @action createProduct = async (product: IProduct) => {
    this.submitting = true;
    try {
      product.dateAdded=moment(product.dateAdded).tz('Asia/Bangkok').utc().toDate();
 
     
      await agent.Product.create(product);
      runInAction( () => {
        this.productRegistry.set(product.id, product);
      });
      history.push(`/products/${product.id}`);
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
  @action editProduct = async (product: IProduct) => {
    this.submitting = true;
    try {
      product.dateAdded=moment(product.dateAdded).tz('Asia/Bangkok').utc().toDate();
      await agent.Product.update(product);
      runInAction( () => {
        this.selectedProduct = product;
        this.productRegistry.set(product.id, product);
      });
      history.push(`/products/${product.id}`);
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
  @action deleteProduct = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.targetDelete = event.currentTarget.name;
    //console.log(this.targetDelete);
    //console.log(this.submitting);
    try {
      await agent.Product.delete(id);
      runInAction( () => {
        this.productRegistry.delete(id);
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

  //--Photo Part--

  @action uploadPhoto = async (file: Blob, productId: string) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Photo.uploadPhoto(file, productId);
      runInAction(() => {
        if (this.selectedProduct) {
          this.selectedProduct.photos.push(photo);
          if (photo.main) {
            this.selectedProduct.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem uploading photo');
    } finally {
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.setMainLoading = true;
    try {
      await agent.Photo.setMainPhoto(photo.id);
      runInAction(() => {
        this.selectedProduct!.image = photo.url;
        this.selectedProduct!.photos.find((a) => a.main)!.main = false;
        this.selectedProduct!.photos.find((a) => (a.id = photo.id))!.main = true;
        this.selectedProduct!.image = photo.url;
      });
    } catch (error) {
      // toast.error('Problem setting photo as main');
    } finally {
      runInAction(() => {
        this.setMainLoading = false;
      });
    }
    //final testing
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.setMainLoading = true;
    try {
      await agent.Photo.deletePhoto(photo.id);
      runInAction(() => {
        this.selectedProduct!.photos = this.selectedProduct!.photos.filter(
          (a) => a.id !== photo.id
        );
      });
    } catch (error) {
      toast.error('Problem deleting the photo');
    } finally {
      runInAction(() => {
        this.setMainLoading = false;
      });
    }
  };
}
//export default createContext(new ActivityStore());
