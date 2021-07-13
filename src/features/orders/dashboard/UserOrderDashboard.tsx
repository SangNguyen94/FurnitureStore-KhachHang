import React, { useContext, useEffect, Fragment, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import OrderList from './OrderList';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import OrderListItemPlaceholder from './OrderListItemPlaceholder';
import PaginationOrder from '../../paginate/PaginationOrder';
import UserOrderList from './UserOrderList';

//pass down props from parent

const UserOrderDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadOrders, loadingInitial } = rootStore.orderStore;
  const {loadUserOrder} = rootStore.userStore;
  const [, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    loadUserOrder().then(() => setLoadingNext(false));
  };

  // Similar to componentDidMount and componentDidUpdate:
  // first parameter is componentDidMount, second is componentDidUpdate with return similar to componentUnMount
  useEffect(() => {
    loadUserOrder();
  }, [loadUserOrder]);

  return (
    <Fragment>
  
      <Grid>
        <Grid.Column width='16'>
          {loadingInitial ? <OrderListItemPlaceholder /> : <UserOrderList />}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default observer(UserOrderDashboard);
