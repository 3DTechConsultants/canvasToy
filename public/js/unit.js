class Unit {
    static #idCounter = 0;
    static up = { x: 0, y: -1 };
    static down = { x: 0, y: 1 };
    static left = { x: -1, y: 0 };
    static right = { x: 1, y: 0 };
    #id;
    #canvas;
    #rect;
    #collider;
    #color;
    #moveDir;
    #moveSet;
    #viewDist;

    constructor(canvas, rect, collider, viewDist = 5, color = null, moveSet = ['up', 'down', 'left', 'right']) {
        this.#id = Unit.#idCounter++;
        this.#canvas = canvas;
        if (collider && typeof (collider) == 'object' && collider.constructor.name == 'Collider') {
            this.#collider = collider;
        }

        if (Rect.isValidRect(rect)) {
            this.#rect = new Rect(rect);
        }
        else {
            throw new Error("Invalid Rect");

        }

        this.#viewDist = viewDist;
        this.#color = color || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        this.#moveDir = Math.floor(Math.random() * moveSet.length);
        this.#moveSet = moveSet;

    }


    get id() {
        return this.#id;
    }

    get canvas() {
        return this.#canvas;
    }

    get rect() {
        return this.#rect;
    }

    get color() {
        return this.#color;
    }

    get moveSet() {
        return this.#moveSet;
    }

    get moveDir() {
        return this.#moveDir;
    }

    get viewDist() {
        return this.#viewDist;
    }

    get collider() {
        return this.#collider;
    }

    set viewDist(newDist) {
        this.#viewDist = newDist;
    }

    set canvas(newCanvas) {
        this.#canvas = newCanvas;
    }

    set collider(newCollider) {
        if (typeof (newCollider) == 'object' && collider.constructor.name == 'Collider') {
            this.#collider = newCollider;
        }
    }

    set moveSet(newSet) {
        if (Array.isArray(newSet)) {
            this.#moveSet = newSet;
        }
    }

    static getDirection(text) {
        switch (text) {
            case 'up':
                return this.up;
                break;
            case 'down':
                return this.down;
                break;
            case 'left':
                return this.left;
                break;
            case 'right':
                return this.right;
                break;
            default:
                return null;
        }
    }

    getMoveDir() {
        return this.#moveSet[this.#moveDir];
    }

    nextMoveDir() {
        this.#moveDir++
        if (this.#moveDir >= this.moveSet.length) {
            this.#moveDir = 0;
        }
        return this.getMoveDir();
    }

    draw() {
        const ctx = this.#canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = this.#color;
            ctx.fillRect(this.#rect.x, this.#rect.y, this.#rect.width, this.#rect.height);
            ctx.fillStyle = "#000000";
            ctx.strokeRect(this.#rect.x + 1, this.#rect.y + 1, this.#rect.width - 1, this.#rect.height - 1)
            ctx.fillStyle = this.invertColor(this.#color);
            ctx.fillText(this.#id, this.#rect.x + 3, this.#rect.y + 10);
            ctx.fillText(this.#rect.x + "," + this.#rect.y, this.#rect.x + 3, this.#rect.y + 20);
            ctx.fillText(this.#viewDist, this.#rect.x + 3, this.#rect.y + 30);
        }
    }

    erase() {
        const ctx = this.#canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(this.#rect.x, this.#rect.y, this.#rect.width, this.#rect.height);
        }
    }

    move(newX, newY) {
        this.erase();
        this.#rect.x = newX;
        this.#rect.y = newY;
        this.draw();
    }



    cast(direction, castDistance, checkUnits) {
        let rv = [];
        let castBox = {};
        const ctx = this.#canvas.getContext("2d");


        switch (direction) {
            case 'up':
                castBox = {
                    x: this.#rect.x, y: this.#rect.y - castDistance - 1, width: this.#rect.width, height: castDistance
                };
                break;
            case 'down':
                castBox = {
                    x: this.#rect.x, y: this.#rect.y + this.#rect.height + 1, width: this.#rect.width, height: castDistance
                };
                break;
            case 'left':
                castBox = {
                    x: this.#rect.x - castDistance - 1, y: this.#rect.y, width: castDistance, height: this.#rect.height
                };
                break;
            case 'right':
                castBox = {
                    x: this.#rect.x + this.#rect.width + 1, y: this.#rect.y, width: castDistance, height: this.#rect.height
                };
                break;
            default:
                return null;
        }
        //ctx.fillStyle = "#ffffff";
        //ctx.strokeRect(castBox.x, castBox.y, castBox.width, castBox.height);

        if (castBox.x <= 0 || castBox.x + castBox.width >= this.canvas.width) {
            return true;
        }
        if (castBox.y <= 0 || castBox.y + castBox.height >= this.canvas.height) {
            return true;
        }

    }

    invertColor(hex) {
        // Remove the hash at the start of the string
        hex = hex.slice(1);

        // Convert hex to RGB
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);

        // Invert each component
        r = (255 - r).toString(16).padStart(2, '0');
        g = (255 - g).toString(16).padStart(2, '0');
        b = (255 - b).toString(16).padStart(2, '0');

        // Return the inverted color
        return `#${r}${g}${b}`;
    }
}
