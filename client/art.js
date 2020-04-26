
let ctx = document.getElementById("ctx").getContext("2d");
ctx.font = "30px Arial";

let drawFace = function (player, myPlayer) {
    if (player.team == 0) {
        if (player.id === myPlayer.id && myPlayer.mouthOpenFrames > 0) {
            myPlayer.mouthOpenFrames--;
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

let drawHearts = function (heartDict) {
    for (let i in heartDict) {
        if (heartDict[i].health) {
            ctx.fillText(heartDict[i].health, heartDict[i].x, heartDict[i].y);
        }
    }
};

let drawPlayers = function (playerDict, myPlayer) {
    for (let i in playerDict) {
        drawFace(playerDict[i], myPlayer);
    }
};

let drawProjectiles = function (projectileDict) {
    for (let i in projectileDict) {

        ctx.fillText("*", projectileDict[i].x, projectileDict[i].y);
    }
};

let drawArc = function (myPlayer, mousePosition) {
    let pointsToDraw = 30;
    let dotDist = 50;
    let imaginaryProjectile = {
        x: myPlayer.x,
        y: myPlayer.y,
        xVelocity: getProjectileVelocityXY(myPlayer, mousePosition).xVelocity,
        yVelocity: getProjectileVelocityXY(myPlayer, mousePosition).yVelocity
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

let drawScores = function (scores) {
    ctx.fillText(scores[0], 300, 50);
    ctx.fillText(scores[1], 1000, 50);
};

// TODO: move to utility file
let getProjectileVelocityXY = function (shooterPosition, mousePosition) {
    let xDirection = (mousePosition.x - shooterPosition.x);
    let yDirection = (mousePosition.y - shooterPosition.y);
    let speed = 0.8;
    let xVel = speed * xDirection / (Math.abs(xDirection) + Math.abs(yDirection));
    let yVel = -speed * yDirection / (Math.abs(xDirection) + Math.abs(yDirection));

    let newXVel = xVel * (1 + 0.2 * (speed - Math.abs(Math.abs(xVel) - Math.abs(yVel))));
    let newYVel = yVel * (1 + 0.2 * (speed - Math.abs(Math.abs(xVel) - Math.abs(yVel))));

    return { xVelocity: 10 * newXVel, yVelocity: -10 * newYVel };
};

// TODO: move to utility file
let euclideanDist = function (object1, object2) {
    return Math.sqrt((Math.pow(object1.x - object2.x, 2)) + (Math.pow(object1.y - object2.y, 2)));
};

// TODO: reference world.js so that this function is not duplicated
let moveProjectile = function (projectile) {
    projectile.x += projectile.xVelocity;
    projectile.y += projectile.yVelocity;

    projectile.yVelocity += 0.055;
};

export {
    drawFace,
    drawHearts,
    drawPlayers,
    drawProjectiles,
    drawArc,
    drawScores
};
