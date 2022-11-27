const con = require('../connection');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const emailRex = /^[\w\.-0-9]+@[\w\.-0-9]+\.\w{2,4}/i;
class userEntity {
    constructor() { };

    privateAccessKey = fs.readFileSync(path.resolve(__dirname, '../../keys/RSA_private_access.key'), 'utf-8');
    publicAccessKey = fs.readFileSync(path.resolve(__dirname, '../../keys/RSA_public_access.key'), 'utf-8');
    privateRefreshKey = fs.readFileSync(path.resolve(__dirname, '../../keys/RSA_private_refresh.key'), 'utf-8');
    publicRefreshKey = fs.readFileSync(path.resolve(__dirname, '../../keys/RSA_public_refresh.key'), 'utf-8');
    /**
     * createUser
     * 
     * * Method that create a new user in the database.
     * @param {String} name 
     * @param {String} email 
     * @param {String} password 
     * @returns {{message:string,error:boolean}} Object with feedback.
     */
    createUser = async (name, email, password) => {
        if (password && name && email) {
            if (emailRex.test(email)) {
                let sql = "CALL create_new_user(?,?,?)";
                let hashed_pass = await bcryptjs.hash(password, 8);
                await con.query(sql, [name, email, hashed_pass]).then().catch(e => {
                    if (e.code = "ER_DUP_ENTRY")
                        throw { message: "The email has already been taken.", error: true };
                    else
                        throw { message: e.sqlMessage, error: true };
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
     * getUserByEmail
     * * Gets all user information with its email.
     * ! This method just used to validate the logging process
     * ! Don call it on the restfull area or all user info will be leaked
     * @param {email} email 
     * @returns {{message:string,results:[],error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    getUserByEmail = async (email) => {
        if (!email)
            throw { message: "Some parameters are null or empty.", error: true };
        if (!emailRex.test(email))
            throw { message: "The email format is incorrect", error: true };
        else {
            let sql = "CALL select_user_by_email(?)";
            let res = null;
            await con.query(sql, [email]).then(r => { res = r })
                .catch(e => { throw { message: e.sqlMessage, error: true } });
            console.log("User selected!!!");
            if (res[0][0].length > 0)
                return {
                    message: "User selected!!!",
                    results: res[0][0],
                    error: false
                }
            else
                throw { message: "There no user register with that email.", error: true };
        }
    }
    /**
     * updateUserEmail
     * * Method that allows to update email 
     * to an user in the database.
     * @param {Number} id
     * @param {String} email
     * @returns {{message:string,error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    updateUserEmail = async (id, email) => {
        if (id && email && !isNaN(id)) {
            if (emailRex.test(email)) {
                let sql = "CALL update_user_email(?,?)";
                await con.query(sql, [id, email]).then().catch(e => {
                    throw { message: e.message, error: true };
                });
                console.log(`Email address updated successfully!!!`);
                return { message: "Email address updated successfully!!!", error: false };
            } else
                throw { message: "The email format is incorrect", error: true };
        } else
            throw { message: "Some parameters are null or empty.", error: true };
    }
    /**
     * validatingLogin
     * * Verifies if the password and email are correct and
     * then it give to the user and access token and a 
     * refresh token to maintain an session on the server
     * with out using memory, only hard drive.
     * @param {string} email 
     * @param {string} password 
     * @returns {{message:string,results:{},error:boolean}} returns an objects with feedback.
     * @throws throws an object with feedback of the error.
     */
    validatingLogin = async (email, password) => {
        let user = null;
        let payload = {};
        let refreshTokenReal = randToken.uid(256);
        try {
            user = (await this.getUserByEmail(email)).results[0];
            payload.id=user.user_id;
            payload.name=user.user_name;
            payload.email=user.user_email;
            let compare = bcryptjs.compareSync(password, user.user_password);
            if (!compare) {
                throw { message: "Password is incorrect.", error: true };
            } else {
                delete user.user_password;
                let accessToken = await jwt.sign(payload, this.privateAccessKey, {
                    issuer: process.env.JWT_ISSUER,
                    audience: process.env.JWT_AUDIENCE,
                    algorithm: 'RS256',
                    expiresIn: process.env.JWT_ACCESS_EXP
                });
                let decodedAccess = await jwt.decode(accessToken,this.publicAccessKey,{
                        issuer: process.env.JWT_ISSUER,
                        audience: process.env.JWT_AUDIENCE,
                        algorithm: ['RS256'],
                    });
                let refreshToken = await jwt.sign(payload,this.privateRefreshKey,{
                    issuer: process.env.JWT_ISSUER,
                    audience: process.env.JWT_AUDIENCE,
                    algorithm: 'RS256',
                    expiresIn: process.env.JWT_REFRESH_EXP
                });
                let decodedRefresh = await jwt.decode(refreshToken,this.publicRefreshKey,{
                    issuer: process.env.JWT_ISSUER,
                    audience: process.env.JWT_AUDIENCE,
                    algorithm: ['RS256'],
                });
                user.accessToken=accessToken;
                user.refreshToken=refreshTokenReal;
                user.decodedAccess = decodedAccess;
                user.decodedRefresh = decodedRefresh;
                return { message: "Logged successfully!!!", results: user, error: false };
            }
        } catch (e) {
            throw { message: e.message, error: true };
        }
    }

};

module.exports = userEntity;