// João Paulo de Avila
// 178898

const hitSound = document.getElementById('hitSound');
const cheerSound = document.getElementById('cheerSound');
const booSound = document.getElementById('booSound');

let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;

let player1 = {
    name: localStorage.getItem('player1Name') || 'Jogador 1',
    photo: localStorage.getItem('player1Photo') || '',
    x: 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    score: 0,
    gameScore: 0,
    setScore: 0,
    matchScore: 0,
    side: 'Esquerda'
};

let player2 = {
    name: localStorage.getItem('player2Name') || 'Jogador 2',
    photo: localStorage.getItem('player2Photo') || '',
    x: canvas.width - 30,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    score: 0,
    gameScore: 0,
    setScore: 0,
    matchScore: 0,
    side: 'Direita'
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#fff"
};

let upArrowPressed = false;
let downArrowPressed = false;
let wPressed = false;
let sPressed = false;

const tennisScores = ['00', '15', '30', '50', 'GAME'];

let isCourtChange = false;
let courtChangeCountdown = 0;

window.onload = function() {
    document.getElementById('player1Name').innerText = player1.name;
    document.getElementById('player2Name').innerText = player2.name;

    if (player1.photo) {
        document.getElementById('player1Photo').src = player1.photo;
    }

    if (player2.photo) {
        document.getElementById('player2Photo').src = player2.photo;
    }

    updateScoreboard();

    requestAnimationFrame(gameLoop);

    document.getElementById('ballSpeedRange').addEventListener('input', function() {
        let speed = parseInt(this.value);
        ball.speed = speed;
        ball.velocityX = (ball.velocityX > 0 ? 1 : -1) * speed;
        ball.velocityY = (ball.velocityY > 0 ? 1 : -1) * speed;
    });
};

