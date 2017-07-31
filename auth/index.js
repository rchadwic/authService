const express = require('express');
const passport = require('passport');
const authService = new express.Router();
const localStrategy = require('./strategies/local');
const basicStrategy = require('./strategies/basic');

const jwt = require('jsonwebtoken');

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
        let tokenResponse = {
            'access_token': userToken,
            'token_type': "Bearer",
            "expires_in": 1000 * 60 * 60 * 24,
        }

        return res.cookie('rr-jwt-token', userToken).status(200).send(tokenResponse);
    } else {
        next();
    }
}

const postLoginError = function postLoginError(err, req, res, next) {

    console.error(err)
    res.status(401).send("Error logging in");
}

authService.use(localStrategy, postLogin, postLoginError);
authService.use(basicStrategy, postLogin, postLoginError);

module.exports = authService;