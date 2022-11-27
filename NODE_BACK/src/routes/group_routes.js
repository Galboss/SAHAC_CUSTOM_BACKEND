const express = require('express');
const router = express.Router();
const model = require('../model/model');

router.post('/createNewGroup',async(req,res)=>{
    try{
        res.status(201).json(await model.groupEntity.createNewGroup(
            req.body.code,req.body.number,req.body.org_id,req.body.teacher_id,
            req.body.course_id));
    }catch(e){
        res.status(406).json(e);
    }
});

router.post('/createNewGroupsInQuantity',async(req,res)=>{
    try{
       res.status(201).json(await model.groupEntity.createNewGroupsInQuantity(
        req.body.code,req.body.quantity,req.body.org_id,req.body.course_id)); 
    }catch(e){
        res.json(406).json(e);
    }
});

router.get('/getGroupsByCourseId/:course_id',async(req,res)=>{
    try{
        res.status(200).json(await model.groupEntity.getGroupsByCourseId(
            req.params.course_id));
    }catch{
        res.status(400).json(e);
    }
});

router.patch('/updateGroupNumber',async(req,res)=>{
    try{
        res.status(200).json(await model.groupEntity.updateGroupNumber(
            req.body.course_id,req.body.oldNumber,req.body.newNumber));
    }catch(e){
        res.status(400).json(e);
    }
});

router.delete('/deleteGroup',async(req,res)=>{
    try{
        res.status(200).json(await model.groupEntity.deleteGroupFromCourse(
            req.body.course_id,req.body.number));
    }catch(e){
        res.status(400).json(e);
    }
});

router.delete('/deleteGroupByNumberAndCourse',async(req,res)=>{
    try{
        const {group_number,course_id}=req.body
        res.status(200).json(await model.groupEntity.deleteGroupFromCourseByNumber(
            course_id,group_number));
    }catch(e){
        res.status(400).json(e);
    }
});

module.exports=router;