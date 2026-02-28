const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = canvas.width / COLS;

let score = 0;
let gameOver = false;

// Grille
const grid = Array.from({length: ROWS}, () => Array(COLS).fill(0));

// Couleurs des pièces
const colors = [null, '#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#FFA500'];

// Formes des tetrominos
const tetrominos = [
  [],
  [[1,1,1,1]],          // I
  [[2,2],[2,2]],        // O
  [[0,3,0],[3,3,3]],    // T
  [[0,4,4],[4,4,0]],    // S
  [[5,5,0],[0,5,5]],    // Z
  [[6,0,0],[6,6,6]],    // J
  [[0,0,7],[7,7,7]]     // L
];

// Pièce actuelle
let piece = randomPiece();
let nextDrop = Date.now();

// Générer une pièce aléatoire
function randomPiece() {
  const id = Math.floor(Math.random() * (tetrominos.length -1)) + 1;
  const shape = tetrominos[id];
  return {id, shape, x: Math.floor(COLS/2 - shape[0].length/2), y: 0};
}

// Dessiner la grille + pièce
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Grille
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      if(grid[r][c]){
        ctx.fillStyle = colors[grid[r][c]];
        ctx.fillRect(c*BLOCK_SIZE, r*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(c*BLOCK_SIZE, r*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  // Pièce
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value){
        ctx.fillStyle = colors[piece.id];
        ctx.fillRect((piece.x + x)*BLOCK_SIZE, (piece.y + y)*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = '#000';
        ctx.strokeRect((piece.x + x)*BLOCK_SIZE, (piece.y + y)*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });

  // Score
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Collision
function collision(px, py, shape){
  for(let y=0;y<shape.length;y++){
    for(let x=0;x<shape[y].length;x++){
      if(shape[y][x]){
        const newX = px + x;
        const newY = py + y;
        if(newX <0 || newX>=COLS || newY>=ROWS) return true;
        if(newY>=0 && grid[newY][newX]) return true;
      }
    }
  }
  return false;
}

// Fusionner la pièce dans la grille
function merge() {
  piece.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value && piece.y+y>=0) grid[piece.y+y][piece.x+x] = piece.id;
    });
  });
}

// Supprimer lignes complètes
function clearLines() {
  let lines = 0;
  outer: for(let r=ROWS-1;r>=0;r--){
    if(grid[r].every(v=>v!==0)){
      grid.splice(r,1);
      grid.unshift(Array(COLS).fill(0));
      lines++;
      r++;
    }
  }
  if(lines>0) score += lines*10;
}

// Rotation
function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

// Déplacer la pièce
function move(dx) {
  if(!collision(piece.x + dx, piece.y, piece.shape)) piece.x += dx;
}

// Descente rapide
function drop() {
  if(!collision(piece.x, piece.y+1, piece.shape)) piece.y++;
  else {
    merge();
    clearLines();
    piece = randomPiece();
    if(collision(piece.x, piece.y, piece.shape)){
      alert(`Game Over ! Score final : ${score}`);
      score = 0;
      grid.forEach(r=>r.fill(0));
    }
  }
}

// Touches
window.addEventListener('keydown', e=>{
  if(gameOver) return;
  if(e.key==='ArrowLeft') move(-1);
  else if(e.key==='ArrowRight') move(1);
  else if(e.key==='ArrowDown') drop();
  else if(e.key==='ArrowUp') piece.shape = rotate(piece.shape);
});

// Mobile
document.getElementById('left-btn').addEventListener('touchstart',()=>move(-1));
document.getElementById('right-btn').addEventListener('touchstart',()=>move(1));
document.getElementById('down-btn').addEventListener('touchstart',()=>drop());
document.getElementById('rotate-btn').addEventListener('touchstart',()=>piece.shape = rotate(piece.shape));

// Boucle
function loop(){
  const now = Date.now();
  if(now - nextDrop > 500){
    drop();
    nextDrop = now;
  }
  draw();
  requestAnimationFrame(loop);
}

loop();