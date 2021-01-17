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

//Підключаєм в файлі server.js модуль cookie-parser і інтегруєм його в express
var cookieParser = require('cookie-parser')();
app.use(cookieParser);

// Підключаєм в файлі server.js модуль cookie-session, час життя сесії - 2 год.
var session = require('cookie-session')({
    keys: ['secret'],
    maxAge: 2 * 60 * 60 * 1000
});
app.use(session);

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

//Підключаємо модель на сервері
var ChatUser = require('./chatuser');

//11) Підключаємо passport-local для автентифікації, створюємо екземпляр passport-local,
//реалізуєм логіку автентифікації
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function (username, password, done) {
        ChatUser.find({ username: username, password: password },
            function (err, data) {
                console.log("data:");
                console.log(data);
                if (data.length)
                    return done(null, { id: data[0]._id, username: data[0].username });
                return done(null, false);
            })
    }));

//12) Записуємо дані об'єкта, які повертає local-стратегія після автентифікації в сесію,
//користувач авторизується
passport.serializeUser(function (user, done) {
    console.log("serialize user:");
    console.log(user);
    done(null, user);
});

//13) При всіх наступних зверненнях авторизованого користувача до сервера відбувається
//десеріалізація (використання даних сесії)
passport.deserializeUser(function (id, done) {
    console.log("deserialize user:");
    console.log(id);
    ChatUser.find({ _id: id.id },
        function (err, data) {
            console.log(data);
            if (data.length == 1)
                done(null, { username: data[0].username });
        });
});

//14) Реалізуєм запуск автентифікації на основі local-стратегії з відповідним редіректом, а
//також створюєм middleware-функцію MyAuth, яка перевіряє, чи користувач є авторизованим
var auth = passport.authenticate(
    'local', {
    successRedirect: '/',
    failureRedirect: '/login'
});
var myAuth = function (req, res, next) {
    if (req.isAuthenticated())
        next();
    else {
        res.redirect('/login');
    }
}

//15) Реалізуєм обробники клієнтських запитів на сервері
//перевірка чи user автентифікований
app.get('/', myAuth);
//опрацювання кореневого шляху
app.get('/', function (req, res) {
    //console.log("req.user:");
    console.log("req.user:");
    console.log(req.user);
    console.log("req.session:");
    console.log(req.session);
    res.sendFile(__dirname + '/chat.html');
});
app.post('/login', auth);
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

//16) Підключаєм модуль socket.io та налаштовуємо сервер
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//17) Прив'язуєм соккет до сесії
io.use(function (socket, next) {
    var req = socket.handshake;
    var res = {};
    cookieParser(req, res, function (err) {
        if (err) return next(err);
        session(req, res, next);
    });
});

//20) Слухаєм подію 'joinclient' на сервері
var users = [];
io.on('connection', function (socket) {
    var user = socket.handshake.session.passport.user.username;
    var pos = users.indexOf(user);
    if (pos == -1) users.push(user);
    socket.on('joinclient', function (data) {
        //console.log("push");
        console.log(data);
        console.log("socket-clients:");
        console.log(Object.keys(io.sockets.sockets));
        socket.emit('joinserver', { msg: "Привіт " + user + "!", users: users });
        socket.broadcast.emit('joinserver', { msg: "В чат увійшов " + user, users: users });
    })
})

//порт прослуховування
app.listen(8080);
console.log('Run server!')

