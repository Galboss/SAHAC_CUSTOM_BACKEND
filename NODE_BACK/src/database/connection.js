const mysql = require('mysql2/promise');
const {promisify} = require('util');
const con = mysql.createPool({
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASS}`,
    database: `${process.env.DB_NAME}`,
    connectionLimit: 10
});

con.getConnection((err,connection)=>{
    if(err)
        console.error(err.message);
    if(connection)
        connection.release();
    console.log("DB connected");
    return;
});
/*
con.query = promisify(con.query); // *Converting callbacks to promises
*/

module.exports = con;