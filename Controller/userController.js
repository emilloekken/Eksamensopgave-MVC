const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../model/User');

var session = require('express-session');
const { deleteUserByEmail } = require('../services/userService');
const { update } = require('../model/User');



//Login page
router.get('/login', (req, res) => res.render('Login'));

router.use(session({secret: "Dette er ekstremt hemmeligt!!"}));

//Registerpage
router.get('/register', (req, res) => res.render('Register'));

router.get('/profile', (req, res) => res.render('Profile', {deleteUser: deleteUser, email: req.session.email}))

// Registrering, får submit af register profil i terminalen, og efterfølgende kører den igennem if statements, for validation
router.post('/register', (req, res) => {
    const { name, email, age, gender, preferredGender, password, password2 } = req.body;
    let errors = [];

// checker om alle felterne er udfyldte
if (!name || !email || !age || !gender || !preferredGender || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

// checker om de to passwords matcher
if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

//tjekker om passwordet er længere end 8
if (password.length < 8) {
    errors.push({ msg: 'Password must be at least 8 characters' });
  }

//tjekker at det er mere end 0
if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      age,
      gender, 
      preferredGender,
      password,
      password2
});
} else {
// hvis kriterierne er opfyldt kører følgende kode
    User.findOne({ email: email})
    .then(user => {
        if(user) {
            //useren findes
            errors.push({ msg: 'Email findes allerede'});
            res.render('register', {
                errors,
                name,
                email,
                age, 
                gender, 
                preferredGender,
                password,
                password2
            });
        } else {
            const newUser = new User({
                name, 
                email, 
                age, 
                gender, 
                preferredGender,
                password
            });

//vi får vores password i tekst som er læseligt, vi laver derfor hash password som er krypteret
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

//sætter password fra plain tekst til hash 
            newUser.password = hash;
//gemmer vores nye user information
            newUser.save()
            .then(user => {
                res.redirect('/users/login');
            })
            .catch(err => console.log(err));

        }))

        }
    });
}

});

//login, redirecter efter login
router.post('/login', (req, res, next) => {
    req.session.email = req.body.email

    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
      })(req, res, next);
    });

// Logout, redirecter dig tilbage til forsiden når du logger ud
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
  });

// endpoint til at slette en bruger, denne er forsøgt koblet op til min submit knap på profil-siden, dette lykkedes dog ikke 

router.delete('/delete-user/:id', ((req, res, next) => {
    User.findByIdAndRemove(req.params.id, (error, data) => {
        if(error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
}));


//endpoint til at opdatere bruger
// opdaterer med .put (UPDATE, Crud operation)
router.put("/update/:id", async (req, res) => {

    //henter id'et på brugeren
    const _id = req.params.id;
    //henter den nuværende brugers body
    const currentUser = req.body;

    try {
      var updatedUser = await User.findByIdAndUpdate(
          //finder den enkelte bruger 
        _id,
        currentUser,
        {
          new: true,
          useFindAndModify: false,
        }
      );
      //opdaterer brugeren og sender tilbage
      res.send(updatedUser);
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });

module.exports = router;