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
}

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

Mass.prototype.update = function(elapsed, ctx) {
    this.x += this.vx * elapsed;
    this.y += this.vy * elapsed;
    this.angle = (this.angle + this.vrotation * elapsed) % (2 * Math.PI);

    // Horizontal wrapping
    if (this.x - this.radius > ctx.canvas.width) { // if left edge is beyond right screen boundary
        this.x = -this.radius;
    } else if (this.x + this.radius < 0) { // if right edge is beyond left screen boundary
        this.x = ctx.canvas.width + this.radius;
    }

    // Vertical wrapping
    if (this.y - this.radius > ctx.canvas.height) { // if top edge is beyond bottom screen boundary
        this.y = -this.radius;
    } else if (this.y + this.radius < 0) { // if bottom edge is beyond top screen boundary
        this.y = ctx.canvas.height + this.radius;
    }
};

Mass.prototype.push = function(angle, force, elapsed) {
    this.vx += elapsed * (Math.cos(angle) * force) / this.mass;
    this.vy += elapsed * (Math.sin(angle) * force) / this.mass;
};

Mass.prototype.twist = function(force, elapsed) {
    this.vrotation += elapsed * force / this.mass;
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

function Ship(x, y, power) {
    this.super(x, y, 10, 20, 1.5 * Math.PI);
    this.thrusterPower = power;
    this.steeringPower = power / 20;
    this.leftThrusterOn = false;
    this.rightThrusterOn = false;
    this.forwardThrusterOn = false;
}
extend(Ship, Mass);

Ship.prototype.draw = function(ctx, guide) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    drawShip(ctx, this.radius, {
        guide: guide,
        forwardThrusterOn: this.forwardThrusterOn
    });

    ctx.restore()
};

Ship.prototype.update = function(elapsed) {
    if (this.forwardThrusterOn) {
        this.push(this.angle, this.thrusterPower, elapsed);
    }

    if (this.leftThrusterOn && !this.rightThrusterOn) {
        this.twist(-this.steeringPower, elapsed);
    } else if (this.rightThrusterOn && !this.leftThrusterOn) {
        this.twist(this.steeringPower, elapsed);
    }

    Mass.prototype.update.apply(this, arguments);
};
