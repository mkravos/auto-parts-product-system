const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Require files
const inventory = require('./inventory');
const customer = require('./customer');
const extra_charge = require('./extra_charge');
const order = require('./order');
const part_collection = require('./part_collection');

const app = express();

// Aid JSON request, response
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// We establish connection to the path
app.use('/inventory', inventory);
app.use('/customer', customer);
app.use('/extra_charge', extra_charge);
app.use('/order', order);
app.use('/part_collection', part_collection);

app.listen('3000', () => {
    console.log('Server started on port 3000');
});