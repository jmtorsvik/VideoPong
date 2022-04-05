import { move, draw, addKeyListeners, resetBall } from "./gameFunc";

export function startGame(canvas) {
    function loop() {
        // loop
        requestAnimationFrame(loop);

        // move elements
        move(canvas);

        // draw elements
        draw(canvas);
    }

    // add listeners on keys
    addKeyListeners();
    
    // set initial ball speed
    resetBall(canvas);

    // start the game
    requestAnimationFrame(loop);
}
