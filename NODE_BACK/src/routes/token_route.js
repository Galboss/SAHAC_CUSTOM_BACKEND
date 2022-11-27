const express = require('express');
const router = express.Router();
const model = require('../model/model');
const jwt = require('jsonwebtoken');

router.post('/',async(req,res)=>{
    try {
        const {refreshToken,accessToken} = req.body;
        let decoded = await jwt.verify(accessToken,model.userEntity.publicAccessKey, {
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE,
            algorithm: ['RS256']
        });
        if(!decoded)
            return res.status(403).json({message:"You must logging again.",error:true});
        else{
            let now = new Date()/1000;
            let tokenInfo = await model.tokenEntity.getToken(refreshToken);
            tokenInfo =  tokenInfo.results[0];
            if(tokenInfo){
                if(now>tokenInfo.expiration){
                    await model.tokenEntity.deleteExpiredTokens();
                    return res.status(403).json({message:"You must logging again.",error:true});
                }
                if(decoded.exp!=tokenInfo.access_expiration){
                    await model.tokenEntity.invalidateToken(refreshToken);
                    return res.status(403).json({message:"You must logging again.",error:true});
                }
                if(now>decoded.exp && now<tokenInfo.expiration){
                    let userInfo = await model.userEntity.getUserByEmail(decoded.email);
                    if(userInfo){
                        let payload={name:userInfo.name,id:userInfo.id,email:userInfo.email};
                        let newAccessToken = await jwt.sign(payload,model.userEntity.privateAccessKey,{
                            issuer: process.env.JWT_ISSUER,
                            audience: process.env.JWT_AUDIENCE,
                            algorithm: 'RS256',
                            expiresIn: `${process.env.JWT_ACCESS_EXP}`
                        });
                        let newAccessDecoded= await jwt.decode(accessToken,model.userEntity.publicAccessKey, {
                            issuer: process.env.JWT_ISSUER,
                            audience: process.env.JWT_AUDIENCE,
                            algorithm: ['RS256']
                        });
                        await model.tokenEntity.updateAccessExp(refreshToken,newAccessDecoded.exp)
                        return res.status(200).json({message:"Here is your new access token!!!",
                        data:{accessToken:newAccessToken},error:false});
                    }else{
                        await model.tokenEntity.invalidateToken(refreshToken);
                        return res.status(403).json({message:"You must logging again.",error:true});
                    }   
                }
            }else
                return res.status(403).json({message:"You must logging again.",error:true});
        }
    } catch (e) {
        res.status(400).json(e);
    }
});

module.exports=router;