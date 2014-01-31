/* Mongoose */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pickup');
var db = mongoose.connection;
exports.connect = db;

var Schema = mongoose.Schema;
var id = mongoose.Types.ObjectId;
exports.ObjectId = id;

var userSchema = new Schema({
  'username': String,
  'password': String
});

var User = mongoose.model('User', userSchema);
exports.User = User;

var pickupSchema = new Schema({
  'location': String,
  'item': String,
  'returnTo': String,
  'offer': String,
  'selected': Boolean
});

var Pickup = mongoose.model('Pickup', pickupSchema);
exports.Pickup = Pickup;
