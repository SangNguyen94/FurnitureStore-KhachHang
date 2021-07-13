import React, { useContext, useEffect } from 'react';
import { Button, Label, Table, Icon, Card, Grid, Header, Rating, Message } from 'semantic-ui-react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { IProduct } from '../../../app/models/product';
import ProductCardItem from '../../home/ProductCardItem';
import { resolveAny } from 'dns';

import ProductDetailInfoPlaceholder from '../details/ProductDetailInfoPlaceholder';

interface DetailParams {
  id: string;
}
const src = 'assets/ORIGINAL.jpg'
const ProductItemDetail: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
   const rootStore = useContext(RootStoreContext);
  const { selectedProduct: product, loadProduct, loadingInitial } = rootStore.productStore;
  const { getCurrentUser,user,usersRegistry } = rootStore.userStore;
  const {cartCount,loadCart,getCart,cartRegistry,selectedCart,CountCart,count,currID,totalPrice,totalMoney,currentCart,createCartProductNormal}    = rootStore.cartStore;
  const image = product?.image;
  useEffect(() => {
    loadProduct(match.params.id);
  }, [loadProduct, match.params.id, history, image]);
  const handleCartAdd=  ()=>{
    if(currentCart)
    {
      if(currID!=="")
      {
        createCartProductNormal(currID,match.params.id,1);
        history.push("/");
      }
     
    }
  }
  let isBought=false;
  currentCart?.products?.forEach((value, key) => {
    console.log("productID: "+match.params.id);
    if(match.params.id == value.product.id)
    {
      isBought= true;
    }
    console.log("isBought: "+isBought);
  })
  
 
  if (loadingInitial) return <ProductDetailInfoPlaceholder />;
  if (!product) return <h2>Product not found</h2>;
  return (
    <Grid divided='vertically'>
    <Grid.Row columns={2}>
      <Grid.Column floated='right'>

      <ProductCardItem ProductDTO={product} index={1} />
      </Grid.Column>
      <Grid.Column>
       <Header>
          {product.brand}
       </Header>
       <br/>
       <Icon fitted name = "dollar sign">
        {product.price}
       </Icon>
       <Rating icon='star' defaultRating={4} maxRating={5} size='small' floated="right" className="right_floated" />
       <h2>
        {product.category}
       </h2>
       <br/>
       <Message size='small'>
         {product.description}
       </Message>
       {!isBought && (
       <Button onClick={()=>handleCartAdd()}>
         Add to cart
       </Button>
       )}
       {isBought && (
       <Button onClick={()=>history.push('/checkout')}>
         Go to cart page
       </Button>
       )}
      </Grid.Column>
    </Grid.Row>
    </Grid>
  );
};

export default observer(ProductItemDetail);
