import React, { useContext } from 'react'
import { Card } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
//import { RootStoreContext } from '../../../app/stores/rootStore';
import ProductCardItem from './ProductCardItem';
import { RootStoreContext } from '../../app/stores/rootStore';
const src = './ORIGINAL.jpg'

const ProductCardList :React.FC<{ isLoggedIn:Boolean  }> = ({ isLoggedIn })=> {
  const rootStore = useContext(RootStoreContext);
  const { productRegistry, predicate } = rootStore.productStore;
  const lstProduct = Array.from(productRegistry.values());
 return(
   
  <Card.Group itemsPerRow={5}>
    {lstProduct.map((product, index) => (
          <ProductCardItem key={index+1} ProductDTO={product} index={index + 1} />
        ))}
  </Card.Group>
 )
}

export default observer(ProductCardList)
