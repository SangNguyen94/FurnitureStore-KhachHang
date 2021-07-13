import React, { useContext, useEffect } from 'react';
import { Button, Label, Table, Icon, Card, Image, Grid, GridRow, Segment, Item, Menu } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { IProduct } from '../../app/models/product';
import CartItem from './CartItem';
//import { product } from '../../app/common/sample/productSeedDb';

enum Size {
    small = "small",
    big = "big",
    huge = "huge",
}
const src = 'assets/ORIGINAL.jpg'
const CartIcon: React.FC<{ }> = ({ }) => {
    const rootStore = useContext(RootStoreContext);
    const {cartCount,loadCart,getCart,cartRegistry,selectedCart,CountCart,count,currID}    = rootStore.cartStore;
    const {usersRegistry,user,getUser,getUserID}= rootStore.userStore;
    useEffect(() => {
        loadCart(getUserID);
      }, [loadCart,count]);
   console.log(count);
   console.log('Current id: '+currID);
    //   const { deleteProduct, submitting, targetDelete } = rootStore.productStore;
    const timeZone = 'Asia/Bangkok';
    return (
        <Menu.Item float="right"  style={{color: "green"
      }} >
          <Label as={NavLink} to='/checkout'  size="big"
          style={{color: "white"
        }}>
            <Icon name="shopping cart" color="green">
            </Icon>
            {count}
          </Label>

        </Menu.Item>

    );
};

export default observer(CartIcon);
