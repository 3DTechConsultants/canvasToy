const onscreenCanvas = document.getElementById('canvas');
const gameObjects = [];
let run = true;


document.getElementById('stop').addEventListener("click", function () { run = false; })
document.getElementById('canvas').addEventListener('mousemove', (event) => {
    // Get the mouse position relative to the canvas
    const rect = onscreenCanvas.getBoundingClientRect();
    mouseX = Math.trunc(event.clientX - rect.left);
    mouseY = Math.trunc(event.clientY - rect.top);
    document.getElementById('mouseLocation').innerHTML = mouseX + ", " + mouseY;
});
document.getElementById('start').addEventListener("click", function () { run = true; requestAnimationFrame(animationLoop); })
document.getElementById('reset').addEventListener("click", function () { clearUnits(); popUnits(onscreenCanvas); drawBarriers(onscreenCanvas); })



drawBarriers(onscreenCanvas);
popUnits(onscreenCanvas);
animationLoop();

function animationLoop() {
    if (run) {
        const onscreenCtx = onscreenCanvas.getContext('2d');
        onscreenCtx.clearRect(0, 0, onscreenCanvas.width, onscreenCanvas.height);
        onscreenCtx.imageSmoothingEnabled = false;

        for (let obj of gameObjects) {
            obj.collider.checkCollisions(gameObjects);
            if (obj.move) {
                obj.move(obj.moveDir.x + obj.rect.x, obj.moveDir.y + obj.rect.y);
            }
            obj.draw();
        }
        drawDebug();
        requestAnimationFrame(animationLoop);
    }
}


function drawDebug() {
    let debugHtml = null;

    debugHtml = '<table class="table table-sm table-striped"><thead><tr><td>Num</td><td>X</td><td>Y</td><td>Color</td><td>VD</td></tr></thead><tbody>';
    for (let obj of gameObjects) {
        if (obj.constructor.name != "Unit") {
            continue;
        }
        debugHtml += "<tr><td>" + obj.id + "</td><td>" + obj.rect.x + "</td><td>" + obj.rect.y + "</td><td style = \"background-color:" + obj.color + "\">" + obj.color + "</td><td>" + obj.collider.stayCollisions.length + "</td></tr>\n";
    }
    debugHtml += "</tbody></table>"
    debug = document.getElementById('debug').innerHTML = debugHtml;
}



function clearUnits() {
    gameObjects.length = 0;
}

function popUnits(drawCanvas) {
    let numUnits = Number(document.getElementById('numPlayers').value);
    let size = Number(document.getElementById('size').value); // Unit size (height and width)

    // Calculate the number of rows and columns needed
    let rows = Math.ceil(Math.sqrt(numUnits)); // Number of rows
    let cols = Math.ceil(numUnits / rows); // Number of columns

    // Calculate the spacing between units
    let horizontalSpacing = (drawCanvas.width - cols * size) / (cols + 1);
    let verticalSpacing = (drawCanvas.height - rows * size) / (rows + 1);

    if (horizontalSpacing < 0 || verticalSpacing < 0) {
        console.error("Too many units to fit on the canvas!");
        return;
    }

    //gameObjects.length = 0; // Clear existing units

    let currentUnit = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (currentUnit >= numUnits) break;

            // Calculate the x and y positions for the unit (rounded to whole numbers)
            let x = Math.round(horizontalSpacing + col * (size + horizontalSpacing));
            let y = Math.round(verticalSpacing + row * (size + verticalSpacing));

            // Create a new unit at the calculated position
            let newUnit = new Unit(drawCanvas, { x: x, y: y, height: size, width: size }, null, null);
            let newCollider = new Collider(newUnit.rect.getRect(), newUnit, handleCollisionStart, null, null);
            newUnit.draw();
            gameObjects.push(newUnit);
            currentUnit++;
        }
    }
}

function handleCollisionStart(collidingObject) {
    this.parent.moveDir = Geometry.getOppositeDirection(this.parent.moveDir);
}


function handleCollisionStay() {

}
function drawBarriers(canvas) {
    const barriers = [];

    // Define the dimensions of the barriers
    const topBarrierRect = { x: 0, y: 0, width: canvas.width, height: 10 }; // Top edge
    const bottomBarrierRect = { x: 0, y: canvas.height - 10, width: canvas.width, height: 10 }; // Bottom edge
    const leftBarrierRect = { x: 0, y: 10, width: 10, height: canvas.height - 20 }; // Left edge
    const rightBarrierRect = { x: canvas.width - 10, y: 10, width: 10, height: canvas.height - 20 }; // Right edge

    // Create barriers and add them to the array
    barriers.push(new Barrier(canvas, topBarrierRect));
    barriers.push(new Barrier(canvas, bottomBarrierRect));
    barriers.push(new Barrier(canvas, leftBarrierRect));
    barriers.push(new Barrier(canvas, rightBarrierRect));

    for (let barrier of barriers) {
        barrier.collider = new Collider(barrier.rect.getRect(), barrier, handleCollisionStart, null, null);
        barrier.draw();
    };

    gameObjects.push(...barriers); // Return the barriers array for further use
}
