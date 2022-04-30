export const canvasWidth = 700; // or: document.getElementById('root').clientWidth/2;
export const canvasHeight = 500;
export const grid = canvasWidth / 50; // used as a granual size unit
export const playerSpeed = (grid / 100) * 45;
export const scoreSize = grid * 10;
export const colors = ["purple", "white", "fuchsia"]; // [background, scores, balls/players/walls]

const ballSize = grid;

export let clientId = Math.floor(Math.random() * 1000000);

export let ball = {
  x: (canvasWidth - ballSize) / 2,
  y: (canvasHeight - ballSize) / 2,
  dx: 0,
  dy: 0,
  size: ballSize,
};

const playerWidth = grid;
const playerHeight = grid * 7;
export let globalGame = {
  pending: null,
};

export let leftPlayer = {
  x: 0,
  y: (canvasHeight - playerHeight) / 2,
  actual_pos: (canvasHeight - playerHeight) / 2,
  dir: "up",
  width: playerWidth,
  height: playerHeight,
  dy: 0,
  score: 0,
};

export let rightPlayer = {
  x: canvasWidth - playerWidth,
  y: (canvasHeight - playerHeight) / 2,
  width: playerWidth,
  height: playerHeight,
  dy: 0,
  score: 0,
};
