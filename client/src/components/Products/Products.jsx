import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography, Grid, Card, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { AddShoppingCart, DeleteForever } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

import Product from './Product/Product';
import useStyles from './styles';

import HomeIcon from '@material-ui/icons/Home';
import { ShoppingCart } from '@material-ui/icons';

import logo from '../../assets/Logo.png';

const Products = () => {
    const PAGE_PRODUCTS = 'products';
    const PAGE_CART = 'cart';
    const PAGE_CHECKOUT = 'checkout';

    const [cart, setCart] = useState([]);
    const [page, setPage] = useState(PAGE_PRODUCTS);
    const [productList, setProductList] = useState([]);

    const getProducts = () => {
        axios.get('http://localhost:3000/parts/all').then((response) => {
            setProductList(response.data);
        });
    };

    const addToCart = (product) => {
        setCart([...cart, { ...product}]);
        console.log(cart);
        console.log(productList);
    }

    const removeFromCart = (productToRemove) => {
        setCart(cart.filter(product => product !== productToRemove));
    }

    const getCartTotal = () => {
        var sum = 0;
        cart.map((product) => {
            sum += product.price;
        });
        return sum;
    };

    const classes = useStyles();

    const navigateTo = (nextPage) => {
        setPage(nextPage);
    }

    const renderProducts = () => (
       <> 
        <Grid container justify="center" spacing={4}>
            {productList.map((product) => (
                <Grid item key={product.number} xs={12} sm={6} md={4} lg={3}>
                    <Card className={classes.root}>
                        <CardMedia className={classes.media} image={product.pictureURL} title={product.description}/>
                        <CardContent>
                            <div className={classes.cardContent}>
                                <Typography variant="h5" gutterBottom>
                                    {product.description}
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    {product.price}
                                </Typography>
                            </div>
                            <Typography variant="body2" color="textSecondary">
                                { product.description }
                            </Typography>
                        </CardContent>

                        <CardActions disableSpacing className={classes.cardActions}>
                            <IconButton aria-label="Add to Cart">
                                <AddShoppingCart onClick={() => addToCart(product)}/>
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
       </>
    )

    const renderCart = () => (
        <> 
        <Grid container justify="center" spacing={4}>
            {cart.map((product) => (
                <Grid item key={product.number} xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.root}>
                    <CardMedia className={classes.media} image={product.pictureURL} title={product.description}/>
                    <CardContent>
                        <div className={classes.cardContent}>
                            <Typography variant="h5" gutterBottom>
                                {product.description}
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                {product.price}
                            </Typography>
                        </div>
                        <Typography variant="body2" color="textSecondary">
                            { product.description }
                        </Typography>
                    </CardContent>

                    <CardActions disableSpacing className={classes.cardActions}>
                        <IconButton aria-label="Add to Cart">
                            <DeleteForever onClick={() => removeFromCart(product)}/>
                        </IconButton>
                    </CardActions>
                </Card>
            </Grid>
            ))}
        </Grid>
        {cart.length === 0 && <><h1>Your cart is empty!</h1><br/><br/><br/></>}
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '25vh'}}>
            <h3>Total Cost: ${getCartTotal()}</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="outlined" color="primary" onClick={() => navigateTo(PAGE_CHECKOUT)}>
                Checkout
            </Button>
        </div>
       </>
    )

    const renderCheckout = () => (
        <div>
            <div style={{justifyContent:'center', alignItems:'center'}}>
                <h2>Please fill out the form completely</h2>
                <form>
                    <label>First Name:</label>
                    <input type="text" /><br/><br/>
                    <label>Last Name:</label>
                    <input type="text" /><br/><br/>
                    <label>Address:</label>
                    <input type="text" /><br/><br/>
                    <label>Other:</label>
                    <input type="text" /><br/><br/>
                    <h3>Card info - other fields</h3>
                    <Button variant="outlined" color="primary">
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )

    return (
        <main className={classes.content} onLoad={getProducts}>
            <div className={classes.toolbar} />
            
            {/* Customer facing Navbar */}
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography variant="h6" className={classes.title} color="inherit">
                        <img src={logo} alt="Logo.js" height="25px" className={classes.image} /> Auto Parts
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.button}>
                        <IconButton aria-label="Home" color="inherit">
                            <Badge color="secondary">
                                <HomeIcon button onClick={()=> navigateTo(PAGE_PRODUCTS)}/>
                            </Badge>
                        </IconButton>
                        <IconButton aria-label="Show cart items" color="inherit">
                            <Badge badgeContent={cart.length} color="secondary">
                                <ShoppingCart onClick={()=> navigateTo(PAGE_CART)}/>
                            </Badge>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {page === PAGE_CART && renderCart()}
            {page === PAGE_PRODUCTS && renderProducts()}
            {page === PAGE_CHECKOUT && renderCheckout()}
        </main>
    )
}

export default Products;