import { move, draw, addKeyListeners, resetBall } from "./gameFunc";
import { ball } from "./gameVar";
import client from "./mqtt";

export function startGame(canvas, gameName, isInitiator) {
  function loop() {
    // loop
    requestAnimationFrame(loop);

    // move elements
    move(canvas, gameName);

    // draw elements
    draw(canvas);
  }

  // add listeners on relevant keys
  addKeyListeners(gameName);

  // set initial ball speed
  resetBall(canvas, isInitiator);

  // start the game
  requestAnimationFrame(loop);
}
