const express = require('express');
const router = express.Router();
const model = require('../model/model');

router.post('/createNewCourse',async(req,res)=>{
    try {
        res.status(201).json(await model.courseEntity.createNewCourse(
            req.body.name,req.body.code,req.body.org_id, req.body.assign_id));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.get('/getCoursesByOrg/:org_id',async(req,res)=>{
    try {
        res.status(200).json(await model.courseEntity.getCoursesByOrganization(
            req.params.org_id));
    } catch (e) {
        res.status(400).json(e);
    }
});

router.get('/getCoursesByOrgAndAssign/:org_id/:assign_id',async(req,res)=>{
    try {
        res.status(200).json(await model.courseEntity.getCoursesByOrgAndAssign(
            req.params.org_id,req.params.assign_id));
    } catch (e) {
        res.status(400).json(e);
    }
});

router.patch('/updateCourse',async(req,res)=>{
    try{
        res.status(200).json(await model.courseEntity.updateCourse(
            req.body.id,req.body.name,req.body.code,req.body.org_id,req.body.assign_id));
    }catch(e){
        res.status(406).json(e);
    }
});

router.delete('/deleteCourseById',async(req,res)=>{
    try {
        res.status(200).json(await model.courseEntity.deleteCourseById(
            req.body.id));
    } catch (e) {
        res.status(400).json(e);
    }
});

module.exports = router;