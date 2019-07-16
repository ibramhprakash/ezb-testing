const http = require('http');
const app = require('./src/app');
const config = require('./config/config.json');
const hostname = process.env.HOSTNAME || config.hostname;
const port = process.env.PORT || config.port;

const server = http.createServer(app);
const io = require('socket.io').listen(server);
const socket = require('./src/socketio/socket');


//start sever on specfic port 3000
server.listen(port, hostname, () => {
    console.log(`Server sss running at http://${hostname}:${port}/`);
    console.log(`Server sss running at http://${hostname}:${port}/`);
});

// create socketio connection
io.on('connection', request => {
    new socket(request, io);
});