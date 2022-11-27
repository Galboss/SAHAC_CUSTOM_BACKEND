const con = require ('../connection');

class lessonEntity{
    constructor(){}
    /**
     * createNewLesson
     * * Creates a new lesson that is associated with 
     * association, group and course. It have a day of
     * a week in this format (MON,TUE,WED,THU,FRY,SAT,SUN). 
     * @param {string} day 
     * @param {number} begin 
     * @param {number} end 
     * @param {number} org_id 
     * @param {number} group_id 
     * @param {number} course_id 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error. 
     */
    createNewLesson=async(day,begin,end,org_id,group_id,course_id)=>{
        if(day&&begin&&end&&org_id&&!isNaN(org_id)&&
        group_id&&!isNaN(group_id)&&course_id&&!isNaN(course_id)){
            let sql = "CALL create_new_lesson(?,?,?,?,?,?)"
            await con.query(sql,[day,begin,end,org_id,group_id,course_id])
            .then().catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Lesson created!!!");
            return {message:"Lesson created!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * selectLessonsByCourse
     * * Gets all lessons that are associated with the
     * course ID that enters by parameters.
     * @param {number} course_id 
     * @returns {{message:string,results:[],error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    selectLessonsByCourse=async(course_id)=>{
        if(course_id&&!isNaN(course_id)){
            let sql="CALL select_lessons_by_course(?)";
            let res = null;
            await con.query(sql,[course_id]).then(r=>{res=r})
            .catch(e=>{throw{message:e.sqlMessage,error:true}});
            console.log("Lessons selected!!!");
            return {
                message:"Lessons selected!!!",
                results:res[0][0],
                error:false
            }
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * updateLessonsHour
     * * Updates a lesson hours of begin and ends by
     * it's id.
     * @param {number} id 
     * @param {number} begin 
     * @param {number} end 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    updateLessonHours=async(id,begin,end)=>{
        if(id&&!isNaN(id)&&begin&&end){
            let sql="CALL update_lesson_hours(?,?,?)";
            await con.query(sql,[id,begin,end]).then()
            .catch(e=>{throw {message:sqlMessage,error:true}});
            console.log("Lesson updated!!!");
            return {message:"Lesson update!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * deleteLesson
     * * Deletes a lesson by its id.
     * @param {number} id 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    deleteLesson=async(id)=>{
        if(id&&!isNaN(id)){
            let sql = "CALL delete_lesson_by_id(?)";
            await con.query(sql,[id]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Lesson deleted!!!");
            return {message:"Lesson deleted!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
}

module.exports=lessonEntity;