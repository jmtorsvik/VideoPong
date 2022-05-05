import {
  ball,
  leftPlayer,
  rightPlayer,
  grid,
  playerSpeed,
  scoreSize,
  colors,
  pending,
  globalGame,
} from "./gameVar";
import client from "./mqtt";

export function move(canvas, gameName) {
  const isOffice = localStorage.getItem("office") === "true" || false

  // set boundaries
  const maxX = canvas.width - rightPlayer.width;
  const maxY = canvas.height - grid;

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
      if (!globalGame.pending) {
        client.publish(
          "/ponggame/" + gameName + "/balldeflect",
          JSON.stringify({
            ball: { dx: -ball.dx, dy: ball.dy },
            barY: rightPlayer.y,
            username: localStorage.getItem("username"),
            office: isOffice
          })
        );
      }
    } else {
      //resetBall(canvas, true);
      ball.dy = 0;
      ball.dx = 0;
      ball.x = (canvas.width - ball.size) / 2;
      ball.y = (canvas.height - ball.size) / 2;
      if (globalGame.pending === null) {
        globalGame.pending = "goal";
        const now = new Date();
        leftPlayer.score++;
        now.setSeconds(now.getSeconds() + 5);
        client.publish(
          "/ponggame/" + gameName + "/goal",
          JSON.stringify({
            score: leftPlayer.score,
            username: localStorage.getItem("username"),
            timestamp: now,
            office: isOffice
          })
        );
      }
    }
  }

  // stop ball if it hits opponent side
  if (false && ball.x < leftPlayer.width) {
    ball.x = leftPlayer.width;
    ball.dx = ball.dy = 0;
  }
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
  context.fillText(
    leftPlayer.score,
    canvas.width / 2 - (scoreSize / 3) * 2,
    canvas.height / 2 + grid * 3
  );
  context.fillText(
    rightPlayer.score,
    canvas.width / 2 + (scoreSize / 3) * 2,
    canvas.height / 2 + grid * 3
  );

  // draw walls
  context.fillStyle = colors[2]; // ball, player and wall color
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  // draw ball
  context.fillRect(ball.x, ball.y, ball.size, ball.size);

  // draw player bars
  // left playerx
  console.log("SET: " + leftPlayer.y);
  console.log("REPORTED: " + leftPlayer.actual_pos);
  console.log(leftPlayer.y !== leftPlayer.actual_pos);

  if (leftPlayer.actual_pos !== leftPlayer.y) {
    if (
      leftPlayer.dir === "up" &&
      Math.floor(leftPlayer.actual_pos) > Math.floor(leftPlayer.y)
    ) {
      context.fillRect(
        leftPlayer.x,
        (leftPlayer.y += 10),
        leftPlayer.width,
        leftPlayer.height
      );
    } else if (
      leftPlayer.dir === "down" &&
      Math.floor(leftPlayer.actual_pos) < Math.floor(leftPlayer.y)
    ) {
      context.fillRect(
        leftPlayer.x,
        (leftPlayer.y -= 10),
        leftPlayer.width,
        leftPlayer.height
      );
    } else {
      context.fillRect(
        leftPlayer.x,
        leftPlayer.y,
        leftPlayer.width,
        leftPlayer.height
      );
    }
  } else {
    context.fillRect(
      leftPlayer.x,
      leftPlayer.y,
      leftPlayer.width,
      leftPlayer.height
    );
  }

  // right player
  context.fillRect(
    rightPlayer.x,
    rightPlayer.y,
    rightPlayer.width,
    rightPlayer.height
  );
}

export function addKeyListeners(gameName) {
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
      publishSpeed(gameName);
    }
  });
}

function publishSpeed(gameName) {

  client.publish(
    "/ponggame/" + gameName + "/playerspeed",
    JSON.stringify({
      dy: rightPlayer.dy,
      y: rightPlayer.y,
      username: localStorage.getItem("username"),
    }),
    {
      qos: 2,
    }
  );
}

export function resetBall(canvas, isInitiator) {
  ball.x = (canvas.width - ball.size) / 2;
  ball.y = (canvas.height - ball.size) / 2;
  // TO-DO: RANDOMIZE BALL START
  ball.dx = isInitiator ? 4 : -4;
  ball.dy = 4;
}
