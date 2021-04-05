const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Require files
const inventory = require('./inventory');
const customer = require('./customer');
const extra_charge = require('./extra_charge');
const order = require('./order');
const parts = require('./parts');
const part_collection = require('./part_collection');
const account = require('./login/account');
const position = require('./login/position');
const position_collection = require('./login/position_collection');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Aid JSON request, response
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Establish connection to the path
app.use('/inventory', inventory);
app.use('/customer', customer);
app.use('/extra_charge', extra_charge);
app.use('/order', order);
app.use('/parts', parts);
app.use('/part_collection', part_collection);
app.use('/login/account', account);
app.use('/login/position', position);
app.use('/login/position_collection', position_collection);

// Server listening on port 3000
app.listen('3000', () => {
   console.log('Server started on port 3000');
});
