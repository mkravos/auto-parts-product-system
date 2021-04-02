const express = require('express');
const cors = require('cors');
const router = express.Router();
const db = require('../login');

router.use(express.json());
router.use(cors());

router.get('/', (req, res) => {
  res.send('root of position table operations\n');
});

router.post("/create", (req, res) => {
   const position_description = req.body.position_description
   db.query(
      "INSERT INTO position SET position_description = ?",
      position_description,
      (err, result) => {
         if (err) {
            console.log(err);
         } else {
            res.send(result);
         }
      }
   );
});

router.get("/search", (req, res) => {
   db.query(
      "SELECT * FROM position", (err, result) => {
      if (err) {
         console.log(err);
      } else {
         res.send(result);
      }
   });
});

router.get("/search/:id", (req, res) => {
   const id = req.params.id;
   db.query(
      "SELECT * FROM position WHERE position_id = ?",
      id,
      (err, result) => {
      if (err) {
         console.log(err);
      } else {
         res.send(result);
      }
   });
});

router.put("/update", (req, res) => {
   const id = req.body.id;
   const position_description = req.body.position_description;
   db.query(
      "UPDATE position SET position_description = ? WHERE position_id = ?",
      [position_description, id],
      (err, result) => {
         if (err) {
            console.log(err);
         } else {
            res.send(result);
         }
      }
   );
});

router.delete("/delete/:id", (req, res) => {
   const id = req.params.id;
   db.query(
      "DELETE FROM position WHERE position_id = ?",
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
