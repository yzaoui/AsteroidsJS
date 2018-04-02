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

function drawShip(ctx, radius, options) {
    options = options || {};
    let angle = (options.angle || 0.5 * Math.PI) / 2;
    let curveBack = options.curveBack || 0.25;
    let curvePointBack = {x: -radius * curveBack, y: 0};
    let curveSides = options.curveSides || 0.75;

    ctx.save();

    // Guide circle for ship radius
    if (options.guide) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    ctx.lineWidth = options.lineWidth || 2;
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.quadraticCurveTo(
        Math.cos(angle) * radius * curveSides,
        Math.sin(angle) * radius * curveSides,
        Math.cos(Math.PI - angle) * radius,
        Math.sin(Math.PI - angle) * radius
    );
    ctx.quadraticCurveTo(
        curvePointBack.x,
        curvePointBack.y,
        Math.cos(Math.PI + angle) * radius,
        Math.sin(Math.PI + angle) * radius
    );
    ctx.quadraticCurveTo(
        Math.cos(-angle) * radius * curveSides,
        Math.sin(-angle) * radius * curveSides,
        radius,
        0
    );
    ctx.fill();
    ctx.stroke();

    // Guide line / point for the curve-pulling point
    if (options.guide) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.lineWidth = 0.5;

        // Draw the three axes
        ctx.beginPath();
        ctx.moveTo(
            Math.cos(-angle) * radius,
            Math.sin(-angle) * radius
        );
        ctx.lineTo(0, 0);
        ctx.moveTo(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        );
        ctx.lineTo(0, 0);
        ctx.moveTo(
            -radius,
            0
        );
        ctx.lineTo(0, 0);
        ctx.stroke();

        // Draw the three control points
        ctx.beginPath();
        ctx.arc(
            Math.cos(angle) * radius * curveSides,
            Math.sin(angle) * radius * curveSides,
            radius / 40,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
            Math.cos(-angle) * radius * curveSides,
            Math.sin(-angle) * radius * curveSides,
            radius / 40,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
            curvePointBack.x,
            curvePointBack.y,
            radius / 50,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }

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
