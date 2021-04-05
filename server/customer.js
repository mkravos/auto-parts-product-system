const express = require("express");
const cors = require("cors");
const router = express.Router()
const db = require('./customer_interaction_db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

router.post("/create", (req, res) => {
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

router.get("/all", (req, res) => {
  db.query("SELECT * FROM customer", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/select/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM customer WHERE customer_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/update", (req, res) => {
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

router.delete("/delete/:id", (req, res) => {
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