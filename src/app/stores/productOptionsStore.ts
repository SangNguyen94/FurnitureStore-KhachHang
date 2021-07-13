import { observable, action, runInAction, makeObservable } from 'mobx';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { ICategoryOptions, IBrandOptions } from '../common/sample/productOptions';
import { toast } from 'react-toastify';
import moment from 'moment-timezone'
export default class ProductOptions {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;
  }

  //List
  @observable loadingOptions = false;

  @observable categoryOptionsRegistry = new Array<ICategoryOptions>();

  @observable brandOptionsRegistry = new Array<IBrandOptions>();
  //List
  @action loadOptions = async () => {
    this.loadingOptions = true;
    try {
      const productOption = await agent.ProductOptions.list();
      const { categoryOptions, brandOptions } = productOption;
      runInAction( () => {
        this.categoryOptionsRegistry = [];
        categoryOptions.forEach((category: string) => {
          let tempCategory: ICategoryOptions = { key: category, value: category, text: category };
          this.categoryOptionsRegistry.push(tempCategory);
        });

        this.brandOptionsRegistry = [];
        brandOptions.forEach((brand: string) => {
          let tempBrand: IBrandOptions = { key: brand, value: brand, text: brand };
          this.brandOptionsRegistry.push(tempBrand);
        });
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem loading product options');
    } finally {
      runInAction( () => {
        this.loadingOptions = false;
      });
    }
  };
}
//export default createContext(new ActivityStore());
