const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Require files
const parts = require('./parts');
const inventory = require('./customer_interaction/inventory');
const customer = require('./customer_interaction/customer');
const extra_charge = require('./customer_interaction/extra_charge');
const order = require('./customer_interaction/order');
const part_collection = require('./customer_interaction/part_collection');
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
app.use('/parts', parts);
app.use('/customer_interaction/inventory', inventory);
app.use('/customer_interaction/customer', customer);
app.use('/customer_interaction/extra_charge', extra_charge);
app.use('/customer_interaction/order', order);
app.use('/customer_interaction/part_collection', part_collection);
app.use('/login/account', account);
app.use('/login/position', position);
app.use('/login/position_collection', position_collection);

// Server listening on port 3000
app.listen('3000', () => {
   console.log('Server started on port 3000');
});
