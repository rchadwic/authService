const express = require('express');
const basicStrategyRouter = new express.Router();
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy;

const db = require("../../../config/db.js")

passport.use('basic', new BasicStrategy(function(username, password, done) {
   
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

const basicStrategy = function basicStrategy(req, res, next) {
    const authFunc = passport.authenticate('basic', {
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

basicStrategyRouter.get('/basic', basicStrategy);
module.exports = basicStrategyRouter;