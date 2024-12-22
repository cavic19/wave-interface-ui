const FPS = 60;
const TIME_STEP = 1000 / FPS;
const VERTICAL_POINT_COUNT = 6;
const MOUSE_PEN_DEPTH = 90;
const MOUSE_FORCE = 0.5;


const DELTA = 0.05;
// This conversion doesn't rly work...
const FREQUENCY = 1 / TIME_STEP;
const OMEGA_0 = 2 * Math.PI * FREQUENCY;


let windowWidth = 0;
let windowHeight = 0;
let verticalPoints = [];
let waveBlockWidth = 0;

let mouseX = 0;
let mouseY = 0;
let mouseVX = 0;
let mouseVY = 0;

class Point {
    constructor(x, y, vx, vy) {
        this.initX = x;
        this.initY = y;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    amplitudeX() {
        return this.x - this.initX;
    }
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener('resize', (e) => {
    initialiseCanvas(e.target.innerWidth, e.target.innerHeight);
}, true);


document.addEventListener('mousemove', (e) => {
    mouseVX = e.pageX - mouseX;
    mouseVY = e.pageY - mouseY;
    mouseX = e.pageX;
    mouseY = e.pageY;
});


function main() {
    initialiseCanvas(window.innerWidth, window.innerHeight);
    setInterval(() => {
        update();
        draw();
    }, TIME_STEP);
}


function initialiseCanvas(width, height) {
    canvas.height = height;
    canvas.width = width;
    windowWidth = width;
    windowHeight = height;
    waveBlockWidth = windowWidth / 4;
    verticalGap = windowHeight / (VERTICAL_POINT_COUNT - 1);
    verticalPoints = new Array(VERTICAL_POINT_COUNT).fill(0).map((_, i) => (
        new Point(
            windowWidth - waveBlockWidth,
            i * verticalGap,
            0,
            0
        )
    ));
}


function update() {
    for (const p of verticalPoints) {
        const mouseDistanceX = Math.abs(p.initX - mouseX);
        const mouseDistanceY = Math.abs(p.initY - mouseY);
        if (mouseDistanceX < MOUSE_PEN_DEPTH && mouseDistanceY < verticalGap) {
            // p.x = mouseX;
            p.vx = mouseVX * MOUSE_FORCE;
        } else {
            p.vx = p.vx * (1 - 2 * DELTA) - OMEGA_0 ** 2 * p.amplitudeX();
            p.x = p.x + p.vx;
        }
    }
}


function draw() {
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.beginPath();
    ctx.moveTo(windowWidth, 0);
    ctx.lineTo(verticalPoints.at(0).x, verticalPoints.at(0).y);
    for (let i = 0; i < VERTICAL_POINT_COUNT - 1; i++) {
        const point = verticalPoints[i];
        const nextPoint = verticalPoints[i + 1];
        const cX = (point.x + nextPoint.x) / 2;
        const cY = (point.y + nextPoint.y) / 2;
        ctx.bezierCurveTo(point.x, point.y, cX, cY, cX, cY);
    }
    ctx.lineTo(verticalPoints.at(-1).x, verticalPoints.at(-1).y);
    ctx.lineTo(windowWidth, windowHeight);
    ctx.closePath(); // Close the path to form a shape
    ctx.fillStyle = '#f56c6c'; // Set fill color
    ctx.fill(); // Fill the shape
}

main();