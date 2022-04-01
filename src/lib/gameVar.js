import { canvas } from "./game";

export const grid = 15;
export const minX = 0;
export const maxX = canvas.width;
export const minY = grid;
export const maxY = canvas.height - grid;
export const playerSpeed = 5;

const ballSize = 10;

export let ball = {
    x: (canvas.width - ballSize) / 2,
    y: (canvas.height - ballSize) / 2,
    dx: 0,
    dy: 0,
    size: ballSize
}

const playerWidth = grid;
const playerHeight = grid * 5;

export let leftPlayer = {
    x: 0,
    y: (canvas.height - playerHeight) / 2,
    width: playerWidth,
    height: playerHeight,
    dy: 0,
}

export let rightPlayer = {
    x: canvas.width - playerWidth,
    y: (canvas.height - playerHeight) / 2,
    width: playerWidth,
    height: playerHeight,
    dy: 0,
}