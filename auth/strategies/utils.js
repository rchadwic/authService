const db = require('../../config/db.js')

const postAuth = function postAuth(err, user, info, req , next) {
   	console.log("postauth")
    if (err) {
        return next(err);
    }
    if (!user) {
        return next(info);
    }
    req.user = user;
    return next();
}


const strategyCallback = function strategyCallback(username, password, done) {

	
    db.user.findAll({
        where: {
            username
        }
    }).then(users => {
        if (users[0] && users[0].testPassword(password)) {
            done(null, users[0])
        } else {
            done(null, null, {
                message: 'incorrect login'
            });
        }
    })
}

module.exports.postAuth = postAuth;
module.exports.strategyCallback = strategyCallback;