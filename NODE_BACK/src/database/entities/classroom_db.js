const con = require('../connection');

class classroomEntity{
    constructor(){}
    /**
     * createNewClassrom
     * *Creates a new classroom associated to the organization
     * that enters on the parameters.
     * @param {number} number 
     * @param {string} code 
     * @param {number} org_id 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    createNewClassroom=async(number,code,org_id)=>{
        if(number&&!isNaN(number)&&org_id&&!isNaN(org_id)){
            let sql="CALL create_new_classroom(?,?,?)";
            await con.query(sql,[number,code,org_id]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Classroom created!!!");
            return {message:"Classroom created!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * getClassroomsByOrg
     * *Gets all the classrooms that are associated with 
     * the organization number that enters by parameters.
     * @param {number} org_id 
     * @returns {{message:string,results:[],error:boolean}} returns an objects with feedback and the results.
     * @throws throws an object with feedback of the error.
     */
    getClassroomsByOrg=async(org_id)=>{
        if(org_id&&isNaN(org_id)){
            let sql = "CALL select_classroom_by_org(?)";
            let res = null;
            await con.query(sql,[org_id]).then(r=>{res=r})
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Classrooms selected!!!");
            return {
                message:"Classrooms selected!!!",
                results:res[0][0],
                error:false
            };
        }else
            throw {message:"Some parameters are null or empty.",error:true}
    }
    /**
     * updateClassroom
     * *Updates classroom information like the number
     * of the classroom and the code for that classroom
     * by it's id.
     * @param {number} id 
     * @param {number} number 
     * @param {string} code 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    updateClassroom=async(id,number,code)=>{
        if(id&&!isNaN(id)){
            let sql = "CALL update_classroom_by_id(?,?,?)";
            let res = null;
            await con.query(sql,[id,number,code]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Classroom updated!!!");
            return {message:"Classroom updated!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * deleteClassroom
     * *Deletes a classroom by its id.
     * @param {number} id 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    deleteClassroom=async(id)=>{
        if(id&&!isNaN(id)){
            let sql = "CALL delete_classroom_by_id(?)"
            await con.query(sql,[id]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Classroom deleted!!!");
            return {message:"Classroom deleted!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
}

module.exports= classroomEntity;