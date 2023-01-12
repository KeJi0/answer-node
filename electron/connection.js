const mysql = require('mysql2/promise');
async function getConnection() {
    try{
      return await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            port: '3306',                   
            database: 'test'
        });
    }catch(err) {
        console.log('[CONNECT ERROR] -', err.message);
    }

}
module.exports = {
    getConnection
}

