const organizationEntity = require('../database/entities/organization_db');
const userEntity = require("../database/entities/users_db");
const assignmentEntity = require('../database/entities/assignment_db');

const model = {
    userEntity: new userEntity(),
    organizationEntity: new organizationEntity(),
    assignmentEntity: new assignmentEntity(),
}

module.exports = model;