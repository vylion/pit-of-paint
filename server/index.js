var port = process.env.PORT || 9000
var io = require('socket.io')(port)

var players = {}

//socket.emit('instruction', socket.id) to a specific socket
//socket.broadcast.emit('instruction') to all OTHER sockets
//io.emit('instruction') to EVERY socket

io.on('connection', function (socket) {
  console.log('user connected', socket.id)
	socket.emit('init', players)
  socket.on('disconnect', function () {
    console.log('user disconnected', socket.id)
  })
  socket.on('update_position', function (info) {
    console.log('Updating position', socket.id)
		info.id = socket.id
		players[socket.id] = info
		socket.broadcast.emit('update_position', info)
  })
})

console.log('server started on port', port)
