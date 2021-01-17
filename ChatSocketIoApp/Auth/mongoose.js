var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://dbUser:5ibap7il3Jx4bxgI@cluster0.z5ndh.mongodb.net/mydb?retryWrites=true&w=majority');
console.log("mongodb connect...")
module.exports = mongoose;