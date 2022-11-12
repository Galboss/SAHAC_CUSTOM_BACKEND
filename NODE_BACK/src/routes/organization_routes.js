const express = require('express');
const router = express.Router();
const model = require('../model/model');

router.post('/createOrganizationWithName',async(req,res)=>{
    try {
        res.status(201).json(await model.organizationEntity.createOrganizationWithName(
            req.body.name, req.body.user_id));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.post('/addUserAdminToOrg',async(req,res)=>{
    try{
        res.status(201).json(await model.organizationEntity.addUserAdminToOrganization(
            req.body.org_id,req.body.user_id));
    }catch (e){
        res.status(406).json(e);
    }
});

router.post('/addUserPendingToOrg',async(req,res)=>{
    try {
        res.status(201).json(await model.organizationEntity.addUserPendingToOrganization(
            req.body.org_id,req.body.user_id));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.patch('/updateOrgName',async(req,res)=>{
    try {
        res.status(200).json(await model.organizationEntity.updateOrganizationName(
            req.body.org_id,req.body.name));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.patch('/updateUserRolOrg',async(req,res)=>{
    try {
        res.status(200).json(await model.organizationEntity.updateUserRolOrganization(
            req.body.user_id,req.body.org_id,req.body.rol));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.get('/getUsersByOrg/:org_id',async(req,res)=>{
    try {
        res.status(200).json(await model.organizationEntity.selectUsersByOrganization(
            req.params.org_id));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.get('/getUsersPending/:org_id',async(req,res)=>{
    try {
        res.status(200).json(await model.organizationEntity.selectUsersPendingByOrganization(
            req.params.org_id));
    } catch (e) {
        res.status(406).json(e);
    }
});

router.delete('/',async(req,res)=>{
    try{
        res.status(200).json(await model.organizationEntity.deleteOrganization(
            req.body.org_id));
    }catch(e){
        res.status(406).json(e);
    }
});

module.exports=router;