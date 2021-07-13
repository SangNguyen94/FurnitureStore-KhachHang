import React, { useContext, useEffect } from 'react';
import { Button, Label, Table, Icon, Card, Image, Grid, GridRow, Segment, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { IProduct } from '../../app/models/product';
import CartItem from './CartItem';
import ProductListItemPlaceHolder from '../products/dashboard/ProductListItemPlaceHolder';
//import { product } from '../../app/common/sample/productSeedDb';

enum Size {
    small = "small",
    big = "big",
    huge = "huge",
}
const src = 'assets/ORIGINAL.jpg'
const FullCart: React.FC<{ parentCallBack:Function}> = ({parentCallBack }) => {
    const rootStore = useContext(RootStoreContext);
    const {cartCount,loadCart,getCart,cartRegistry,selectedCart,currentCart,loadingcart}    = rootStore.cartStore;
    const {getUserID}= rootStore.userStore;
  

    //   const { deleteProduct, submitting, targetDelete } = rootStore.productStore;
    const callback = (count:number) => {
        parentCallBack(count);
        
        // do something with value in parent component, like save to state
    }
    useEffect(() => {
        loadCart(getUserID);
      }, [loadCart]);
    const timeZone = 'Asia/Bangkok';
    return (
        <Segment>
            <Item.Group divided>
            {loadingcart ? <ProductListItemPlaceHolder /> :  currentCart?.products?.map((product,index) => (
          <CartItem key={index+1} ProductDTO={product.product} count={product.quantity} parentCallBack={callback} />
        ))}
           
               
            </Item.Group>
            
        </Segment>

    );
};

export default observer(FullCart);
