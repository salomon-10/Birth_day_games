// ballons.js - Jeu Toucher les Ballons
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let frames = 0;
let score = 0;
let vies = 5;

const ballons = [];

function genererBallon() {
    const radius = 20 + Math.random() * 10;
    const x = radius + Math.random() * (canvas.width - 2*radius);
    const y = canvas.height + radius;
    const speed = 1 + Math.random() * 2;

    ballons.push({x, y, radius, speed, couleur: `hsl(${Math.random()*360}, 80%, 60%)`});
}

// Fonction pour vérifier si un ballon est touché
function toucherBallon(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for(let i = 0; i < ballons.length; i++) {
        const b = ballons[i];
        const dist = Math.hypot(clickX - b.x, clickY - b.y);
        if(dist < b.radius){
            score++;
            ballons.splice(i,1);
            i--;
        }
    }
}

// Support mobile pour toucher
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    toucherBallon({clientX: touch.clientX, clientY: touch.clientY});
});

// Support desktop
canvas.addEventListener('click', toucherBallon);

// Boucle du jeu
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    frames++;

    // Générer un ballon toutes les 60 frames
    if(frames % 60 === 0) genererBallon();

    // Dessiner et mettre à jour les ballons
    for(let i = 0; i < ballons.length; i++){
        const b = ballons[i];
        b.y -= b.speed;

        // Dessiner le ballon
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.fillStyle = b.couleur;
        ctx.fill();
        ctx.closePath();

        // Ballon sort du haut -> perdre une vie
        if(b.y + b.radius < 0){
            ballons.splice(i,1);
            i--;
            vies--;
            if(vies <= 0){
                alert(`Game Over ! 🎈 Score final : ${score}`);
                score = 0;
                vies = 5;
                ballons.length = 0;
            }
        }
    }

    // Afficher le score et les vies
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Vies: ${vies}`, 10, 40);

    requestAnimationFrame(loop);
}

loop();