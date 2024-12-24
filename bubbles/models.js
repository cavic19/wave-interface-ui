import { Point } from '../point.js';

export class Bubble {
    constructor(centerX, centerY, radius) {
        this.center = { x: centerX, y: centerY };
        this.points = Bubble.regularPolygonPoints(centerX, centerY, radius, 6);
    }

    get edgeLength() {
        const a = this.points[0];
        const b = this.points[1];

        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    /**
     * Calculate points of regular pentagon of N degree, given its center coordinates
     * and radius.
     * @returns 
     */
    static regularPolygonPoints(centerX, centerY, radius, n) {
        const points = [];
        // Each side subtends an angle of (2π / n).
        const angleIncrement = (2 * Math.PI) / n;

        for (let i = 0; i < n; i++) {
            const angle = angleIncrement * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            points.push(new Point(x, y, 0, 0));
        }
        return points;
    }
}
