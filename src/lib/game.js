import { loop } from "./gameFunc";
import { rightPlayer, playerSpeed } from "./gameVar";

export let canvas;
export let context;

export function startGame(ref) {
    canvas = ref.current;
    context = canvas.getContext("2D");
    
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