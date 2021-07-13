import React, { useContext, useEffect } from 'react';
import { Table, Label, Image, Button, Icon, Dropdown, Segment, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import { createBrowserHistory } from 'history';
import TableToExcel from '../../../app/common/exportTable/TableToExcel';
import CartItemSmall from '../../CartCheckOut/CartItemSmall';

const UserOrderProduct = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadOptions, productOptionsRegistry, productRegistry } = rootStore.orderOptions;
  const {
    selectedOrder: order,
    addProductOrder,
    setSelectedProduct,
    editable,
    setQuantity,
    removeProductOrder,
    editOrder,
    currentOrder,
    submitting,
  } = rootStore.orderStore;
  const history = createBrowserHistory();

  const tableId = 'orderTable';

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  var total: number = 0;
  return (
   
    <Segment raised>
      <Item.Group>
      {currentOrder?.products?.map((product, index) => (
      <CartItemSmall key={index + 1} ProductDTO={product.product} quantity={product.quantity} />))}
      </Item.Group>
    
  </Segment>
  );
};

export default observer(UserOrderProduct);
