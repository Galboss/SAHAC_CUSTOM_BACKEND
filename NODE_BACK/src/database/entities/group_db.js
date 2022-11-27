const con = require('../connection');

class groupEntity{
    constructor(){}
    /**
     * createNewGroup
     * * Creates a new group in the database
     * associated with an organization and course.
     * @param {string} code 
     * @param {number} number 
     * @param {number} org_id 
     * @param {number} teacher_id 
     * @param {number} course_id 
     * @returns {{message:string,error:boolean}} returns an object with feedback.
     * @throws throws an object with feedback of the error.
     */
    createNewGroup=async(code,number,org_id,teacher_id,course_id)=>{
        if(number&&!isNaN(number)&&org_id
        &&!isNaN(org_id)&&course_id&&!isNaN(course_id)){
            let sql=`CALL create_new_group(?,?,?,?,?)`
            await con.query(sql,[code,number,org_id,teacher_id,course_id])
            .then().catch(e=>{throw {message:e.sqlMessage,error:true}})
            console.log('Group created!!!');
            return {message:"Group created!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * createNewGroupsInQuantity
     * * Create a large quantity of groups associated with 
     * the organization and course that enters by parameters.
     * @param {string} code 
     * @param {number} quantity 
     * @param {number} org_id 
     * @param {number} course_id 
     * @returns {{message:string,error:boolean}} returns an object with feedback.
     * @throws throws an object with feedback of the error.
     */
    createNewGroupsInQuantity=async(code,quantity,org_id,course_id)=>{
        if(quantity&&!isNaN(quantity)&&quantity>=1&&org_id
        &&!isNaN(org_id)&&course_id&&!isNaN(course_id)){
            let sql="CALL create_new_groups_by_quantity(?,?,?,?)"
            await con.query(sql,[code,quantity,org_id,course_id])
            .then().catch(e=>{throw{message:e.sqlMessage,error:true}})
            console.log(`${quantity} groups created!!!`);
            return {message:`${quantity} groups created!!!`,error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * getGroupsByCourseId
     * * Get all the groups that are associated with that course id.
     * @param {number} course_id 
     * @returns {{message:string,results:[],error:boolean}} returns an object 
     * with feedback and the results of the consult.
     * @throws throws an object with feedback of the error.
     */
    getGroupsByCourseId=async(course_id)=>{
        if(course_id&&!isNaN(course_id)){
            let sql = "CALL select_groups_by_course_id(?)";
            let res=null;
            await con.query(sql,[course_id]).then(r=>{res=r})
            .catch(e=>{throw {message:sqlMessage,error:true}});
            console.log("Groups selected!!!");
            return {
                message: "Groups selected!!!",
                results:res[0][0],
                error:false
            }
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * updateGroupNumber
     * * Update a group number
     * with another number that is not in use.
     * @param {number} course_id 
     * @param {number} oldNumber 
     * @param {number} newNumber 
     * @returns {{message:string,error:boolean}} returns an object with feedback
     * @throws throws an object with feedback of the error.
     */
    updateGroupNumber=async(course_id,oldNumber,newNumber)=>{
        if(course_id&&!isNaN(course_id)&&oldNumber
        &&!isNaN(oldNumber)&&newNumber&&!isNaN(newNumber)){
            let sql = "CALL update_group_number(?,?,?)";
            await con.query(sql,[course_id,oldNumber,newNumber]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log(`Group ${oldNumber} is now Group ${newNumber}`);
            return {message:`Group ${oldNumber} is now Group ${newNumber}`,error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * deleteGroupFromCourse
     * * Deletes a group that is associate with 
     * the course id that enters by parameters
     * @param {number} course_id 
     * @param {number} number 
     * @returns {{message:string,error:boolean}} return an object with feedback.
     * @throws throws and object with feedback of the error.
     */
    deleteGroupFromCourse=async(course_id,number)=>{
        if(course_id&&!isNaN(course_id)&&number&&!isNaN(number)){
            let sql="CALL delete_a_group_from_course_by_id(?,?)";
            await con.query(sql,[course_id,number]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Group deleted!!!");
            return {message:`Group ${number} has been deleted!!!`,error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * deleteGroupFromCourseByNumber
     * * Deletes a group by its number and update all
     * other groups if the deleted group is on the middle.
     * @param {number} course_id 
     * @param {number} group_number 
     * @returns {{message:string,error:boolean}} return an object with feedback.
     * @throws throws and object with feedback of the error.
     */
    deleteGroupFromCourseByNumber=async(course_id,group_number)=>{
        if(course_id&&group_number
            &&!isNaN(group_number)&&!isNaN(course_id)){
            let sql = "CALL delete_group_by_number(?,?)";
            await con.query(sql,[course_id,group_number]).then()
            .catch(e=>{throw {message:""}});
            return {message:"Group deleted and others updated!!!",error:true};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }

}

module.exports=groupEntity;