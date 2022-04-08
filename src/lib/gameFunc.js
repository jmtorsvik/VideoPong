import { ball, leftPlayer, rightPlayer, grid, playerSpeed, scoreSize, colors } from "./gameVar";

export function move(canvas) {
    // set boundaries
    const maxX = canvas.width - rightPlayer.width;
    const maxY = canvas.height - grid;

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

    // move ball by its vector
    ball.x += ball.dx;
    ball.y += ball.dy;

    // deflect ball off walls
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy = -ball.dy;
    } else if (ball.y > maxY - ball.size) {
        ball.y = maxY - ball.size;
        ball.dy = -ball.dy;
    }

    // deflect ball off right player or end game
    if (ball.x > maxX - ball.size) {
        if (ball.y > rightPlayer.y && ball.y < rightPlayer.y + rightPlayer.height) {
            ball.x = maxX - ball.size;
            ball.dx = -ball.dx;
            // TO-DO: SEND MQTT MESSAGE ABOUT BALL HIT!
        } else {
            leftPlayer.score++;
            resetBall(canvas);
            // TO-DO: SEND MQTT MESSAGE ABOUT GOAL!
        }
    }

    // stop ball if it hits opponent side 
    /*if (ball.x < leftPlayer.width) {
        ball.x = leftPlayer.width;
        ball.dx = ball.dy = 0;
    }*/
    // TEMP: deflect ball off opponent side
    if (ball.x < leftPlayer.width) {
        ball.x = leftPlayer.width;
        ball.dx = -ball.dx;
    }

}



export function draw(canvas) {
    // create context from canvas
    const context = canvas.getContext("2d");

    // clear canvas and draw background
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = colors[0]; // background color
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw scores
    context.fillStyle = colors[1]; // score color
    context.font = scoreSize + "px Arial";
    context.textAlign = "center";
    context.fillText(":", canvas.width / 2, canvas.height / 2 + grid * 3);
    context.fillText(leftPlayer.score, canvas.width / 2 - (scoreSize / 3) * 2, canvas.height / 2 + grid * 3);
    context.fillText(rightPlayer.score, canvas.width / 2 + (scoreSize / 3) * 2, canvas.height / 2 + grid * 3);

    // draw walls
    context.fillStyle = colors[2]; // ball, player and wall color
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

export function resetBall(canvas) {
    ball.x = (canvas.width - ball.size) / 2;
    ball.y = (canvas.height - ball.size) / 2;
    // TO-DO: RANDOMIZE BALL START
    ball.dx = 4;
    ball.dy = 4;
}

