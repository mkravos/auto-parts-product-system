const express = require('express')
const cors = require('cors');
const router = express.Router()
const db = require('./db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

router.get('/all', (req, res) => {
    db.query('SELECT * FROM inventory', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

router.get('/:number', (req, res) => {
    const number = req.params.number;
    db.query('SELECT * FROM inventory WHERE number = ?', number, (err, result) => {
        if (err) 
        {
            console.log(err);
        } 
        else 
        {
            res.send(result);
        }
    });
});

module.exports = router;