import { RootStore } from './rootStore';
import { observable, action, makeObservable } from 'mobx';
import moment from 'moment-timezone'
export default class ModalStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;
  }

  //specify that object only observable shallow mean their property is not observable to avoid MobX strict mode
  @observable.shallow modal = {
    open: false,
    body: null,
  };

  @action openModal = (content: any) => {
    this.modal.open = true;
    this.modal.body = content;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}
