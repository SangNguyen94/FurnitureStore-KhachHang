import React, { useContext, useEffect, Fragment, useState } from 'react';
import { Grid } from 'semantic-ui-react';

import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';


import OrderListItemPlaceholder from '../orders/dashboard/OrderListItemPlaceholder';
import UserList from './UserList';

//pass down props from parent

const UserPageList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadUsers, loadingInitial } = rootStore.userStore;
  const {loadUserOrder} = rootStore.userStore;
  const [, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    loadUserOrder().then(() => setLoadingNext(false));
  };

  // Similar to componentDidMount and componentDidUpdate:
  // first parameter is componentDidMount, second is componentDidUpdate with return similar to componentUnMount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <Fragment>
  
      <Grid>
        <Grid.Column width='16'>
          {loadingInitial ? <OrderListItemPlaceholder /> : <UserList />}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default observer(UserPageList);
