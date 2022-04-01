import { useEffect, useRef } from "react";
import "./App.css";

import mqtt from "mqtt";

export default function App() {
  const ref = useRef();

  useEffect(() => {
    const client = mqtt.connect("mqtt://mqtt.item.ntnu.no");
    client.on("connect", () => {
      console.log("CONNTECTED");
    });
  }, []);

  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current;
      const context = canvas.getContext("2d");
      const grid = 15;
      const playerHeight = grid * 5; // 45
      const maxPlayerY = canvas.height - grid - playerHeight;

      const playerSpeed = 5;

      const leftPlayer = {
        // start in the middle of the game on the left side
        x: 0,
        y: canvas.height / 2 - playerHeight / 2,
        width: grid,
        height: playerHeight,
        // player velocity
        dy: 0,
      };

      const rightPlayer = {
        // start in the middle of the game on the right side
        x: canvas.width - grid,
        y: canvas.height / 2 - playerHeight / 2,
        width: grid,
        height: playerHeight,

        // player velocity
        dy: 0,
      };

      // game loop
      function loop() {
        requestAnimationFrame(loop);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // move players by their velocity
        leftPlayer.y += leftPlayer.dy;
        rightPlayer.y += rightPlayer.dy;

        // prevent players from going through walls
        if (leftPlayer.y < grid) {
          leftPlayer.y = grid;
        } else if (leftPlayer.y > maxPlayerY) {
          leftPlayer.y = maxPlayerY;
        }

        if (rightPlayer.y < grid) {
          rightPlayer.y = grid;
        } else if (rightPlayer.y > maxPlayerY) {
          rightPlayer.y = maxPlayerY;
        }

        // draw player bars
        context.fillStyle = "black";
        context.fillRect(
          leftPlayer.x,
          leftPlayer.y,
          leftPlayer.width,
          leftPlayer.height
        );
        context.fillRect(
          rightPlayer.x,
          rightPlayer.y,
          rightPlayer.width,
          rightPlayer.height
        );

        // draw walls
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, grid);
        context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);
      }

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

      // start the game
      requestAnimationFrame(loop);
    }
  }, []);

  return (
    <div>
      <canvas width="750" height="585" id="game" ref={ref}></canvas>
    </div>
  );
}
