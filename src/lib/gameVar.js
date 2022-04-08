export const canvasWidth = 750;
export const canvasHeight = 585;
export const grid = 15;
export const maxX = canvasWidth - grid;
export const maxY = canvasHeight - grid;
export const playerSpeed = 7;

const ballSize = 10;

export let ball = {
    x: (canvasWidth - ballSize) / 2,
    y: (canvasHeight - ballSize) / 2,
    dx: 0,
    dy: 0,
    size: ballSize
}

const playerWidth = grid;
const playerHeight = grid * 5;

export let leftPlayer = {
    x: 0,
    y: (canvasHeight - playerHeight) / 2,
    width: playerWidth,
    height: playerHeight,
    dy: 0,
}

export let rightPlayer = {
    x: canvasWidth - playerWidth,
    y: (canvasHeight - playerHeight) / 2,
    width: playerWidth,
    height: playerHeight,
    dy: 0,
}