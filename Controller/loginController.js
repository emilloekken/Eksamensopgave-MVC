const express = require('express');

const router = express.Router();

const { ensureAuthenticated } = require('../Authentication/login');

//dette er siden når man er kommet ind
router.get('/', (req, res) => res.render('Velkommen til'));

//home siden når man er kommet ind
router.get('/home', ensureAuthenticated, (req, res) => 
res.render('home', {
    name: req.user.name
}));



module.exports = router;