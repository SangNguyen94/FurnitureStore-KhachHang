import React, { useContext, useEffect } from 'react';
import { Menu, Container, Button, Dropdown, Image, Icon, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import RegisterForm from '../user/RegisterForm';
import EditForm from '../user/EditForm';
import CartIcon from '../CartCheckOut/CartIcon';

//import { RootStoreContext } from '../../app/stores/rootStore';

const NavBarSeller: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout,isLoggedIn } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;
 // const {cartCount,loadCart,getCart,cartRegistry,selectedCart,editCartProductNormal,editCart,setCount,CountCart}    = rootStore.cartStore;

//console.log(isLoggedIn);
  return (
    
    <Menu fixed='top' inverted>
 
        <Menu.Item header as={NavLink} exact to='/'>
          <img src='/assets/Sport.png' alt='logo' style={{ marginRight: '10px' }} />
          Furniture Store
        </Menu.Item>
        {user && (
           <Menu.Item content='Manage orders'  as={NavLink} to='/userorders' />
        )}
    
        {/* <Menu.Item>
          <Button as={NavLink} to='/productsCreate' positive content='Create Product' />
        </Menu.Item> */}

        {/* <Menu.Item name='Products' as={NavLink} to='/products' />
        <Menu.Item>
          <Button as={NavLink} to='/productsCreate' positive content='Create Product' />
        </Menu.Item>
        <Menu.Item name='Imports' as={NavLink} to='/imports' />
        <Menu.Item name='Orders' as={NavLink} to='/orders' />

        <Menu.Item>
          <Dropdown
            pointing='top left'
            text='Shipment'
            labeled
            button
            className='button blue icon inverted'
          >
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to='/importShipment' content='Import Shipment' />
              <Dropdown.Item as={NavLink} to='/orderShipment' content='Order Shipment' />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>

        <Menu.Item>
          <Dropdown
            pointing='top left'
            text='Statistics'
            labeled
            button
            className='button purple icon inverted'
          >
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to='/income' content='Income Statistics' />
              <Dropdown.Item as={NavLink} to='/revenue' content='Revenue Statistics' />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>

        <Menu.Item>
          <Dropdown pointing='top left' text='Create' labeled button className='button teal icon'>
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to='/productsCreate' content='Create Product' />
              <Dropdown.Item as={NavLink} to='/orderCreate' content='Create Order' />
              <Dropdown.Item as={NavLink} to='/importCreate' content='Create Import' />
              <Dropdown.Item
                as={NavLink}
                to='/importShipmentCreate'
                content='Create Shipment Import'
              />
              <Dropdown.Item
                as={NavLink}
                to='/orderShipmentCreate'
                content='Create Shipment Order'
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item> */}
        {user && (
          
          <Menu.Item float='right'>
            <Image avatar spaced='right' src={'/assets/user.png'} />
            <Dropdown pointing='top left' text={user.userName}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                <Dropdown.Item
                  onClick={() => openModal(<EditForm />)}
                  text='Edit user'
                  icon='edit outline'
                />
                {user?.role === 'Admin' && (
                  <Dropdown.Item
                    as={NavLink}
                    to='/users/manage'
                    content='Manage Users'
                    icon='clipboard outline'
                  />
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
        {!isLoggedIn && (
         <Menu.Item>
            <Button onClick={() => openModal(<LoginForm />)} size='huge' >
              Login
            </Button>
          </Menu.Item>
       
        )}
        {!isLoggedIn && (
         <Menu.Item>
            <Button onClick={() => openModal(<RegisterForm />)} size='huge' >
              Register
            </Button>
          </Menu.Item>
       
        )}
        {user && (
          <CartIcon></CartIcon>
        )}
 
    </Menu >
  );
};

export default observer(NavBarSeller);
