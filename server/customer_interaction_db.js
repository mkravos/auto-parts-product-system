const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'local',
    password: '12345678',
    database: 'customer_interaction_db'
});

db.connect(() => {
    console.log('Connected to MySQL \'customer_interaction_db\'');
});

module.exports = db;