function gameLoop() {
    if (!isCourtChange) {
        update();
    }
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (wPressed && player1.y > 0) {
        player1.y -= 7;
    }
    if (sPressed && (player1.y < canvas.height - player1.height)) {
        player1.y += 7;
    }
    if (upArrowPressed && player2.y > 0) {
        player2.y -= 7;
    }
    if (downArrowPressed && (player2.y < canvas.height - player2.height)) {
        player2.y += 7;
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? player1 : player2;

    if (collision(ball, player)) {
        hitSound.play();
        ball.velocityX = -ball.velocityX;
    }

    if (ball.x - ball.radius < 0) {
        player2.score++;
        updateCurrentScore();
        resetBall();
        checkGamePoint();
        logEvent(`${player2.name} marcou um ponto. 🎉`);
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        updateCurrentScore();
        resetBall();
        checkGamePoint();
        logEvent(`${player1.name} marcou um ponto. 🎉`);
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(39, 174, 96, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawBall(ball.x, ball.y, ball.radius, ball.color);

    drawPlayer(player1.x, player1.y, player1.width, player1.height, '#fff');
    drawPlayer(player2.x, player2.y, player2.width, player2.height, '#fff');

    drawNet();

    if (isCourtChange) {
        let messageElement = document.getElementById('courtChangeMessage');
        messageElement.style.display = 'block';
    } else {
        let messageElement = document.getElementById('courtChangeMessage');
        messageElement.style.display = 'none';
    }
}

function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

function drawPlayer(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawNet() {
    context.fillStyle = "#fff";
    context.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
}

function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    let speed = ball.speed;
    ball.velocityX = (ball.velocityX > 0 ? 1 : -1) * speed;
    ball.velocityY = (ball.velocityY > 0 ? 1 : -1) * speed;
}

function updateCurrentScore() {
    let score1 = tennisScores[player1.score] || 'GAME';
    let score2 = tennisScores[player2.score] || 'GAME';
    document.getElementById('currentScore').innerText = `${score1} - ${score2}`;
}

function updateScoreboard() {
    updatePlayerUI();
}

function updatePlayerUI() {
    let player1NameElement = document.getElementById('player1Name');
    let player1PhotoElement = document.getElementById('player1Photo');
    let player1GameScoreElement = document.getElementById('player1GameScore');
    let player1SetScoreElement = document.getElementById('player1SetScore');
    let player1MatchScoreElement = document.getElementById('player1MatchScore');

    let player2NameElement = document.getElementById('player2Name');
    let player2PhotoElement = document.getElementById('player2Photo');
    let player2GameScoreElement = document.getElementById('player2GameScore');
    let player2SetScoreElement = document.getElementById('player2SetScore');
    let player2MatchScoreElement = document.getElementById('player2MatchScore');

    if (player1.side === 'Esquerda') {
        player1NameElement.innerText = player1.name;
        player1PhotoElement.src = player1.photo;
        player1GameScoreElement.innerText = player1.gameScore;
        player1SetScoreElement.innerText = player1.setScore;
        player1MatchScoreElement.innerText = player1.matchScore;

        player2NameElement.innerText = player2.name;
        player2PhotoElement.src = player2.photo;
        player2GameScoreElement.innerText = player2.gameScore;
        player2SetScoreElement.innerText = player2.setScore;
        player2MatchScoreElement.innerText = player2.matchScore;
    } else {
        player1NameElement.innerText = player2.name;
        player1PhotoElement.src = player2.photo;
        player1GameScoreElement.innerText = player2.gameScore;
        player1SetScoreElement.innerText = player2.setScore;
        player1MatchScoreElement.innerText = player2.matchScore;

        player2NameElement.innerText = player1.name;
        player2PhotoElement.src = player1.photo;
        player2GameScoreElement.innerText = player1.gameScore;
        player2SetScoreElement.innerText = player1.setScore;
        player2MatchScoreElement.innerText = player1.matchScore;
    }
}

function checkGamePoint() {
    if ((player1.score >= 4 || player2.score >= 4) && Math.abs(player1.score - player2.score) >= 1) {
        if (player1.score > player2.score) {
            player1.gameScore++;
            logEvent(`${player1.name} ganhou o GAME. 🏆`);
        } else {
            player2.gameScore++;
            logEvent(`${player2.name} ganhou o GAME. 🏆`);
        }
        player1.score = 0;
        player2.score = 0;
        updateCurrentScore();
        updateScoreboard();
        checkSetPoint();

        let totalGames = player1.gameScore + player2.gameScore;
        if (totalGames % 2 !== 0) {
            initiateCourtChange();
        }
    }
}

function checkSetPoint() {
    if ((player1.gameScore >= 6 || player2.gameScore >= 6) && Math.abs(player1.gameScore - player2.gameScore) >= 1) {
        if (player1.gameScore > player2.gameScore) {
            player1.setScore++;
            cheerSound.play();
            logEvent(`${player1.name} ganhou o SET. 🎉`);
        } else {
            player2.setScore++;
            booSound.play();
            logEvent(`${player2.name} ganhou o SET. 🎉`);
        }
        player1.gameScore = 0;
        player2.gameScore = 0;
        updateScoreboard();
        checkMatchPoint();
    }
}

function checkMatchPoint() {
    if (player1.setScore >= 2) {
        cheerSound.play();
        player1.matchScore++;
        logEvent(`${player1.name} ganhou a partida! 🥇`);
        endMatch(player1);
    } else if (player2.setScore >= 2) {
        player2.matchScore++;
        booSound.play();
        logEvent(`${player2.name} ganhou a partida! 🥇`);
        endMatch(player2);
    }
}

function endMatch(winner) {
    alert(`${winner.name} venceu a partida! 🏆`);
    player1.score = 0;
    player2.score = 0;
    player1.gameScore = 0;
    player2.gameScore = 0;
    player1.setScore = 0;
    player2.setScore = 0;
    updateCurrentScore();
    updateScoreboard();
    document.getElementById('gameSummaryList').innerHTML = '';
}

function logEvent(message) {
    let listItem = document.createElement('li');
    listItem.innerText = message + ' 🎾';
    document.getElementById('gameSummaryList').appendChild(listItem);
    document.getElementById('gameSummaryList').scrollTop = document.getElementById('gameSummaryList').scrollHeight;
}

function initiateCourtChange() {
    isCourtChange = true;
    courtChangeCountdown = 3;
    let player1SideAfter = player1.side === 'Esquerda' ? 'Direita' : 'Esquerda';
    let messageElement = document.getElementById('courtChangeMessage');
    messageElement.style.display = 'block';
    messageElement.innerText = `Troca de quadra... ${player1.name} irá para a quadra da ${player1SideAfter} em ${courtChangeCountdown}...`;

    let countdownInterval = setInterval(function() {
        courtChangeCountdown--;
        if (courtChangeCountdown > 0) {
            messageElement.innerText = `Troca de quadra... ${player1.name} irá para a quadra da ${player1SideAfter} em ${courtChangeCountdown}...`;
        } else {
            clearInterval(countdownInterval);
            messageElement.style.display = 'none';
            switchCourt();
            isCourtChange = false;
        }
    }, 1000);
}

function switchCourt() {
    let tempX = player1.x;
    player1.x = player2.x;
    player2.x = tempX;

    let tempSide = player1.side;
    player1.side = player2.side;
    player2.side = tempSide;

    updatePlayerUI();

    logEvent(`Jogadores trocaram de quadra. ${player1.name} agora está na ${player1.side} e ${player2.name} está na ${player2.side}. 🔄`);
}

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 87:
            wPressed = true;
            break;
        case 83:
            sPressed = true;
            break;
        case 38:
            upArrowPressed = true;
            break;
        case 40:
            downArrowPressed = true;
            break;
        case 49:
            if (!isCourtChange) doubleFault(player1);
            break;
        case 50:
            if (!isCourtChange) doubleFault(player2);
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
        case 87:
            wPressed = false;
            break;
        case 83:
            sPressed = false;
            break;
        case 38:
            upArrowPressed = false;
            break;
        case 40:
            downArrowPressed = false;
            break;
    }
});

function doubleFault(player) {
    if (player === player1) {
        player2.score++;
        logEvent(`${player1.name} cometeu uma dupla falta. 😬`);
        booSound.play();
    } else {
        player1.score++;
        logEvent(`${player2.name} cometeu uma dupla falta. 😬`);
        booSound.play();
    }
    updateCurrentScore();
    checkGamePoint();
}
