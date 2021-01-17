//19) Створюєм файл chat.js і встановлюєм зв'язок з сервером

$(document).ready(function () {
    // під'єднуємось до сервера - створюєм новий сокет
    var socket = io.connect('http://localhost:8080');
    // відправляємо повідомлення про під'єднання нового користувача
    socket.emit('joinclient', "is connected!");
});