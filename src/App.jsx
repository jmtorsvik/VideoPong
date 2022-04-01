import { useEffect, useRef } from "react";
import "./App.css";

import { ball, leftPlayer, rightPlayer, grid, maxY, playerSpeed } from "./lib/gameVar";
import { draw, move, addKeyListeners } from "./lib/gameFunc";

export default function App() {
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            const canvas = ref.current;

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
    }, []);

    return (
        <div>
            <canvas width="750" height="585" id="game" ref={ref}></canvas>
        </div>
    );
}
