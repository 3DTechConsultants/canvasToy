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
        if (Rect.isValidRect(rect)) {
            this.#rect = new Rect(rect);
        } else {
            throw new Error('Invalid rect passed');
        }
        this.#stayCollisions = [];
        this.#id = Collider.#idCounter++;
        this.#parent = parent;
        this.#onCollisionStart = startCollisionFunc;
        this.#onCollisionStay = stayCollisionFunc;
        this.#onCollisionEnd = endCollisionFunc;
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

    set onCollisionStart(newFunc = function () { console.log("onCollisionStart"); }) {
        this.#onCollisionStart = newFunc;
    }

    set onCollisionStay(newFunc = function () { console.log("onCollisionStay"); }) {
        this.#onCollisionStay = newFunc;
    }

    set onCollisionEnd(newFunc = function () { console.log("onCollisionEnd"); }) {
        this.#onCollisionEnd = newFunc;
    }


    checkCollisions(checkTargets) {
        let currentCollisions = [];
        for (let target of checkTargets) {
            if (!this.#rect.isIntersecting(target.rect.getRect())) {
                continue;
            }
            if (target === this) {
                continue;
            }
            currentCollisions.push(target);

            //First handle any new collisions
            let newCollisions = currentCollisions.filter(target => !this.#stayCollisions.includes(target));
            for (let collision of newCollisions) {
                if (typeof (this.#onCollisionStart) == 'function') {
                    this.#onCollisionStart(target);
                }
            }

            //Then any collisions that are ongoing
            let existingCollisions = currentCollisions.filter(target => this.#stayCollisions.includes(target));
            for (let collision of existingCollisions) {
                if (typeof (this.#onCollisionStay) == 'function') {
                    this.#onCollisionStay(target);
                }
            }

            //Finally ended collisions.
            let endedCollisions = this.#stayCollisions.filter(target => !currentCollisions.includes(target));
            for (let collision of endedCollisions) {
                if (typeof (this.#onCollisionEnd) == 'function') {
                    this.#onCollisionEnd(target);
                }
            }

            this.#stayCollisions = currentCollisions;
        }
    }
}
