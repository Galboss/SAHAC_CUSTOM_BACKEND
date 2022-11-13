const express = require('express')
const router = express.Router();
const userRoutes = require('./user_routes');
const organizationRoutes = require('./organization_routes');
const assignmentsRoutes = require('./assignment_routes');

/**
 * * this is the correct way to call the external routes
 * * from others files.
 * * const user_routes= require('./user_routes');
 * * router.use('/user',user_routes);
 */

router.use('/user', userRoutes);
router.use('/organization', organizationRoutes);
router.use('/assignment', assignmentsRoutes);

module.exports = router;