const mysql = require('mysql2/promise')

exports.pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Letmein@dev@123',
    database: 'onwork-tracker',
    port:1115
});

