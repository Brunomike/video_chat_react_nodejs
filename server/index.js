const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const port = process.env.PORT || 5000;

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is running...');
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('calluser', { signal: signalData, from: from, name });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
});


server.listen(port, (err) => {
    err ? console.log(err.message) : console.log(`Server listening on http://localhost:5000`);
});