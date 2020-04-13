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
const LEFT_KEY_CODE = 37;
const UP_KEY_CODE = 38;
const RIGHT_KEY_CODE = 39;
const DOWN_KEY_CODE = 40;
const A_KEY_CODE = 65;
const W_KEY_CODE = 87;
const D_KEY_CODE = 68;
const S_KEY_CODE = 83;
let myPlayer = {};
let heartDict = {};
let socket = io();
let playerDict;
let projectileDict;
let mouthOpenFrames = 0;
let mousePosition = { x: 500, y: 200 }
let scores = [0, 0];
let mouseDown = 0;
let mouseDownTicks = 0;
let ticksBetweenShots = 200;

let getProjectileVelocityXY = function () {
    let xDirection = (mousePosition.x - myPlayer.x);
    let yDirection = (mousePosition.y - myPlayer.y);
    let speed = 0.8;
    let xVel = speed * xDirection / (Math.abs(xDirection) + Math.abs(yDirection));
    let yVel = -speed * yDirection / (Math.abs(xDirection) + Math.abs(yDirection));

    let newXVel = xVel * (1 + 0.2 * (speed - Math.abs(Math.abs(xVel) - Math.abs(yVel))));
    let newYVel = yVel * (1 + 0.2 * (speed - Math.abs(Math.abs(xVel) - Math.abs(yVel))));

    return { xVelocity: 10 * newXVel, yVelocity: -10 * newYVel };
}

// TODO: reference world.js so that this function is not duplicated
let moveProjectile = function (projectile) {
    projectile.x += projectile.xVelocity;
    projectile.y += projectile.yVelocity;

    projectile.yVelocity += 0.055;
};

document.body.onmousedown = function (event) {
    mouseDown++;
    mousePosition.x = event.x;
    mousePosition.y = event.y;
};

document.body.onmouseup = function (event) {
    mouseDown--;
    mousePosition.x = event.x;
    mousePosition.y = event.y;
};

document.onkeydown = function (event) {
    if (event.keyCode === LEFT_KEY_CODE || event.keyCode === A_KEY_CODE) {
        socket.emit("keyPress", { inputId: "left", state: true });
    }
    if (event.keyCode === UP_KEY_CODE || event.keyCode === W_KEY_CODE) {
        socket.emit("keyPress", { inputId: "up", state: true });
    }
    if (event.keyCode === RIGHT_KEY_CODE || event.keyCode === D_KEY_CODE) {
        socket.emit("keyPress", { inputId: "right", state: true });
    }
    if (event.keyCode === DOWN_KEY_CODE || event.keyCode === S_KEY_CODE) {
        socket.emit("keyPress", { inputId: "down", state: true });
    }
};

document.onkeyup = function (event) {
    if (event.keyCode === LEFT_KEY_CODE || event.keyCode === A_KEY_CODE) {
        socket.emit("keyPress", { inputId: "left", state: false });
    }
    if (event.keyCode === UP_KEY_CODE || event.keyCode === W_KEY_CODE) {
        socket.emit("keyPress", { inputId: "up", state: false });
    }
    if (event.keyCode === RIGHT_KEY_CODE || event.keyCode === D_KEY_CODE) {
        socket.emit("keyPress", { inputId: "right", state: false });
    }
    if (event.keyCode === DOWN_KEY_CODE || event.keyCode === S_KEY_CODE) {
        socket.emit("keyPress", { inputId: "down", state: false });
    }
};

window.addEventListener("mousemove", function (event) {
    mousePosition.x = event.x;
    mousePosition.y = event.y;
});

var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = "30px Arial";

socket.on("newPlayerPositions", function (data) {
    playerDict = data;

    for (let i in playerDict) {
        if (playerDict[i].id === myPlayer.id) {
            myPlayer.x = playerDict[i].x;
            myPlayer.y = playerDict[i].y;
        }
    }
});

socket.on("newProjectilePositions", function (data) {
    projectileDict = data;
});

socket.on("yourPlayerId", function (id) {
    myPlayer.id = id;
});

socket.on("yourPlayerTeam", function (team) {
    myPlayer.team = team;
});

