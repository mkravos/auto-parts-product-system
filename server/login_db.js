const mysql = require('mysql');

const db = mysql.createConnection({
   host: 'localhost',
    user: 'local',
    password: '12345678',
   database: 'login_db',
   multipleStatements: true
});

db.connect(() => {
   console.log('Connected to MySQL \'login_db\'');
});

module.exports = db;
