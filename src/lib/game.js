import { move, draw, addKeyListeners } from "./gameFunc";

export function startGame(canvas) {
    function loop() {
        // loop
        requestAnimationFrame(loop);

        // move elements
        move();

        // draw elements
        draw(canvas);
    }

    addKeyListeners();
    
    // start the game
    requestAnimationFrame(loop);
}
