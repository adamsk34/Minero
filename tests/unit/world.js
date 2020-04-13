let assert = require("assert");
let w = require("../../objects/world");

describe("Unit", function () {
    describe("generateHeartDict()", function () {
        it("should return null when numPlayers=0", function () {
            assert.equal(w.generateHeartDict(0), null);
        });
        it("should return null when numPlayers=1", function () {
            assert.equal(w.generateHeartDict(1), null);
        });
        it("should return null when numPlayers=2", function () {
            let heartDict = w.generateHeartDict(2);
            assert(heartDict);
            assert.equal(Object.keys(heartDict).length, 3);
            for (let i in heartDict) {
                assert(heartDict[i]);
                assert(heartDict[i].x);
                assert(heartDict[i].y);
                assert(heartDict[i].width);
                assert(heartDict[i].height);
                assert.equal(heartDict[i].health, 3);
            }
        });
    });

    describe("checkIfTouching()", function () {
        describe("Simple cases", function () {
            it("Should return true if in same place", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return true if touching (different sizes)", function () {
                let object1 = {
                    x: 100,
                    y: 0,
                    width: 200,
                    height: 150,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 is left of object2", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 100,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 is right of object2", function () {
                let object1 = {
                    x: 100,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 is above of object2", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 100,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 is below of object2", function () {
                let object1 = {
                    x: 0,
                    y: 100,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
        });

        describe("Edges close", function () {
            it("Should return true if object1 barely touches object2 from the left", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 9.9,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return true if object1 barely touches object2 from the right", function () {
                let object1 = {
                    x: 9.9,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return true if object1 barely touches object2 from above", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 14.9,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return true if object1 barely touches object2 from below", function () {
                let object1 = {
                    x: 0,
                    y: 14.9,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 barely to the left of object2", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 10.1,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 barely to the right of object2", function () {
                let object1 = {
                    x: 10.1,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 barely above object2", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 15.1,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 barely below object2", function () {
                let object1 = {
                    x: 0,
                    y: 15.1,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
        });

        describe("Corners close", function () {
            it("Should return true if object1 barely touches object2 from the upper left", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 9.9,
                    y: 14.9,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return true if object1 barely touches object2 from the upper right", function () {
                let object1 = {
                    x: 9.9,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 14.9,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return true if object1 barely touches object2 from the bottom left", function () {
                let object1 = {
                    x: 0,
                    y: 14.9,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 9.9,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return true if object1 barely touches object2 from the bottom right", function () {
                let object1 = {
                    x: 9.9,
                    y: 14.9,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 barely to the upper left of object2", function () {
                let object1 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 10.1,
                    y: 15.1,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 barely to the upper right of object2", function () {
                let object1 = {
                    x: 10.1,
                    y: 0,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 15.1,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 barely to the bottom left of object2", function () {
                let object1 = {
                    x: 0,
                    y: 15.1,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 10.1,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
            it("Should return false if object1 barely to the bottom right of object2", function () {
                let object1 = {
                    x: 10.1,
                    y: 15.1,
                    width: 10,
                    height: 15,
                };
                let object2 = {
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 15
                };
                assert(!w.checkIfTouching(object1, object2));
            });
        });
    });
});
