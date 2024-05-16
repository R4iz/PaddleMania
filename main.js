const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ballRadius = 10;
let balls = [{ x: getRandomInt(ballRadius, canvas.width - ballRadius), y: getRandomInt(ballRadius, canvas.height / 2), dx: getRandomSpeed(), dy: getRandomSpeed(), color: 'blue', spawnTime: Date.now() }];
let blackBalls = [];
const paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let interval;

document.getElementById('buyPaddle').addEventListener('click', buyPaddle);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSpeed() {
    let speed = Math.random() * 4 - 2;
    while (Math.abs(speed) < 1) {
        speed = Math.random() * 4 - 2;
    }
    return speed;
}

interval = setInterval(draw, 10);
