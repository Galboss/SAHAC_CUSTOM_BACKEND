const organizationEntity = require('../database/entities/organization_db');
const userEntity = require("../database/entities/users_db");

const model = {
    userEntity: new userEntity(),
    organizationEntity: new organizationEntity(),
}

const test = async() => {
    try{
        console.log(await userEntityObj.createUser("Pep3", "", "Hola15"));
    }catch(err){
        if(err.code=='ER_DUP_ENTRY')
        console.log({message:"The email address has been already taken.",error:true})
    }
   
    //userEntityObj.createUser("Pep3", "pepo@gmail.com", "Hola15");
    //userEntityObj.createUser("Mepo", "mepo@gmail.com", "Adios14");
}

module.exports = model