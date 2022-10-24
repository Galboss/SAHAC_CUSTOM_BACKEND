require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT||7070;
const routes = require('./routes/routes');
const con = require('./database/connection'); //!This is the connection with the database
app.use(express.json());
app.listen(port,()=>{console.log(`Listening on port ${port} ...`)});
app.use('/rest',routes);