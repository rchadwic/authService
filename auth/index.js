const express = require('express');
const passport = require('passport');
const authService = new express.Router();
const localStrategy = require("./strategies/local");
const basicStrategy = require("./strategies/basic");

var jwt = require('jsonwebtoken');

const postLogin = function postLogin(req, res, next) {
    if (req.user) {
        // why does object.assign fail here?
        let sub = JSON.parse(JSON.stringify(req.user));
        // don't send the password
        delete sub.password;
        const userToken = jwt.sign({
            sub: sub,
            iat: Date.now() + 1000 * 60 * 60 * 24, // TODO: Add to .env
        }, process.env.JWT_SECRET)

        // TODO: add to .env
        return res.cookie('rr-jwt-token', userToken).status(200).send({message:'success'});
    } else {
        next(new Error("invalid login"));
    }
}

const postLoginError = function postLoginError(err, req, res, next) {

	 res.status(401).send("Error logging in");
}

//authService.use(localStrategy, postLogin, postLoginError);
authService.use(basicStrategy, postLogin, postLoginError);

module.exports = authService;