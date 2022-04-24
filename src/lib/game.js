import { move, draw, addKeyListeners, resetBall } from "./gameFunc";
import client from "./mqtt";
import {
  ball,
  leftPlayer,
  rightPlayer,
  grid,
  playerSpeed,
  scoreSize,
  colors,
} from "./gameVar";
export function startGame(canvas) {
  client.on("connect", function () {
    function loop() {
      // loop
      requestAnimationFrame(loop);

      // move elements
      move(canvas);

      // draw elements
      draw(canvas);
    }
    client.subscribe("/ponggname/#");

    client.on("message", (topic, message, packet) => {
      console.log(packet);
      let parsed_message;
      try {
        parsed_message = JSON.parse(message.toString());
      } catch (err) {
        console.log("NOE_GIKK_GALT");
      }
      if (parsed_message) {
        // eslint-disable-next-line default-case
        switch (topic) {
          case "/ponggname/balldeflect":
            break;
          case "/ponggname/goal":
            rightPlayer.score++;
            break;
          case "/ponggname/playerSpeed":
            leftPlayer.dy = parsed_message.dy;
            break;
          case "/ponggame/new_user":
        }
      }
    });

    // add listeners on relevant keys
    addKeyListeners();

    // set initial ball speed
    resetBall(canvas);

    // start the game
    requestAnimationFrame(loop);
  });
}
