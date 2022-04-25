import { move, draw, addKeyListeners, resetBall } from "./gameFunc";
import { ball, globalGame } from "./gameVar";
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

  requestAnimationFrame(loop);

  // start the game
}