socket.on("heartDict", function (heartDictGiven) {// TODO: heartDictGiven should be heartDict
    heartDict = heartDictGiven;
});

socket.on("heartHitList", function (heartHitList) {
    for (let i = 0; i < heartHitList.length; i++) {
        let index = heartHitList[i];

        if (heartDict[index].health > 0) {
            heartDict[index].health--;
        }
    }
});

socket.on("heartRestartList", function (heartRestartList) {
    for (let i in heartRestartList) {
        let currHeart = heartDict[heartRestartList[i]];
        if (currHeart.health == 0) {
            currHeart.health = 3;
        } else {
            console.error("ERROR: Cannot restart heart whose health is not 0 (health =", currHeart.health + ")");
        }
    }
});

socket.on("newScores", function (scoresGiven) {
    scores = scoresGiven;
});

let drawFace = function (player) {
    if (player.team == 0) {
        if (player.id === myPlayer.id && mouthOpenFrames > 0) {
            mouthOpenFrames--;
            ctx.fillText(":o", player.x, player.y);
        } else {
            ctx.fillText(":)", player.x, player.y);
        }
    } else if (player.team == 1) {
        ctx.fillText("_", player.x - 5, player.y - 35);
        ctx.fillText(":)", player.x, player.y);
    } else {
        console.error("ERROR: Player team should be 0 or 1 (player.team ===", player.team + ")");
    }
};

let drawHearts = function () {
    for (let i in heartDict) {
        if (heartDict[i].health) {
            ctx.fillText(heartDict[i].health, heartDict[i].x, heartDict[i].y);
        }
    }
};

let drawPlayers = function () {
    for (let i in playerDict) {
        drawFace(playerDict[i]);
    }
};

let drawProjectiles = function () {
    for (let i in projectileDict) {

        ctx.fillText("*", projectileDict[i].x, projectileDict[i].y);
    }
};

let euclideanDist = function (object1, object2) {
    return Math.sqrt((Math.pow(object1.x - object2.x, 2)) + (Math.pow(object1.y - object2.y, 2)));
}

let drawArc = function () {
    let pointsToDraw = 30;
    let dotDist = 50;
    let imaginaryProjectile = {
        x: myPlayer.x,
        y: myPlayer.y,
        xVelocity: getProjectileVelocityXY(mousePosition).xVelocity,
        yVelocity: getProjectileVelocityXY(mousePosition).yVelocity
    };
    let prevDot = { x: myPlayer.x, y: myPlayer.y };

    while (pointsToDraw > 0) {
        let eDist = 0;
        while (eDist < dotDist) {
            moveProjectile(imaginaryProjectile);
            eDist = euclideanDist(imaginaryProjectile, prevDot);
        }
        ctx.fillText(".", imaginaryProjectile.x, imaginaryProjectile.y - 14);
        prevDot = { x: imaginaryProjectile.x, y: imaginaryProjectile.y };
        pointsToDraw--;
    }
};

let drawScores = function () {
    ctx.fillText(scores[0], 300, 50);
    ctx.fillText(scores[1], 1000, 50);
};

let shootHandler = function () {
    if (mouseDownTicks == 0) {
        mouseDownTicks++;

        if (myPlayer.team == 0) {
            mouthOpenFrames = 15;

            socket.emit("shootProjectile", {
                x: myPlayer.x,
                y: myPlayer.y,
                xVelocity: getProjectileVelocityXY(mousePosition).xVelocity,
                yVelocity: getProjectileVelocityXY(mousePosition).yVelocity
            });
        }
    }
};

setInterval(function () {
    ctx.clearRect(0, 0, 1300, 600);

    if (mouseDown) {
        shootHandler();
    }

    if (mouseDownTicks > 0) {
        mouseDownTicks++;
        if (mouseDownTicks == ticksBetweenShots) {
            mouseDownTicks = 0;
        }
    }

    drawScores();
    drawPlayers();
    drawProjectiles();
    drawHearts();
    if (myPlayer.team == 0) {
        drawArc();
    }
}, 1000 / 160);