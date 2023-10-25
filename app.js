let paths = []

const initCanvas = (dimensions) => {
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
}

const drawCurve = (samples = 100, ease_fn = easeNone) => {
    for (let i = 0; i <= samples; i++) {
        let t = i / samples;
        t = ease_fn(t);
        let bezierPoints = getQuadraticBezierCurvePoints(t);
        paths.push(bezierPoints.ABBCBCCD)
    }


    for (let i = 0; i < paths.length; i++) {
        context.beginPath();
        const x = paths[i].x;
        const y = paths[i].y;
        context.arc(x, y, 4, 0, Math.PI * 2);
        context.fillStyle = "#f0500055"
        context.fill()
        context.closePath();
    }

    context.beginPath();
    context.moveTo(paths[0].x, paths[0].y);
    for(let i = 1; i < paths.length; i++){
        const x = paths[i].x;
        const y = paths[i].y;
        context.lineTo(x,y);
    }
    context.strokeStyle = "#ff000055"
    context.stroke();
    context.closePath();

    context.strokeStyle = "#000"

    paths = [];
}

const animateCurve = (ease_fn = easeNone, speed = 1) => {
    const timestamp = new Date().getTime() / 1000;
    const sin_t = (Math.sin(speed * timestamp * Math.PI) + 1) / 2;
    const sin_t_eased = ease_fn(sin_t)
    const {AB, BC, CD, ABBC, BCCD, ABBCBCCD} = getQuadraticBezierCurvePoints(sin_t_eased)
    drawCurve(samples, ease_fn);

    drawLine(A, B, 1);
    drawLine(B, C, 0.05);
    drawLine(C, D, 1);

    drawPoint(A, 30, "A", 1);
    drawPoint(B, 30, "B", 1);
    drawPoint(C, 30, "C", 1);
    drawPoint(D, 30, "D", 1);

    drawLine(AB, BC, 0.05);
    drawLine(BC, CD, 0.05);


    drawPoint(AB, 5, "", 0.2);
    drawPoint(BC, 5, "", 0.2);
    drawPoint(CD, 5, "", 0.2);

    drawLine(ABBC, BCCD, 0.1);

    drawPoint(ABBC, 5, "", 0.3);
    drawPoint(BCCD, 5, "", 0.3);

    drawPoint(ABBCBCCD, 30, "E");
}

const getQuadraticBezierCurvePoints = (t) => {
    const AB = new Point(
        lerp(A.x, B.x, t),
        lerp(A.y, B.y, t)
    )
    const BC = new Point(
        lerp(B.x, C.x, t),
        lerp(B.y, C.y, t)
    )
    const CD = new Point(
        lerp(C.x, D.x, t),
        lerp(C.y, D.y, t)
    )

    const ABBC = new Point(
        lerp(AB.x, BC.x, t),
        lerp(AB.y, BC.y, t)
    )

    const BCCD = new Point(
        lerp(BC.x, CD.x, t),
        lerp(BC.y, CD.y, t)
    )

    const ABBCBCCD = new Point(
        lerp(ABBC.x, BCCD.x, t),
        lerp(ABBC.y, BCCD.y, t)
    )

    return {AB, BC, CD, ABBC, BCCD, ABBCBCCD}
}

const animateCanvas = (fn) => {
    context.clearRect(0, 0, DIMENSIONS.width, DIMENSIONS.height);
    fn();
    requestAnimationFrame(() => { animateCanvas(fn) })
}

const lerp = (A, B, t) => {
    // a + (b-a) * t
    // a + (b*t - a*t)
    // a * (1-t) + (b*t)
    return A * (1 - t) + (B * t)
}

const drawPoint = (point, radius, label, alpha = 1) => {
    context.globalAlpha = alpha;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.lineWidth = 2;
    context.fillStyle = "#fff";
    context.fill()
    context.stroke();
    context.closePath();
    context.beginPath();
    context.fillStyle = "#000"
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = radius + "px sans-serif";
    context.fillText(label, point.x, point.y);
    context.closePath();
    context.globalAlpha = 1;
}

const drawLine = (pointA, pointB, alpha = 1) => {
    context.globalAlpha = alpha;

    context.beginPath();

    context.moveTo(pointA.x, pointA.y);
    context.lineTo(pointB.x, pointB.y);

    context.lineWidth = 1;
    context.stroke();
    context.closePath();


    context.globalAlpha = 1;
}

const lerp_ver1 = () => {
    animateCanvas(() => { animateCurve(easeInOutCubic, 1 / 5) });
}


initCanvas(DIMENSIONS);
lerp_ver1();