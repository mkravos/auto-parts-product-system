const express 	= require('express')
const cors 	= require('cors');
const router 	= express.Router();
const db 	= require('./db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

router.get('extra_charge/all', (req, res) => {
    db.query('SELECT * FROM extra_charge', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

router.get('extra_charge/select/:weight', (req, res) => {
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

router.post("extra_charge/create", (req, res) => {
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

router.put("extra_charge/update", (req, res) => {
  const weight	 = req.body.weight;
  const shipping = req.body.shipping;
  const handling = req.body.handling;

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

router.delete("extra_charge/delete/:weight", (req, res) => {
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
