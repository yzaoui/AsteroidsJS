function Asteroid(x, y, mass, vx, vy, vrotation) {
    let density = 1; // kg / pixel^2
    let radius = Math.sqrt((mass / density) / Math.PI);
    this.super(x, y, mass, radius, 0, vx, vy, vrotation);
    this.circumference = 2 * Math.PI * this.radius;
    this.segments = Math.min(25, Math.max(5, Math.ceil(this.circumference / 15))); // Constrain number of segments to [5, 25]
    this.noise = 0.2;
    this.shape = [];

    for (let i = 0; i < this.segments; i++) {
        this.shape.push(Math.random() - 0.5);
    }
}
extend(Asteroid, Mass);

Asteroid.prototype.draw = function(ctx, guide) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    drawAsteroid(ctx, this.radius, this.shape, {
        noise: this.noise,
        guide: guide
    });

    ctx.restore();
};

Asteroid.prototype.spawnChild = function(mass) {
    return new Asteroid(this.x, this.y, mass, this.vx, this.vy, this.vrotation)
};

function Pacman(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.angle = 0;
    this.vx = speed;
    this.vy = 0;
    this.time = 0;
    this.mouthAngle = 0;
}

Pacman.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    drawPacman(ctx, this.radius, this.mouthAngle);
    ctx.restore();
};

Pacman.prototype.moveRight = function() {
    this.vx = this.speed;
    this.vy = 0;
    this.angle = 0;
};

Pacman.prototype.moveDown = function() {
    this.vx = 0;
    this.vy = this.speed;
    this.angle = 0.5 * Math.PI;
};

Pacman.prototype.moveLeft = function() {
    this.vx = -this.speed;
    this.vy = 0;
    this.angle = Math.PI;
};

Pacman.prototype.moveUp = function() {
    this.vx = 0;
    this.vy = -this.speed;
    this.angle = 1.5 * Math.PI;
};

Pacman.prototype.turnCCW = function() {
    this.turn(-1);
};
Pacman.prototype.turnCW = function() {
    this.turn(1);
};

Pacman.prototype.turn = function(direction) {
    if (this.vy) {
        // Moving vertically
        this.vx = -direction * this.vy;
        this.vy = 0;
        this.angle = this.vx > 0 ? 0 : Math.PI;
    } else {
        // Moving horizontally
        this.vy = direction * this.vx;
        this.vx = 0;
        this.angle = this.vy > 0 ? 0.5 * Math.PI : 1.5 * Math.PI;
    }
};

Pacman.prototype.update = function(elapsed, width, height) {
    if (this.x - this.radius + elapsed * this.vx > width) {
        this.x = -this.radius;
    } else if (this.x + this.radius + elapsed * this.vx < 0) {
        this.x = width + this.radius;
    }

    if (this.y - this.radius + elapsed * this.vy > height) {
        this.y = -this.radius;
    } else if (this.y + this.radius + elapsed * this.vy < 0) {
        this.y = height + this.radius;
    }

    this.x += this.vx * elapsed;
    this.y += this.vy * elapsed;
    this.time += elapsed;
    this.mouthAngle = Math.abs(Math.sin(2 * Math.PI * this.time));
};

function Ghost(x, y, bodyHeight, speed, color) {
    this.x = x;
    this.y = y;
    this.bodyHeight = bodyHeight;
    this.speed = speed;
    this.color = color;
}

Ghost.prototype.draw = function(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    drawGhost(ctx, this.bodyHeight, {
        fillStyle: this.color,
        ridges: 5
    });

    ctx.restore();
};

Ghost.prototype.update = function(target, elapsed) {
    let angle = Math.atan2(target.y - this.y, target.x - this.x);
    let vx = Math.cos(angle) * this.speed;
    let vy = Math.sin(angle) * this.speed;
    this.x += vx * elapsed;
    this.y += vy * elapsed;
};

function extend(ChildClass, ParentClass) {
    let parent = new ParentClass();
    ChildClass.prototype = parent;
    ChildClass.prototype.super = parent.constructor;
    ChildClass.prototype.constructor = ChildClass;
}

function Mass(x, y, mass, radius, angle, vx, vy, vrotation) {
    this.x = x;
    this.y = y;
    this.mass = mass || 1;
    this.radius = radius || 50;
    this.angle = angle || 0;
    this.vx = vx || 0;
    this.vy = vy || 0;
    this.vrotation = vrotation || 0;
}

