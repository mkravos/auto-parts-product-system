const express = require("express");
const cors = require("cors");
const router = express.Router()
const db = require('./customer_interaction_db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

router.post("/create", (req, res) => {
  const id = req.body.id;
  const customer_id = req.body.customer_id;
  const weight = req.body.weight;
  const shipping = req.body.shipping;
  const handling = req.body.handling;
  const charge_total = req.body.charge_total;
  const order_date = req.body.order_date;
  const status = req.body.status;

  db.query(
    "INSERT INTO `order` (order_id, customer_id, weight, shipping, handling, charge_total, order_date, status) VALUES (?,?,?,?,?,?,?,?)",
    [id, customer_id, weight, shipping, handling, charge_total, order_date, status],
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
  db.query("SELECT * FROM `order`", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/select/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM `order` WHERE order_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/update", (req, res) => {
  const id = req.body.id;
  const customer_id = req.body.customer_id;
  const weight = req.body.weight;
  const shipping = req.body.shipping;
  const handling = req.body.handling;
  const charge_total = req.body.charge_total;
  const order_date = req.body.order_date;
  const status = req.body.status;

  if (customer_id != null) {
    db.query(
      "UPDATE `order` SET customer_id = ?, weight = ?, shipping = ?, handling = ?, charge_total = ?, order_date = ?, status = ? WHERE order_id = ?",
      [customer_id, weight, shipping, handling, charge_total, order_date, status, id],
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

  db.query("DELETE FROM `order` WHERE order_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;