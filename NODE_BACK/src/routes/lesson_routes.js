const express = require('express');
const router = express.Router();
const model = require('../model/model');

router.post('/createNewLesson', async (req, res) => {
    try {
        const {day,begin,end,org_id,group_id,course_id}=req.body;
        res.status(201).json(await model.lessonEntity.createNewLesson(
            day,begin,end,org_id,group_id,course_id));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.get("getLessonsByCourse/:course_id",async(req,res)=>{
    try {
        res.status(200).json(await model.lessonEntity.selectLessonsByCourse(
            req.params.course_id));
    } catch (e) {
        res.status(400).json(e);
    }
});

router.patch("updateLessonHours",async(req,res)=>{
    try {
        res.status(200).json(await model.lessonEntity.updateLessonHours(
            req.body.id,req.body.begin,req.body.end));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.delete('/deleteLesson',async(req,res)=>{
    try {
        res.status(200).json(await model.lessonEntity.deleteLesson(
            req.body.id));
    } catch (e) {
        res.status(400).json(e);
    }
});

module.exports = router;