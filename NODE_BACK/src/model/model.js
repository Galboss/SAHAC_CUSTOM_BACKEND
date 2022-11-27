const organizationEntity = require('../database/entities/organization_db');
const userEntity = require("../database/entities/users_db");
const assignmentEntity = require('../database/entities/assignment_db');
const courseEntity = require('../database/entities/courses_db');
const groupEntity = require('../database/entities/group_db');
const teacherEntity = require('../database/entities/teacher_db');
const lessonEntity = require('../database/entities/lesson_db');
const classroomEntity = require('../database/entities/classroom_db');
const tokenEntity = require('../database/entities/token_db');

const model = {
    tokenEntity: new tokenEntity(),
    userEntity: new userEntity(),
    organizationEntity: new organizationEntity(),
    assignmentEntity: new assignmentEntity(),
    courseEntity: new courseEntity(),
    groupEntity: new groupEntity(),
    teacherEntity: new teacherEntity(),
    lessonEntity: new lessonEntity(),
    classroomEntity:new classroomEntity(),
}

module.exports = model;