let socket = io();

(function () {
  var socket = io();
  $('#chatroom').submit(function (e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
})();