Mass.prototype.update = function(elapsedMS, ctx) {
    this.x += this.vx * elapsedMS;
    this.y += this.vy * elapsedMS;
    this.angle = (this.angle + this.vrotation * elapsedMS) % (2 * Math.PI);

    // If out of horizontal bounds
    if (this.x > ctx.canvas.width + this.radius || this.x < ctx.canvas.width - this.radius) {
        // Mass is allowed to go its own radius beyond the screen, thus the width
        // to wrap around is the game's width + its own radius on both sides
        const widthToWrapAround = ctx.canvas.width + 2 * this.radius;
        // Shift calculations by the mass' radius since the widthToWrapAround is shifted by 1 radius
        const newX = (this.x + this.radius) % widthToWrapAround;

        // Convert remainder to modulo, and undo shift by 1 radius
        this.x = (newX >= 0 ? newX : newX + widthToWrapAround) - this.radius;
    }

    // If out of vertical bounds
    if (this.y > ctx.canvas.height + this.radius || this.y < ctx.canvas.height - this.radius) {
        // Same logic as above block
        const heightToWrapAround = ctx.canvas.height + 2 * this.radius;
        const newY = (this.y + this.radius) % heightToWrapAround;

        this.y = (newY >= 0 ? newY : newY + heightToWrapAround) - this.radius;
    }
};

Mass.prototype.push = function(angle, force, elapsedMS) {
    this.vx += elapsedMS * (Math.cos(angle) * force) / this.mass;
    this.vy += elapsedMS * (Math.sin(angle) * force) / this.mass;
};

Mass.prototype.twist = function(force, elapsedMS) {
    this.vrotation += elapsedMS * force / this.mass;
};

Mass.prototype.speed = function() {
    return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
};

Mass.prototype.movementAngle = function() {
    return Math.atan2(this.vy, this.vx);
};

Mass.prototype.draw = function(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();

    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.lineTo(0, 0);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    ctx.restore();
};

function Ship(x, y, mass, radius, power, weaponPower) {
    this.super(x, y, mass, radius, 1.5 * Math.PI);
    this.thrusterPower = power;
    this.steeringPower = power / 20;
    this.leftThrusterOn = false;
    this.rightThrusterOn = false;
    this.forwardThrusterOn = false;
    this.backwardThrusterOn = false;
    this.weaponPower = weaponPower || 0.0002;
    this.loaded = false;
    this.weaponReloadTimeMS = 250;
    this.timeMSUntilReloaded = this.weaponReloadTimeMS;
    this.compromised = false;
    this.maxHealth = 2000;
    this.health = this.maxHealth;
}
extend(Ship, Mass);

Ship.prototype.draw = function(ctx, guide) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    drawShip(ctx, this.radius, {
        guide: guide,
        forwardThrusterOn: this.forwardThrusterOn,
        compromised: this.compromised
    });

    ctx.restore()
};

Ship.prototype.update = function(elapsedMS) {
    if (this.forwardThrusterOn && !this.backwardThrusterOn) {
        this.push(this.angle, this.thrusterPower, elapsedMS);
    } else if (!this.forwardThrusterOn && this.backwardThrusterOn) {
        this.push(this.angle, -this.thrusterPower, elapsedMS);
    }

    if (this.leftThrusterOn && !this.rightThrusterOn) {
        this.twist(-this.steeringPower, elapsedMS);
    } else if (this.rightThrusterOn && !this.leftThrusterOn) {
        this.twist(this.steeringPower, elapsedMS);
    }

    // Reload as necessary
    this.loaded = this.timeMSUntilReloaded === 0;
    if (!this.loaded) {
        this.timeMSUntilReloaded -= Math.min(elapsedMS, this.timeMSUntilReloaded);
    }

    if (this.compromised) {
        this.health -= Math.min(elapsedMS, this.health);
    }

    Mass.prototype.update.apply(this, arguments);
};

Ship.prototype.projectile = function(elapsed) {
    let projectile = new Projectile(
        0.025,
        3000,
        this.x + Math.cos(this.angle) * this.radius,
        this.y + Math.sin(this.angle) * this.radius,
        this.vx,
        this.vy,
        this.vrotation
    );

    projectile.push(this.angle, this.weaponPower, elapsed);
    this.push(this.angle + Math.PI, this.weaponPower, elapsed);

    this.timeMSUntilReloaded = this.weaponReloadTimeMS;

    return projectile;
};

function Projectile(mass, lifetimeMS, x, y, vx, vy, vrotation) {
    let density = 0.001;
    let radius = Math.sqrt((mass / density) / Math.PI);
    this.super(x, y, mass, radius, 0, vx, vy, vrotation);
    this.lifetimeMS = lifetimeMS;
    this.lifePercentage = 1;
}
extend(Projectile, Mass);

Projectile.prototype.update = function(elapsedMS, ctx) {
    this.lifePercentage -= (elapsedMS / this.lifetimeMS);
    Mass.prototype.update.apply(this, arguments);
};

Projectile.prototype.draw = function(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    drawProjectile(ctx, this.radius, this.lifePercentage);

    ctx.restore();
};

function Indicator(label, x, y, width, height) {
    this.label = label + ": ";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Indicator.prototype.draw = function(ctx, filledPercentage) {
    ctx.save();

    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.font = this.height + "pt Arial";
    let offset = ctx.measureText(this.label).width;
    ctx.fillText(this.label, this.x, this.y + this.height - 1);
    ctx.beginPath();
    ctx.rect(offset + this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(offset + this.x, this.y, this.width * filledPercentage, this.height);
    ctx.fill();

    ctx.restore();
};
