const Sequelize = require('sequelize');
const uuid = require('uuid');
const crypto = require('crypto');
module.exports = (sequelize) => {
    let userModel = sequelize.define('user', {
        username: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING(512),
        salt: Sequelize.STRING,
        role: {
            type: Sequelize.ENUM('admin', 'participant', 'clinician', 'import'),
            allowNull: false,
        },
        resetToken: Sequelize.String
    });
    userModel.prototype.setPassword = function setPassword(newPassword)
    {
    	return new Promise( (resolve,reject) => {
    		this.salt = uuid.v4();
    		
    		this.password = crypto.pbkdf2Sync(newPassword, Buffer.from(this.salt), 100000, 128, 'sha256').toString('hex');
    		this.save( (err) => 
    		{
    			if(err) reject(err);
    			resolve();
    		})
    	});
    }
    userModel.prototype.testPassword = function testPassword(testPassword)
    {
    	return crypto.pbkdf2Sync(testPassword, Buffer.from(this.salt), 100000, 128, 'sha256').toString('hex') === this.password;
    }
    return userModel;
}