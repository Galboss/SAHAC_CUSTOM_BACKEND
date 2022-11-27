const con = require('../connection');

class teacherEntity {
    constructor(){}
    /**
     * createNewTeacher
     * * Creates a new teacher associated with the organization
     * id that enters by parameters.
     * @param {string} name 
     * @param {string} email 
     * @param {number} load 
     * @param {string} phone 
     * @param {number} org_id 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    createNewTeacher=async(name,email,load,phone,org_id)=>{
        if(name&&email&&load&&!isNaN(load)&&org_id&&!isNaN(org_id)){
            let sql = "CALL create_new_teacher(?,?,?,?,?)";
            await con.query(sql,[name,email,load,phone,org_id]).then()
            .catch(e=>{throw {message:sqlMessage,error:true}});
            console.log("Teacher created!!!");
            return {message:"Teacher created!!!",error:false};
        }else{
            throw {message:"Some parameters are null or empty.",error:true};
        }
    }
    /**
     * selectTeacherByOrg
     * * Gets all the teachers that are associated with
     * the organization id that enters by parameter.
     * @param {number} org_id 
     * @returns {{message:string,results:[],error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    selectTeacherByOrg=async(org_id)=>{
        if(org_id&&!isNaN(org_id)){
            let sql = "CALL select_teacher_by_organization(?)"
            let res=null;
            await con.query(sql,[org_id]).then(r=>{res=r})
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Teachers selected!!!");
            return{
                message: "Teacher selected!!!",
                results: res[0][0],
                error:false
            }
        }else
            throw {message:"Some parameters are null or empty", error:true};
    }
    /**
     * updateTeacherById
     * * Updates teacher's information by it's id.
     * @param {number} id 
     * @param {string} name 
     * @param {string} email 
     * @param {number} load 
     * @param {string} phone 
     * @param {number} org_id 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    updateTeacherById=async(id,name,email,load,phone,org_id)=>{
        if(id&&!isNaN(id)&&name&&email&&load
        &&!isNaN(load)&&org_id&&!isNaN(org_id)){
            let sql = "CALL update_teacher_by_id(?,?,?,?,?,?)"
            await con.query(sql,[id,name,email,load,phone,org_id])
            .then().catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Teacher information updated!!!");
            return {message:"Teacher information updated!!!",error:false}
        }else{
            throw {message:"Some parameters are null or empty.",error:true};
        }
    }
    /**
     * deleteTeacherById
     * * Delete a teacher by it's id.
     * @param {number} id 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    deleteTeacherByID=async(id)=>{
        if(id&&!isNaN(id)){
            let sql="CALL delete_teacher_by_id(?)";
            await con.query(sql,[id]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Teacher deleted!!!");
            return {message:'Teacher deleted!!!',error:true};
        }else
            throw {message:"Some parameters are null or empty.",error:true}
    }
}

module.exports = teacherEntity;