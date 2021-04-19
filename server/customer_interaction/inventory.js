// Require needed libraries
const express = require('express')
const cors = require('cors');
const router = express.Router()
const db = require('../customer_interaction_db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

// This API call returns all of the entries from inventory
router.get('/all', (req, res) => {
    db.query('SELECT * FROM inventory', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

// This API call returns a specific entry from inventory
router.get('/select/:number', (req, res) => {
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

// This API call creates a new entry in the inventory
router.post("/create", (req, res) => {
  const number	 = req.body.number;
  const quantity = req.body.quantity;

  db.query(
    "INSERT INTO inventory (number, quantity) VALUES (?,?)",
    [number, quantity],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("inventory table - inserted row");
      }
    }
  );
});

// This API call updates an existing entry in the inventory
router.put("/update", (req, res) => {
  const number	 = req.body.number;
  const quantity = req.body.quantity;
 
  if (!req.body.number) {
    return res.status(400).json({
      status: 'error',
      error: 'req body cannot be empty',
    });
  }
    
  db.query(
    "UPDATE inventory SET quantity = quantity + ? WHERE number = ?",
    [quantity, number],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// This API call deletes an entry from the inventory
router.delete("/delete/:number", (req, res) => {
  const number	 = req.params.number;

  db.query(
    "DELETE FROM inventory WHERE number = ?",
    number,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Export router to be used by app.js
module.exports = router;
