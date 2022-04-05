import { ball, leftPlayer, rightPlayer, grid, maxY, playerSpeed } from "./gameVar";

export function move() {
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

    //move ball by its vector
    ball.x += ball.dx;
    ball.y += ball.dy;
}

export function draw(canvas) {
    // create context from canvas
    const context = canvas.getContext("2d");

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
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

export function addKeyListeners() {
    // listen to keyboard events to move the players
    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowUp") {
            rightPlayer.dy = -playerSpeed;
        } else if (e.key === "ArrowDown") {
            rightPlayer.dy = playerSpeed;
        }
    });

    // listen to keyboard events to stop the player if key is released
    document.addEventListener("keyup", function (e) {
        if (
            (e.key === "ArrowUp" && rightPlayer.dy < 0) ||
            (e.key === "ArrowDown" && rightPlayer.dy > 0)
        ) {
            rightPlayer.dy = 0;
        }
    });
}

