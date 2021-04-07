import React from 'react';
import { Grid } from '@material-ui/core';

import Product from './Product/Product';
import Navbar from '../Navbar/Navbar';
import useStyles from './styles';

const products = [
    {id: 1, name: 'Shoes', description: 'Running shoes.', price: '$5', image: 'http://cdn.shopify.com/s/files/1/1104/4168/products/Allbirds_WL_RN_SF_PDP_Natural_Grey_BTY_10b4c383-7fc6-4b58-8b3f-6d05cef0369c_600x600.png?v=1610061677'},
    {id: 2, name: 'Macbook', description: 'Apple macbook.', price: '$100', image: 'https://www.bhphotovideo.com/images/images2500x2500/apple_mvfj2ll_a_13_3_macbook_air_with_1492876.jpg'},
    {id: 1, name: 'Shoes', description: 'Running shoes.', price: '$5', image: 'http://cdn.shopify.com/s/files/1/1104/4168/products/Allbirds_WL_RN_SF_PDP_Natural_Grey_BTY_10b4c383-7fc6-4b58-8b3f-6d05cef0369c_600x600.png?v=1610061677'},
    {id: 2, name: 'Macbook', description: 'Apple macbook.', price: '$100', image: 'https://www.bhphotovideo.com/images/images2500x2500/apple_mvfj2ll_a_13_3_macbook_air_with_1492876.jpg'},
    {id: 1, name: 'Shoes', description: 'Running shoes.', price: '$5', image: 'http://cdn.shopify.com/s/files/1/1104/4168/products/Allbirds_WL_RN_SF_PDP_Natural_Grey_BTY_10b4c383-7fc6-4b58-8b3f-6d05cef0369c_600x600.png?v=1610061677'},
    {id: 2, name: 'Macbook', description: 'Apple macbook.', price: '$100', image: 'https://www.bhphotovideo.com/images/images2500x2500/apple_mvfj2ll_a_13_3_macbook_air_with_1492876.jpg'},
    {id: 1, name: 'Shoes', description: 'Running shoes.', price: '$5', image: 'http://cdn.shopify.com/s/files/1/1104/4168/products/Allbirds_WL_RN_SF_PDP_Natural_Grey_BTY_10b4c383-7fc6-4b58-8b3f-6d05cef0369c_600x600.png?v=1610061677'},
    {id: 2, name: 'Macbook', description: 'Apple macbook.', price: '$100', image: 'https://www.bhphotovideo.com/images/images2500x2500/apple_mvfj2ll_a_13_3_macbook_air_with_1492876.jpg'}
];

const Products = () => {
    const classes = useStyles();

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Navbar/>
            <Grid container justify="center" spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Product product={product}/>
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}

export default Products;