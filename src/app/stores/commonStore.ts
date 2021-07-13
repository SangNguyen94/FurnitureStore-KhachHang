import { RootStore } from './rootStore';
import { observable, action, reaction, makeObservable } from 'mobx';

export default class CommonStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;

    //react when property have changed
  }
  
  @observable appLoaded = false;

  

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}
