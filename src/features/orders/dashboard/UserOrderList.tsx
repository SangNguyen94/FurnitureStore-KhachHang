import React, { useContext } from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import OrderListItem from './OrderListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import OrderSearch from './OrderSearch';
import UserOrderListItem from './UserOrderListItem';

const UserOrderList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { orderRegistry, predicate } = rootStore.orderStore;
  const {getCurrentUser} = rootStore.userStore
  const lstOrders = Array.from(getCurrentUser!.orders.values());
  return (
    <Table key='table data' celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID đơn</Table.HeaderCell>
          <Table.HeaderCell>Tên người nhận</Table.HeaderCell>
          <Table.HeaderCell>Địa chỉ nhận</Table.HeaderCell>
          <Table.HeaderCell>Số điện thoại người nhận</Table.HeaderCell>
          <Table.HeaderCell>Ngày đặt đơn</Table.HeaderCell>
          <Table.HeaderCell>Trạng thái</Table.HeaderCell>
          <Table.HeaderCell>Tìm kiếm</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <OrderSearch />
        <Table.Row>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>{predicate.get('name')}</Table.Cell>
          <Table.Cell>{predicate.get('address')}</Table.Cell>
          <Table.Cell>{predicate.get('phone')}</Table.Cell>
          <Table.Cell>{predicate.get('date')}</Table.Cell>
          <Table.Cell>{predicate.get('status')}</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
        {lstOrders.map((order, index) => (
          <UserOrderListItem key={order.order.id} order={order.order} index={index + 1} />
        ))}
      </Table.Body>
    </Table>
  );
};

export default observer(UserOrderList);
