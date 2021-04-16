const express = require('express')
const cors = require('cors');
const router = express.Router()
const mysql = require('mysql');

// Database configuration
const db = mysql.createConnection({
    host: 'blitz.cs.niu.edu',
    port: '3306',
    user: 'student',
    password: 'student',
    database: 'csci467'
});

// Connect to the db
db.connect(() => {
    console.log('Connected to MySQL \'csci467\'');
});

// Needed for the request, response
router.use(express.json());
router.use(cors());

router.get('/all', (req, res) => {
    db.query('SELECT * FROM parts', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

router.get('/select/:number', (req, res) => {
    const number = req.params.number;
    db.query('SELECT * FROM parts WHERE number = ?', number, (err, result) => {
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

router.get('/select/description/:description', (req, res) => {
    const description = decodeURIComponent(req.params.description);
    db.query(
      'SELECT number FROM parts WHERE description = ?',
       description,
       (err, result) => {
           if (err) {
               console.log(err);
           } else {
               res.send(result);
           }
        }
    );
});

module.exports = router;
