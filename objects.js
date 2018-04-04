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
