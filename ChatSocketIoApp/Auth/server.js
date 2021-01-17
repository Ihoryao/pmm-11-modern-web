//підключаєм express і створюємо app
var express = require('express');
var app = express();
//підключаєм модуль body-parser і інтегруєм в express
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//задаєм папку для статичного контенту
app.use(express.static(__dirname));
//опрацювання кореневого шляху
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/chat.html');
})
//порт прослуховування
app.listen(8080);
console.log('Run server!');
