const express = require('express');
const router = express.Router();
const model = require('../model/model');

router.post('/createNewTeacher',async(req,res)=>{
    try{
        res.status(201).json( await model.teacherEntity.createNewTeacher(
            req.body.name,req.body.email,req.body.load,
            req.body.phone,req.body.org_id));
    }catch(e){
        res.status(406).json(e);
    }
});

router.get('/getTeachersByOrg/:org_id',async(req,res)=>{
    try{
        res.status(200).json(await model.teacherEntity
            .selectTeacherByOrg(req.params.org_id));
    }catch(e){
        res.status(400).json(e);
    }
});

router.patch('/updateTeacherById',async(req,res)=>{
    try{
        res.status(200).json(await model.teacherEntity.updateTeacherById(
            req.body.id,req.body.name,req.body.email,
            req.body.phone,req.body.org_id));
    }catch(e){
        res.status(406).json(e);
    }
});

router.delete('/deleteTeacherById',async(req,res)=>{
    try{
        res.status(200).json(await model.teacherEntity.deleteTeacherByID(
            req.body.id));
    }catch(e){
        res.status(400).json(e);
    }
});

module.exports = router;