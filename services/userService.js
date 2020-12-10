const User = require('../model/User');


function deleteUserByEmail(email){
    return User.findOneAndDelete({email: email});
}



module.exports = {
    deleteUserByEmail
}