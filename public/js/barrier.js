class Barrier {
    #rect;
    #collider;
    #canvas;

    constructor(canvas, rect) {
        if (!Rect.isValidRect(rect)) {
            throw new Error("Invalid Rect");
        }

        this.#canvas = canvas;
        this.#rect = new Rect(rect);
        this.#collider = new Collider(this.#rect.getRect(), this);
    }

    // Getters
    get rect() {
        return this.#rect;
    }

    get collider() {
        return this.#collider;
    }

    get canvas() {
        return this.#canvas;
    }

    // Setters
    set rect(newRect) {
        if (Rect.isValidRect(newRect)) {
            this.#rect = new Rect(newRect);
            if (this.#collider) {
                this.#collider.rect = this.#rect.getRect();
            }
        } else {
            throw new Error("Invalid Rect");
        }
    }

    set collider(newCollider) {
        if (newCollider && typeof newCollider === "object" && newCollider.constructor.name === "Collider") {
            this.#collider = newCollider;
        } else {
            throw new Error("Invalid Collider");
        }
    }

    set canvas(newCanvas) {
        this.#canvas = newCanvas;
    }

    // Draw the barrier on the canvas
    draw() {
        const ctx = this.#canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "#000000"; // Default wall color
            ctx.fillRect(this.#rect.x, this.#rect.y, this.#rect.width, this.#rect.height);
            ctx.strokeStyle = "#FFFFFF"; // Outline color
            ctx.strokeRect(this.#rect.x, this.#rect.y, this.#rect.width, this.#rect.height);
        }
    }
}