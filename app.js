/* Express */
var express = require('express');
var app = express();

/* Port */
var port = process.env.PORT || 9000;

/* Mongoose */
var db = require('./models/db');

/* MongoStore */
var MongoStore = require('connect-mongo')(express);

/* Flash */
var flash = require('connect-flash');

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
  res.send('Home!');
});

app.get('/login', function (req, res) {
  res.sendfile('public/login.html');
});

app.post('/login', auth.login);

app.get('/logout', auth.logout);

app.get('/register', function (req, res) {
  res.sendfile('public/register.html');
});

app.post('/register', auth.register);

app.listen(port);
console.log("Listening on " + port);
