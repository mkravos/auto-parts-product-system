import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography, Grid, Card, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { AddShoppingCart, DeleteForever } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


import Product from './Product/Product';
import useStyles from './Product/styles';

import HomeIcon from '@material-ui/icons/Home';
import { ShoppingCart } from '@material-ui/icons';

import logo from '../../assets/Logo.png';

const api = axios.create({baseURL: 'http://localhost:3000/'});

const Products = () => {
    const PAGE_PRODUCTS = 'products';
    const PAGE_CART = 'cart';
    const PAGE_CHECKOUT = 'checkout';
    const PAGE_ORDERCONFIRMED = 'orderconfirmed';

    const [cart, setCart] = useState([]);
    const [page, setPage] = useState(PAGE_PRODUCTS);
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [weightList, setWeightList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [ccResList, setCCRes] = useState([]);

    let firstNameRef = useRef(null);
    let lastNameRef = useRef(null);
    let addressRef = useRef(null);
    let emailRef = useRef(null);
    let cardNumberRef = useRef(null);
    let cardExpRef = useRef(null);

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    const getProducts = () => {
        axios.get('http://localhost:3000/parts/all').then((response) => {
            setProductList(response.data);
        });
    };

    const getCustomers = async () => {
        try {
            const response = await api.get('customer_interaction/customer/all')
            setCustomerList(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getOrders = async () => {
        try {
            const response = await api.get('customer_interaction/order/all')
            setOrderList(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // process credit card, then clear the cart
    const confirmTransaction = async (cardNum, cardExp, custName, orderAmount) => {
        // Somehow we need vendor and trans to be unique.
        let transactionNum = Math.floor(Math.random() * 999);
        transactionNum += '-'+Math.floor(Math.random() * 999999999);
        transactionNum += '-'+Math.floor(Math.random() * 999)
        try {
            const response = await axios.post('http://blitz.cs.niu.edu/CreditCard/', {
                vendor : 'VE001-99',
                trans : transactionNum,
                cc : cardNum,
                name : custName, 
                exp : cardExp, 
                amount : orderAmount
            })
            return response.data.errors;
        } catch (error) {
            console.error(error);
        }
    };

    const processTransaction = () => {
        // Input values for customer.
        let firstName = firstNameRef.current.value;
        let lastName = lastNameRef.current.value;
        let address = addressRef.current.value;
        let email = emailRef.current.value;

        // Input values for credit card processing.
        let cardNumber = cardNumberRef.current.value;
        let cardExp = cardExpRef.current.value;

        // CUSTOMER
        api.post('customer_interaction/customer/create', {
            email: email,
            first_name: firstName,
            last_name: lastName,
            address: address
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        });
        // Generate values for order creation.
        // For the customer, this will be wasteful and simply works as a needed solution.
        // It does not check for duplicate customers, this simply uses the last created
        // customer's ID to fulfill the order.
        getCustomers();
        let orderCustID = -1;
        if (customerList.length > 0){
            orderCustID = customerList.pop().customer_id;
        }
        // Now we begin by getting our weight.
        let orderWeight = 0;
        cart.map((product) => {
            orderWeight += product.weight;
        });
        axios.get('http://localhost:3000/customer_interaction/extra_charge/all')
            .then((response) => {
                setWeightList(response.data);
            }).catch((error) =>{
                console.error(error);
            });
        // We now have all the weight 'brackets' defined in the database.
        // From here we can skim over them all to find the 'bracket' that the weight
        // of our order fits into.
        let orderShipping = 0;
        let orderHandling = 0;
        for(let weight of weightList){
            if(orderWeight >= weight){
                orderShipping = weight.shipping;
                orderHandling = weight.handling;
            }
        }
        // Now we can determine the total price of the order.
        // First, we calculate the raw cost of the order without shipping/handling.
        let orderTotal = 0;
        cart.map((product) => {
            orderTotal += product.price;
        });
        // Now we can add shipping/handling costs.
        orderTotal += orderShipping + orderHandling;

        // Process cc transaction.
        // If transaction doesn't go through, we can simply delete the latest customer.
        let ccRes = "allClear";
        confirmTransaction(cardNumber, cardExp, firstName+' '+lastName, orderTotal)
            .then((response) => {
                setCCRes(response[0]);
            }).catch((error) => {
                console.error(error);
            })
        ccRes = ccResList;
        if(ccRes == 'allClear'){
            // Get current date.
            // Can't figure out how to get in local timezone.
            let d = new Date();
            let month = d.getMonth();
            let day = d.getDate();
            let date = d.getFullYear() + '-'
                + (month < 10 ? '0' + month : month) + '-'
                + (day < 10 ? '0' + day : day); 

            // ORDER
            api.post('customer_interaction/order/create', {
                customer_id : orderCustID,
                weight: orderWeight,
                shipping: orderShipping,
                handling: orderHandling,
                charge_total: orderTotal,
                order_date: date,
                status: 'Created'
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.error(error);
            });

            // Same with customer, in order to get the order ID we are using the method
            // of selecting all orders and getting the id of the last order.
            // Inefficient, but it works.
            getOrders();
            let orderID = -1;
            if (orderList.length > 0){
                orderID = orderList.pop().order_id;
            }
            // Now, for each product in our order we must make an entry in the part_collection db.
            let uniqueProducts = [];
            cart.map((product) => {
                let orderPartNum = product.number;
                if(uniqueProducts.find(element => element === orderPartNum) === undefined){
                    // If we don't find the same part num already in the array.
                    uniqueProducts.push(orderPartNum);
                    let orderQuantity = 0;
                    // Loop through to determine how many of a certain product was in the order.
                    cart.map((product) => {
                        if(product.number === orderPartNum){
                            orderQuantity += 1;
                        }
                    });
                    // PART COLLECTION
                    api.post('customer_interaction/part_collection/create', {
                        order_id: orderID,
                        number: orderPartNum,
                        quantity: orderQuantity
                    }).then((response) => {
                        console.log(response);
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            });
            setCart([]); // then clear cart
            navigateTo(PAGE_PRODUCTS);
        }
        else{
            api.delete('customer_interaction/customer/delete/'+orderCustID)
            .then((response) => {
                console.log(response);
            }).catch((error) => {
                console.error(error);
            });
        }
    }

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
                                    ${product.price}
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
                                ${product.price}
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
        {cart.length === 0 && 
            <>
            <center><h1>Your cart is empty!</h1>
            <Button variant="outlined" color="primary" onClick={() => navigateTo(PAGE_PRODUCTS)}>
                Return to Catalog
            </Button></center><br/><br/><br/>
            </>
        }
        {cart.length !== 0 &&
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '25vh'}}>
                <h3>Total Price: {formatter.format(getCartTotal())}</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button variant="outlined" color="primary" onClick={() => navigateTo(PAGE_CHECKOUT)}>
                    Checkout
                </Button>
            </div>
        }
       </>
    )

    const renderCheckout = () => (
        <div style={{justifyContent:'center', alignItems:'center'}}>
            <center>
            <h2>Please fill out the form completely:</h2>
            <form className={classes.form}>
            <center><TextField
                     label="First Name"
                     defaultValue=""
                     inputRef={firstNameRef}
                     className={classes.textField} /></center>
            <center><TextField
                     label="Last Name"
                     defaultValue=""
                     inputRef={lastNameRef}
                     className={classes.textField} /></center>
            <center><TextField
                     label="Address"
                     defaultValue=""
                     inputRef={addressRef}
                     className={classes.textField} /></center>
            <center><TextField
                     label="Email"
                     defaultValue=""
                     inputRef={emailRef}
                     className={classes.textField} /></center>
            <center><TextField
                     label="Card Number"
                     defaultValue=""
                     inputRef={cardNumberRef}
                     className={classes.textField} /></center>
            <center><TextField
                     label="Card exp"
                     defaultValue=""
                     inputRef={cardExpRef}
                     className={classes.textField} /></center>
                <Button variant="outlined" color="primary" onClick={() => processTransaction()}>
                    Confirm Purchase
                </Button>
            </form>
            </center>
        </div>
    )

    // this is where I'm thinking confirmTransaction should be called from in order to confirm the credit card details and finalize the order
    const renderOrderConfirmed = () => (
        <div style={{justifyContent:'center', alignItems:'center'}}>
            <center>
            <h2>Order Confirmed!</h2>
            <Button variant="outlined" color="primary" onClick={() => navigateTo(PAGE_PRODUCTS)}>
                Continue Shopping
            </Button>
            </center>
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
            {page === PAGE_ORDERCONFIRMED && renderOrderConfirmed()}
        </main>
    )
}

export default Products;
