const con = require('../connection');

class coursesEntities{
    constructor(){};
    /**
     * createNewCourse
     * * Create a new course in the database associated 
     * with the organization that goes in th parameters.
     * @param {string} name 
     * @param {string} code 
     * @param {number} org_id 
     * @param {number} assign_id 
     * @returns {{message:string,error:boolean}} returns an object with feedback
     * @throws throws an object with feedback of the error.
     */
    createNewCourse=async(name,code,org_id,assign_id)=>{
        if(name&&org_id&&!isNaN(org_id)&&assign_id&&!isNaN(assign_id)){
            let sql="CALL create_new_course(?,?,?,?)";
            await con.query(sql,[name,code,org_id,assign_id]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Course created!!!");
            return {message:"Course created!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty!!!", error:true};
    }
    /**
     * getCoursesByOrganization
     * * Gets all the courses that are associated with the organization that
     * enters by parameters.
     * @param {number} org_id 
     * @returns {{message:string,results:[],error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    getCoursesByOrganization=async(org_id)=>{
        if(org_id&&!isNaN(org_id)){
            let sql="CALL select_courses_by_organization(?)";
            let res = null;
            await con.query(sql,[org_id]).then(r=>{res=r})
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Courses selected!!!");
            return {message:"Courses selected!!!",results:res[0][0],error:false};
        }else
            throw {message:"Some parameters are null or empty",error:true};
    }
    /**
     * getCoursesByOrgAndAssign
     * * Gets all the courses that are associated with the organization that
     * enters by parameters.
     * @param {number} org_id 
     * @returns {{message:string,results:[],error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
     getCoursesByOrgAndAssign=async(org_id,assign_id)=>{
        if(org_id&&!isNaN(org_id)&&assign_id&&!isNaN(assign_id)){
            let sql="CALL select_courses_by_org_and_assignment(?,?)";
            let res = null;
            await con.query(sql,[org_id,assign_id]).then(r=>{res=r})
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Courses selected!!!");
            return {message:"Courses selected!!!",results:res[0][0],error:false};
        }else
            throw {message:"Some parameters are null or empty",error:true};
    }
    /**
     * updateCourse
     * * Update the data of a course given the id of the course
     * @param {number} id 
     * @param {string} name 
     * @param {string} code 
     * @param {number} org_id 
     * @param {number} assign_id 
     * @returns {{message:string,error:boolean}} returns an object with feedback.
     * @throws throws an object with feedback of the error.
     */
    updateCourse=async(id,name,code,org_id,assign_id)=>{
        if(id&&!isNaN(id),name&&org_id&&!isNaN(org_id)&&assign_id&&!isNaN(assign_id)){
            let sql="CALL update_course(?,?,?,?,?)";
            await con.query(sql,[id,name,code,org_id,assign_id]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log(`${id} course has been updated!!!`);
            return {message:"Course has been updated!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * deleteCourseById
     * * Deletes a course from de database given the id of the course.
     * @param {number} id 
     * @returns {{message:string,error:boolean}} returns an object with feedback.
     * @throws throws and object with feedback of the error.
     */
    deleteCourseById=async(id)=>{
        if(id&&!isNaN(id)){
            let sql = "CALL delete_course_by_id(?)"
            await con.query(sql,[id]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log(`Course deleted. ID: ${id}`);
            return {message:`Course deleted. ID: ${id}`,error:false};
        }else
            throw {message:"Some parameters are null or empty",error:true};
    }
}

module.exports=coursesEntities;