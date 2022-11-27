const express = require('express');
const router = express.Router();
const model = require('../model/model');

router.post('/createNewClassroom',async(req,res)=>{
    try{
        const {number,code,org_id}=req.body;
        res.status(201).json(await model.classroomEntity.createNewClassroom(
            number,code,org_id));
    }catch(e){
        res.status(406).json(e);
    }
});

router.get('/getClassroomsByOrg/:org_id',async(req,res)=>{
    try{
        res.status(200).json(await model.classroomEntity.getClassroomsByOrg(
            req.params.org_id));
    }catch(e){
        res.status(400).json(e);
    }
});

router.patch('/updateClassroom',async(req,res)=>{
    const {id,number,code} = req.body;
    try{
        res.status(200).json(await model.classroomEntity.updateClassroom(
            id,number,code));
    }catch(e){
        res.status(406).json(e);
    }
});

router.delete('/deleteClassroom',async(req,res)=>{
    try{
        res.status(201).json(await model.classroomEntity.deleteClassroom(
            req.body.id));
    }catch(e){
        res.status(406).json(e);
    }
});



module.exports = router;

