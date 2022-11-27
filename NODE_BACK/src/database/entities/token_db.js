const con = require('../connection');

class tokenEntity{
    constructor (){};
    /**
     * createNewToken
     * * Creates a new token and stores on the database
     * to validate that session on the server.
     * @param {string} refresh_token 
     * @param {number} acc_exp 
     * @param {number} exp 
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of error.
     */
    createNewToken=async (refresh_token,acc_exp,exp)=>{
        if(refresh_token,acc_exp,exp){
            let sql = "CALL create_new_refresh_token(?,?,?)";
            await con.query(sql,[refresh_token,acc_exp,exp]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Token saved");
            return {message:"Token saved",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true}
    }
    /**
     * getToken
     * * Gets all the information associated with that token
     * @param {string} refresh_token 
     * @returns {{message:string,results[],error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of error.
     */
    getToken=async(refresh_token)=>{
        if(refresh_token){
            let sql = "CALL select_token(?)";
            let res = null;
            await con.query(sql,[refresh_token]).then(r=>{res=r})
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            return{results : res[0][0]};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /*
    updateToken=async(refresh_token,acc_exp,exp)=>{
        if(refresh_token,new_refresh_token,acc_exp,exp){
            let sql = "CALL update_token(?,?,?)";
            await con.query(sql,[refresh_token,acc_exp,exp]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Token updated!!!");
            return {message: "Token updated!!!",error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }*/
    /**
     * invalidateToken
     * * Invalidates a token that enters by parameters
     * @param {string} refresh_token 
     * @throws throws an object with feedback of error.
     */
    invalidateToken = async (refresh_token)=>{
        if(refresh_token){
            let sql = "CALL invalidate_token(?)";
            await con.query(sql,[refresh_token]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Token Deleted");
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
    /**
     * deleteExpiredTokens
     * * Deletes all the tokens that are expired
     * @throws throws an object with feedback of error.
     */
    deleteExpiredTokens = async ()=>{
        let sql = "CALL delete_expired_tokens()"
        await con.query(sql,[]).then()
        .catch(e=>{throw {message:e.sqlMessage,error:true}});
        console.log("Token expired has been deleted from the database");
    }
    /**
     * updateAccessEXP
     * * Update accessEXP to the token refresh
     * @param {string} token 
     * @param {number} accessExp 
     * @throws throws an object with feedback of error.
     */
    updateAccessExp=async(token,accessExp)=>{
        if(token&&accessExp&&!isNaN(accessExp)){
            let sql = "CALL update_access_expiration(?,?)";
            await con.query(sql,[token,accessExp]).then()
            .catch(e=>{throw {message:e.sqlMessage,error:true}});
            console.log("Access expiration updated!!!");
            return {message:"Access expiration updated!!!", error:false};
        }else
            throw {message:"Some parameters are null or empty.",error:true};
    }
}

module.exports = tokenEntity;