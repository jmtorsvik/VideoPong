import { useEffect, useRef } from "react";
import "./App.css";
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;

export default function App() {
  const ref = useRef();

  let playerBar = {
    x: 0,
    y: 0,
  };

  const opponentBar = {
    x: 0,
    y: 0,
  };

  const ball = {
    x: 0,
    y: 0,
  };

  function update(secondsPassed) {
    playerBar.X += movingSpeed * secondsPassed;
    playerBar.Y += movingSpeed * secondsPassed;
  }

  function draw() {
    const ctx = ref.current.getContext("2d");
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    ctx.beginPath();
    ctx.rect(0, playerBar.y, 10, 100);
    ctx.stroke();
  }

  function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    update(secondsPassed);
    draw();
    window.requestAnimationFrame(gameLoop);
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.width = window.innerWidth;
      ref.current.height = window.innerHeight;
    }
    document.onkeydown = (e) => {
      for (let i = 0; i < 10; i++) {
        if (e.key === "ArrowUp") {
          playerBar.y += 1;
        } else if (e.key === "ArrowDown") {
          playerBar.y -= 1;
        }
      }
    };
    gameLoop();
  }, []);

  return (
    <div>
      <canvas
        ref={ref}
        id="myCanvas"
        style={{ border: "1px solid black" }}
      ></canvas>
    </div>
  );
}
