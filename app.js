/* Express */
var express = require('express');
var app = express();

/* Port */
var port = process.env.PORT || 9000;

/* Mongoose */
var db = require('./models/db');
var Pickup = db.Pickup;
var ObjectId = db.ObjectId;

/* MongoStore */
var MongoStore = require('connect-mongo')(express);

/* Flash */
var flash = require('connect-flash');

/* Jade */
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

/* Middleware */
app.use(express.compress())
   .use(express.static(__dirname + '/public'))
   .use(express.cookieParser())
   .use(express.urlencoded())
   .use(express.json())
   .use(express.session({
     store: new MongoStore({
       db: 'pickup',
       host: 'localhost',
       port: 27017
     }),
     secret: 'jmc123'
   }))
   .use(flash());  

/* Passport */
var auth = require('./routes/auth');
auth.configure(app);

/* Routing */
app.get('/', function (req, res) {
  res.send('Testing\n');
});

app.get('/home', function (req, res) {
  Pickup.find(function (err, pickups) {
    if (err) {
      console.error('Error loading pickups:', err);
    }
    else if (!pickups) {
      res.render('home');
    }
    else {
      res.render('home', { 'pickups': pickups });
    }
  });
});

app.get('/login', function (req, res) {
  res.sendfile('public/login.html');
});

app.post('/login', auth.login);

app.get('/logout', auth.logout);

app.get('/new', function (req, res) {
  res.sendfile('public/pickup.html');
});

app.post('/new', function (req, res) {
  var newPickup = new Pickup({
    'location': req.body.location,
    'item': req.body.item,
    'returnTo': req.body.returnTo,
    'offer': req.body.offer,
    'selected': false
  });
  newPickup.save(function (err) {
    if (err) {
      console.error('Error creating new pickup:', err);
      req.flash('error', 'Error creating new pickup request.');
      res.redirect('/new');
    }
    else {
      req.flash('info', 'New pickup request created!');
      res.redirect('/home');
    }
  });
});

app.get('/register', function (req, res) {
  res.sendfile('public/register.html');
});

app.post('/register', auth.register);

app.get('/selected', function (req, res) {
  Pickup.findById(new ObjectId(req.query.id), function (err, pickup) {
    if (err) {
      console.error('Error selecting pickup:', err);
    }
    else if (!pickup) {
      console.error('No pickup found\n');
    }
    else {
      Pickup.update(pickup, { 'selected': true }, 
                    function (err) {
        if (err) {
          console.error('Error claiming pickup:', err);
        }
      });
    }
  });
  res.send('Complete\n');
});

app.listen(port);
console.log("Listening on " + port);
