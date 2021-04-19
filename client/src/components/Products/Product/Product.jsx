import React from 'react'
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton} from '@material-ui/core';
import { AddShoppingCart, Assessment } from '@material-ui/icons';

import useStyles from './styles';

/*
* Generates the Product component that displays the product image, description, price, and other information.
*
* @return JSX that performs the generation of the Product Component.
*/
const Product = ({ product }) => {
    const classes = useStyles();

    return (
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
                    <AddShoppingCart />
                </IconButton>
            </CardActions>

        </Card>
    )
}

export default Product