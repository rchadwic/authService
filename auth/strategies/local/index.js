const express = require('express');
const localStrategyRouter = new express.Router();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const authUtils = require('../utils.js')


passport.use('local', new LocalStrategy(authUtils.strategyCallback));

const localStrategy = function localStrategy(req, res, next) {
    
    const authFunc = passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        authUtils.postAuth(err, user, info, req, next)
    })
    return authFunc(req, res, next);
}

localStrategyRouter.post('/local', localStrategy);
module.exports = localStrategyRouter;