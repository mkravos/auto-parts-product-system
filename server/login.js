const mysql = require('mysql');

const db = mysql.createConnection({
   host: 'localhost',
   user: 'me',
   password: '',
   database: 'login',
   multipleStatements: true
});

db.connect(() => {
   console.log('Connected to MySQL \'login\' db');
});

module.exports = db;
