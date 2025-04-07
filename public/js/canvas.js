const canvas = document.getElementById('canvas');
const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
const units = [];
let run = true;


document.getElementById('stop').addEventListener("click", function () { run = false; })
document.getElementById('canvas').addEventListener('mousemove', (event) => {
    // Get the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    mouseX = Math.trunc(event.clientX - rect.left);
    mouseY = Math.trunc(event.clientY - rect.top);
    document.getElementById('mouseLocation').innerHTML = mouseX + ", " + mouseY;
});
document.getElementById('start').addEventListener("click", function () { run = true; requestAnimationFrame(animationLoop); })
document.getElementById('reset').addEventListener("click", function () { clearUnits(); popUnits(); })

let colliders = [];

let unit1 = new Unit(canvas, { x: 100, y: 100, width: 50, height: 50 });
let collider1 = new Collider(unit1.rect.getRect(), unit1, colliders);
colliders.push(collider1);
unit1.draw();

let unit2 = new Unit(canvas, { x: 120, y: 100, width: 50, height: 50 });
let collider2 = new Collider(unit2.rect.getRect(), unit2, colliders);
colliders.push(collider2);
unit2.draw();

collider1.checkCollisions(colliders);
collider1.checkCollisions(colliders);

unit2.move(500, 500);
unit2.draw();
collider1.checkCollisions(colliders);
function drawDebug() {
    let debugHtml = null;

    debugHtml = '<table class="table table-sm table-striped"><thead><tr><td>Num</td><td>X</td><td>Y</td><td>Color</td><td>VD</td></tr></thead><tbody>';
    for (let unit of units) {
        debugHtml += "<tr><td>" + unit.id + "</td><td>" + unit.x + "</td><td>" + unit.y + "</td><td style = \"background-color:" + unit.color + "\">" + unit.color + "</td><td>" + unit.viewDist + "</td></tr>\n";
    }
    debugHtml += "</tbody></table>"
    debug = document.getElementById('debug').innerHTML = debugHtml;
}

function isOccupied(player, x, y) {
    for (i = 0; i < players.length; i++) {
        if (player === players[i]) {
            continue;
        }
        if (!(players[i].pos.x + players[i].size <= player.pos.x ||  // players[i] is to the left of player
            players[i].pos.x >= player.pos.x + player.size ||  // players[i] is to the right of player
            players[i].pos.y + players[i].size <= player.pos.y ||  // players[i] is above player
            players[i].pos.y >= player.pos.y + player.size)) {
            return players[i];
        }
    }
    return false;
}


function popUnits() {
    let numUnits = Number(document.getElementById('numPlayers').value);

    let xOffset = Math.floor(canvas.width / 10) + 1;
    let yOffset = Math.floor(canvas.height / (numUnits / 10)) + 1;
    ;
    let currentX = 1;
    let currentY = 1;

    for (let i = 0; i < numUnits; i++) {
        let size = Number(document.getElementById('size').value);
        let viewDist = Math.floor(Math.random() * 5) + 1
        let newUnit = new Unit(offscreenCanvas, { x: currentX, y: currentY, height: size, width: size }, viewDist);

        newUnit.draw();
        units.push(newUnit);
        currentX += xOffset;
        if (currentX + 5 > canvas.width) {
            currentX = 5;
            currentY += yOffset;
        }
    }
}

function clearUnits() {
    for (unit of units) {
        unit.erase();
    }
    units.length = 0;
}
