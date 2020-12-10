module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next ();
        }
        req.flash('error_msg', 'Log venligst ind for at se denne side');
        res.redirect('/users/login');
    }
}

