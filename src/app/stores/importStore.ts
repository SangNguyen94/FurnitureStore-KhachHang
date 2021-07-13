import { observable, action, runInAction, computed, makeObservable } from 'mobx';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { IImport, IProductImport } from '../models/import';
import { IProduct } from '../models/product';
import moment from 'moment-timezone'
const LIMIT = 5;

export default class ImportStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;
  }

  //Observable map
  @observable importRegistry = new Map();

  //List
  @observable loadingInitial = false;

  //Details
  @observable selectedImport: IImport | null = null;

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

  //Edit productImport
  @observable editable = false;

  //Delete
  @observable targetDelete = '';

  //Paging
  @observable importCount = 0;
  @observable page = 1;

  @computed get totalPages() {
    return Math.ceil(this.importCount / LIMIT);
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

  //Filtering option
  @action loadFilters = (isReset: boolean) => {
    this.page = 1;
    if (isReset) {
      this.predicate.clear();
    }
    this.importRegistry.clear();
    this.loadImports();
  };

  //List
  @action loadImports = async () => {
    this.loadingInitial = true;

    try {
      const importEnvelope = await agent.Imports.list(this.axiosParams);
      const { imports, resultCount } = importEnvelope;
      runInAction( () => {
        this.importRegistry.clear();
        this.importCount = resultCount;
        imports.forEach((importDTO) => {
          this.importRegistry.set(importDTO.id, importDTO);
        });
      });
    } catch (error) {
      toast.error('Problem loading imports');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };

  //Detail
  @action loadImport = async (id: string) => {
    let importDTO = this.getImport(id);
    if (importDTO) {
      this.selectedImport = importDTO;
      return importDTO;
    } else {
      this.loadingInitial = true;
      try {
        importDTO = await agent.Imports.details(id);
        runInAction( () => {
          this.selectedImport = importDTO;
          this.importRegistry.set(importDTO.id, importDTO);
        });
        return importDTO;
      } catch (error) {
        toast.error('Problem load import');
        console.log(error);
      } finally {
        runInAction( () => {
          if (importDTO.products.length == 0) this.editable = true;
          else this.editable = false;
          this.loadingInitial = false;
        });
      }
    }
  };

  getImport = (id: string) => {
    return this.importRegistry.get(id);
  };

  //Create
  @action createImport = async (importDTO: IImport) => {
    this.submitting = true;
    try {
      importDTO.placementDate=moment(importDTO.placementDate).tz('Asia/Bangkok').utc().toDate();
      await agent.Imports.create(importDTO);
      runInAction( () => {
        this.importRegistry.set(importDTO.id, importDTO);
      });
      history.push(`/imports/${importDTO.id}`);
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
  @action editImport = async (importDTO: IImport) => {
    this.submitting = true;
    try {
      importDTO.placementDate=moment(importDTO.placementDate).tz('Asia/Bangkok').utc().toDate();
      await agent.Imports.update(importDTO);
      runInAction( () => {
        this.selectedImport = importDTO;
        this.importRegistry.set(importDTO.id, importDTO);
      });
      history.push(`/imports/${importDTO.id}`);
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
  @action deleteImport = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.targetDelete = event.currentTarget.name;
    //console.log(this.targetDelete);
    //console.log(this.submitting);
    try {
      await agent.Imports.delete(id);
      runInAction( () => {
        this.importRegistry.delete(id);
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

  //Add ImportProduct
  @action addProductImport = async () => {
    if (this.quantity <= 0) toast.error('Quantity is not valid');
    else if (this.selectedProduct === null) toast.error('Must select a product before adding');
    else {
      try {
        runInAction( () => {
          let productImport: IProductImport = {
            product: this.selectedProduct!,
            quantity: this.quantity,
          };
          let isProductContained: boolean = false;
          if (this.selectedImport!.products.length == 0)
            this.selectedImport?.products.push(productImport);
          else {
            for (let iterator of this.selectedImport!.products) {
              if (iterator.product.id === productImport.product.id) {
                iterator.quantity += productImport.quantity;
                isProductContained = true;
              }
            }
            if (!isProductContained) this.selectedImport?.products.push(productImport);
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

  //Remove ImportProduct
  @action removeProductImport = async () => {
    try {
      runInAction( () => {
        this.selectedImport!.products = this.selectedImport!.products.filter(
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
