
let Player = function (id, w) {
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

    // force player to stay in their bounding box
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

module.exports = Player;