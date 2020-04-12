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

let moveProjectiles = function () {
    for (let i in world.projectileDict) {
        world.projectileDict[i].x += world.projectileDict[i].xVelocity;
        world.projectileDict[i].y += world.projectileDict[i].yVelocity;

        world.projectileDict[i].yVelocity += 0.11;
    }
};

let checkProjectileHitBoxPlayer = function (index) {
    let projectile = world.projectileDict[index];
    let playerId;

    if (projectile) {
        for (let i in world.playerDict) {
            let player = world.playerDict[i];
            if (projectile.x < player.x + 20 && player.x - 10 < projectile.x
                && projectile.y < player.y + 30 && player.y - 25 < projectile.y && player.team == 2) {
                playerId = i;
                delete world.projectileDict[index];
            }
        }
    }

    return playerId;
};

let checkProjectileHitBoxHeart = function (index) {
    let projectile = world.projectileDict[index];
    let heartId;

    if (projectile) {
        for (let i in world.heartDict) {
            let heart = world.heartDict[i];
            if (projectile.x < heart.x + 20 && heart.x - 10 < projectile.x
                && projectile.y < heart.y + 30 && heart.y - 25 < projectile.y && heart.health > 0) {
                heartId = i;
                heart.health--;
                delete world.projectileDict[index];
            }
        }
    }

    return heartId;
};

let generateHearts = function (numPlayers) {
    switch (numPlayers) {
        case 2:
            world.heartDict[Math.random()] = {
                x: 850,
                y: 400,
                health: 3
            };
            world.heartDict[Math.random()] = {
                x: 1025,
                y: 400,
                health: 3
            };
            world.heartDict[Math.random()] = {
                x: 1200,
                y: 400,
                health: 3
            };
            break;
    }
}

let world = {
    removeProjectiles: removeProjectiles,
    moveProjectiles: moveProjectiles,
    checkProjectileHitBoxHeart: checkProjectileHitBoxHeart,
    checkProjectileHitBoxPlayer: checkProjectileHitBoxPlayer,
    generateHearts: generateHearts,
    playerDict: {},
    projectileDict: {},
    heartDict: {}
};

module.exports = world;