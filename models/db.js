/* Mongoose */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pickup');
var db = mongoose.connection;
exports.connect = db;

var Schema = mongoose.Schema;

var userSchema = new Schema({
  'username': String,
  'password': String
});

var User = mongoose.model('User', userSchema);
exports.User = User;
