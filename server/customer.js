const express = require("express");
const cors = require("cors");
const router = express.Router()
const db = require('./db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

router.post("customer/create", (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const address = req.body.address;

  db.query(
    "INSERT INTO customer (customer_id, email, first_name, last_name, address) VALUES (?,?,?,?,?)",
    [id, email, first_name, last_name, address],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

router.get("customer/search", (req, res) => {
  db.query("SELECT * FROM customer", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("customer/search/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM customer WHERE customer_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.put("customer/update", (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const address = req.body.address;

  if (email != null) {
    db.query(
      "UPDATE customer SET email = ?, first_name = ?, last_name = ?, address = ? WHERE customer_id = ?",
      [email, first_name, last_name, address, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
});

router.delete("customer/delete/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM customer WHERE customer_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;