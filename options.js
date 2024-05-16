document.getElementById('openOptions').addEventListener('click', openOptionsMenu);
document.getElementById('closeOptions').addEventListener('click', closeOptionsMenu);
document.getElementById('audioSettings').addEventListener('click', openAudioSettings);
document.getElementById('graphicsSettings').addEventListener('click', openGraphicsSettings);
document.getElementById('volumeControl').addEventListener('input', updateVolume);

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

function updateVolume() {
    const volume = document.getElementById('volumeControl').value;
    console.log(`Volume set to ${volume}`);
    // Hier können Sie die Lautstärkeregelung implementieren
}
