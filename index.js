/**
    Copyright 2020 Kevin Adams ©

    This file is a part of Minero

    Minero is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Minero is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Minero.  If not, see <https://www.gnu.org/licenses/>.
*/
let express = require("express");
let http = require("http");
let socketIO = require("socket.io");

let app = express();
let serv = http.Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

serv.listen(2000, function (error) {
    if (error) {
        console.error("ERROR: Something went wrong", error);
    } else {
        console.log("Server started at port 2000");
    }
});

const heartTicksDead = 650;
let socketDict = {};
let w = require("./objects/world");

w.heartDict = w.generateHeartDict(2);// TODO: # of players should be known from the start

let Player = function (id) {
    let self = {
        x: 250,
        y: 250,
        width: 50,
        height: 50,
        id: id,
        pressingLeft: false,
        pressingUp: false,
        pressingRight: false,
        pressingDown: false,
        speed: 2,
        team: (Object.keys(w.playerDict).length % 2)
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
            case 0:
                if (self.x < 100) {
                    self.x = 100;
                } else if (self.x > 500) {
                    self.x = 500;
                }
                self.y = 450;
                break;
            case 1:
                if (self.x < 700) {
                    self.x = 700;
                } else if (self.x > 1250) {
                    self.x = 1250;
                }
                if (self.y < 100) {
                    self.y = 100;
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

    socket.emit("yourPlayerId", socket.id);
    socket.emit("yourPlayerTeam", player.team);
    socket.emit("heartDict", w.heartDict);
    socket.emit("newScores", w.scores);

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
        w.projectileDict[projId].width = 10;
        w.projectileDict[projId].height = 10;
        w.removeProjectiles();
    });
});

setInterval(function () {
    let heartHitList = [];
    let heartRestartList = [];
    let heartId;
    let newScores = false;

    for (let i in w.playerDict) {
        w.playerDict[i].updatePosition();
    }

    w.moveProjectiles(w.projectileDict);
    for (let i in w.projectileDict) {
        w.checkProjectileHitBoxAllPlayers(i);
        heartId = w.checkProjectileHitBoxAllHearts(i);
        if (heartId) {
            heartHitList.push(heartId);
            delete w.projectileDict[i];
        }
    }

    // check health
    for (let i in heartHitList) {
        w.heartDict[heartHitList[i]].health--;
    }

    // check scores
    for (let i in heartHitList) {
        if (w.heartDict[heartHitList[i]].health == 0) {
            // w.heartDict[heartHitList[i]].health = 3;
            w.heartDict[heartHitList[i]].ticksUntilRestart = heartTicksDead;
            w.scores[0]++;
            newScores = true;
        }
    }

    // count ticks while hearts before they restart
    for (let i in w.heartDict) {
        if (w.heartDict[i].ticksUntilRestart > 0) {
            w.heartDict[i].ticksUntilRestart--;
            if (w.heartDict[i].ticksUntilRestart == 0) {
                w.heartDict[i].health = 3;
                heartRestartList.push(i);
            }
        }
    }

    for (let i in socketDict) {
        let socket = socketDict[i];
        socket.emit("newPlayerPositions", w.playerDict);
        socket.emit("newProjectilePositions", w.projectileDict);
        if (heartHitList.length > 0) {
            socket.emit("heartHitList", heartHitList);
        }
        if (heartRestartList.length > 0) {
            socket.emit("heartRestartList", heartRestartList);
        }
        if (newScores) {
            socket.emit("newScores", w.scores);
        }
    }
}, 1000 / 160);