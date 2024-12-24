import { Point } from './point.js';
// CONFIGURATION 
// Frames per second
const FPS = 60;
// Time in seconds for the amplitude to decay to A / e.
const TAU = 0.5
// Frequency of the oscilation
const FREQUENCY = 3;
// Not rly force per se. The larger the number the bigger the cursor impact on the wave interface when crossing.
const MOUSE_FORCE = 10;
const VERTICAL_POINT_COUNT = 6;


// CALCULATED PROPERTIES
const TIME_STEP_MS = 1000 / FPS;
const TIME_STEP_S = 1 / FPS;
// The amplitude decayes with e^(-DELTA * t)
const DELTA = 1 / TAU;
// This also ensures that DELTA^2 < OMEGA_0^2
const OMEGA_0_SQUARED = DELTA**2 + (2 * Math.PI * FREQUENCY)**2;


// VARIABLE PROPERTIES
let windowWidth = 0;
let windowHeight = 0;
let verticalPoints = [];
// Gap between neigbouring points
let verticalGap = 0;
// Position of the wave interface
let waveInterfaceX = 0;

let mouseX = 0;
let mouseY = 0;
let mouseVX = 0;
let mouseVY = 0;

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
    }, TIME_STEP_MS);
}


function initialiseCanvas(width, height) {
    canvas.height = height;
    canvas.width = width;
    windowWidth = width;
    windowHeight = height;
    waveInterfaceX = windowWidth / 4;
    verticalGap = windowHeight / (VERTICAL_POINT_COUNT - 1);
    verticalPoints = new Array(VERTICAL_POINT_COUNT).fill(0).map((_, i) => (
        new Point(
            windowWidth - waveInterfaceX,
            i * verticalGap,
            0,
            0
        )
    ));
}


function update() {
    for (const p of verticalPoints) {
        if (p.isClose(mouseX, mouseY, verticalGap)) {
            p.vx = mouseVX * MOUSE_FORCE;
        } else {
            p.x = p.x + p.vx * TIME_STEP_S;
            p.vx = p.vx * (1 - 2 * DELTA * TIME_STEP_S) - OMEGA_0_SQUARED * TIME_STEP_S * p.amplitudeX();
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
    ctx.closePath();
    ctx.fillStyle = '#f56c6c'; 
    ctx.fill(); 
}

main();