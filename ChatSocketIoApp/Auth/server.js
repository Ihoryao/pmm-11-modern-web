//підключаєм express і створюємо app
var express = require('express');
var app = express();

//Підключаєм в файлі server.js модуль cookie-parser і інтегруєм його в express
var cookieParser = require('cookie-parser')();
app.use(cookieParser);

// Підключаєм в файлі server.js модуль cookie-session, час життя сесії - 2 год.
var session = require('cookie-session')({
    keys: ['secret'],
    maxAge: 2 * 60 * 60 * 1000
});
app.use(session);

//Підключаємо модель на сервері
var ChatUser = require('./chatuser');

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
