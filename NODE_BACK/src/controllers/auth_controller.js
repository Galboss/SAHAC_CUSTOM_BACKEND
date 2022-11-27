const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userEntity = require('../model/model').userEntity;
const crypto = require('crypto');
const verifyToken = router;

verifyToken.use(async (req, res, next) => {
    try {
        const bearerHeaders = req.headers['authorization'] || req.headers['x-access-token'];
        if (bearerHeaders) {
            const bearerToken = bearerHeaders.split(" ")[1];

            let legit = await jwt.verify(bearerToken, userEntity.publicAccessKey, {
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_audience,
                algorithm: ['RS256'],
                expiresIn: `${process.env.JWT_ACCESS_EXP}`
            });
            next();
        }  else
            res.status(406).json({ message: "You have to login first to access this content.", error: true });
        }catch (e) {
            res.status(403).json({ message: "You have to login first to access this content.", error: true });
            console.log(e.message);
        }
});

module.exports = {
    verifyToken
}