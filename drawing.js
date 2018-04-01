function drawGrid(ctx, minor_, major_, stroke_, fill_) {
    let minor = minor_ || 10;
    let major = major_ || minor * 5;
    let stroke = stroke_ || "#00FF00";
    let fill = fill_ || "#009900";

    ctx.save();

    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;

    for (let x = 0; x < width; x += minor) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.lineWidth = (x % major === 0) ? 0.5 : 0.25;
        ctx.stroke();
        if (x % major === 0) {
            ctx.fillText(x.toString(), x, 10);
        }
    }

    for (let y = 0; y < height; y += minor) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.lineWidth = (y % major === 0) ? 0.5 : 0.25;
        ctx.stroke();
        if (y % major === 0) {
            ctx.fillText(y.toString(), 0, y + 10);
        }
    }

    ctx.restore();
}

function drawShip(ctx, x, y, radius, options) {
    options = options || {};

    ctx.save();

    // Optionally draw collision radius display
    if (options.guide) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill()
    }

    // Default values
    ctx.lineWidth = options.lineWidth || 2;
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";
    let angle = (options.angle || 0.5 * Math.PI) / 2;

    // Draw ship
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(
        x + Math.cos(Math.PI - angle) * radius,
        y + Math.sin(Math.PI - angle) * radius,
    );
    ctx.lineTo(
        x + Math.cos(Math.PI + angle) * radius,
        y + Math.sin(Math.PI + angle) * radius,
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawPacman(ctx, x, y, radius, openFactor) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0.25 * Math.PI * openFactor, -0.25 * Math.PI * openFactor);
    ctx.lineTo(x, y);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.restore();
}
