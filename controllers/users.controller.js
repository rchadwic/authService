const userController = {};
const db = require("../config/db.js")
const uuid = require('uuid');

userController.create = function(req,res,next)
{
	const newUser = db.user.build({});
	newUser.username = req.body.username;
	newUser.setPassword(req.body.password);
	newUser.email = req.body.email;
	newUser.role = 'participant';

	newUser.save().then( (newUser) => {
		
		return res.send(newUser._id);		
	}).catch( (err) => {
		console.log(err);
	});
}

userController.delete = function(req,res,next)
{
	
}

userController.update = function(req,res,next)
{
	
}

userController.get = function(req,res,next)
{
	
}

userController.forgotPassword = function(req,res,next)
{
	db.user.findAll({email:req.body.email}).then( users => {
		let user = users[0];
		if(!user)
			return res.status(400).send("User not found");
		user.resetToken = uuid.v4();
		user.save().then( () => {
			res.status(201).send(user.resetToken)
		})
	})
}

userController.resetPassword = function(req,res,next)
{
	// TODO: there is a tiny tiny but not 0 chance of UUID collision here.
	db.user.findAll({resetToken:req.body.resetToken}).then( users => {
		let user = users[0];
		if(!user)
			return res.status(400).send("User not found");
		user.setPassword(req.body.password).then( () => {
			res.status(201).send();
		})
	})
}

module.exports = userController;