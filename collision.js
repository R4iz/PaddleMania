function detectCollisions() {
    balls.forEach(ball => {
        blackBalls.forEach(blackBall => {
            const dx = blackBall.x - ball.x;
            const dy = blackBall.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ballRadius * 2) {
                const angle = Math.atan2(dy, dx);
                const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                ball.dx = -Math.cos(angle) * speed;
                ball.dy = -Math.sin(angle) * speed;
            }
        });
    });

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[j].x - balls[i].x;
            const dy = balls[j].y - balls[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ballRadius * 2) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                const pos0 = { x: 0, y: 0 };
                const pos1 = rotate(dx, dy, sin, cos, true);

                const vel0 = rotate(balls[i].dx, balls[i].dy, sin, cos, true);
                const vel1 = rotate(balls[j].dx, balls[j].dy, sin, cos, true);

                const vxTotal = vel0.x - vel1.x;
                vel0.x = ((balls[i].dx * (ballRadius - ballRadius) + (2 * ballRadius * balls[j].dx)) / (ballRadius + ballRadius));
                vel1.x = vxTotal + vel0.x;

                const vel0F = rotate(vel0.x, vel0.y, sin, cos, false);
                const vel1F = rotate(vel1.x, vel1.y, sin, cos, false);

                balls[i].dx = vel0F.x * 0.9;
                balls[i].dy = vel0F.y * 0.9;
                balls[j].dx = vel1F.x * 0.9;
                balls[j].dy = vel1F.y * 0.9;

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
            totalBallsHit++;
            if (ball.color === 'blue') {
                score++;
                points++;
                totalBlueBallsHit++;
            } else if (ball.color === 'red') {
                score += 10;
                points += 10;
                totalRedBallsHit++;
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
