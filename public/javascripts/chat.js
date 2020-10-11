document.addEventListener('DOMContentLoaded', () => {
  var status = document.getElementById('status');
  var online = document.getElementById('online');

  socket.on('connect', function () {
    status.innerText = 'Connected.';
  });

  socket.on('disconnect', function () {
    status.innerText = 'Disconnected.';
  });

  socket.on('online', function (amount) {
    online.innerText = amount;
  });
});
