import React, { useContext, useState } from 'react';
import { Button, Label, Table, Icon, Card, Image, Grid, GridRow, Segment, Item, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { IProduct } from '../../app/models/product';
enum Size {
  small = "small",
  big = "big",
  huge = "huge",
}

const src = 'assets/ORIGINAL.jpg'
const productOrderDetail: React.FC<{}> = ({ }) => {
  const rootStore = useContext(RootStoreContext);
  //   const { deleteProduct, submitting, targetDelete } = rootStore.productStore;
  const [count, setCount] = useState(0);
 
  const timeZone = 'Asia/Bangkok';
  return (
    <Item>
      <Item.Image size='tiny' src={src} />

      <Item.Content>
        <Item.Header>Table</Item.Header>
        <Item.Meta  >
          <Label attached="top right" >
            <Icon name="dollar sign">

            </Icon>
                199
            </Label>

        </Item.Meta>
        <Item.Description>Wooden table</Item.Description>
        <br />
        <Button.Group   attached="right" floated="right">
          <Button color='blue' onClick={()=>setCount(count -1)}>
            <Icon name="minus" />
          </Button>
          <Label as='a' basic color='red'  >
          {count}
      </Label>


          <Button color='blue'  onClick={()=>setCount(count +1)}>
            <Icon name="plus" />
          </Button>
        </Button.Group>
      </Item.Content>
    </Item>
  );
};

export default observer(productOrderDetail);
