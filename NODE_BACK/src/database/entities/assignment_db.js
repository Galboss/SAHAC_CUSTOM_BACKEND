const con = require('../connection')

class AssignmentEntity {
    constructor() { };
    /**
     * createNewAssignment
     * * Create a new Assignment in the database associated with one organization.
     * @param {string} code 
     * @param {string} name 
     * @param {string} description 
     * @param {number} org_id 
     * @param {number} cat_id 
     * @returns {{message:string,error:boolean}} returns an object with feedback.
     * @throws throws an object with feedback.
     */
    createNewAssignment = async (code, name, description, org_id, cat_id) => {
        if (name && org_id && !isNaN(org_id)) {
            let sql = "CALL create_new_assignment(?,?,?,?,?)";
            await con.query(sql, [code, name, description, org_id, cat_id]).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log(`${name} assignment has been created!!!`);
            return { message: `${name} assignment has been created!!!`, error: false };
        } else {
            throw { message: "Some parameters are null or empty.", error: true };
        }
    };
    /**
     * createNewAssignmentCategory
     * * Create a new assignment category associated to an organization
     * @param {string} name 
     * @param {string} description 
     * @param {string} parentId 
     * @param {string} org_id 
     * @returns {{message:string,error:boolean}} returns an object with feedback.
     * @throws throws an object with feedback.
     */
    createNewAssignmentCategory = async (name, description, parentId, org_id) => {
        if (name && org_id && !isNaN(org_id)) {
            let sql = "CALL create_new_assignment_category(?,?,?,?)";
            await con.query(sql, [name, description, parentId, org_id]).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log(`${name} assignment category has been created!!!`);
            return { message: `${name} assignment category has been created!!!`, error: false };
        } else
            throw { message: "Some parameters are null or empty.", error: true };
    }
    /**
     * getAssignmentsByOrganization
     * * Gets all the assignments that are associated with the organization
     * that enters in parameter.
     * @param {number} org_id 
     * @returns {{message:string,results:[],error:boolean}} returns an object
     * with feedback and the results of the consult.
     * @throws Throws and object with feedback of the error.
     */
    getAssignmentsByOrganization = async (org_id) => {
        if (org_id && !isNaN(org_id)) {
            let sql = "CALL select_assignment_by_organization(?)";
            let res = null;
            await con.query(sql, [org_id]).then(r => { res = r }).catch(e => {
                throw { message: e.sqlMessage, error: true }
            });
            console.log("Assignments selected!!!");
            return {
                message: "Assignments selected!!!",
                results: res[0][0],
                error: false
            }
        } else
            throw { message: "Some parameters are null or empty.", error: true };
    }
    /**
     * getAssignmentsCatByOrganization
     * * Gets all the assignments categories that are associated with the
     * organization that enters in the parameter.
     * @param {number} org_id 
     * @returns {{message:string,results:[],error:boolean}} return an object 
     * with feedback and the results.
     * @throws throws and object with the feedback of the error.
     */
    getAssignmentsCatByOrganization = async (org_id) => {
        if (org_id && !isNaN(org_id)) {
            let sql = "CALL select_categories_by_org(?)";
            let res = null;
            await con.query(sql, [org_id]).then(r => { res = r }).catch(e => {
                throw { message: e.sqlMessage, error: true }
            });
            console.log("Assignments selected!!!");
            return {
                message: "Assignments selected!!!",
                results: res[0][0],
                error: false
            }
        } else
            throw { message: "Some parameters are null or empty.", error: true };
    }
    /**
     * updateAssignment
     * * Update the assignment information by the ID of the assignment.
     * @param {number} id 
     * @param {string} name 
     * @param {string} code 
     * @param {string} description 
     * @param {number} cat_id 
     * @returns {{message:string,error:boolean}} return an object 
     * with feedback and the results.
     * @throws throws an object with feedback of the error.
     */
    updateAssignment = async (id, name, code, description, cat_id) => {
        if (id && !isNaN(id), name) {
            let sql = "CALL update_assignment(?,?,?,?,?)"
            await con.query(sql, [id, name, code, description, cat_id]).then()
                .catch(e => { throw { message: sqlMessage, error: true } });
            console.log("The assignment has been updated!!!");
            return {message:"The assignment has been updated!!!",error:false};
        } else
            throw { message: "Some parameters are null or empty.", error: true };
    }
    /**
     * deleteAssignment
     * * Deletes an assignment from the database with the ID of the assignment.
     * @param {number} id 
     * @returns {{message:string,error:boolean}} returns an object with feedback
     * @throws throws an object with the feedback of the error.
     */
    deleteAssignment = async (id) => {
        if (id && !isNaN(id)) {
            let sql = "CALL delete_assignment(?)";
            await con.query(sql, [id]).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log("Assignment deleted!!!");
            return { message: "Assignment deleted!!!", error: false };
        } else
            throw { message: "Some parameters are null or empty.", error: true };
    }
    /**
     * deleteAssignmentCat
     * * Deletes an assignment category from the database with the ID of the assignment.
     * @param {number} id 
     * @returns {{message:string,error:boolean}} returns an object with feedback
     * @throws throws an object with the feedback of the error.
     */
    deleteAssignmentCat = async (id) => {
        if (id && !isNaN(id)) {
            let sql = "CALL delete_assignment_category(?)";
            await con.query(sql, [id]).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log("Assignment deleted!!!");
            return { message: "Assignment deleted!!!", error: false };
        } else
            throw { message: "Some parameters are null or empty.", error: true };
    }
}

module.exports = AssignmentEntity;