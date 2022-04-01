import { useEffect, useRef } from "react";
import "./App.css";

import { startGame } from "./lib/game";

export default function App() {
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            // create canvas variable
            const canvas = ref.current;

            // start game
            startGame(canvas);
        }
    }, []);

    return (
        <div>
            <canvas width="750" height="585" id="game" ref={ref}></canvas>
        </div>
    );
}
