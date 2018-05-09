function collision(obj1, obj2) {
    return distanceBetween(obj1, obj2) < (obj1.radius + obj2.radius);
}

function distanceBetween(obj1, obj2) {
    return Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
}

let AsteroidsGame = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.focus();
    this.guide = false;
    this.asteroidPush = 2;
    this.ship = new Ship(
        this.canvas.width / 2,
        this.canvas.height / 2,
        10,
        20,
        0.001
    );
    this.projectiles = [];
    this.asteroids = [];
    this.asteroids.push(this.movingAsteroid(60));
    this.healthIndicator = new Indicator("health", 5, 5, 100, 10);
    this.massLostOnCollision = 500;
    this.score = 0;
    this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
    this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
    window.requestAnimationFrame(this.frame.bind(this));
};

AsteroidsGame.prototype.movingAsteroid = function(elapsedMS) {
    const asteroid = this.newAsteroid();
    this.pushAsteroid(asteroid, elapsedMS);

    return asteroid;
};

AsteroidsGame.prototype.newAsteroid = function() {
    return new Asteroid(
        this.canvas.width * Math.random(),
        this.canvas.height * Math.random(),
        2000 + Math.random() * 8000
    );
};

AsteroidsGame.prototype.pushAsteroid = function(asteroid, elapsedMS_) {
    const elapsedMS = elapsedMS_ || 15;
    asteroid.push(2 * Math.PI * Math.random(), this.asteroidPush, elapsedMS);
    asteroid.twist((Math.random() - 0.5) * 0.3 * this.asteroidPush, elapsedMS)
};

AsteroidsGame.prototype.splitAsteroid = function(asteroid, elapsedMS) {
    // Lose mass to distribute to children
    asteroid.mass -= this.massLostOnCollision;
    // Score is all mass that gets split
    this.score += this.massLostOnCollision;
    // Split asteroid along [25, 75]#
    let split = 0.25 + 0.5 * Math.random();
    let child1 = asteroid.spawnChild(asteroid.mass * split);
    let child2 = asteroid.spawnChild(asteroid.mass * (1 - split));

    [child1, child2].forEach(function(child) {
        if (child.mass < this.massLostOnCollision) {
            this.score += child.mass;
        } else {
            this.pushAsteroid(child, elapsedMS);
            this.asteroids.push(child);
        }
    }, this)
};

AsteroidsGame.prototype.keyDown = function(e) {
    this.keyHandler(e, true);
};

AsteroidsGame.prototype.keyUp = function(e) {
    this.keyHandler(e, false);
};

AsteroidsGame.prototype.keyHandler = function(e, pressed) {
    let notHandled = false;

    switch (e.key) {
        case "ArrowUp":
            this.ship.forwardThrusterOn = pressed;
            break;
        case "ArrowDown":
            this.ship.backwardThrusterOn = pressed;
            break;
        case "ArrowLeft":
            this.ship.leftThrusterOn = pressed;
            break;
        case "ArrowRight":
            this.ship.rightThrusterOn = pressed;
            break;
        case " ":
            this.ship.triggerOn = pressed;
            break;
        case "g":
            if (pressed) this.guide = !this.guide;
            break;
        default:
            notHandled = true;
    }

    if (!notHandled) e.preventDefault();
};

AsteroidsGame.prototype.frame = function(timestamp) {
    if (!this.previousTimestamp) this.previousTimestamp = timestamp;
    let elapsedMS = (timestamp - this.previousTimestamp);
    this.update(elapsedMS);
    this.draw();
    this.previousTimestamp = timestamp;
    window.requestAnimationFrame(this.frame.bind(this));
};

AsteroidsGame.prototype.update = function(elapsedMS) {
    this.ship.compromised = false;
    this.asteroids.forEach(function(asteroid) {
        asteroid.update(elapsedMS, this.ctx);
        if (collision(asteroid, this.ship)) {
            this.ship.compromised = true;
        }
    }, this);
    this.ship.update(elapsedMS, this.ctx);
    this.projectiles.forEach(function(projectile, i) {
        projectile.update(elapsedMS, this.ctx);
        if (projectile.lifePercentage <= 0) {
            this.projectiles.splice(i, 1);
        } else {
            this.asteroids.forEach(function(asteroid, j) {
                if (collision(asteroid, projectile)) {
                    this.projectiles.splice(i, 1);
                    this.asteroids.splice(j, 1);
                    this.splitAsteroid(asteroid, elapsedMS);
                }
            }, this)
        }
    }, this);
    if (this.ship.triggerOn && this.ship.loaded) {
        this.projectiles.push(this.ship.projectile(elapsedMS));
    }
};

AsteroidsGame.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.guide) {
        drawGrid(this.ctx);
        this.asteroids.forEach(function(asteroid) {
            drawLine(this.ctx, asteroid, this.ship);
        }, this);
    }

    this.asteroids.forEach(function(asteroid) {
        asteroid.draw(this.ctx, this.guide);
    }, this);

    this.ship.draw(this.ctx, this.guide);

    this.projectiles.forEach(function(projectile) {
        projectile.draw(this.ctx)
    }, this);

    this.healthIndicator.draw(this.ctx, this.ship.health / this.ship.maxHealth);
};
