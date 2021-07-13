import { observable, computed, action, runInAction, makeObservable } from 'mobx';
import {persist} from 'mobx-persist'
import {makePersistable} from 'mobx-persist-store'
import { IUser, IUserFormValues } from '../models/user';
import { ICart, createCart } from '../models/cart';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import IncomeChart from '../../features/incomes/dashboard/IncomeChart';

export default class UserStore {
  _rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this._rootStore = rootStore;
    makeObservable(this);
    makePersistable(this, { name: 'UserStore', properties: ['user','isLoggedIn','getUserID','getCurrentUser','getLatestOrderID'], storage: window.localStorage });

  }

   @observable user: IUser | null = null;

   @computed get getUserID(){
    if(this.user!== null)
    {
      return this.user.id;
    }
    else
    {
      return "1";
    }
  }

  @computed get getLatestOrderID()
  {
    if(this.user)
    {
      return this.user.orders[this.user.orders.length-1].order.id;
    }
    else{
      
    return "1";
    }
  }

   @computed get getCurrentUser(){
    if(this.user!== null)
    {
      return this.user;
    }
    else
    {
      return ;
    }
  }

  //Observable map
   @observable usersRegistry = new Map();

  //Observable edit role map
   @observable rolesRegistry = new Map();

  //List
   @observable loadingInitial = false;

  //Delete
  @observable submitting = false;
  @observable targetDelete = '';

  //Update
   @observable targetUpdate = '';

   @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      
      const user = await agent.Users.login(values);

      runInAction(() => {
        this.user = user;
        
      });
      
      console.log(this.user);
      this._rootStore.modalStore.closeModal();
      history.push('/');
    } catch (error) {
      toast.error('Problem login users');
      console.log(error);
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      //const user =
      values.role='Customer';
      let user=await agent.Users.register(values);
      let cart =createCart({userID: user.id.toString()}); 
      await agent.Cart.create(cart);
      // runInAction(() => {
      //   this.user = user;
      // });
      //this._rootStore.commonStore.setToken(user.token);
      this._rootStore.modalStore.closeModal();
      history.push('/products');
    } catch (error) {
      toast.error('Problem register users');
      console.log(error);
      throw error;
    }
  };

  //Get User
  @action getUser = async () => {
    try {
      const user = await agent.Users.current();
      runInAction(() => (this.user = user));
    } catch (error) {
      console.log(error);
    }
  };

  //Get Users
  @action loadUsers = async () => {
    this.loadingInitial = true;

    try {
      const employees = await agent.Users.getEmployee();
   runInAction( () => {
     
        this.usersRegistry.clear();
        employees.forEach((user) => {
          this.usersRegistry.set(user.email, user);
          this.rolesRegistry.set(user.email, user.role);
        });
      });
    } catch (error) {
      toast.error('Problem load users');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };

  //Delete
  @action deleteUser = async (event: SyntheticEvent<HTMLButtonElement>, email: string) => {
    this.submitting = true;
    this.targetDelete = event.currentTarget.name;
    try {
      await agent.Users.delete(email);
      runInAction( () => {
        this.usersRegistry.delete(email);
      });
    } catch (error) {
      toast.error('Problem deleting users');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
        this.targetDelete = '';
      });
    }
  };

  //Edit
  @action updateUser = async (user: IUserFormValues) => {
    try {
      user.email = this.user?.email!;
      const editedUser = await agent.Users.edit(user);

      runInAction(() => {
        this.usersRegistry.set(user.email, editedUser);
        this.user = editedUser;
      });
      this._rootStore.modalStore.closeModal();
    } catch (error) {
      toast.error('Problem updating User');
    }
  };

  //Set Role
  @action setRole = async (event: SyntheticEvent<HTMLButtonElement>, role: String) => {
    this.submitting = true;
    this.targetUpdate = event.currentTarget.name;
    let email = this.targetUpdate;
    try {
      const user = await agent.Users.setRole(email, role);
      runInAction(() => {
        this.usersRegistry.set(user.email, user);
      });
    } catch (error) {
      toast.error('Problem edit role User');
    } finally {
      runInAction( () => {
        this.submitting = false;
        this.targetUpdate = '';
      });
    }
  };

  //Set Registry
  @action setRegistryRole = async (email: String, role: String) => {
    try {
      runInAction(() => {
        this.rolesRegistry.set(email, role);
      });
    } catch (error) {
      toast.error('Problem set role User');
    } finally {
      runInAction( () => {});
    }
  };
//User Order
  @action loadUserOrder = async () => {
    this.loadingInitial = true;

    try {
      const employees = await agent.Users.getUserOrders(this.user?.id!);
      runInAction( () => {
        if(this.user)
        {
          this.user.orders=employees;
        }
        
      });
    } catch (error) {
      toast.error('Problem load users');
      console.log(error);
    } finally {
      runInAction( () => {
        this.loadingInitial = false;
      });
    }
  };

  @action logout = () => {
   
    this.user = null;
    history.push('/');
  };

   //Create cart product
   @action createUserOrderNormal = async (id:string,orderID:string,quantity:number) => {
    this.submitting = true;
    //id=this.selectedCart?.id!;
    try {
      await agent.Users.createUserOrder(id,orderID,quantity);
      await agent.Users.getUserOrders(id);
      await this.loadUserOrder();
      
  
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
  @action removeUserOrderNormal = async (id:string,orderID:string) => {
    this.submitting = true;
    
    try {
      await agent.Users.deleteUserOrder(id,orderID);
      await agent.Users.getUserOrders(id);
   
    } catch (error) {
      toast.error('Problem editing data');
      console.log(error);
    } finally {
      runInAction( () => {
        this.submitting = false;
      });
    }
  };



  //Remove CartProduct
  @action removeProductCart = async () => {
    try {
      runInAction( () => {
        this.user!.orders = this.user!.orders!.filter(
          (p) => p.order.id !== this.user?.id
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

