const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'local',
    password: '12345678',
    database: 'autoparts'
});

db.connect(() => {
    console.log('MySQL connected');
});

module.exports = db;
