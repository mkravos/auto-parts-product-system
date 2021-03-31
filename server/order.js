const express = require("express");
const cors = require("cors");
const router = express.Router()
const db = require('./db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

router.post("order/create", (req, res) => {
  const id = req.body.id;
  const customer_id = req.body.customer_id;
  const weight = req.body.weight;
  const shipping = req.body.shipping;
  const handling = req.body.handling;
  const charge_total = req.body.charge_total;
  const order_date = req.body.order_date;
  const status = req.body.status;

  db.query(
    "INSERT INTO order (order_id, customer_id, weight, shipping, handling, charge_total, order_date, status) VALUES (?,?,?,?,?,?,?,?)",
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

router.get("order/search", (req, res) => {
  db.query("SELECT * FROM order", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("order/search/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM order WHERE order_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.put("order/update", (req, res) => {
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
      "UPDATE order SET customer_id = ? WHERE order_id = ?",
      [customer_id, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
  if (weight != null) {
    db.query(
      "UPDATE customer SET weight = ? WHERE order_id = ?",
      [weight, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
  if (shipping != null) {
    db.query(
      "UPDATE customer SET shipping = ? WHERE order_id = ?",
      [shipping, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
  if (handling != null) {
    db.query(
      "UPDATE customer SET handling = ? WHERE order_id = ?",
      [handling, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
  if (charge_total != null) {
    db.query(
      "UPDATE customer SET charge_total = ? WHERE order_id = ?",
      [charge_total, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
  if (order_date != null) {
    db.query(
      "UPDATE order_date SET handling = ? WHERE order_id = ?",
      [order_date, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
  if (status != null) {
    db.query(
      "UPDATE customer SET status = ? WHERE order_id = ?",
      [status, id],
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

router.delete("order/delete/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM order WHERE order_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;