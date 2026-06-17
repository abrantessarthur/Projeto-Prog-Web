const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rafaeldb',
    database: 'biblioteca',
    port: '3306'
});

db.connect((err) => {
    if (err) throw err;
        console.log('Conectado ao banco de dados');
});
module.exports = db;
    