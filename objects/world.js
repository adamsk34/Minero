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
let removeProjectiles = function () {
    let oobProjList = [];
    for (let i in world.projectileDict) {
        if (world.projectileDict[i].x < -5 || world.projectileDict[i].x > 1305 || world.projectileDict[i].y < -5 || world.projectileDict[i].y > 605) {
            oobProjList.push(i);
        }
    }
    for (let i in oobProjList) {
        delete world.projectileDict[oobProjList[i]];
    }
};

let moveProjectile = function (projectile) {
    projectile.x += projectile.xVelocity;
    projectile.y += projectile.yVelocity;

    projectile.yVelocity += 0.055;
};

let moveProjectiles = function (projectileDict) {
    for (let i in projectileDict) {
        moveProjectile(projectileDict[i]);
    }
};

let checkProjectileHitBoxAllPlayers = function (index) {
    let projectile = world.projectileDict[index];
    let playerId;

    if (projectile) {
        for (let i in world.playerDict) {
            let player = world.playerDict[i];
            if (checkIfTouching(projectile, player) && player.team == 1) {
                playerId = i;
                delete world.projectileDict[index];
            }
        }
    }

    return playerId;
};

let checkIfTouching = function (object1, object2) {
    let minDistX = object1.width / 2 + object2.width / 2;
    let minDistY = object1.height / 2 + object2.height / 2;

    return (object1.x < object2.x + minDistX
        && object2.x < object1.x + minDistX
        && object1.y < object2.y + minDistY
        && object2.y < object1.y + minDistY);
};

let checkProjectileHitBoxAllHearts = function (index) {
    let projectile = world.projectileDict[index];
    let heartId;

    if (projectile) {
        for (let i in world.heartDict) {
            let heart = world.heartDict[i];
            if (checkIfTouching(projectile, heart) && heart.health > 0) {
                heartId = i;
            }
        }
    }

    return heartId;
};

let generateHeartDict = function (numPlayers) {
    let heartDict;

    switch (numPlayers) {
        case 2:
            heartDict = {};
            heartDict["1"] = {
                x: 850,
                y: 400,
                width: 40,
                height: 40,
                health: 3,
                ticksUntilRestart: 0
            };
            heartDict["2"] = {
                x: 975,
                y: 400,
                width: 40,
                height: 40,
                health: 3,
                ticksUntilRestart: 0
            };
            heartDict["3"] = {
                x: 1100,
                y: 400,
                width: 40,
                height: 40,
                health: 3,
                ticksUntilRestart: 0
            };
            break;
    }

    return heartDict;
}

let world = {
    removeProjectiles: removeProjectiles,
    moveProjectile: moveProjectile,
    moveProjectiles: moveProjectiles,
    checkProjectileHitBoxAllHearts: checkProjectileHitBoxAllHearts,
    checkProjectileHitBoxAllPlayers: checkProjectileHitBoxAllPlayers,
    generateHeartDict: generateHeartDict,
    checkIfTouching: checkIfTouching,
    scores: [0, 0],
    playerDict: {},
    projectileDict: {},
    heartDict: {}
};

module.exports = world;