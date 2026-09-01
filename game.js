const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');

let player, obstacles, gameRunning, score, speed, gravity, jumpForce;

function resetGame() {
    player = {
        x: 80,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        vy: 0,
        onGround: true
    };

    obstacles = [];
    gameRunning = false;
    score = 0;
    speed = 6;
    gravity = 0.6;
    jumpForce = -12;
    scoreEl.textContent = score;
}

function spawnObstacle() {
    const width = 30 + Math.random() * 40;
    const height = 30 + Math.random() * 40;
    obstacles.push({
        x: canvas.width + width,
        y: canvas.height - height,
        width,
        height
    });
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player physics
    player.vy += gravity;
    player.y += player.vy;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // Draw player
    ctx.fillStyle = '#0f9d58';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Obstacles
    if (Math.random() < 0.02) {
        spawnObstacle();
    }

    ctx.fillStyle = '#e91e63';
    obstacles.forEach((ob, index) => {
        ob.x -= speed;
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

        // Remove off-screen
        if (ob.x + ob.width < 0) {
            obstacles.splice(index, 1);
            score++;
            scoreEl.textContent = score;
        }

        // Collision
        if (
            player.x < ob.x + ob.width &&
            player.x + player.width > ob.x &&
            player.y < ob.y + ob.height &&
            player.y + player.height > ob.y
        ) {
            gameOver();
        }
    });

    requestAnimationFrame(update);
}

function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 90, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Start to play again', canvas.width / 2 - 130, canvas.height / 2 + 40);
}

function startGame() {
    resetGame();
    gameRunning = true;
    update();
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (player.onGround) {
            player.vy = jumpForce;
            player.onGround = false;
        }
    }
});

canvas.addEventListener('click', () => {
    if (player.onGround) {
        player.vy = jumpForce;
        player.onGround = false;
    }
});

startBtn.addEventListener('click', startGame);

resetGame();
