const express = require('express');
const localStrategyRouter = new express.Router();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const db = require("../../../config/db.js")

passport.use('local', new LocalStrategy(function(username, password, done) {
   
   	db.user.findAll({
   		where:{
   			username
   		}
   	}).then( users => {	   		
	    if(users[0] && users[0].testPassword(password))
	    {
	    	done(null,users[0])
	    }else
	    {
	    	done(null,null,{message:"incorrect login"});
	    }
   	})
}));

const localStrategy = function localStrategy(req, res, next) {
    const authFunc = passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(info);
        }
        req.user = user;
        return next();
    })
    return authFunc(req, res, next);
}

localStrategyRouter.post('/local', localStrategy);
module.exports = localStrategyRouter;