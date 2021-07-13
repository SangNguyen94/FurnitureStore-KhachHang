import { observable, action, runInAction, computed, makeObservable } from 'mobx';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import moment from 'moment-timezone'
const LIMIT = 5;

export default class IncomeStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;
  }

  //Observable map
  @observable incomeRegistry = new Map();

  //List
  @observable loadingInitial = false;

  //Paging
  @observable incomesCount = 0;
  @observable page = 1;

  @computed get totalPages() {
    return Math.ceil(this.incomesCount / LIMIT);
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
    this.incomeRegistry.clear();
    this.loadIncomes();
  };

  //List
  @action loadIncomes = async () => {
    this.loadingInitial = true;

    try {
      const incomeEnvelope = await agent.Income.list(this.axiosParams);
      const { incomes, resultCount } = incomeEnvelope;
      runInAction( () => {
        this.incomesCount = resultCount;
        incomes.forEach((income) => {
          this.incomeRegistry.set(`${income.month}-${income.year}`, income);
        });
      });
    } catch (error) {
      toast.error('Problem load income statistic');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };

  getIncome = (id: string) => {
    return this.incomeRegistry.get(id);
  };
}
//export default createContext(new ActivityStore());
