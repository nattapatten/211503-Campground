const mysql = require("mysql");




var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    // password: 's2w1d1e0v5p0r3ac',
    database: 'vacCenter'
});


module.exports = connection;