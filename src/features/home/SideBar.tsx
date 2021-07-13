import React, { useContext, useState, useEffect } from 'react'
import { observer } from "mobx-react-lite"
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Search,
  Container,
  Table,
} from 'semantic-ui-react'
import _ from 'lodash'

import ProductCardList from './ProductCardList'
import { RootStoreContext } from '../../app/stores/rootStore'
import PaginationProduct from '../paginate/PaginationProduct'
import ProductListItemPlaceHolder from '../products/dashboard/ProductListItemPlaceHolder'
import SearchBar from './SearchBar'
import ProductSearch from '../products/dashboard/ProductSearch'
import SellerProductSearch from '../products/dashboard/SellerProductSearch'
//import SearchBar from './SearchBar'

const initialState = {
  loading: false,
  results: [],
  value: '',
}



const HorizontalSidebar = (prop: { animation: any | undefined, direction: any | undefined, visible: any | undefined }) => (
  <Sidebar
    as={Segment}
    animation={prop.animation}
    direction={prop.direction}
    visible={prop.visible}
  >
    <Grid textAlign='center'>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Header as='h3'>Advance Search</Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Table celled padded >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Criteria</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Brand</Table.HeaderCell>
              <Table.HeaderCell>Search</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <SellerProductSearch>

            </SellerProductSearch>
          </Table.Body>
        </Table>

      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Sidebar>
)

const VerticalSidebar = (prop: { animation: any | undefined, direction: any | undefined, visible: any | undefined }) => (
  <Sidebar
    as={Menu}
    animation={prop.animation}
    direction={prop.direction}
    icon='labeled'
    inverted
    vertical
    visible={prop.visible}
    width='thin'

  >
    <Menu.Item as='a' >
      <Icon name='home' />
      Home
    </Menu.Item>
    <Menu.Item as='a'>
      <Icon name='gamepad' />
      Games
    </Menu.Item>
    <Menu.Item as='a'>
      <Icon name='camera' />
      Channels
    </Menu.Item>
  </Sidebar>

)

function exampleReducer(state: any, action: any) {
  switch (action.type) {
    case 'CHANGE_ANIMATION':
      return { ...state, animation: action.animation, visible: !state.visible }
    case 'CHANGE_DIMMED':
      return { ...state, dimmed: action.dimmed }
    case 'CHANGE_DIRECTION':
      return { ...state, direction: action.direction, visible: false }
    default:
      throw new Error()
  }
}

const SideBarShop: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    animation: 'push',
    direction: 'top',
    dimmed: false,
    visible: false,
  })

  const { animation, dimmed, direction, visible } = state
  const vertical = direction === 'bottom' || direction === 'top'
  const rootStore = useContext(RootStoreContext);
  const { loadProducts, loadingInitial } = rootStore.productStore;
  const [, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    loadProducts().then(() => setLoadingNext(false));
  };

  // Similar to componentDidMount and componentDidUpdate:
  // first parameter is componentDidMount, second is componentDidUpdate with return similar to componentUnMount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div>

      <Container
      
        style={{
          paddingTop: "3rem",
          paddingBottom: "1rem",
          marginLeft:"3rem"
         
        }}
      >
        <SearchBar  >

        </SearchBar>
      </Container>
      <Container
        
        style={{
          marginLeft:"3rem"
        }}
      >
        <Grid>
          <Grid.Column width="16">
            <Button
              onClick={() =>
                dispatch({ type: 'CHANGE_ANIMATION', animation: 'push' })
              }
            >
              Advance Search
             </Button>
          </Grid.Column>
        </Grid>
      </Container>


      <Sidebar.Pushable as={Segment} style={{ overflow: 'hidden' }}>
        {vertical && (
          <HorizontalSidebar
            animation={animation}
            direction={direction}
            visible={visible}
          />
        )}
        {!vertical && (
          <VerticalSidebar
            animation={animation}
            direction={direction}
            visible={visible}
          />
        )}

        <Sidebar.Pusher dimmed={dimmed && visible}>
          <Segment basic>
            <Header as='h3'>Currently on sale products</Header>
            {loadingInitial ? <ProductListItemPlaceHolder /> : <ProductCardList isLoggedIn={isLoggedIn} />}
            <PaginationProduct handlePageChange={handleGetNext} />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  )
}

export default observer(SideBarShop)
