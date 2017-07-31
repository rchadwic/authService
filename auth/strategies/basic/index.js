const express = require('express');
const localStrategyRouter = new express.Router();
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy;
const authUtils = require('../utils.js')



passport.use('basic', new BasicStrategy(authUtils.strategyCallback));

const localStrategy = function localStrategy(req, res, next) {
    
    const authFunc = passport.authenticate('basic', {
        session: false
    }, (err, user, info) => {
        authUtils.postAuth(err, user, info, req, next)
    })
    return authFunc(req, res, next);
}

localStrategyRouter.get('/basic', localStrategy);
module.exports = localStrategyRouter;