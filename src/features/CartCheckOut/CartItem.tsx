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
const CartItem: React.FC<{ ProductDTO: IProduct; count: number ; parentCallBack:Function;}> = ({ ProductDTO, count, parentCallBack }) => {
  const rootStore = useContext(RootStoreContext);
  const {cartCount,loadCart,getCart,cartRegistry,selectedCart,editCartProductNormal,editCart,currID,removeCartProductNormal}    = rootStore.cartStore;
  //   const { deleteProduct, submitting, targetDelete } = rootStore.productStore;
  const [itemCount, setCount] = useState(count);

  const timeZone = 'Asia/Bangkok';
  return (
    <Item>
      <Item.Image size='tiny'  src={ProductDTO.image} />
      <Item.Content>
      <Item.Meta  >
          <Label   style={{float: "right"}}>
            <Icon name="dollar sign">
            </Icon>
            {ProductDTO.price}
          </Label>

        </Item.Meta>
        <Item.Header>{ProductDTO.name}</Item.Header>
        
        <Item.Description>{ProductDTO.brand}</Item.Description>
        <br />
        <Button.Group attached="right" floated="right">
          <Button color='blue' onClick={() => {
            if((itemCount-1)===0)
            {
              removeCartProductNormal(currID,ProductDTO.id);
            }
            else{
              editCartProductNormal(currID,ProductDTO.id,itemCount-1);
              setCount(itemCount - 1)
              parentCallBack(itemCount);
            }
          }}>
            <Icon name="minus" />
          </Button>
          <Label as='a' basic color='red'  >
            {itemCount}
          </Label>


          <Button color='blue' onClick={() => {
            editCartProductNormal(currID,ProductDTO.id,itemCount+1);
            setCount(itemCount + 1)
            parentCallBack(itemCount);
          }}>
            <Icon name="plus" />
          </Button>
        </Button.Group>
      </Item.Content>
    </Item>
  );
};

export default observer(CartItem);
