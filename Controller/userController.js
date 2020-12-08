const express = require('express');

const router = express.Router();

// bruger bcrypt til at inkrypterer password
const bcrypt = require('bcryptjs');

const passport = require('passport');

// Henter user model
const User = require('../Model/User');

//Login page
router.get('/login', (req, res) => res.render('Login'));

//Registerpage
router.get('/register', (req, res) => res.render('Register'));

// Register handler, får submit af register profil i terminalen
router.post('/register', (req, res) => {
    const { name, email, age, gender, preferredGender, password, password2 } = req.body;
    let errors = [];

// check om felterne er udfyldte
if (!name || !email || !age || !gender || !preferredGender || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

//Check passwords match, evt find på nogle selv istedet, ellers brug hans fra videoen ca 31:00
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
//vi får vores password i tekst som vi kan se, vi laver derfor hash password som er krypteret
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
//set password fra plain tekst til hash 
            newUser.password = hash;
//save vores nye user info
            newUser.save()
            .then(user => {
                req.flash('success_msg', 'du er nu registreret og kan tilgå hjemmesiden');
                res.redirect('/users/login');
            })
            .catch(err => console.log(err));

        }))

        }
    });
}

});

//login handle, redirecter efter login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
    });

// Logout handle, redirecter dig tilbage til forsiden når du logger ud
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Du er nu logget ud');
    res.redirect('/users/login');
  });

// Delete User, url: https://www.positronx.io/build-secure-jwt-token-based-authentication-api-with-node/


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



//endpoint til at slette en bruger
/*
router.delete('/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndRemove({
            _id: req.params.id
        })
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
})
*/

// Update User
/*
router.update('/update-user/:id', ((req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('User successfully updated!')
        }
    })
}))
*/



module.exports = router;
