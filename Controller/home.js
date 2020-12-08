//Først anskaffer vi de modules vi skal bruge til at danne vores routes
const express = require('express');
const router = express.Router();


//sætter express til at fungere ved brug af app

//Routes fra home side til de andre sider

//route fra home til swipe, bruger render til at videresende et dokument der skal fremvises, her swipe.ejs
router.get('/swipe', (req, res) => res.render('swipe'))

//route fra home til matches, bruger render til at videresende et dokument der skal fremvises, her matches.ejs
router.get('/matches', (req, res) => res.render('matches'))


//route fra home til profile, bruger render til at videresende et dokument der skal fremvises, her profile.ejs
router.get('/profile', (req, res) => res.render('profile'))

module.exports = router;