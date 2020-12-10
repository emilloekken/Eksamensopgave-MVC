const express = require('express');

const router = express.Router();

const { ensureAuthenticated } = require('../authentication/login');

//Her bruger vi ensureAuthenticated, til at tjekke om brugeren er verificeret til at se home siden, hvis han er det, bliver han redirected derhen
router.get('/home', ensureAuthenticated, (req, res) => 
res.render('home', {
    name: req.user.name
}));



module.exports = router;