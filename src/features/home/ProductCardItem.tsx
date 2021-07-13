import React, { useContext } from 'react';
import { Button, Label, Table, Icon, Card, Image } from 'semantic-ui-react';
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

// style={{
//   width: '400px',
//   height: '400px',
//   backgroundImage: "url(" + ProductDTO.image + ")",
//   backgroundPosition: 'center',
//   backgroundSize: 'cover',
// }}
const src = 'assets/ORIGINAL.jpg'
const ProductCardItem: React.FC<{ ProductDTO: IProduct; index: number }> = ({ ProductDTO, index }) => {
  const rootStore = useContext(RootStoreContext);

  //   const { deleteProduct, submitting, targetDelete } = rootStore.productStore;

  const timeZone = 'Asia/Bangkok';
  return (
    <Card key={index} fluid href={`/product/${ProductDTO.id}`} >
      {/* <img src={ProductDTO.image} min-height={87} max-height={500}/> */}
      <Image size="big" centered src={ProductDTO.image}
      style={{
        width: '400px',
        height: '400px',
        backgroundImage: "url(" + ProductDTO.image + ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}  />
      <Card.Content>
        <Card.Header>{ProductDTO.name}</Card.Header>
        <Card.Meta>{ProductDTO.category}</Card.Meta>
        <Card.Description>
          <Icon fitted name="dollar sign">
            {ProductDTO.price}
          </Icon>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default observer(ProductCardItem);
