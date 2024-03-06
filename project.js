const canvas = document.getElementById('project');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 500;

function drawCanvas() {
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

////////////////////////// Players ///////////////////////////////////

class Players {
    constructor(name, x, y, width, height, score, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.score = score;
        this.color = color;
    }

    drawPlayer() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    playersCollusion(){
        if(this.y + this.height >= canvas.height){
            this.y = canvas.height - this.height
        }
        if (this.y <= 0) {
            this.y = 0;
        }
    }

/*     gameOver(joueur){
        if (this.score - joueur.score >= 2) {
            // Afficher le message de game over
            ctx.font = '30px Arial';
            ctx.fillText(`The Winner is`, canvas.width/4, 120);
            ctx.fillStyle = 'gold';
            ctx.fillText(`${this.name}`, canvas.width/2.5, 160)
            ball.speedX = 0;
            ball.speedY = 0;
            fans.pause()
        }
            // Arrêter le jeu en arrêtant la boucle de rendu
            return;
            
        } */
}

const player1 = new Players(`MCA`, 10, canvas.height / 2 - 15, 15, 65, 0, 'green');
const player2 = new Players(`USMA`, canvas.width - 25, canvas.height / 2 - 15, 15, 65, 0, 'red');

//Players Draw with Players collusion
function drawPlayers() {
    player1.drawPlayer();
    player2.drawPlayer();
    player1.playersCollusion();
    player2.playersCollusion();
}


////////////////////////////////////// Ball ///////////////////////////////////////////////

class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.initialSpeedX = speedX;
    }

    drawBall() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 7;
        ctx.stroke();
    }

    ////// lancez la balle , le jeux ///////
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        fans.play();
        
        // Balle collision avec player1
        if (this.x - this.radius < player1.x + player1.width &&
            this.x + this.radius > player1.x &&
            this.y + this.radius > player1.y &&
            this.y - this.radius < player1.y + player1.height)
            {
                this.speedX += this.x;
                collisionSound1.play();
                this.increaseSpeed(); // Augmenter légèrement la vitesse
            }
            
        // Balle collision avec player2
        if (this.x - this.radius < player2.x + player2.width &&
                this.x + this.radius > player2.x &&
                this.y + this.radius > player2.y &&
                this.y - this.radius < player2.y + player2.height &&
                this.speedX > 0)
            {
                this.speedX = -this.speedX;
                collisionSound2.play();
                this.increaseSpeed(); // Augmenter légèrement la vitesse
            }

        // Balle Collision -  haut - bas
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }


        // Vérifiez si la balle sort et point++ - (score)
        if (this.x + this.radius < 0) {
            // Player 2 scores
            player2.score++;
            this.reset();
            goal.play();

        } else if (this.x - this.radius > canvas.width) {
            // Player 1 scores
            player1.score++;
            this.reset();
            goal.play();
        }
    }

    increaseSpeed() {
        // Augmenter légèrement la vitesse, max 3 fois la vitesse d'origine
        if (this.speedX * 1.2 <= this.initialSpeedX * 3) {
            this.speedX *= 1.2;
        } else {
            this.speedX = this.initialSpeedX * 3;
        }
    }

/*     increaseSpeed() {
        // Augmenter légèrement la vitesse, max 3 fois la vitesse d'origine
        const increasedSpeedX = this.speedX * 1.2;
    
        if (increasedSpeedX <= this.initialSpeedX * 3) {
            this.speedX = increasedSpeedX;
        } else {
            this.speedX = this.initialSpeedX * 3;
        }
    } */
    

    reset() {
        this.x = canvas.width / 6;
        this.y = canvas.height / 2;
        this.speedY = this.initialSpeedX; // Réinitialiser la vitesse Y verticale 
        this.speedX = this.initialSpeedX; // Réinitialiser la vitesse X horizontale 
    }
}

const ball = new Ball(canvas.width / 2, canvas.height / 2, 8, 2, 2, 'black');

/////////////// Draw Ball ////////////////////////////////////////

ball.drawBall();


/////////////////// Draw Score ///////////////////////////////////////////////////////

function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(` ${player1.name + ` ` + player1.score} - ${player2.score + ` ` + player2.name}`, canvas.width/5, 40)
}


///////////////////////////// players Control ///////////////////////////////////////////////
const keys = {};

document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

function playersControl() {
    // Joueur 1
    if (keys['w']) {
        player1.y -= 5;
    } else if (keys['s']) {
        player1.y += 5; 
    }

    // Joueur 2
    if (keys['ArrowUp']) {
        player2.y -= 5;
    } else if (keys['ArrowDown']) {
        player2.y += 5;
    }
}

// Limiter la position des joueurs à l'intérieur des limites du canvas
/* function playersCollusion(player){
    if(player.y + player.height >= canvas.height){
        player.y = canvas.height - player.height
    }
    if (player.y <= 0) {
        player.y = 0;
    }
} */

/////////////////////// Game over condition ///////////////////////////////////////////////////////////
function gameOver(){
    if (player1.score - player2.score >= 2) {
        // Afficher le message de game over
        ctx.font = '30px Arial';
        ctx.fillText(`The Winner is`, canvas.width/4, 120);
        ctx.fillStyle = 'gold';
        ctx.fillText(`${player1.name}`, canvas.width/2.5, 160)
        ball.speedX = 0;
        ball.speedY = 0;
        fans.pause()
    }

    if(player2.score - player1.score >= 2) {
        ctx.font = '30px Arial';
        ctx.fillText(`The Winner is`, canvas.width/4, 120);
        ctx.fillStyle = 'gold';
        ctx.fillText(`${player2.name}`, canvas.width/2.8, 160)
        ball.speedX = 0;
        ball.speedY = 0;
        fans.pause()
    }

        // Arrêter le jeu en arrêtant la boucle de rendu
        return;
        
    }

////////////////////// restart ///////////////////////////////////////////////////////////

const rejouerButton = document.getElementById('rejouerButton');

// Ajout d'un gestionnaire d'événements au clic sur le bouton de redémarrage
rejouerButton.addEventListener('click', () => {
    // Réinitialisation du jeu
    player1.score = 0;
    player2.score = 0;
    player1.y = canvas.height / 2 - 15;
    player2.y = canvas.height / 2 - 15;
    ball.reset();
    referee.play();
});



///////////////////////// Background Image /////////////////////////////

const stadium = new Image();
stadium.src = 'stadium.jpg';

const sprite = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    image: stadium,
};

stadium.onload = () => {
    ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function game() {
    requestAnimationFrame(game);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);

    drawPlayers();

    ball.drawBall();

    drawScore();

    playersControl();

/*     playersCollusion(player1);
    playersCollusion(player2); */



    ball.update();

    gameOver();
    
}

// Lancer le jeu
requestAnimationFrame(game);
