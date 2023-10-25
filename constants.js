const A = new Point(200, 200)
const B = new Point(200, 1000)
const C = new Point(1000, 1000)
const D = new Point(1000, 200)
let points = [A, B, C, D]
const scale = 2;

const canvas = document.getElementById("canvas_1");
const context = canvas.getContext('2d');
const DIMENSIONS = {
    width: 1200,
    height: 1200,
}