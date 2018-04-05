function Asteroid(segments, radius, noise) {
    this.x = context.canvas.width * Math.random();
    this.y = context.canvas.height * Math.random();
    this.angle = 0;
    this.vx = context.canvas.width * (Math.random() - 0.5);
    this.vy = context.canvas.height * (Math.random() - 0.5);
    this.vrotation = 2 * Math.PI * (Math.random() - 0.5);
    this.radius = radius;
    this.noise = noise;
    this.shape = [];
    for (let i = 0; i < segments; i++) {
        this.shape.push(Math.random() - 0.5);
    }
}

Asteroid.prototype.update = function(elapsed) {
    if (this.x - this.radius + elapsed * this.vx > context.canvas.width) {
        this.x = -this.radius;
    }

    if (this.x + this.radius + elapsed * this.vx < 0) {
        this.x = context.canvas.width + this.radius;
    }

    if (this.y - this.radius + elapsed * this.vy > context.canvas.height) {
        this.y = -this.radius;
    }

    if (this.y + this.radius + elapsed * this.vy < 0) {
        this.y = context.canvas.height + this.radius;
    }

    this.x += elapsed * this.vx;
    this.y += elapsed * this.vy;
    this.angle = (this.angle + elapsed * this.vrotation) % (2 * Math.PI);
};

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
    // ~ Once per 100 frames
    if (Math.random() <= 0.01) {
        if (Math.random() < 0.5) {
            this.turnCCW();
        } else {
            this.turnCW();
        }
    }

    if (this.x - this.radius + elapsed * this.vx > width) {
        this.x = -this.radius;
    }
    if (this.x + this.radius + elapsed * this.vx < 0) {
        this.x = width + this.radius;
    }
    if (this.y - this.radius + elapsed * this.vy > height) {
        this.y = -this.radius;
    }
    if (this.y + this.radius + elapsed * this.vy < 0) {
        this.y = height + this.radius;
    }
    this.x += this.vx * elapsed;
    this.y += this.vy * elapsed;
    this.time += elapsed;
    this.mouthAngle = Math.abs(Math.sin(2 * Math.PI * this.time));
};
