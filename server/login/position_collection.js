const express = require('express');
const cors = require('cors');
const router = express.Router();
const db = require('../login_db');

router.use(express.json());
router.use(cors());

// for verbosity
router.get('/', (req, res) => {
  res.send('root of position_collection table operations\n');
});

// add row with account_id and position_id to position_collection
router.post("/create", (req, res) => {
   const account_id = req.body.account_id
   const position_id = req.body.position_id
   db.query(
      "INSERT INTO position_collection (account_id, position_id) VALUES (?, ?)",
      [account_id, position_id],
      (err, result) => {
         if (err) {
            console.log(err);
         } else {
            res.send(result);
         }
      }
   );
});

// get all rows and columns from position_collection
router.get("/all", (req, res) => {
   db.query(
      "SELECT * FROM position_collection", (err, result) => {
      if (err) {
         console.log(err);
      } else {
         res.send(result);
      }
   });
});

// get all columns from a row from position_collection given by position_collection_id
router.get("/select/:id", (req, res) => {
   const id = req.params.id;
   db.query(
      "SELECT * FROM position_collection WHERE position_collection_id = ?", id, (err, result) => {
      if (err) {
         console.log(err);
      } else {
         res.send(result);
      }
   });
});

// replace account_id and position_id in position_collection at row given by 
// position_collection_id
router.put("/update", (req, res) => {
   const id = req.body.id;
   const account_id = req.body.account_id;
   const position_id = req.body.position_id;
   db.query(
      "UPDATE position_collection SET account_id = ?, position_id = ? WHERE position_collection_id = ?",
      [account_id, position_id, id],
      (err, result) => {
         if (err) {
            console.log(err);
         } else {
            res.send(result);
         }
      }
   );
});

// delete row in position_collection given by position_collection_id
router.delete("/delete/:id", (req, res) => {
   const id = req.params.id;
   db.query(
      "DELETE FROM position_collection WHERE position_collection_id = ?",
      id,
      (err, result) => {
      if (err) {
         console.log(err);
      } else {
         res.send(result);
      }
   });
});

module.exports = router;
