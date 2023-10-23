const DIMENSIONS = {
    width: 1200,
    height: 1200,
}

const canvas = document.getElementById("canvas_1");
canvas.width = DIMENSIONS.width;
canvas.height = DIMENSIONS.height;
const context = canvas.getContext('2d');

const animating = true;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const A = new Point(200, 200)
const B = new Point(200, 1000)
const C = new Point(1000, 1000)
const D = new Point(1000, 200)

let samples = 0;

let paths = []

const drawCurve = (samples = 100, ease_fn=easeNone) => {
    for(let i = 0; i <= samples; i++){
        let t = i / samples;
        t = ease_fn(t);
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
        paths.push(ABBCBCCD)
    }


    for(let i = 0; i < paths.length; i++){
        context.beginPath();
        const x = paths[i].x;
        const y = paths[i].y;
        context.arc(x, y, 4, 0, Math.PI * 2);
        context.fillStyle = "#f0500055"
        context.fill()
        context.closePath();
    }
    
    // context.beginPath();
    // context.moveTo(paths[0].x, paths[0].y);
    // for(let i = 1; i < paths.length; i++){
    //     const x = paths[i].x;
    //     const y = paths[i].y;
    //     context.lineTo(x,y);
    // }
    // context.strokeStyle = "#f00"
    // context.stroke();
    // context.closePath();

    context.strokeStyle = "#000"

    paths = [];
}

const animatePointC = (ease_fn = easeNone, speed = 1) => {
    const timestamp = new Date().getTime() / 1000;
    const sin_t = (Math.sin(speed * timestamp * Math.PI) + 1) / 2;
    const sin_t_eased = ease_fn(sin_t)
    const AB = new Point(
        lerp(A.x, B.x, sin_t_eased),
        lerp(A.y, B.y, sin_t_eased)
    )
    const BC = new Point(
        lerp(B.x, C.x, sin_t_eased),
        lerp(B.y, C.y, sin_t_eased)
    )
    const CD = new Point(
        lerp(C.x, D.x, sin_t_eased),
        lerp(C.y, D.y, sin_t_eased)
    )

    const ABBC = new Point(
        lerp(AB.x, BC.x, sin_t_eased),
        lerp(AB.y, BC.y, sin_t_eased)
    )

    const BCCD = new Point(
        lerp(BC.x, CD.x, sin_t_eased),
        lerp(BC.y, CD.y, sin_t_eased)
    )

    const ABBCBCCD = new Point(
        lerp(ABBC.x, BCCD.x, sin_t_eased),
        lerp(ABBC.y, BCCD.y, sin_t_eased)
    )
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

const drawPoint = (point, radius, label, alpha=1) => {
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

const drawLine = (pointA, pointB, alpha=1) => {
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
    animateCanvas(() => { animatePointC(easeInOutCubic, 1/5) });
}

lerp_ver1();

let points = [A, B, C, D]
const scale = 2;

const getHoldPoint = (point1, radius=30) => {
    for(let i = 0; i < points.length; i++){
        const point2 = points[i];
        const distance = getDistance(point1.x, point1.y, point2.x, point2.y)
        if(distance <= radius){
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

    if(onHold){
        if(holdedPoint){
            holdedPoint.x = mousePos.x;
            holdedPoint.y = mousePos.y;
        }
        else{
            if(prevMousePos.x != undefined){
                const deltaPos = {
                    x: mousePos.x - prevMousePos.x,
                    y: mousePos.y - prevMousePos.y
                }

                for(let i = 0; i < points.length; i++){
                    points[i].x += deltaPos.x;
                    points[i].y += deltaPos.y;
                }
            }
        }
    }
    prevMousePos = {...mousePos}
});

canvas.addEventListener('mousedown', () => {
    onHold = true;
    if(!holdedPoint){
        holdedPoint = getHoldPoint(mousePos, 30)
    }
});

canvas.addEventListener('mouseup', () => {
    onHold = false
    holdedPoint = null;
});



const slider = document.getElementById('slider');
samples = slider.value;

slider.addEventListener('input', () => {
    samples = slider.value * Math.sqrt(slider_m.value);
    samples = Math.floor(samples)
});

const slider_m = document.getElementById('slider2');
samples = slider.value * slider_m.value;
slider_m.addEventListener('input', () => {
    samples = slider.value * Math.sqrt(slider_m.value);
    samples = Math.floor(samples)
});