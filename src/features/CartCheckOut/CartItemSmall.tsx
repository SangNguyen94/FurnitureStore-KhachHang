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
const CartItemSmall: React.FC<{ ProductDTO: IProduct; quantity: number }> = ({ ProductDTO, quantity }) => {
  const rootStore = useContext(RootStoreContext);
  const { cartCount, loadCart, getCart, cartRegistry, selectedCart, editCartProductNormal, editCart, currID } = rootStore.cartStore;
  //   const { deleteProduct, submitting, targetDelete } = rootStore.productStore;




  const timeZone = 'Asia/Bangkok';
  return (
    <Item>
      <Item.Image size='tiny' src={ProductDTO.image} />
      <Item.Content>
        <Item.Header >
          <Label style={{ float: "right" }}>
            <Icon name="dollar sign">
            </Icon>
            {ProductDTO.price}
          </Label>
        </Item.Header>
        <Item.Description  >
          <Label className="title" size="big">
            Product Name: {ProductDTO.name}
            <br />
            Brand: {ProductDTO.brand}
            <br />
             Quantity: {quantity}
          </Label>
        </Item.Description>
      </Item.Content>

    </Item>
  );
};

export default observer(CartItemSmall);
