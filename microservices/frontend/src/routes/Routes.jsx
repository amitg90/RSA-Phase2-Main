import React, { Component } from 'react';
import Catalog from '../components/Catalog';
import ProductDetails from '../components/ProductDetails';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from '../components/Home';
import AddProduct from '../components/AddProduct';
import Checkout from '../components/Checkout';
import OrderConfirmation from '../components/OrderConfirmation';
class Routes extends Component {
    render() {

        return (
            <BrowserRouter>
             <Switch>
                    <Route exact path='/' component={Home}></Route>
                    <Route exact path='/catalog-ui' component={Catalog}></Route>
                    <Route exact path='/productDetails' component={ProductDetails}></Route>
                    <Route exact path='/addProduct' component={AddProduct}></Route>
                    <Route exact path='/checkout' component = {Checkout}></Route>
                    <Route exact path='/orderConfirmation' component = {OrderConfirmation}></Route>
                </Switch>
            </BrowserRouter>
               
        )
    }
}

export default Routes;
