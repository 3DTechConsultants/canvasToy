class Rect {
    #x;
    #y;
    #height;
    #width;


    constructor(rect) {
        if (!Rect.isValidRect(rect)) {
            throw new Error("invalid Rect Specified");
        }

        this.#width = rect.width;
        this.#height = rect.height;
        this.#x = rect.x;
        this.#y = rect.y;
    }

    static isValidRect(rect) {
        if ('x' in rect && Number.isInteger(rect.x) &&
            'y' in rect && Number.isInteger(rect.y) &&
            'height' in rect && rect.height > 0 &&
            'width' in rect && rect.width > 0
        ) {
            return true;
        } else {
            return false;
        }
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get center() {
        return {
            x: Math.trunc(this.#x + this.width / 2), y: Math.trunc(this.#x + this.#height / 2),
        };
    }

    set height(newHeight) {
        if (newHeight > 0) {
            this.#height = newHeight;
        }
    }

    set width(newWidth) {
        if (newWidth > 0) {
            this.#width = newWidth;
        }
    }

    set x(newX) {
        this.#x = newX;
    }

    set y(newY) {
        this.#y = newY;
    }

    getRect() {
        return { x: this.#x, y: this.#y, height: this.#height, width: this.#width }
    }

    isIntersecting(targetRect) {
        if (!Rect.isValidRect(targetRect)) {
            return false;
        }
        if (this.#x >= targetRect.x + targetRect.width) {
            return false;
        }
        // Check if rect1 is to the left of rect2
        if (this.#x + this.#width <= targetRect.x) {
            return false;
        }
        // Check if rect1 is below rect2
        if (this.#y >= targetRect.y + targetRect.height) {
            return false;
        }
        // Check if rect1 is above rect2
        if (this.#y + this.#height <= targetRect.y) {
            return false;
        }

        // If none of the above conditions are true, the rectangles intersect
        return true;
    }
}
