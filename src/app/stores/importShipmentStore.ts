import { observable, action, runInAction, computed, makeObservable } from 'mobx';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { IShipment } from '../models/shipment';
import { shipmentStatusOptions } from '../common/sample/shipmentStatusOptions';
import { statusOptions } from '../common/sample/statusOptions';
import moment from 'moment-timezone';
const LIMIT = 5;

export default class ImportShipmentStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this._rootStore = rootStore;
  }

  //Observable map
  @observable shipmentRegistry = new Map();

  //List
  @observable loadingInitial = false;

  //Details
  @observable selectedShipment: IShipment | null = null;

  //Create
  @observable submitting = false;

  //Delete
  @observable targetDelete = '';

  //Paging
  @observable shipmentCount = 0;
  @observable page = 1;

  @computed get totalPages() {
    return Math.ceil(this.shipmentCount / LIMIT);
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
    this.shipmentRegistry.clear();
    this.loadShipments();
  };
  //List
  @action loadShipments = async () => {
    this.loadingInitial = true;

    try {
      const shipmentEnvelope = await agent.ImportShipment.list(this.axiosParams);
      const { shipments, resultCount } = shipmentEnvelope;
      runInAction( () => {
        this.shipmentRegistry.clear();
        this.shipmentCount = resultCount;
        shipments.forEach((shipment) => {
          this.shipmentRegistry.set(shipment.id, shipment);
        });
      });
    } catch (error) {
      toast.error('Problem loading importShipments');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };

  //Detail
  @action loadShipment = async (id: string) => {
    let shipment = this.getShipment(id);
    if (shipment) {
      this.selectedShipment = shipment;
      return shipment;
    } else {
      this.loadingInitial = true;
      try {
        shipment = await agent.ImportShipment.details(id);
        runInAction( () => {
          this.selectedShipment = shipment;
          this.shipmentRegistry.set(shipment.id, shipment);
        });
        return shipment;
      } catch (error) {
        toast.error('Problem load shipment');
        console.log(error);
      } finally {
        runInAction( () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  getShipment = (id: string) => {
    return this.shipmentRegistry.get(id);
  };

  //Create
  @action createShipment = async (shipment: IShipment) => {
    this.submitting = true;
    try {
      shipment.deliverDate=moment(shipment.deliverDate).tz('Asia/Bangkok').utc().toDate();
      await agent.ImportShipment.create(shipment);
      runInAction( () => {
        this.shipmentRegistry.set(shipment.id, shipment);
      });
      history.push(`/importShipment/${shipment.id}`);
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
  @action editShipment = async (shipment: IShipment) => {
    this.submitting = true;
    try {
      shipment.deliverDate=moment(shipment.deliverDate).tz('Asia/Bangkok').utc().toDate();
      let currentImport = await agent.Imports.details(shipment.importID);
      if (shipment.shipmentStatus === shipmentStatusOptions[0].value) {
        currentImport.status = statusOptions[0].value;
        this._rootStore.importStore.editImport(currentImport);
      } else if (shipment.shipmentStatus === shipmentStatusOptions[2].value) {
        currentImport.status = statusOptions[2].value;
        this._rootStore.importStore.editImport(currentImport);
      }
      await agent.ImportShipment.update(shipment);
      runInAction( () => {
        this.selectedShipment = shipment;
        this.shipmentRegistry.set(shipment.id, shipment);
      });
      history.push(`/importShipment/${shipment.id}`);
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
  @action deleteShipment = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.targetDelete = event.currentTarget.name;
    try {
      await agent.ImportShipment.delete(id);
      runInAction( () => {
        this.shipmentRegistry.delete(id);
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
}
//export default createContext(new ActivityStore());
