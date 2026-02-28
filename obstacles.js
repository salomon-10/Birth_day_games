// obstacles.js - Jeu "Évite les obstacles"
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let frames = 0;
let score = 0;
let vies = 5;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 30,
    speed: 5,
    draw() {
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

const obstacles = [];

// Génération des obstacles
function genererObstacle() {
    const width = 30 + Math.random() * 40;
    const x = Math.random() * (canvas.width - width);
    const y = -20;
    const speed = 2 + Math.random() * 3;
    obstacles.push({x, y, width, height: 20, speed});
}

// Détection collision joueur-obstacle
function collision(p, o) {
    return p.x < o.x + o.width &&
           p.x + p.width > o.x &&
           p.y < o.y + o.height &&
           p.y + p.height > o.y;
}

// Clavier
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Mobile
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

let mobileLeft = false;
let mobileRight = false;

leftBtn.addEventListener('touchstart', () => mobileLeft = true);
leftBtn.addEventListener('touchend', () => mobileLeft = false);
rightBtn.addEventListener('touchstart', () => mobileRight = true);
rightBtn.addEventListener('touchend', () => mobileRight = false);

// Boucle du jeu
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    frames++;

    // Déplacement joueur
    if(keys['ArrowLeft'] || mobileLeft) player.x -= player.speed;
    if(keys['ArrowRight'] || mobileRight) player.x += player.speed;

    if(player.x < 0) player.x = 0;
    if(player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    player.draw();

    // Générer obstacle toutes les 60 frames
    if(frames % 60 === 0) genererObstacle();

    // Dessiner et mettre à jour obstacles
    for(let i = 0; i < obstacles.length; i++){
        const o = obstacles[i];
        o.y += o.speed;
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(o.x, o.y, o.width, o.height);

        if(collision(player, o)){
            obstacles.splice(i,1);
            i--;
            vies--;
            if(vies <= 0){
                alert(`Game Over ! ⚡ Score final : ${score}`);
                // Reset
                score = 0;
                vies = 5;
                obstacles.length = 0;
                player.x = canvas.width / 2 - 25;
            }
        }

        else if(o.y > canvas.height){
            score++;
            obstacles.splice(i,1);
            i--;
        }
    }

    // Afficher score et vies
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Vies: ${vies}`, 10, 40);

    requestAnimationFrame(loop);
}

loop();