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

function drawPacman(ctx, x, y, radius, openPercentage) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0.25 * Math.PI * openPercentage, -0.25 * Math.PI * openPercentage);
    ctx.lineTo(x, y);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.restore();
}
