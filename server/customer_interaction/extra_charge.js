const express = require('express')
const cors = require('cors');
const router = express.Router();
const db = require('../customer_interaction_db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

router.get('/all', (req, res) => {
    db.query('SELECT * FROM extra_charge', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

router.get('/select/:weight', (req, res) => {
    const weight = req.params.weight;
    
    db.query('SELECT * FROM extra_charge WHERE weight = ?',
    [weight],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

router.post("/create", (req, res) => {
  const weight	 = req.body.weight;
  const shipping = req.body.shipping;
  const handling = req.body.handling;

  db.query(
    "INSERT INTO extra_charge (weight, shipping, handling) VALUES (?,?,?)",
    [weight, shipping, handling],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("extra_charge table - values inserted");
      }
    }
  );
});

router.put("/update", (req, res) => {
  const weight	 = req.body.weight;
  const shipping = req.body.shipping;
  const handling = req.body.handling;
 
  if (!req.body.weight) {
    return res.status(400).json({
      status: 'error',
      error: 'req body cannot be empty',
    });
  }
    
  db.query(
    "UPDATE extra_charge SET shipping = ?, handling = ? WHERE weight = ?",
    [shipping, handling, weight],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

router.delete("/delete/:weight", (req, res) => {
  const weight = req.params.weight;

  db.query(
    "DELETE FROM extra_charge WHERE weight = ?",
    weight,
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
