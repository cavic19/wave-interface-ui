import {Bubble} from "./models.js";

// CONFIGURATION 
// Frames per second
const FPS = 60;
// Time in seconds for the amplitude to decay to A / e.
const TAU = 0.5
// Frequency of the oscilation
const FREQUENCY = 3;
// Not rly force per se. The larger the number the bigger the cursor impact on the wave interface when crossing.
const MOUSE_FORCE = 3;

// CALCULATED PROPERTIES
const TIME_STEP_MS = 1000 / FPS;
const TIME_STEP_S = 1 / FPS;
// The amplitude decayes with e^(-DELTA * t)
const DELTA = 1 / TAU;
// This also ensures that DELTA^2 < OMEGA_0^2
const OMEGA_0_SQUARED = DELTA**2 + (2 * Math.PI * FREQUENCY)**2;


let windowWidth = 0;
let windowHeight = 0;
let mouseX = 0;
let mouseY = 0;
let mouseVX = 0;
let mouseVY = 0;
let bubbles = [];


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

function draw() {
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    for (const bubble of bubbles) {
        drawBubble(bubble);
    }
}

function drawBubble(bubble) {
    const points = bubble.points;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length; i++) {
        const startPoint = points[i];
        const endPoint = points.at(i + 1) ?? points[0]
        const [cp1, cp2] = bezierControlPoints(
            bubble.center.x,
            bubble.center.y,
            startPoint.x,
            startPoint.y,
            endPoint.x,
            endPoint.y
        );
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endPoint.x, endPoint.y);
    }
    ctx.closePath();
    ctx.fillStyle = '#FF8A6D'; 
    ctx.fill(); 
}


function update() {
    for (const bubble of bubbles) {
        for (const p of bubble.points) {
            if (p.isClose(mouseX, mouseY, bubble.edgeLength / 2)) {
                p.vx = mouseVX * MOUSE_FORCE;
                p.vy = mouseVY * MOUSE_FORCE;
            } else {
                // Evolve x
                p.vx = p.vx * (1 - 2 * DELTA * TIME_STEP_S) - OMEGA_0_SQUARED * TIME_STEP_S * p.amplitudeX();
                p.x += + p.vx * TIME_STEP_S;

                // Evolve y
                p.vy = p.vy * (1 - 2 * DELTA * TIME_STEP_S) - OMEGA_0_SQUARED * TIME_STEP_S * p.amplitudeY();
                p.y += p.vy * TIME_STEP_S;
            }
        }
    }
}

/**
 * Initialise canvas, that means create all the bubbles + their point and initialsie them to velocity zero.
 */
function initialiseCanvas(width, height) {
    canvas.height = height;
    canvas.width = width;
    windowWidth = width;
    windowHeight = height;
    bubbles = [];
    for (const dom of document.querySelectorAll(".bubble")) {
        // If user scroll we would need to account for scrolling as well. Window.scrollX or smthing liek that 
        const rect = dom.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const diagonal = Math.sqrt(rect.width ** 2 + rect.height ** 2);

        bubbles.push(new Bubble(centerX, centerY, diagonal / 2 + 32));
    }
}


/**
 * Calculate cubic bezier control points to 
 * mimic a circel arch spanning from [x1, y1] to [x4, y4]
 * with center (of the circle) at [xc, yc].
 * 
 * Taken from: https://stackoverflow.com/a/44829356/13243424
 */
function bezierControlPoints(xc, yc, x1, y1, x4, y4) {
    let ax = x1 - xc
    let ay = y1 - yc
    let bx = x4 - xc
    let by = y4 - yc
    let q1 = ax * ax + ay * ay
    let q2 = q1 + ax * bx + ay * by
    let k2 = (4 / 3) * (Math.sqrt(2 * q1 * q2) - q2) / (ax * by - ay * bx)

    let x2 = xc + ax - k2 * ay
    let y2 = yc + ay + k2 * ax
    let x3 = xc + bx + k2 * by
    let y3 = yc + by - k2 * bx

    return [
        { x: x2, y: y2 },
        { x: x3, y: y3 },
    ]
}

main();