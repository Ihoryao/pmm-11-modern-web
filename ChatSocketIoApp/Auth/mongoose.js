var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://gnat:userdb@passdb.mlab.com:33260/mybase');
console.log("mongodb connect...")
module.exports = mongoose;