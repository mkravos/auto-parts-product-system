const express = require('express');
const cors = require('cors');
const router = express.Router();
const db = require('../login_db');

router.use(express.json());
router.use(cors());

// for verbosity
router.get('/', (req, res) => {
  res.send('root of account table operations\n');
});

// add row to account
// add row to position_collection to follow table design logic
router.post("/create", (req, res) => {
   const first_name = req.body.first_name;
   const last_name = req.body.last_name;
   const password = req.body.password;
   const position_id = req.body.position_id;
   db.query(
      "INSERT INTO account " +
      "(first_name, last_name, password) VALUES " +
      "(?,?,?); " +
      "INSERT INTO position_collection " +
      "(position_id, account_id) VALUES " +
      "(?, LAST_INSERT_ID())",
      [first_name, last_name, password, position_id],
      (err, result) => {
         if (err) {
            console.log(err);
         } else {
            res.send(result);
         }
      }
   );
});
  
// get all rows and columns from account
router.get("/all", (req, res) => {
   db.query(
      "SELECT * FROM account",
      (err, result) => {
      if (err) {
         console.log(err);
      } else {
         res.send(result);
      }
   });
});

// get all rows and columns that satisfy a provided account_id ':id'
// from account
router.get("/select/:id", (req, res) => {
   const id = req.params.id;
   db.query(
      "SELECT * FROM account WHERE account_id = ?",
      id,
      (err, result) => {
      if (err) {
         console.log(err);
      } else {
         res.send(result);
      }
   });
});

// overwrite first_name, last_name, and password for a given 'id' checked against
// account_id in account
router.put("/update", (req, res) => {
   const id = req.body.id;
   const first_name = req.body.first_name;
   const last_name = req.body.last_name;
   const password = req.body.password;
   db.query(
      "UPDATE account SET first_name = ?, last_name = ?, password = ? WHERE account_id = ?",
      [first_name, last_name, password, id],
      (err, result) => {
         if (err) {
            console.log(err);
         } else {
            res.send(result);
         }
      }
   );
});

// delete a row from account that has the account_id ':id'
router.delete("/delete/:id", (req, res) => {
   const id = req.params.id;
   db.query(
      "DELETE FROM account WHERE account_id = ?",
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
