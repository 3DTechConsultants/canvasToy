class Unit {
    static #idCounter = 0;
    #id;
    #canvas;
    #rect;
    #collider;
    #color;
    #moveDir;
    #viewDist;

    constructor(canvas, rect, collider, moveDir, viewDist = 5, color = null) {
        this.#id = Unit.#idCounter++;
        this.#canvas = canvas;
        if (collider && typeof (collider) == 'object' && collider.constructor.name == 'Collider') {
            this.#collider = collider;
            collider.parent = this;
        }

        if (Rect.isValidRect(rect)) {
            this.#rect = new Rect(rect);
        }
        else {
            throw new Error("Invalid Rect");

        }
        this.#moveDir = moveDir || Geometry.getRandomDirection();
        this.#viewDist = viewDist;
        this.#color = color || `#${Math.floor(Math.random() * 16777215).toString(16)}`;

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

    get moveDir() {
        return this.#moveDir;
    }

    get collider() {
        return this.#collider;
    }

    set moveDir(newMoveDir) {
        if (newMoveDir && typeof (newMoveDir) == 'object') {
            this.#moveDir = newMoveDir;
        }
    }

    set canvas(newCanvas) {
        this.#canvas = newCanvas;
    }

    set collider(newCollider) {
        if (typeof (newCollider) == 'object' && newCollider.constructor.name == 'Collider') {
            this.#collider = newCollider;
        }
    }

    draw() {
        const ctx = this.#canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        if (ctx) {
            ctx.fillStyle = this.#color;
            ctx.fillRect(this.#rect.x, this.#rect.y, this.#rect.width, this.#rect.height);
            ctx.strokeStyle = "#FFFFFF";
            ctx.strokeRect(this.#rect.x + 1, this.#rect.y + 1, this.#rect.width - 1, this.#rect.height - 1)
            ctx.fillStyle = "this.invertColor(this.#color)";
            ctx.fillStyle = this.invertColor(this.#color);
            ctx.fillText(this.#id, this.#rect.x + 3, this.#rect.y + 10);
            ctx.fillText(this.#rect.x + "," + this.#rect.y, this.#rect.x + 3, this.#rect.y + 20);
            ctx.fillText(this.#viewDist, this.#rect.x + 3, this.#rect.y + 30);
        }
    }

    move() {
        if (this.#collider) {
            this.#collider.rect.x = this.#collider.rect.x + this.moveDir.x;
            this.#collider.rect.y = this.#collider.rect.y + this.#moveDir.y;
        }
        this.#rect.x += this.#moveDir.x;
        this.#rect.y += this.#moveDir.y;
    }

    moveTo(newX, newY) {
        // Calculate the relative movement
        const deltaX = newX - this.#rect.x;
        const deltaY = newY - this.#rect.y;

        // Update the unit's position
        this.#rect.x = newX;
        this.#rect.y = newY;

        // If the unit has a collider, move it by the relative values
        if (this.#collider) {
            this.#collider.rect.x += deltaX;
            this.#collider.rect.y += deltaY;
        }
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
