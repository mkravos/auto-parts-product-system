const express = require('express');

// This is where we require all of our files
const inventory = require('./inventory');

const app = express();

// We establish connection to the path
app.use('/inventory', inventory);

app.listen('3000', () => {
    console.log('Server started on port 3000');
});