import React, { useContext } from 'react';
import { Button, Label, Table, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IOrder } from '../../../app/models/order';
import { format, zonedTimeToUtc } from 'date-fns-tz';

const UserOrderListItem: React.FC<{ order: IOrder; index: number }> = ({ order, index }) => {
  const rootStore = useContext(RootStoreContext);
  const { deleteOrder, submitting, targetDelete } = rootStore.orderStore;
  console.log(order.placementDate);
  const timeZone = 'Asia/Bangkok';
  return (
    <Table.Row key={index}>
      <Table.Cell>{order.id}</Table.Cell>
      <Table.Cell>
        <Label color='green' key={order.id} size='large' as={Link} to={`#`}>
          {order.recipientName}
        </Label>
      </Table.Cell>
      <Table.Cell>{order.recipientAddress}</Table.Cell>
      <Table.Cell>{order.recipientPhone}</Table.Cell>
      <Table.Cell>
        {format(zonedTimeToUtc(order.placementDate, timeZone), 'dd/MM/yyyy', {
          timeZone: timeZone,
        })}
      </Table.Cell>
      <Table.Cell>{order.status}</Table.Cell>
      <Table.Cell textAlign='center'>
        <Button.Group>
          <Button // onClick={() => selectActivity(activity.id)}
            as={Link}
            to={`/userorders/${order.id}`}
            color='blue'
            floated='left'
          >
            <Icon name='search plus' />
          </Button>
          {order.status !== 'Đang giao hàng' && order.status !== "Finished" && order.status !== "Canceled" &&(
             <Button // onClick={() => selectActivity(activity.id)}
             as={Link}
             to={`/payment/${order.id}`}
             color='green'
             positive
             content='Thanh toán'
           >
           </Button>
          )}
         
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  );
};

export default observer(UserOrderListItem);
