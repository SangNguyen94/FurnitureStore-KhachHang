import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import { observer } from 'mobx-react-lite';
import { configure } from "mobx"
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
//import { RootStoreContext } from '../stores/rootStore';
//import LoadingComponent from './LoadingComponent';
//import ModalContainer from '../common/modals/ModalContainer';
import ProductDashboard from '../../features/products/dashboard/ProductDashboard';
import ProductDetails from '../../features/products/details/ProductDetails';
import ProductForm from '../../features/products/form/ProductForm';
import HomePage from '../../features/home/HomePage';
import ModalContainer from '../common/modals/ModalContainer';
import OrderDashboard from '../../features/orders/dashboard/OrderDashboard';
import OrderDetails from '../../features/orders/details/OrderDetails';
import OrderForm from '../../features/orders/form/OrderForm';
import ImportDashboard from '../../features/importss/dashboard/ImportDashboard';
import ImportDetails from '../../features/importss/details/ImportDetails';
import ImportForm from '../../features/importss/form/ImportForm';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import UserList from '../../features/user/UserList';
import ImShipmentDashboard from '../../features/imShipments/dashboard/ImShipmentDashboard';
import ImShipmentDetails from '../../features/imShipments/details/ImShipmentDetails';
import ImShipmentForm from '../../features/imShipments/form/ImShipmentForm';
import OrShipmentDashboard from '../../features/orShipments/dashboard/OrShipmentDashboard';
import OrShipmentDetails from '../../features/orShipments/details/OrShipmentDetails';
import OrShipmentForm from '../../features/orShipments/form/OrShipmentForm';
import IncomeDashboard from '../../features/incomes/dashboard/IncomeDashboard';
import RevenueDashboard from '../../features/revenues/dashboard/RevenueDashboard';
import NavBarSeller from '../../features/nav/NavBarSeller';
import HomeShop from '../../features/home/HomeShop';
import ProductItemDetail from '../../features/products/SellerPage/ProductItemDetail';
import CheckOut from '../../features/CartCheckOut/CheckOut';
import ButtonExampleAttachedEvents from '../../features/CartCheckOut/sampleButton';
import Payment from '../../features/CartCheckOut/Payment';
import Success from '../components/Success';
import Canceled from '../components/Canceled';
import UserOrderDashboard from '../../features/orders/dashboard/UserOrderDashboard';
import UserOrderDetail from '../../features/orders/details/UserOrderDetail';
import UserPageList from '../../features/user/UserPageList';

configure({
  enforceActions: "always",

})
//------------React Hook--------------------------
const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  //get user from token when refresh App.tsx or re-render App.tsx
  useEffect(() => {

    setAppLoaded();

  }, [getUser, setAppLoaded]);

  if (!appLoaded) return <LoadingComponent content='Loading app...' />;

  return (
    <Fragment>

      <ModalContainer />
      {/* <NavBarSeller /> */}
      <Route exact path='/' component={HomePage} />
      {/* <Route exact path='/' component={HomeShop} /> */}
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <ToastContainer position='top-center' />
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path='/product' component={ProductItemDetail} />
                <Route exact path='/product/:id' component={ProductItemDetail} />
                <Route exact path='/checkout' component={CheckOut} />
                <Route exact path='/payment/:id' component={Payment} />
                <Route exact path='/products' component={ProductDashboard} />
                <Route exact path='/products/:id' component={ProductDetails} />
                <Route
                  key={location.key}
                  path={['/productsCreate', '/products/:id/manage']}
                  component={ProductForm}
                />

                <Route exact path='/orders' component={OrderDashboard} />
                <Route exact path='/userorders' component={UserOrderDashboard} />
                <Route exact path='/orders/:id' component={OrderDetails} />
                <Route exact path='/userorders/:id' component={UserOrderDetail} />
                <Route
                  key={location.key}
                  path={['/orderCreate', '/orders/:id/manage']}
                  component={OrderForm}
                />

                <Route exact path='/imports' component={ImportDashboard} />
                <Route exact path='/imports/:id' component={ImportDetails} />
                <Route
                  key={location.key}
                  path={['/importCreate', '/imports/:id/manage']}
                  component={ImportForm}
                />

                <Route exact path='/importShipment' component={ImShipmentDashboard} />
                <Route exact path='/importShipment/:id' component={ImShipmentDetails} />
                <Route
                  key={location.key}
                  path={['/importShipmentCreate', '/importShipment/:id/manage']}
                  component={ImShipmentForm}
                />

                <Route exact path='/orderShipment' component={OrShipmentDashboard} />
                <Route exact path='/orderShipment/:id' component={OrShipmentDetails} />
                <Route
                  key={location.key}
                  path={['/orderShipmentCreate', '/orderShipment/:id/manage']}
                  component={OrShipmentForm}
                />

                <Route exact path='/income' component={IncomeDashboard} />
                <Route exact path='/revenue' component={RevenueDashboard} />

                <Route exact path='/users/manage' component={UserList} />

                <Route exact path='/success.html' component={Success} />
                <Route exact path='/canceled.html' component={Canceled} />
                {/* <Route exact path='/payout/:id' component={Checkout} />  */}

                <Route component={NotFound} />
              </Switch>
              
      
   
            </Container>
            
            
            
          </Fragment>
          
        )}
      />
     
     
    </Fragment>
  );
};
export default withRouter(observer(App));
