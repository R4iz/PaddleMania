document.getElementById('openStats').addEventListener('click', openStatsMenu);
document.getElementById('closeStats').addEventListener('click', closeStatsMenu);

let totalBallsLost = 0;
let totalBlueBallsHit = 0;
let totalRedBallsHit = 0;
let totalBallsHit = 0;

function openStatsMenu() {
    isPaused = true;
    clearInterval(interval);
    document.getElementById('totalBallsLost').textContent = `Verlorene Bälle: ${totalBallsLost}`;
    document.getElementById('totalBlueBallsHit').textContent = `Getroffene blaue Bälle: ${totalBlueBallsHit}`;
    document.getElementById('totalRedBallsHit').textContent = `Getroffene rote Bälle: ${totalRedBallsHit}`;
    document.getElementById('totalBallsHit').textContent = `Getroffene Bälle gesamt: ${totalBallsHit}`;
    document.getElementById('stats-menu').style.display = 'block';
}

function closeStatsMenu() {
    isPaused = false;
    document.getElementById('stats-menu').style.display = 'none';
    interval = setInterval(draw, 10);
}
