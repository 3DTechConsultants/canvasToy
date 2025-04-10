class Collider {
    static #idCounter = 0;
    #id;
    #rect;
    #parent;
    #stayCollisions;
    #onCollisionStart;
    #onCollisionStay;
    #onCollisionEnd;

    constructor(rect, parent,
        startCollisionFunc = function () { console.log("onCollisionStart"); },
        stayCollisionFunc = function () { console.log("onCollisionStay"); },
        endCollisionFunc = function () { console.log("onCollisionEnd"); }) {
        this.#stayCollisions = [];
        if (Rect.isValidRect(rect)) {
            this.#rect = new Rect(rect);
        } else {
            throw new Error('Invalid rect passed');
        }

        if (parent && typeof (parent) == 'object') {
            this.#parent = parent;
            this.#parent.collider = this;
        }

        this.#onCollisionStart = startCollisionFunc;
        this.#onCollisionStay = stayCollisionFunc;
        //this.#onCollisionEnd = endCollisionFunc.bind(this);
    }


    get id() {
        return this.#id;
    }

    get parent() {
        return this.#parent
    }

    get rect() {
        return this.#rect;
    }

    get stayCollisions() {
        return this.#stayCollisions;
    }

    get onCollisionStart() {
        return this.#onCollisionStart;
    }

    get onCollisionStay() {
        return this.#onCollisionStay
    }

    get onCollisionEnd() {
        return this.#onCollisionEnd;
    }

    set parent(newParent) {
        this.#parent = newParent;
    }

    set onCollisionStart(newFunc) {
        this.#onCollisionStart = newFunc;
    }

    set onCollisionStay(newFunc) {
        this.#onCollisionStay = newFunc;
    }

    set onCollisionEnd(newFunc) {
        this.#onCollisionEnd = newFunc;
    }


    checkCollisions(checkTargets) {
        let currentCollisions = [];
        let newCollisions = [];
        let existingCollisions = [];

        for (let target of checkTargets) {
            // Perform the intersection check once
            let isIntersecting = this.#rect.isIntersecting(target.collider.rect.getRect());
            if (!isIntersecting || target.collider === this) {
                continue;
            }
            currentCollisions.push(target);
        }


        // Classify collisions into new and existing
        for (let target of currentCollisions) {
            if (!this.#stayCollisions.includes(target)) {
                newCollisions.push(target);
            } else {
                existingCollisions.push(target);
            }
        }

        // Handle new collisions
        for (let collision of newCollisions) {
            if (typeof this.#onCollisionStart === 'function') {
                const direction = this.#calculateCollisionDirection(collision.collider.rect);
                this.#onCollisionStart(collision);
            }
        }

        // Handle ongoing collisions
        for (let collision of existingCollisions) {
            if (typeof this.#onCollisionStay === 'function') {
                const direction = this.#calculateCollisionDirection(collision.collider.rect);
                this.#onCollisionStay(collision);
            }
            this.ejectCollider(collision);
        }

        // Handle ended collisions
        let endedCollisions = this.#stayCollisions.filter(target => !currentCollisions.includes(target));
        for (let collision of endedCollisions) {
            if (typeof this.#onCollisionEnd === 'function') {
                const direction = this.#calculateCollisionDirection(collision.collider.rect);
                this.#onCollisionEnd(direction);
            }
        }

        // Update the stayCollisions array
        this.#stayCollisions = currentCollisions;
    }

    ejectCollider(collidingObject) {

    }
    #calculateCollisionDirection(targetRect) {
        // Get the centers of both rectangles
        const thisCenter = this.#rect.center;
        const targetCenter = targetRect.center;

        // Calculate the differences in the center positions
        const dx = targetCenter.x - thisCenter.x;
        const dy = targetCenter.y - thisCenter.y;

        // Calculate the combined half-widths and half-heights
        const combinedHalfWidths = (this.#rect.width / 2) + (targetRect.width / 2);
        const combinedHalfHeights = (this.#rect.height / 2) + (targetRect.height / 2);

        // Determine the collision direction
        if (Math.abs(dx) / combinedHalfWidths > Math.abs(dy) / combinedHalfHeights) {
            return dx > 0 ? Geometry.right : Geometry.left;
        } else {
            return dy > 0 ? Geometry.down : Geometry.up;
        }
    }


}
