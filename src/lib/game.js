import { move, draw, addKeyListeners, resetBall } from "./gameFunc";
import { ball, globalGame } from "./gameVar";
import client from "./mqtt";
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

export function startGame(canvas, gameName, isInitiator) {
  function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
  }
  function animate() {
    // request another frame

    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      then = now - (elapsed % fpsInterval);

      // Put your drawing code here
      move(canvas, gameName);

      // draw elements
      draw(canvas);
    }
  }

  if (canvas) {
    // add listeners on relevant keys
    addKeyListeners(gameName);

    // set initial ball speed
    resetBall(canvas, isInitiator);

    startAnimating(60);

    // start the game
  }
}
