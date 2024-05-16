document.getElementById('bgColor').addEventListener('input', updateColors);
document.getElementById('blueBallColor').addEventListener('input', updateColors);
document.getElementById('redBallColor').addEventListener('input', updateColors);

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

loadColors();
