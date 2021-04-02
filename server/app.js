const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const account = require('./login/account');
const position = require('./login/position');
const position_collection = require('./login/position_collection');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/login/account', account);
app.use('/login/position', position);
app.use('/login/position_collection', position_collection);

app.listen('3000', () => {
   console.log('Server started on port 3000');
});
