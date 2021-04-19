const mysql = require('mysql');
/*
* Creates Database Connection
* 
* @param host - host of database
* @param user - username of db
* @param password
* @param database - specific database
*/
const db = mysql.createConnection({
    host: 'localhost',
    user: 'local',
    password: '12345678',
    database: 'customer_interaction_db'
});

// Connects to the specified Database
db.connect(() => {
    console.log('Connected to MySQL \'customer_interaction_db\'');
});

module.exports = db;
