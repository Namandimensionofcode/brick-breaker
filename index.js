const bricksContainer = document.getElementById('bricks');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over');
const youWinMessage = document.getElementById('you-win');

let bricks = [];
let ballX = 200;
let ballY = 200;
let ballDX = 2;
let ballDY = -2;
let gameIsOver = false;
let hasStruckPaddle = false;
let score = 0;

function createBricks(rows, cols) {
  const bricksArray = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const brick = document.createElement('div');
      brick.classList.add('brick');
      brick.style.top = i * 24 + 'px';
      brick.style.left = j * 54 + 'px';
      bricksContainer.appendChild(brick);
      bricksArray.push(brick);
    }
  }
  return bricksArray;
}

function isColliding(ball, brick) {
  const ballRect = ball.getBoundingClientRect();
  const brickRect = brick.getBoundingClientRect();

  return ballRect.right > brickRect.left &&
         ballRect.left < brickRect.right &&
         ballRect.bottom > brickRect.top &&
         ballRect.top < brickRect.bottom;
}

function updateBall() {
  if (gameIsOver) {
    return;
  }

  ballX += ballDX;
  ballY += ballDY;

  if (ballX <= 0 || ballX >= 790) {
    ballDX = -ballDX;
  }

  if (ballY <= 0) {
    ballDY = -ballDY;
  }

  if (ballY >= 390) {
    gameOver();
    return;
  }

  if (ballY >= 380 && ballX >= parseInt(paddle.style.left) && ballX <= parseInt(paddle.style.left) + 100) {
    ballDY = -ballDY;
    hasStruckPaddle = true;
  }

  let bricksDestroyed = 0;

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    if (brick && isColliding(ball, brick)) {
      const ballRect = ball.getBoundingClientRect();
      const brickRect = brick.getBoundingClientRect();

      const ballCenterX = ballRect.left + ballRect.width / 2;
      const ballCenterY = ballRect.top + ballRect.height / 2;

      const brickCenterX = brickRect.left + brickRect.width / 2;
      const brickCenterY = brickRect.top + brickRect.height / 2;

      const deltaX = ballCenterX - brickCenterX;
      const deltaY = ballCenterY - brickCenterY;

      const overlapX = Math.abs(deltaX) - (ballRect.width / 2 + brickRect.width / 2);
      const overlapY = Math.abs(deltaY) - (ballRect.height / 2 + brickRect.height / 2);

      if (overlapX < overlapY) {
        ballDX = -ballDX;
      } else {
        ballDY = -ballDY;
      }

      brick.remove();
      bricks[i] = null;
      score += 10;
      updateScore();
      bricksDestroyed++;

      if (bricksDestroyed > 0) {
        hasStruckPaddle = false;
      }

      if (bricks.every(brick => brick === null)) {
        youWin();
        return;
      }
    }
  }

  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';

  requestAnimationFrame(updateBall);
}

function updateScore() {
  scoreDisplay.innerText = 'Score: ' + score;
}

function gameOver() {
  if (!hasStruckPaddle) {
    gameIsOver = true;
    ball.style.display = 'none';
    gameOverMessage.style.display = 'block';
    showRestartButton(gameOverMessage);
  }
}

function youWin() {
  gameIsOver = true;
  ball.style.display = 'none';
  youWinMessage.style.display = 'block';
  showRestartButton(youWinMessage);
}

function showRestartButton(container) {
  const restartButton = document.createElement('button');
  restartButton.innerText = 'Restart Game';
  restartButton.addEventListener('click', restartGame);
  container.appendChild(restartButton);
}

function restartGame() {
  document.location.reload();
}

function updatePaddlePosition(event) {
  const mouseX = event.clientX;
  const paddleHalfWidth = paddle.offsetWidth / 2;
  const containerLeft = bricksContainer.offsetLeft;
  const containerRight = containerLeft + bricksContainer.offsetWidth;

  if (mouseX >= containerLeft + paddleHalfWidth && mouseX <= containerRight - paddleHalfWidth) {
    paddle.style.left = mouseX - paddleHalfWidth - containerLeft + 'px';
  }
}

document.addEventListener('mousemove', updatePaddlePosition);

// Initialize the game
bricks = createBricks(5, 10);
updateScore();
updateBall();
