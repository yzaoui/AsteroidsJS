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

function drawAsteroid(ctx, radius, shape, options_) {
    let options = options_ || {};
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";
    ctx.save();

    ctx.beginPath();
    for (let i = 0; i < shape.length; i++) {
        ctx.rotate(2 * Math.PI / shape.length);
        ctx.lineTo(radius + radius * options.noise * shape[i], 0);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (options.guide) {
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 0.2;
        ctx.arc(0, 0, radius * (1 + options.noise), 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * (1 - options.noise), 0, 2 * Math.PI);
        ctx.stroke();
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

    if (options.forwardThrusterOn) {
        ctx.save();

        ctx.strokeStyle = "yellow";
        ctx.fillStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(
            Math.cos(Math.PI + angle * 0.8) * radius / 2,
            Math.sin(Math.PI + angle * 0.8) * radius / 2
        );
        ctx.quadraticCurveTo(
            -radius * 2,
            0,
            Math.cos(Math.PI - angle * 0.8) * radius / 2,
            Math.sin(Math.PI - angle * 0.8) * radius / 2
        );
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

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

function drawPacman(ctx, radius, openFactor) {
    let angle = 0.2 * Math.PI * openFactor;

    ctx.save();

    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle, -angle);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawGhost(ctx, bodyHeight, options_) {
    let options = options_ || {};
    let ridges = options.ridges || 4;
    let bodyWidth = bodyHeight * 0.8;
    let ridgeRadius = bodyWidth / ridges;

    ctx.save();

    ctx.strokeStyle = options.strokeStyle || "white";
    ctx.fillStyle = options.fillStyle || "red";
    ctx.lineWidth = options.lineWidth || bodyHeight * 0.05;

    // Assuming center of ghost is at (0,0)
    ctx.beginPath();

    for (let ridge = 0; ridge < ridges; ridge++) {
        ctx.arc(
            (2 * ridgeRadius * (ridges - ridge)) - bodyWidth - ridgeRadius,
            bodyHeight - ridgeRadius,
            ridgeRadius,
            0,
            Math.PI
        );
    }
    ctx.arc(0, bodyWidth - bodyHeight, bodyWidth, Math.PI, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    /* Eyes */
    let horizontalEyeDistanceFromCenter = bodyWidth * 0.4;
    let verticalEyeDistanceFromCenter = bodyHeight * 0.25;
    let eyeRadius = bodyWidth * 0.3;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-horizontalEyeDistanceFromCenter, -verticalEyeDistanceFromCenter, eyeRadius, 0, 2 * Math.PI);
    ctx.moveTo(horizontalEyeDistanceFromCenter, -verticalEyeDistanceFromCenter);
    ctx.arc(horizontalEyeDistanceFromCenter, -verticalEyeDistanceFromCenter, eyeRadius, 0, 2 * Math.PI);
    ctx.fill();

    /* Pupils */
    let horizontalDistanceFromCenterOfEye = eyeRadius * 0.3;
    let pupilRadius = eyeRadius * 0.5;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(horizontalEyeDistanceFromCenter - horizontalDistanceFromCenterOfEye, -verticalEyeDistanceFromCenter, pupilRadius, 0, 2 * Math.PI);
    ctx.moveTo(-horizontalEyeDistanceFromCenter - horizontalDistanceFromCenterOfEye, -verticalEyeDistanceFromCenter);
    ctx.arc(-horizontalEyeDistanceFromCenter - horizontalDistanceFromCenterOfEye, -verticalEyeDistanceFromCenter, pupilRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
}
