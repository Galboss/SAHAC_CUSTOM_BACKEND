const express = require('express')
const router = express.Router();

const userRoutes = require('./user_routes');
const organizationRoutes = require('./organization_routes');
const assignmentsRoutes = require('./assignment_routes');
const courseRoutes = require('./course_routes');
const groupRoutes = require('./group_routes');
const teacherRoutes = require('./teacher_routes');
const lessonRoutes = require('./lesson_routes');
const classroomRoutes=require('./classroom_routes');
const tokenRoute =require('./token_route.js')
const auth = require('../controllers/auth_controller');

/**
 * * this is the correct way to call the external routes
 * * from others files.
 * * const user_routes= require('./user_routes');
 * * router.use('/user',user_routes);
 */

router.use('/user', userRoutes);
router.use('/organization',auth.verifyToken,organizationRoutes);
router.use('/assignment',auth.verifyToken,assignmentsRoutes);
router.use('/course',auth.verifyToken,courseRoutes);
router.use('/group',auth.verifyToken,groupRoutes);
router.use('/teacher',auth.verifyToken,teacherRoutes);
router.use('/lesson',auth.verifyToken,lessonRoutes);
router.use('/classroom',auth.verifyToken,classroomRoutes);
router.use('/token',tokenRoute);

module.exports = router;