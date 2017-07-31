const request = require('request');
const should = require('should');
const uuid = require('uuid');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
require('dotenv').config();
before(() => {

    //connect to test DB. SUPER IMPORTANT
    //process.env.POSTGRES_DB = 'authTest';
    require('../index.js');

})
describe('Basic Auth', () => {

    let username = uuid.v4();
    let password = uuid.v4();
    let email = username + '@google.com';

/*    before((done) => {

    	process.env.PGDATABASE = '';
    	const connectionString = `postgres://${ process.env.POSTGRES_USER }:${ process.env.POSTGRES_PASSWORD }@${ process.env.POSTGRES_HOST }:${ process.env.POSTGRES_PORT }/`;
        console.log(connectionString);
        var client = new pg.Client(connectionString);
      
       
        client.connect().then(() =>{
        		client.query('drop database authTest if exists; create database authText;').then(done);		
        }).catch( err => {
        	done(err);
        });
    })*/
    it('should create a user', (done) => {

        request({
            uri: 'http://localhost:3000/api/v1.0/users/create',
            body: {
                username,
                email,
                password: "1111",
            },
            json: true,
            resolveWithFullResponse: true,
            method: "POST",
        }, (err, res) => {

            res.statusCode.should.equal(200);
            console.log(res.body);
            done();

        })

    })

    it('should send a token when posting a user', (done) => {

        request({
            uri: 'http://localhost:3000/api/v1.0/auth/local',
            body: {
                username: username,
                password: "1111"
            },
            json: true,
            resolveWithFullResponse: true,
            method: "POST",
        }, (err, res) => {

        	var userCookie = cookie.parse(res.headers['set-cookie'][0]);
       
        	let userToken = jwt.verify(userCookie['rr-jwt-token'],process.env.JWT_SECRET);
        	console.log(userToken);
        	userToken.sub.username.should.equal(username);
            res.statusCode.should.equal(200);
            done();

        })

    })

    it('should send a 401 when posting bad creds', (done) => {

        request({
            uri: 'http://localhost:3000/api/v1.0/auth/local',
            body: {
                username: 'test',
                password: uuid.v4()
            },
            json: true,
            resolveWithFullResponse: true,
            method: "POST",
        }, (err, res) => {

            res.statusCode.should.equal(401);
            done();

        })

    })


})