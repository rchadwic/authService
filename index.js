require('dotenv').config()

// Set up the express app
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expresSession = require('express-session');
const authService = require('./auth');
const app = express(); 
const passport = require('passport');
const userRouter = require('./routers/users.router'); 
// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(passport.initialize())
//app.use(expresSession({ secret: 'keyboard cat' , resave:false, saveUninitialized:false}));
app.use(passport.initialize());
//app.use(passport.session());
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('healthCheck', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

const API = new express.Router();
API.use('/auth',authService)
API.use("/users", userRouter);

app.use('/v1',API);
app.listen(3000) 