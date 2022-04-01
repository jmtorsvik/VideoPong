import { canvas, context } from "./game";
import { ball, leftPlayer, rightPlayer, grid, maxY } from "./gameVar";

export function loop() {
    // loop
    requestAnimationFrame(loop);
    
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // move elements
    move();

    // draw elements
    draw();
}

function draw() {
    // draw walls
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

    // draw ball
    context.fillRect(ball.x, ball.y, ball.size, ball.size);

    // draw player bars
    // left player
    context.fillRect(
        leftPlayer.x,
        leftPlayer.y,
        leftPlayer.width,
        leftPlayer.height
    );
    // right player
    context.fillRect(
        rightPlayer.x,
        rightPlayer.y,
        rightPlayer.width,
        rightPlayer.height
    );

}

function move() {
    // move players by their velocity
    leftPlayer.y += leftPlayer.dy;
    rightPlayer.y += rightPlayer.dy;

    // prevent players from going through walls
    if (leftPlayer.y < grid) {
        leftPlayer.y = grid;
    } else if (leftPlayer.y > maxY - leftPlayer.height) {
        leftPlayer.y = maxY - leftPlayer.height;
    }

    if (rightPlayer.y < grid) {
        rightPlayer.y = grid;
    } else if (rightPlayer.y > maxY - rightPlayer.height) {
        rightPlayer.y = maxY - rightPlayer.height;
    }

    //move ball by its velocity and vector
    ball.x += ball.dx;
    ball.y += ball.dy;
}


