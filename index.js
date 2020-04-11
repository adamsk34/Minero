let express = require("express");
let http = require("http");
let socketIO = require("socket.io");

let app = express();
let serv = http.Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

serv.listen(2000);
console.log("Server started");

let SOCKET_LIST = {};
let PLAYER_LIST = {};

let Player = function (id) {
    let self = {
        x: 250,
        y: 250,
        id: id,
        pressingLeft: false,
        pressingUp: false,
        pressingRight: false,
        pressingDown: false,
        speed: 8
    };
    self.updatePosition = function () {
        let xChange = 0;
        let yChange = 0;
        if (self.pressingLeft) {
            xChange -= self.speed;
        }
        if (self.pressingUp) {
            yChange -= self.speed;
        }
        if (self.pressingRight) {
            xChange += self.speed;
        }
        if (self.pressingDown) {
            yChange += self.speed;
        }
        if (xChange !== 0 && yChange !== 0) {
            xChange *= 0.70710678119;
            yChange *= 0.70710678119;
        }
        self.x += xChange;
        self.y += yChange;
    };
    return self;
};

let io = socketIO(serv, {});
io.sockets.on("connection", function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    let player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    socket.on("disconnect", function () {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });




    socket.on("keyPress", function (data) {
        switch (data.inputId) {
            case "left":
                player.pressingLeft = data.state;
                break;
            case "up":
                player.pressingUp = data.state;
                break;
            case "right":
                player.pressingRight = data.state;
                break;
            case "down":
                player.pressingDown = data.state;
                break;
        }
    });
});

setInterval(function () {
    let pack = [];
    for (let i in PLAYER_LIST) {
        let player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            x: player.x,
            y: player.y,
        });
    }
    for (let i in SOCKET_LIST) {
        let socket = SOCKET_LIST[i];
        socket.emit("newPositions", pack);
    }
}, 1000 / 25);