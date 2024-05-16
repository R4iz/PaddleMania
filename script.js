const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ballRadius = 10;
let balls = [{ x: getRandomInt(ballRadius, canvas.width - ballRadius), y: getRandomInt(ballRadius, canvas.height / 2), dx: getRandomSpeed(), dy: getRandomSpeed(), color: 'blue', spawnTime: Date.now() }];
let blackBalls = [];
const paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let score = 0;
let points = 0;
let highscore = 0;
let startTime = Date.now();
let nextBlackBallScore = 100; // Variable to track when the next black ball should appear
let interval;
let isPaused = false;

let totalGames = 0;
let totalTimePlayed = 0;
let totalPointsEarned = 0;
let totalBallsLost = 0;

let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.getElementById('buyPaddle').addEventListener('click', buyPaddle);
document.getElementById('openOptions').addEventListener('click', openOptionsMenu);
document.getElementById('closeOptions').addEventListener('click', closeOptionsMenu);
document.getElementById('audioSettings').addEventListener('click', openAudioSettings);
document.getElementById('graphicsSettings').addEventListener('click', openGraphicsSettings);
document.getElementById('bgColor').addEventListener('input', updateColors);
document.getElementById('blueBallColor').addEventListener('input', updateColors);
document.getElementById('redBallColor').addEventListener('input', updateColors);
document.getElementById('volumeControl').addEventListener('input', updateVolume);
document.getElementById('openStats').addEventListener('click', openStatsMenu);
document.getElementById('closeStats').addEventListener('click', closeStatsMenu);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSpeed() {
    let speed = Math.random() * 4 - 2; // Random speed between -2 and 2
    while (Math.abs(speed) < 1) { // Ensure speed is not too slow
        speed = Math.random() * 4 - 2;
    }
    return speed;
}

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

function buyPaddle() {
    if (points >= 100) {
        points -= 100;
        paddleWidth += 20;
        drawScore();
    }
}

function showWinningScreen() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('total-time').textContent = elapsed;
    document.getElementById('winning-screen').style.display = 'block';
    clearInterval(interval);
    totalGames++;
    totalTimePlayed += elapsed;
}

function openOptionsMenu() {
    isPaused = true;
    clearInterval(interval);
    document.getElementById('options-menu').style.display = 'block';
}

function closeOptionsMenu() {
    isPaused = false;
    document.getElementById('options-menu').style.display = 'none';
    interval = setInterval(draw, 10);
}

function openAudioSettings() {
    document.getElementById('audio-menu').style.display = 'block';
    document.getElementById('graphics-menu').style.display = 'none';
}

function openGraphicsSettings() {
    document.getElementById('audio-menu').style.display = 'none';
    document.getElementById('graphics-menu').style.display = 'block';
}

function openStatsMenu() {
    isPaused = true;
    clearInterval(interval);
    document.getElementById('totalGames').textContent = `Gesamtspiele: ${totalGames}`;
    document.getElementById('totalTimePlayed').textContent = `Gesamtspielzeit: ${totalTimePlayed}s`;
    document.getElementById('totalPointsEarned').textContent = `Gesamtpunkte: ${totalPointsEarned}`;
    document.getElementById('totalBallsLost').textContent = `Verlorene Bälle: ${totalBallsLost}`;
    document.getElementById('stats-menu').style.display = 'block';
}

function closeStatsMenu() {
    isPaused = false;
    document.getElementById('stats-menu').style.display = 'none';
    interval = setInterval(draw, 10);
}

function updateColors() {
    canvas.style.backgroundColor = document.getElementById('bgColor').value;
    document.cookie = `bgColor=${document.getElementById('bgColor').value}; path=/`;
    document.cookie = `blueBallColor=${document.getElementById('blueBallColor').value}; path=/`;
    document.cookie = `redBallColor=${document.getElementById('redBallColor').value}; path=/`;
}

function loadColors() {
    const cookies = document.cookie.split('; ');
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name === 'bgColor') document.getElementById('bgColor').value = value;
        if (name === 'blueBallColor') document.getElementById('blueBallColor').value = value;
        if (name === 'redBallColor') document.getElementById('redBallColor').value = value;
    });
    updateColors();
}

function updateVolume() {
    const volume = document.getElementById('volumeControl').value;
    console.log(`Volume set to ${volume}`);
    // Hier können Sie die Lautstärkeregelung implementieren
}

