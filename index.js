const canvas = document.getElementById("snakeGameBoard");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreText");
const highScoreDisplay = document.getElementById("highScoreText");
const resetButton = document.getElementById("resetGame");
const clearHighScoreButton = document.getElementById("clearHighScore");

const boardWidth = canvas.width;
const boardHeight = canvas.height;
const background = "white";
const snakeColoring = "limegreen";
const snakeOutline = "#333";
const foodColor = "red";
const segmentSize = 25;
let isRunning = false;
let gameSpeed = 75;
let gameTimeout;
let xDirection = segmentSize;
let yDirection = 0;
let foodLocationX;
let foodLocationY;
let currentScore = 0;
let highScore = localStorage.getItem("highScore") ? highScoreDisplay.textContent = localStorage.getItem("highScore") : highScoreDisplay.textContent = "0";
let snakeBody = [
    {x: segmentSize * 4, y: 0},
    {x: segmentSize * 3, y: 0},
    {x: segmentSize * 2, y: 0},
    {x: segmentSize, y: 0},
    {x: 0, y: 0}
];

window.addEventListener("keydown", handleDirectionChange);
resetButton.addEventListener("click", resetGame);
clearHighScoreButton.addEventListener("click", clearHighScore);
document.addEventListener("DOMContentLoaded", startGame)

function startGame() {
    isRunning = true;
    scoreDisplay.textContent = currentScore;
    placeFood();
    drawFood();
    advanceGame();
}

//Game tick
function advanceGame() {
    if (isRunning) {
        gameTimeout = setTimeout(() => {
            clearCanvas();
            drawFood();
            moveTheSnake();
            drawTheSnake();
            checkGameOver();
            advanceGame();
        }, gameSpeed);
    } else {
        displayEndScreen();
    }
}

function setHighScore() {
    const score = localStorage.getItem("highScore");
    const currentScoreNumber = Number(currentScore);

    if (score === null) {
        localStorage.setItem("highScore", currentScoreNumber);
        highScoreDisplay.textContent = currentScoreNumber;
        return;
    }

    const highScoreNumber = Number(score);

    if (currentScoreNumber > highScoreNumber) {
        localStorage.setItem("highScore", currentScoreNumber);
        highScoreDisplay.textContent = currentScoreNumber;
    } else {
        highScoreDisplay.textContent = highScoreNumber;
    }
}

function clearCanvas() {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, boardWidth, boardHeight);
}

function placeFood() {
    function generateRandomPosition(min, max) {
        return Math.round((Math.random() * (max - min) + min) / segmentSize) * segmentSize;
    }

    foodLocationX = generateRandomPosition(0, boardWidth - segmentSize);
    foodLocationY = generateRandomPosition(0, boardHeight - segmentSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodLocationX, foodLocationY, segmentSize, segmentSize);
}

function moveTheSnake() {
    const newHead = {
        x: snakeBody[0].x + xDirection,
        y: snakeBody[0].y + yDirection
    };
    snakeBody.unshift(newHead);

    if (snakeBody[0].x === foodLocationX && snakeBody[0].y === foodLocationY) {
        currentScore++;
        scoreDisplay.textContent = currentScore;
        placeFood();
    } else {
        snakeBody.pop();
    }
    currentScore >= 5 ? adjustGameSpeed() : null
}

function adjustGameSpeed() {
    switch (currentScore) {
        case 5:
            gameSpeed = 65;
            break;
        case 10:
            gameSpeed = 50;
            break;
        case 15:
            gameSpeed = 40;
            break;

        case 20:
            gameSpeed = 35
            break;
        case 30:
            gameSpeed = 25;
    }
}

function drawTheSnake() {
    ctx.fillStyle = snakeColoring;
    ctx.strokeStyle = snakeOutline;
    snakeBody.forEach(part => {
        ctx.fillRect(part.x, part.y, segmentSize, segmentSize);
        ctx.strokeRect(part.x, part.y, segmentSize, segmentSize);
    });
}

function handleDirectionChange(event) {
    event.preventDefault();
    const pressedKey = event.keyCode;
    const leftKey = 37;
    const upKey = 38;
    const rightKey = 39;
    const downKey = 40;
    const wKey = 87;
    const aKey = 65;
    const sKey = 83;
    const dKey = 68;
    const spaceKey = 32; //For restarting game with spacebar
    if (spaceKey === pressedKey) {
        resetGame();
    }

    const isGoingUp = (yDirection === -segmentSize);
    const isGoingDown = (yDirection === segmentSize);
    const isGoingLeft = (xDirection === -segmentSize);
    const isGoingRight = (xDirection === segmentSize);

    switch (true) {
        case ((pressedKey === leftKey || pressedKey === aKey) && !isGoingRight):
            xDirection = -segmentSize;
            yDirection = 0;
            break;
        case ((pressedKey === upKey || pressedKey === wKey) && !isGoingDown):
            xDirection = 0;
            yDirection = -segmentSize;
            break;
        case ((pressedKey === rightKey || pressedKey === dKey) && !isGoingLeft):
            xDirection = segmentSize;
            yDirection = 0;
            break;
        case ((pressedKey === downKey || pressedKey === sKey) && !isGoingUp):
            xDirection = 0;
            yDirection = segmentSize;
            break;
    }

}

function checkGameOver() {
    if (snakeBody[0].x < 0 ||
        snakeBody[0].y < 0 ||
        snakeBody[0].x >= boardWidth ||
        snakeBody[0].y >= boardHeight) {
        isRunning = false;
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i].x === snakeBody[0].x && snakeBody[i].y === snakeBody[0].y) {
            isRunning = false;
            break;
        }
    }
}

function displayEndScreen() {
    ctx.fillStyle = "black";
    ctx.font = "50px MV Boli";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", boardWidth / 2, boardHeight / 2);
    isRunning = false;

    ctx.fillStyle = "rgba(63,63,63,0.38)";
    ctx.fillRect(0, 0, boardWidth, boardHeight);
    setHighScore()
}

function resetGame() {
    currentScore = 0;
    gameSpeed = 75;
    xDirection = segmentSize;
    yDirection = 0;
    snakeBody = [
        {x: segmentSize * 4, y: 0},
        {x: segmentSize * 3, y: 0},
        {x: segmentSize * 2, y: 0},
        {x: segmentSize, y: 0},
        {x: 0, y: 0}
    ];
    clearTimeout(gameTimeout);
    startGame();
}

function clearHighScore() {
    if (confirm("Are you sure you want to delete high score data?")) {
        localStorage.clear();
        highScoreDisplay.textContent = "0"
        resetGame();
    }
}