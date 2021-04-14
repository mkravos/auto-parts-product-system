import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';

import Product from './Product/Product';
import Navbar from '../Navbar/Navbar';
import useStyles from './styles';

const Products = () => {
    const [productList, setProductList] = useState([]);

    const getProducts = () => {
        axios.get('http://localhost:3000/parts/all').then((response) => {
            setProductList(response.data);
        });
    };

    console.log(productList);

    const classes = useStyles();

    return (
        <main className={classes.content} onLoad={getProducts}>
            <div className={classes.toolbar} />
            <Navbar/>
            
            <Grid container justify="center" spacing={4} onload={getProducts}>
                {productList.map((product) => (
                    <Grid item key={product.number} xs={12} sm={6} md={4} lg={3}>
                        <Product product={product}/>
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}

export default Products;