function detectCollisions() {
    // Detect collisions with black balls
    balls.forEach(ball => {
        blackBalls.forEach(blackBall => {
            const dx = blackBall.x - ball.x;
            const dy = blackBall.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ballRadius * 2) {
                // Simple bounce off black ball
                const angle = Math.atan2(dy, dx);
                const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                ball.dx = -Math.cos(angle) * speed;
                ball.dy = -Math.sin(angle) * speed;
            }
        });
    });

    // Detect collisions between moving balls
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[j].x - balls[i].x;
            const dy = balls[j].y - balls[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ballRadius * 2) {
                // Calculate angle of collision
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate ball positions
                const pos0 = { x: 0, y: 0 }; // Ball i at origin
                const pos1 = rotate(dx, dy, sin, cos, true);

                // Rotate ball velocities
                const vel0 = rotate(balls[i].dx, balls[i].dy, sin, cos, true);
                const vel1 = rotate(balls[j].dx, balls[j].dy, sin, cos, true);

                // Collision reaction
                const vxTotal = vel0.x - vel1.x;
                vel0.x = ((balls[i].dx * (ballRadius - ballRadius) + (2 * ballRadius * balls[j].dx)) / (ballRadius + ballRadius));
                vel1.x = vxTotal + vel0.x;

                // Rotate velocities back
                const vel0F = rotate(vel0.x, vel0.y, sin, cos, false);
                const vel1F = rotate(vel1.x, vel1.y, sin, cos, false);

                // Update velocities
                balls[i].dx = vel0F.x * 0.9; // Reduce speed to avoid too strong bounce
                balls[i].dy = vel0F.y * 0.9;
                balls[j].dx = vel1F.x * 0.9;
                balls[j].dy = vel1F.y * 0.9;

                // Move balls apart to avoid overlap
                const absV = Math.abs(vel0F.x) + Math.abs(vel1F.x);
                const overlap = 2 * ballRadius - distance;

                balls[i].x -= overlap * (vel0F.x / absV);
                balls[j].x += overlap * (vel1F.x / absV);
            }
        }
    }
}

function rotate(x, y, sin, cos, reverse) {
    return {
        x: (reverse ? (x * cos + y * sin) : (x * cos - y * sin)),
        y: (reverse ? (y * cos - x * sin) : (y * cos + x * sin))
    };
}

function detectWallCollisions(ball) {
    if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ballRadius) {
        ball.dy = -ball.dy;
    }
}

function detectPaddleCollisions(ball) {
    if (ball.y + ball.dy > canvas.height - ballRadius) {
        if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
            ball.dy = -ball.dy;
            if (ball.color === 'blue') {
                score++;
                points++;
                totalPointsEarned++;
            } else if (ball.color === 'red') {
                score += 10;
                points += 10;
                totalPointsEarned += 10;
            }
            const newBallColor = Math.random() < 0.5 ? 'blue' : 'red';
            balls.push({
                x: getRandomInt(ballRadius, canvas.width - ballRadius),
                y: getRandomInt(ballRadius, canvas.height / 2),
                dx: getRandomSpeed(),
                dy: getRandomSpeed(),
                color: newBallColor,
                spawnTime: Date.now()
            });
            if (score >= nextBlackBallScore) {
                blackBalls.push({
                    x: getRandomInt(ballRadius, canvas.width - ballRadius),
                    y: getRandomInt(ballRadius, canvas.height - ballRadius)
                });
                nextBlackBallScore += 100;
            }
        } else {
            balls.splice(balls.indexOf(ball), 1);
            totalBallsLost++;
        }
    }
}

function checkRedBalls() {
    const currentTime = Date.now();
    balls.forEach(ball => {
        if (ball.color === 'red' && currentTime - ball.spawnTime >= 10000) {
            ball.color = 'blue';
        }
    });
}

function draw() {
    if (isPaused) return; // Skip drawing if paused
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

    if (balls.length === 0) {
        if (score > highscore) {
            highscore = score;
        }
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
    }

    if (paddleWidth >= canvas.width) {
        showWinningScreen();
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

function addPoints(pointsToAdd) {
    points += pointsToAdd;
    drawScore();
}

loadColors();

interval = setInterval(draw, 10);
