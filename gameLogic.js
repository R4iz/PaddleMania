let score = 0;
let points = 0;
let highscore = localStorage.getItem('highscore') ? parseInt(localStorage.getItem('highscore')) : 0;
let startTime = Date.now();
let nextBlackBallScore = 100;
let isPaused = false;

function buyPaddle() {
    if (points >= 100) {
        points -= 100;
        paddleWidth += 20;
        drawScore();
    }
}

function addConsolePoints(pointsToAdd) {
    points += pointsToAdd;
    score += pointsToAdd;
    drawScore();
    checkWinConditions();
}

function checkWinConditions() {
    if (paddleWidth >= canvas.width || score >= 2700) {
        showWinningScreen();
    }
}

function updateGameStatus() {
    if (balls.length === 0) {
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
        }
        showGameOverScreen();
        clearInterval(interval);
    }
    checkWinConditions();
}

function showWinningScreen() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('total-time').textContent = elapsed;
    document.getElementById('winning-screen').style.display = 'block';
    clearInterval(interval);
}

function showGameOverScreen() {
    document.getElementById('recapScoreGameOver').textContent = `Endscore: ${score}`;
    document.getElementById('recapHighscoreGameOver').textContent = `Highscore: ${highscore}`;
    document.getElementById('recapTotalBallsLostGameOver').textContent = `Verlorene Bälle: ${totalBallsLost}`;
    document.getElementById('recapTotalBlueBallsHitGameOver').textContent = `Getroffene blaue Bälle: ${totalBlueBallsHit}`;
    document.getElementById('recapTotalRedBallsHitGameOver').textContent = `Getroffene rote Bälle: ${totalRedBallsHit}`;
    document.getElementById('recapTotalBallsHitGameOver').textContent = `Getroffene Bälle gesamt: ${totalBallsHit}`;
    document.getElementById('game-over-screen').style.display = 'block';
}

document.getElementById('show-recap').addEventListener('click', () => {
    document.getElementById('recapScore').textContent = `Endscore: ${score}`;
    document.getElementById('recapHighscore').textContent = `Highscore: ${highscore}`;
    document.getElementById('recapTotalBallsLost').textContent = `Verlorene Bälle: ${totalBallsLost}`;
    document.getElementById('recapTotalBlueBallsHit').textContent = `Getroffene blaue Bälle: ${totalBlueBallsHit}`;
    document.getElementById('recapTotalRedBallsHit').textContent = `Getroffene rote Bälle: ${totalRedBallsHit}`;
    document.getElementById('recapTotalBallsHit').textContent = `Getroffene Bälle gesamt: ${totalBallsHit}`;
    document.getElementById('recap').style.display = 'block';
    document.getElementById('show-recap').style.display = 'none';
});

document.getElementById('show-recap-game-over').addEventListener('click', () => {
    document.getElementById('recapScoreGameOver').textContent = `Endscore: ${score}`;
    document.getElementById('recapHighscoreGameOver').textContent = `Highscore: ${highscore}`;
    document.getElementById('recapTotalBallsLostGameOver').textContent = `Verlorene Bälle: ${totalBallsLost}`;
    document.getElementById('recapTotalBlueBallsHitGameOver').textContent = `Getroffene blaue Bälle: ${totalBlueBallsHit}`;
    document.getElementById('recapTotalRedBallsHitGameOver').textContent = `Getroffene rote Bälle: ${totalRedBallsHit}`;
    document.getElementById('recapTotalBallsHitGameOver').textContent = `Getroffene Bälle gesamt: ${totalBallsHit}`;
    document.getElementById('recap-game-over').style.display = 'block';
    document.getElementById('show-recap-game-over').style.display = 'none';
});

// Laden der gespeicherten Farbeinstellungen
window.addEventListener('load', () => {
    const bgColor = localStorage.getItem('bgColor') || '#D3D3D3';
    const blueBallColor = localStorage.getItem('blueBallColor') || '#0000FF';
    const redBallColor = localStorage.getItem('redBallColor') || '#FF0000';
    
    document.getElementById('bgColor').value = bgColor;
    document.getElementById('blueBallColor').value = blueBallColor;
    document.getElementById('redBallColor').value = redBallColor;
    
    document.body.style.backgroundColor = bgColor;
    document.documentElement.style.setProperty('--blue-ball-color', blueBallColor);
    document.documentElement.style.setProperty('--red-ball-color', redBallColor);
    
    drawScore(); // Initiale Anzeige des Highscores
});

// Speichern der Farbeinstellungen
document.getElementById('bgColor').addEventListener('input', (e) => {
    const color = e.target.value;
    localStorage.setItem('bgColor', color);
    document.body.style.backgroundColor = color;
});

document.getElementById('blueBallColor').addEventListener('input', (e) => {
    const color = e.target.value;
    localStorage.setItem('blueBallColor', color);
    document.documentElement.style.setProperty('--blue-ball-color', color);
});

document.getElementById('redBallColor').addEventListener('input', (e) => {
    const color = e.target.value;
    localStorage.setItem('redBallColor', color);
    document.documentElement.style.setProperty('--red-ball-color', color);
});
