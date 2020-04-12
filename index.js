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
let playerDict = {};
let projectileDict = {};

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
    socketDict[socket.id] = socket;

    let player = Player(socket.id);
    playerDict[socket.id] = player;

    socket.emit("yourPlayerId", socket.id);

    socket.on("disconnect", function () {
        delete socketDict[socket.id];
        delete playerDict[socket.id];
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

        projectileDict[projId] = data;
        removeProjectiles();
    });
});

let removeProjectiles = function () {
    let oobProjList = [];
    for (let i in projectileDict) {
        if (projectileDict[i].x < -5 || projectileDict[i].x > 1305 || projectileDict[i].y < -5 || projectileDict[i].y > 605) {
            oobProjList.push(i);
        }
    }
    for (let i in oobProjList) {
        delete projectileDict[oobProjList[i]];
    }
};

let moveProjectiles = function () {
    for (let i in projectileDict) {
        projectileDict[i].x += projectileDict[i].xVelocity;
        projectileDict[i].y += projectileDict[i].yVelocity;

        projectileDict[i].yVelocity += 0.5;
    }
};

setInterval(function () {
    let playerPack = [];
    for (let i in playerDict) {
        let player = playerDict[i];
        player.updatePosition();
        playerPack.push({
            x: player.x,
            y: player.y,
            id: player.id
        });
    }

    moveProjectiles();

    for (let i in socketDict) {
        let socket = socketDict[i];
        socket.emit("newPlayerPositions", playerPack);
        socket.emit("newProjectilePositions", projectileDict);
    }
}, 1000 / 60);