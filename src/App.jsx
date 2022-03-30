import { useEffect, useRef } from "react";

const fps = 30;
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

  function draw() {
    setTimeout(function () {
      requestAnimationFrame(draw);
      const ctx = ref.current.getContext("2d");
      ctx.clearRect(0, 0, ref.current.width, ref.current.height);
      ctx.beginPath();
      ctx.rect(0, playerBar.y, 10, 100);
      ctx.stroke();
    }, 1000 / fps);
  }

  useEffect(() => {
    document.onkeydown = (e) => {
      for (let i = 0; i < 10; i++) {
        if (e.key === "ArrowUp") {
          playerBar.y += 1;
          setTimeout(() => {
            playerBar.y += 1;
            setTimeout(() => {
              playerBar.y += 1;
            }, 1000 / fps / 2);
          }, 3 / fps / 2);
        } else if (e.key === "ArrowDown") {
          playerBar.y -= 1;
        }
      }
    };
    draw();
  }, []);

  return (
    <div>
      <h1>Gutta pong</h1>
      <canvas
        ref={ref}
        id="myCanvas"
        width="1000"
        height="1000"
        style={{ border: "1px solid black" }}
      ></canvas>
    </div>
  );
}
