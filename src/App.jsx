import { useEffect, useRef } from "react";

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

  function draw(time) {
    if (ref.current) {
      requestAnimationFrame(draw);
      const ctx = ref.current.getContext("2d");
      ctx.clearRect(0, 0, ref.current.width, ref.current.height);
      ctx.beginPath();
      ctx.rect(0, playerBar.y, 10, 100);
      ctx.stroke();
      return;
    }
  }

  useEffect(() => {
    document.onkeydown = (e) => {
      for (let i = 0; i < 10; i++) {
        if (e.key === "ArrowUp") {
          playerBar.y += 1;
        } else if (e.key === "ArrowDown") {
          playerBar.y -= 1;
        }
      }
    };
    requestAnimationFrame(draw); // start animation
  }, []);

  return (
    <div>
      <h1>Gutta pong</h1>
      <canvas
        ref={ref}
        id="myCanvas"
        width="200"
        height="200"
        style={{ border: "1px solid black" }}
      ></canvas>
    </div>
  );
}
