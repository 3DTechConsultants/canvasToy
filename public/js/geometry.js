class Geometry {
    static up = { x: 0, y: -1, text: 'UP' };
    static down = { x: 0, y: 1, text: 'DOWN' };
    static left = { x: -1, y: 0, text: 'LEFT' };
    static right = { x: 1, y: 0, text: 'RIGHT' };

    static getRandomDirection() {
        const directions = [this.up, this.down, this.left, this.right];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    static getOppositeDirection(direction) {
        if (direction === this.up) return this.down;
        if (direction === this.down) return this.up;
        if (direction === this.left) return this.right;
        if (direction === this.right) return this.left;
        return null;
    }
}