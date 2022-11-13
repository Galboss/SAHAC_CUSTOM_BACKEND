const express = require('express');
const router = express.Router();
const model = require('../model/model')

router.post('/createNewAssignment',async(req,res)=>{
    try{
        res.status(201).json(await model.assignmentEntity.createNewAssignment(
            req.body.code,req.body.name,req.body.description,req.body.org_id,
            req.body.cat_id));  
    }catch(e){
        res.status(406).json(e);
    }
});

router.post('/createNewAssignmentCat',async(req,res)=>{
    try{
        res.status(201).json(await model.assignmentEntity.createNewAssignmentCategory(
            req.body.name,req.body.description,req.body.parentId,req.body.org_id));  
    }catch(e){
        res.status(406).json(e);
    }
});

router.get('/getAssignmentsByOrganization/:org_id',async(req,res)=>{
    try{
        res.status(200).json(await model.assignmentEntity.getAssignmentsByOrganization(
            req.params.org_id));
    }catch(e){
        res.status(400).json(e);
    }
});

router.get('/getAssignmentsCatByOrganization/:org_id',async(req,res)=>{
    try{
        res.status(200).json(await model.assignmentEntity.getAssignmentsCatByOrganization(
            req.params.org_id));
    }catch(e){
        res.status(400).json(e);
    }
});

router.patch('/updateAssignment',async(req,res)=>{
    try{
        res.status(200).json(await model.assignmentEntity.updateAssignment(
            req.body.id,req.body.name,req.body.code,req.body.description,
            req.body.cat_id));
    }catch(e){
        res.status(406).json(e);
    }
});

router.delete('/deleteAssignment',async(req,res)=>{
    try{
        res.status(200).json(await model.assignmentEntity.deleteAssignment(
            req.body.id));
    }catch(e){
        res.status(400).json(e);
    }
});

router.delete('/deleteAssignmentCat',async(req,res)=>{
    try{
        res.status(200).json(await model.assignmentEntity.deleteAssignmentCat(
            req.body.id));
    }catch(e){
        res.status(400).json(e);
    }
});

module.exports=router;
