// Require needed libraries.
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography, Grid, Card, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { AddShoppingCart, DeleteForever } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// Require more libraries.
import Product from './Product/Product';
import useStyles from './Product/styles';

// Require for material table.
import HomeIcon from '@material-ui/icons/Home';
import { ShoppingCart } from '@material-ui/icons';

// Require for logo.
import logo from '../../assets/Logo.png';

// API to handle interacting and fetching data from server.
const api = axios.create({baseURL: 'http://localhost:3000/'});

const Products = () => {
    // Define pages for navigation.
    const PAGE_PRODUCTS = 'products';
    const PAGE_CART = 'cart';
    const PAGE_CHECKOUT = 'checkout';
    const PAGE_ORDERCONFIRMED = 'orderconfirmed';

    // Define containers to store data.
    const [cart, setCart] = useState([]);
    const [page, setPage] = useState(PAGE_PRODUCTS);
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [weightList, setWeightList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [ccResList, setCCRes] = useState([]);

    // Define references for customer information.
    let firstNameRef = useRef(null);
    let lastNameRef = useRef(null);
    let addressRef = useRef(null);
    let emailRef = useRef(null);
    let cardNumberRef = useRef(null);
    let cardExpRef = useRef(null);

    // Define format for displaying currency information.
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    // Function to retrieve all current parts in database.
    // Does not take parameters.
    // Does not return anything.
    const getProducts = () => {
        axios.get('http://localhost:3000/parts/all').then((response) => {
            setProductList(response.data);
        });
    };

    // Function to retrieve all current customers in database.
    // Does not take parameters.
    // Does not return anything.
    const getCustomers = async () => {
        try {
            const response = await api.get('customer_interaction/customer/all')
            setCustomerList(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // Function to retrieve all current orders in database.
    // Does not take parameters.
    // Does not return anything.
    const getOrders = async () => {
        try {
            const response = await api.get('customer_interaction/order/all')
            setOrderList(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // Function to process credit card transaction with external server.
    // Takes in a customer's name, card number, card experation date, and order amount.
    // Returns a response from the external server.
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

    // Function to process the order transaction.
    // Does not take parameters.
    // Does not return anything.
    const processTransaction = () => {
        // Input values for customer.
        let firstName = firstNameRef.current.value;
        let lastName = lastNameRef.current.value;
        let address = addressRef.current.value;
        let email = emailRef.current.value;

        // Input values for credit card processing.
        let cardNumber = cardNumberRef.current.value;
        let cardExp = cardExpRef.current.value;

        // Create a customer using form data.
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
        
        // Retrieve number of customers to determine customer ID.
        getCustomers();
        let orderCustID = -1;
        if (customerList.length > 0){
            orderCustID = customerList.pop().customer_id;
        }
        
        // Calculate weight of entire order.
        let orderWeight = 0;
        cart.map((product) => {
            orderWeight += product.weight;
        });
        
        // Retrieve weight brackets defined in database.
        axios.get('http://localhost:3000/customer_interaction/extra_charge/all')
            .then((response) => {
                setWeightList(response.data);
            }).catch((error) =>{
                console.error(error);
            });
        
        // Calculate shipping/handling price of order from weight brackets.
        let orderShipping = 0;
        let orderHandling = 0;
        for(let weight of weightList){
            if(orderWeight >= weight){
                orderShipping = weight.shipping;
                orderHandling = weight.handling;
            }
        }
        
        // Calculate the total price of the order.
        let orderTotal = 0;
        cart.map((product) => {
            orderTotal += product.price;
        });
        orderTotal += orderShipping + orderHandling;

        // Process credit card transaction.
        // If transaction doesn't go through, we can simply delete the latest customer.
        let ccRes = "allClear";
        confirmTransaction(cardNumber, cardExp, firstName+' '+lastName, orderTotal)
            .then((response) => {
                if(response){
                    setCCRes(response[0]);
                }
            }).catch((error) => {
                console.error(error);
            })
        if(ccResList.length > 0){
            ccRes = ccResList;
        }
        
        // Proceed with order creation if no errors were encountered.
        if(ccRes === 'allClear'){
            // Get current date.
            let d = new Date();
            let month = d.getMonth();
            let day = d.getDate();
            let date = d.getFullYear() + '-'
                + (month < 10 ? '0' + month : month) + '-'
                + (day < 10 ? '0' + day : day); 

            // Create an order using calculated values.
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

            // Retrieve all orders in the database to determine order ID.
            getOrders();
            let orderID = -1;
            if (orderList.length > 0){
                orderID = orderList.pop().order_id;
            }
            
            // Create a entry in the part_collection database for each unique product.
            let uniqueProducts = [];
            cart.map((product) => {
                let orderPartNum = product.number;
                // If we don't find the same part num already in the array.
                if(uniqueProducts.find(element => element === orderPartNum) === undefined){
                    // Keep track of unique products in our order.
                    uniqueProducts.push(orderPartNum);
                    let orderQuantity = 0;
                    
                    // Loop through to determine how many of a certain product was in the order.
                    cart.map((product) => {
                        if(product.number === orderPartNum){
                            orderQuantity += 1;
                        }
                    });
                    
                    // Create an entry in part_collection for our order.
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
            
            // Once transaction is complete, clear the cart and return to catalog.
            setCart([]);
            navigateTo(PAGE_ORDERCONFIRMED);
        }
        else{
            // If there were an error in credit card processing, display the error.
            console.error('ERROR:'+ccRes);
            
            // Delete the newly added customer from the database.
            api.delete('customer_interaction/customer/delete/'+orderCustID)
            .then((response) => {
                console.log(response);
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    // Function to add a product to the cart.
    // Does not take parameters.
    // Does not return anything.
    const addToCart = (product) => {
        setCart([...cart, { ...product}]);
        console.log(cart);
        console.log(productList);
    }

    // Function to remove a product from the cart.
    // Does not take parameters.
    // Does not return anything.
    const removeFromCart = (productToRemove) => {
        setCart(cart.filter(product => product !== productToRemove));
    }

    // Function to retrieve the total value of cart, before shipping/handling.
    // Does not take parameters.
    // Returns the sum of the cart.
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

    /*
    * Renders all of the products 
    */
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

    /*
    * Renders the products that are present in the Cart, as well as price total
    */
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
