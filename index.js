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

let socketDict = {};
let w = require("./objects/world");

let Player = function (id) {
    let self = {
        x: 250,
        y: 250,
        id: id,
        pressingLeft: false,
        pressingUp: false,
        pressingRight: false,
        pressingDown: false,
        speed: 8,
        team: 1 + (Object.keys(w.playerDict).length % 2)
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

        self.stayInBounds();
    };
    self.stayInBounds = function (player) {
        switch (self.team) {
            case 1:
                if (self.x < 50) {
                    self.x = 50;
                } else if (self.x > 500) {
                    self.x = 500;
                }
                self.y = 450;
                break;
            case 2:
                if (self.x < 700) {
                    self.x = 700;
                } else if (self.x > 1250) {
                    self.x = 1250;
                }
                if (self.y < 50) {
                    self.y = 50;
                } else if (self.y > 550) {
                    self.y = 550;
                }
                break;
        }
    };
    return self;
};

let io = socketIO(serv, {});
io.sockets.on("connection", function (socket) {
    let player;
    socket.id = Math.random();
    socketDict[socket.id] = socket;

    player = Player(socket.id);
    w.playerDict[socket.id] = player;

    if (Object.keys(w.playerDict).length == 1) {
        w.generateHearts(2);// TODO: # players should be know from the start
    }

    socket.emit("yourPlayerId", socket.id);
    socket.emit("yourPlayerTeam", player.team);
    socket.emit("heartDict", w.heartDict);

    socket.on("disconnect", function () {
        delete socketDict[socket.id];
        delete w.playerDict[socket.id];
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

    socket.on("shootProjectile", function (data) {
        let projId = Math.random();

        w.projectileDict[projId] = data;
        w.removeProjectiles();
    });
});

setInterval(function () {
    let heartId;

    for (let i in w.playerDict) {
        w.playerDict[i].updatePosition();
    }

    w.moveProjectiles();
    for (let i in w.projectileDict) {
        w.checkProjectileHitBoxPlayer(i);
        heartId = w.checkProjectileHitBoxHeart(i);
    }

    for (let i in socketDict) {
        let socket = socketDict[i];
        socket.emit("newPlayerPositions", w.playerDict);
        socket.emit("newProjectilePositions", w.projectileDict);
        if (heartId) {
            socket.emit("heartHit", heartId);
        }
    }
}, 1000 / 160);