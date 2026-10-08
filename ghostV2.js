let px = 200, py = 200, gx = 0, gy = 0, over = false;
const clamp = n => Math.max(0, Math.min(355, n));

function draw() {
    player.style.left = px + "px";
    player.style.top = py + "px";
    ghost.style.left = gx + "px";
    ghost.style.top = gy + "px";
}

function move(dx, dy) {
    if (over) return;
    px = clamp(px + dx);
    py = clamp(py + dy);
    draw();
}

const moveTop = () => move(0, -20);
const moveDown = () => move(0, 20);
const moveLeft = () => move(-20, 0);
const moveRight = () => move(20, 0);

document.onkeydown = e =>
    ({ ArrowUp: moveTop, ArrowDown: moveDown, ArrowLeft: moveLeft, ArrowRight: moveRight })[e.key]?.();

setInterval(() => {
    if (over) return;
    gx += Math.sign(px - gx) * 5;  
    gy += Math.sign(py - gy) * 5;  
    draw();
    if (Math.abs(gx - px) < 22 && Math.abs(gy - py) < 22) {
        over = true;
        player.textContent = "💀";
        setTimeout(() => alert("The ghost got you!"), 50);
    }
}, 100);

draw();