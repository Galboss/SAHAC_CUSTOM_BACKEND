const express = require('express')
const router = express.Router();
/**
 * !this is the correct way to call the external routes
 * !from others files.
 * !const user_routes= require('./user_routes');
 * !router.use('/user',user_routes);
 */


module.exports = router;