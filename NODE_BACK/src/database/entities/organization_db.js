const con = require('../connection');
class organizationEntity {
    constructor() { };
    /**
     * createOrganizationWithName
     * * Creates a new organization linked with an existen user and
     * its rol set to an admin.
     * @param {String} org_name Organization Name
     * @param {Number} user_id 
     * @returns {{message:string,error:boolean}} returns an object with feedback.
     */
    createOrganizationWithName = async (org_name, user_id) => {
        if (org_name && user_id && !isNaN(user_id)) {
            let sql = `CALL create_organization_users_organization(?,?)`;
            await con.query(sql, [org_name, user_id]).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log(`${org_name} created successfully!!!`);
            return { message: "Organization created successfully!!!", error: false };
        } else
            throw { message: "Some parameters are empty or null", error: true };
    };
    /**
     * addUserAdminToOrganization
     * * Add a user to the organization with the rol set to admin.
     * @param {Number} org_id 
     * @param {Number} user_id 
     * @returns {{message:String,error:boolean}} returns an object with feedback
     */
    addUserAdminToOrganization = async (org_id, user_id) => {
        if (org_id && user_id && !isNaN(org_id) && !isNaN(user_id)) {
            let sql = "CALL create_organization_user_admin(?,?)"
            await con.query(sql, [org_id, user_id]).then().catch(e => {
                throw { message: sqlMessage, error: true };
            });
            console.log(`ID:${user_id} User Associated as an admin!!!`);
            return { message: "User Associated as an admin!!!", error: false }
        } else
            throw { message: "Some parameters are empty or null", error: true };
    };
    /**
     * addUserPendingToOrganization
     * * Add a user to the wait list of an organization.
     * @param {Number} org_id 
     * @param {Number} user_id 
     * @returns {{message:String,error:boolean}} returns an object with feedback
     */
    addUserPendingToOrganization = async (org_id, user_id) => {
        if (org_id && user_id && !isNaN(org_id) && !isNaN(user_id)) {
            let sql = "CALL create_organization_user_pending(?,?)"
            await con.query(sql, [org_id, user_id]).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log("User associated as pending to accepted!!!");
            return { message: "User associated as pending to be accepted!!!", error: false };
        } else
            throw { message: "Some parameters are empty or null", error: true };
    };
    /**
     * updateOrganizationName
     * * Method that update the organization name by
     * the Id of the organization
     * @param {Number} id 
     * @param {String} name 
     * @returns {{message:String,error:boolean}} returns an object with feedback
     */
    updateOrganizationName = async (id, name) => {
        if (id && name && !isNaN(id)) {
            let sql = "CALL update_organization_name(?,?)";
            await con.query(sql, [id, name]).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log("Organization name updated!!!");
            return { message: "Organization name has been updated!!!", error: false };
        } else
            return { message: "Some parameters are empty or null!!!", error: true };
    };
    /**
     * updateUserRolOrganization
     * * Update the rol of a user in one organization by 
     * the ID of the user and the ID of the organization.
     * @param {Number} user_id 
     * @param {Number} org_id 
     * @param {Number} rol 
     * @returns {{message:String,error:boolean}} returns an object with feedback.
     */
    updateUserRolOrganization = async (user_id, org_id, rol) => {
        if (user_id && org_id && rol && !isNaN(user_id) && !isNaN(org_id) && !isNaN(rol)) {
            let sql = "CALL update_organization_user_rol(?,?,?)";
            await con.query(sql, [user_id, org_id, rol]).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log("The rol of the user have been updated!!!");
            return { message: "The rol of the user has been updated!!!", error: false };
        } else
            return { message: "Some parameters are empty or null!!!", error: true };
    }
    /**
     * deleteOrganization
     * * Delete an organization on the database by an ID if exist.
     * @param {Number} id 
     * @returns {{message:String,error:boolean}} returns an object with feedback.
     */
    deleteOrganization = async (id) => {
        if (id && !isNaN(id)) {
            let sql = "CALL delete_organization(?)";
            await con.query(sql, id).then().catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            console.log("The organization has been deleted!!!");
            return { message: "The organization has been deleted!!!", error: false };
        } else
            return { message: "Some parameters are empty or null!!!", error: true };
    };
    /**
     * selectUsersByOrganization
     * 
     * * Select all the users that are linked to that organization.
     * @param {Number} org_id 
     * @returns {{message:string,results:[],error:boolean}} Contains feedback 
     * and the response of the database
     */
    selectUsersByOrganization = async (org_id) => {
        if (org_id && !isNaN(org_id)) {
            let sql = "CALL select_users_by_organization(?)";
            let resp = null;
            await con.query(sql, org_id).then(r => { resp = r }).catch(e => {
                throw { message: e.sqlMessage, error: true };
            });
            return {
                message: "Users selected Successfully!!!",
                results: resp[0][0],
                error:false
            };
        } else
            return { message: "Some parameters are empty or null!!!",error:true };
    }
    /**
     * selectUsersPendingByOrganization
     * * Select all the users that are pending on the organization 
     * to be accepted.
     * @param {Number} org_id 
     * @returns {{message:string,results:[],error:boolean}} return an object with 
     * the results and feedback.
     */
    selectUsersPendingByOrganization = async (org_id) => {
        if (org_id && !isNaN(org_id)) {
            let sql = "CALL select_users_pending_by_organization(?)";
            let resp;
            await con.query(sql, [org_id]).then( results => {resp = results }).catch(e=>{
                throw {message:e.sqlMessage,error:true}
            });
            return {
                message: "Users selected successfully!!!",
                results: resp[0][0],
                error:false
            };
        } else
            throw { message: "Some parameters are empty or null!!!", error:true };
    }
};

module.exports = organizationEntity;