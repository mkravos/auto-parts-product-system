const express 	= require('express')
const cors 	= require('cors');
const router 	= express.Router();
const db 	= require('../customer_interaction_db');

// We need these for the request, response
router.use(express.json());
router.use(cors());

router.get('/all', (req, res) => {
    db.query('SELECT * FROM part_collection', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

router.get('/select/:part_collection_id', (req, res) => {
    const part_collection_id = req.params.part_collection_id;
    
    db.query('SELECT * FROM part_collection WHERE part_collection_id = ?',
    [part_collection_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

router.post("/create", (req, res) => {
  const id       = req.body.part_collection_id;
  const order_id = req.body.order_id;
  const number   = req.body.number;
  const quantity = req.body.quantity;

  db.query(
    "INSERT INTO part_collection (part_collection_id, order_id, number, quantity) VALUES (?,?,?,?)",
    [id, order_id, number, quantity],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("part_collection table - values inserted");
      }
    }
  );
});

router.put("/update", (req, res) => {
  const id       = req.body.part_collection_id;
  const order_id = req.body.order_id;
  const number   = req.body.number;
  const quantity = req.body.quantity;
    
  if (!req.body.part_collection_id) {
    return res.status(400).json({
      status: 'error',
      error: 'req body cannot be empty',
    });
  }

  db.query(
    "UPDATE part_collection SET order_id = ?, number = ?, quantity = ? WHERE part_collection_id = ?",
    [order_id, number, quantity, id],
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
  const id = req.params.part_collection_id;

  db.query(
    "DELETE FROM part_collection WHERE part_collection_id = ?",
    id,
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