// cake.js - Jeu "Attrape les cadeaux"
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let frames = 0;
let score = 0;
let vies = 5; // 5 vies maintenant

// Taille du panier
const panier = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 40,
    width: 50,
    height: 30,
    speed: 5,
    draw() {
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// Cadeaux qui tombent
const cadeaux = [];

function genererCadeau() {
    const width = 20;
    const x = Math.random() * (canvas.width - width);
    cadeaux.push({
        x: x,
        y: -20,
        width: width,
        height: 20,
        speed: 2 + Math.random() * 2,
        draw() {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        update() {
            this.y += this.speed;
        }
    });
}

// Détecte collision panier-cadeau
function collision(p, c) {
    return p.x < c.x + c.width &&
           p.x + p.width > c.x &&
           p.y < c.y + c.height &&
           p.y + p.height > c.y;
}

// Gestion clavier
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Mobile - boutons tactiles
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frames++;

    // Déplacement du panier
    if(keys['ArrowLeft'] || mobileLeft) panier.x -= panier.speed;
    if(keys['ArrowRight'] || mobileRight) panier.x += panier.speed;

    // Limites du panier
    if(panier.x < 0) panier.x = 0;
    if(panier.x + panier.width > canvas.width) panier.x = canvas.width - panier.width;

    panier.draw();

    // Générer un cadeau toutes les 50 frames
    if(frames % 50 === 0) genererCadeau();

    // Dessiner et mettre à jour les cadeaux
    for(let i = 0; i < cadeaux.length; i++){
        const c = cadeaux[i];
        c.update();
        c.draw();

        // Collision panier-cadeau
        if(collision(panier, c)){
            score++;
            cadeaux.splice(i,1);
            i--;
        }

        // Cadeau tombé -> perdre une vie
        else if(c.y > canvas.height){
            cadeaux.splice(i,1);
            i--;
            vies--;
            if(vies <= 0){
                alert(`Game Over ! 🎉 Score final : ${score}`);
                // Recommencer le jeu
                score = 0;
                vies = 5;
                cadeaux.length = 0;
                panier.x = canvas.width / 2 - 25;
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