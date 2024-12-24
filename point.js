export class Point {
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

    /**
     * Returns true if the point [x, y] is closer than distance to the initial position of this point 
     */
    isClose(x, y, distance) {
        return Math.sqrt((this.initX - x)**2 + (this.initY - y)**2) <= distance
    }
}