const net = require('net');



const server = net.createServer((socket) => {
    console.log('Connection from', socket.remoteAddress, 'port', socket.remotePort);

    socket.on('data', async (buffer) => {
        console.log(buffer.toString())
        if (buffer.toString() == "getTrades") {
            //return Trades
        }

    });

    socket.on('end', () => {
        console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
        socket.destroy()
    });
    socket.on('disconnect', () => {
        console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
        socket.destroy()
    });
});

server.maxConnections = 20;
server.listen(59898);