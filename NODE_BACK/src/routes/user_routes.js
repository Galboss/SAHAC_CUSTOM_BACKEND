const express = require('express');
const router = express.Router();
const model = require('../model/model');
const auth = require('../controllers/auth_controller');
const bcryptjs = require('bcryptjs');

router.post('/createUser',async(req,res)=>{
    try{
        res.status(201).json(await model.userEntity.createUser(req.body.name,
            req.body.email,req.body.password));
    }catch(e){
        console.error(e.message);
        res.status(406).json(e);
    }
});

router.post('/login',async(req,res)=>{
    try {
        const {email, password}=req.body;
        let results = await model.userEntity.validatingLogin(email,password);
        await model.tokenEntity.createNewToken(results.data.refreshToken,
            results.data.decodedAccess.exp,results.data.decodedRefresh.exp);
        res.status(200).json({
            message:"Logged successfully!!!",
            results:{accessToken:`${results.data.accessToken}`,refreshToken:`${results.data.refreshToken}`},
            error:false
        });
    } catch (e) {
        res.status(400).json(e);
    }
});

/*router.get('/getUserTest/:email',auth.verifyToken,async(req,res)=>{
    try{
        res.status(200).json(await model.userEntity.getUserByEmail(req.params.email));
    }catch(e){
        throw e;
    }
});*/

router.patch('/updateUserEmail',auth.verifyToken,async(req,res)=>{
    try {
        res.status(200).json(await model.userEntity.updateUserEmail(
            req.body.id,req.body.email));
    } catch (e) {
        console.error(e.message);
        res.status(406).json({message:e.message,error:true});
    }
});

module.exports=router;