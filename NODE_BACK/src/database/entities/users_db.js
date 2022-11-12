const con = require('../connection');
const crypto = require(`crypto`);
const emailRex = /^[\w\.-0-9]+@[\w\.-0-9]+\.\w{2,4}/i;
class userEntity {
    constructor() { };
    /**
     * createUser
     * 
     * * Method that create a new user in the database.
     * @param {String} name 
     * @param {String} email 
     * @param {String} password 
     * @returns {{message:string,error:boolean}} Object with feedback.
     */
    createUser = async(name, email, password) => {
        if (password && name && email) {
            if (emailRex.test(email)) {
                let sql = "CALL create_new_user(?,?,?)";
                let hash = crypto.createHmac('sha256', `${process.env.HASH_SECRET}`);
                let hashed_pass = `${hash.update(password).digest('hex')}`;
                await con.query(sql, [name, email, hashed_pass]).then().catch(e=>{
                    if(e.code="ER_DUP_ENTRY")
                        throw {message: "The email has already been taken.",error:true};
                    else
                        throw {message: e.sqlMessage,error:true};
                });
                console.log("User has been created successfully!!!");
                return { message: "User has been created successfully!!!", error: false };
            } else
                throw { message: "The email format is incorrect", error: true };
        } else {
            throw { message: "Some parameters are null or empty.", error: true };
        }
    };
    /**
     * updateUserEmail
     * *Method that allows to update email to an user in the database
     * @param {Number} id
     * @param {String} email
     * @return {{message:String,error:boolean}} Object with feedback
     */
    updateUserEmail = async(id, email) => {
        if (id && email && !isNaN(id)) {
            if (emailRex.test(email)) {
                let sql = "CALL update_user_email(?,?)";
                await con.query(sql, [id, email]).then().catch(e=>{
                    throw {message:e.message,error:true};
                });
                console.log(`Email address updated successfully!!!`);
                return { message: "Email address updated successfully!!!", error: false };
            } else
                throw { message: "The email format is incorrect", error: true };
        } else
            throw { message: "Some parameters are null or empty.", error: true };
    }
};


module.exports = userEntity;