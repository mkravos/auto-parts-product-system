import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';

import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import InputIcon from '@material-ui/icons/Input';
import HomeIcon from '@material-ui/icons/Home';

import logo from '../../assets/Logo.png';
import useStyles from './styles';

const PrimarySearchAppBar = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography variant="h6" className={classes.title} color="inherit">
            <img src={logo} alt="Logo.js" height="25px" className={classes.image} /> Auto Parts Internal
          </Typography>
          <div className={classes.grow} />
          <div className={classes.button}>
          <IconButton component={Link} to="/" aria-label="Home" color="inherit">
              <Badge color="secondary">
                <HomeIcon />
              </Badge>
            </IconButton>
            <IconButton component={Link} to="/admin" aria-label="Admin" color="inherit">
              <Badge color="secondary">
                <SupervisorAccountIcon />
              </Badge>
            </IconButton>
            <IconButton component={Link} to="/receiving" aria-label="Receiving" color="inherit">
              <Badge color="secondary">
                <InputIcon />
              </Badge>
            </IconButton>
            <IconButton component={Link} to="/shipping" aria-label="Shipping" color="inherit">
              <Badge color="secondary">
                <LocalShippingIcon />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default PrimarySearchAppBar;