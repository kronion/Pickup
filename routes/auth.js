var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

/* DB Access */
var User = require('../models/db').User;

module.exports = {

  configure: function (app) {

    app.use(passport.initialize())
       .use(passport.session());

    passport.use(new LocalStrategy(
      function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { 'message': 'Incorrect username' });
          }
          if (user.password != password) {
            return done(null, false, { 'message': 'Incorrect password' });
          }
          return done(null, user);
        });
      }
    ));

    passport.serializeUser(function (user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });
  },

  login: function (req, res) {
    (passport.authenticate('local', { successRedirect: '/home',
                                      failureRedirect: '/login',
                                      failureFlash: true }))(req, res);
  },
  
  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  register: function (req, res) {
    User.findOne({ 'username': req.body.username }, function (err, user) {
      if (err) {
        console.error('query failed:', err);
        req.flash('error', 'Registration failed on our end. Please try again.');
        res.redirect('/register');
      }
      if (!user) {
        newUser = new User({
          'username': req.body.username,
          'password': req.body.password
        });
        newUser.save(function (err) {
          if (err) {
            console.error('user creation failed:', err);
            req.flash('error', 'User creation failed. Please try again.');
            res.redirect('/register');
          }
          else {
            req.flash('info', 'User created!');
            res.redirect('/home');
          }
        }); 
      } 
  
      else {
        req.flash('error', 'Username already taken, please try again.');
        res.redirect('/register');
      }
    });
  }
}
