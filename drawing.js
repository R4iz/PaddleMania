function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color === 'blue' ? document.getElementById('blueBallColor').value : document.getElementById('redBallColor').value;
    ctx.fill();
    ctx.closePath();
}

function drawBlackBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('points').textContent = `Punkte: ${points}`;
    document.getElementById('highscore').textContent = `Highscore: ${highscore}`;
    document.getElementById('buyPaddle').disabled = points < 100;
}

function drawTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `Zeit: ${elapsed}s`;
}

function draw() {
    if (isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(drawBall);
    blackBalls.forEach(drawBlackBall);
    drawPaddle();
    drawScore();
    drawTimer();
    detectCollisions();
    checkRedBalls();

    balls.forEach((ball) => {
        detectWallCollisions(ball);
        detectPaddleCollisions(ball);
        ball.x += ball.dx;
        ball.y += ball.dy;
    });

    updateGameStatus();

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}
