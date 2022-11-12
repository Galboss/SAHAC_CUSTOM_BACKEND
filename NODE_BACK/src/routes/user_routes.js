const express = require('express');
const router = express.Router();
const model = require('../model/model');

router.post('/createUser',async(req,res)=>{
    try{
        res.status(201).json(await model.userEntity.createUser(req.body.name,
            req.body.email,req.body.password));
    }catch(e){
        console.error(e.message);
        res.status(406).json(e);
    }
});

router.patch('/updateUserEmail',async(req,res)=>{
    try {
        res.status(200).json(await model.userEntity.updateUserEmail(
            req.body.id,req.body.email));
    } catch (e) {
        console.error(e.message);
        res.status(406).json({message:e.message,error:true});
    }
})

module.exports=router;