const getHoldPoint = (point1, radius = 30) => {
    for (let i = 0; i < points.length; i++) {
        const point2 = points[i];
        const distance = getDistance(point1.x, point1.y, point2.x, point2.y)
        if (distance <= radius) {
            return points[i];
        }
    }
}

const getDistance = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
let prevMousePos = {

}
const mousePos = {

}
let onHold = false;
let holdedPoint = null;

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mousePos.x = x * scale;
    mousePos.y = y * scale;

    if (onHold) {
        if (holdedPoint) {
            holdedPoint.x = mousePos.x;
            holdedPoint.y = mousePos.y;
        }
        else {
            if (prevMousePos.x != undefined) {
                const deltaPos = {
                    x: mousePos.x - prevMousePos.x,
                    y: mousePos.y - prevMousePos.y
                }

                for (let i = 0; i < points.length; i++) {
                    points[i].x += deltaPos.x;
                    points[i].y += deltaPos.y;
                }
            }
        }
    }
    prevMousePos = { ...mousePos }
});

canvas.addEventListener('mousedown', () => {
    onHold = true;
    if (!holdedPoint) {
        holdedPoint = getHoldPoint(mousePos, 30)
    }
});

canvas.addEventListener('mouseup', () => {
    onHold = false
    holdedPoint = null;
});
