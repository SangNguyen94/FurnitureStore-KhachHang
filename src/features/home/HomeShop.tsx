import React, { Fragment, useContext } from 'react';
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import SearchBar from './SearchBar';
import SideBarShop from './SideBar';
//import { RootStoreContext } from '../../app/stores/rootStore';
// import LoginForm from '../user/LoginForm';
// import RegisterForm from '../user/RegisterForm';

const HomeShop = () => {
    const rootStore = useContext(RootStoreContext);
    const { isLoggedIn, user } = rootStore.userStore;
    const { openModal } = rootStore.modalStore;

    return (
        <div>
            {/* <Segment vertical className='masthead' style={{paddingTop: "42px"}}>
                <Container fluid >
                    <SearchBar />
                </Container>
            </Segment> */}
            <Segment vertical className='mastheadContent'>
                <Container fluid>
                    <SideBarShop isLoggedIn={isLoggedIn} />
                </Container>

                <div className="ui inverted black vertical footer segment">
                <div className="ui center aligned container">
            <h4 className="ui inverted header">&copy; Copyright 2021 | All rights reserved </h4>
            <a href="https://www.facebook.com/"><i className="facebook square icon big"></i></a>
            <a href="https://twitter.com/"><i className="twitter square icon big"></i></a>
            <a href="https://www.linkedin.com/company/c"><i className="linkedin square icon big"></i></a>
        </div>
    </div>
      
                
            </Segment>
        </div>
    );


};

export default HomeShop;
