// 定義 gameboard 變數
const gameBoard = document.querySelector("#gameBoard");
// 定義 2d 渲染環境
const ctx = gameBoard.getContext("2d");
// 定義分數
const scoreText = document.querySelector("#scoreText");
// 定義 reset 按鈕
const resetBtn = document.querySelector("#resetBtn");
// 定義遊戲區域寬度
const gameWidth = gameBoard.width;
// 定義遊戲區域高度
const gameHeight = gameBoard.height;
// 定義遊戲背景顏色
const boardBackground = "forestgreen";
// 定義面板1顏色
const paddle1Color = "lightblue";
// 定義面板2顏色
const paddle2Color = "red";
// 定義面板邊框顏色
const paddleBorder = "black";
// 定義球顏色
const ballColor = "yellow";
// 定義球邊框顏色
const ballBorderColor = "black";
// 定義球的半徑
const ballRadius = 12.5;
// 定義面板移動速度
const paddleSpeed = 50;
// 定義時間循環變數
let intervalId;
// 定義球的初始速度
let ballSpeed = 1;
// 定義球 X軸
let ballX = gameWidth / 2;
// 定義球 Y軸
let ballY = gameHeight / 2;
// 定義球方向 X軸
let ballXDirection = 0;
// 定義球方向 Y軸
let ballYDirection = 0;
// 定義玩家1初始分數為0
let player1Score = 0;
// 定義玩家2初始分數為0
let player2Score = 0;
// 定義面板1
let paddle1 = {
    // 寬
    width: 25,
    // 高
    height: 100,
    // 位置
    x: 0,
    y: 0
};
// 定義面板2
let paddle2 = {
    // 寬
    width: 25,
    // 高
    height: 100,
    // 位置
    x: gameWidth - 25,
    y: gameHeight - 100
};

// 鍵盤按鈕事件
window.addEventListener("keydown", changeDirection);
// reset 按鈕點擊事件
resetBtn.addEventListener("click", resetGame);

// 呼叫 gameStart 函數
gameStart();

// 開始遊戲
function gameStart() {
    // 呼叫 createBall 函數
    createBall();
    // 呼叫 nextTick 函數
    nextTick();
};

function nextTick() {
    // 設定時間循環
    intervalId = setTimeout(() => {
        // 呼叫 clearBoard 函數
        clearBoard();
        // 呼叫 drawPaddles 函數
        drawPaddles();
        // 呼叫 moveBall 函數
        moveBall();
        // 呼叫 drawBall 函數
        drawBall(ballX, ballY);
        // 呼叫 checkCollision 函數
        checkCollision();
        // 呼叫 nextTick 函數
        nextTick();
    }, 10)
};

// 清除
function clearBoard() {
    // 渲染背景顏色
    ctx.fillStyle = boardBackground;
    // 渲染矩形大小
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

// 產生面板
function drawPaddles() {
    // 設定面板邊框顏色
    ctx.strokeStyle = paddleBorder;

    // 渲染背景顏色
    ctx.fillStyle = paddle1Color;
    // 填充矩形
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    // 繪製矩形邊框
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    // 渲染背景顏色
    ctx.fillStyle = paddle2Color;
    // 填充矩形
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    // 繪製矩形邊框
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};

// 產生球
function createBall() {
    // 設定球速
    ballSpeed = 1;
    // 設定隨機亂數決定方向
    if (Math.round(Math.random()) == 1) {
        ballXDirection = 1;
    }
    else {
        ballXDirection = -1;
    }
    // 設定隨機亂數決定方向
    if (Math.round(Math.random()) == 1) {
        ballYDirection = 1;
    }
    else {
        ballYDirection = -1;
    }
    // 球 X軸
    ballX = gameWidth / 2;
    // 球 Y軸
    ballY = gameHeight / 2;
    // 呼叫 drawBall 函數
    drawBall(ballX, ballY);
};

// 球體移動
function moveBall() {
    // X軸移動
    ballX += (ballSpeed * ballXDirection);
    // Y軸移動
    ballY += (ballSpeed * ballYDirection);
};

// 繪製球
function drawBall(ballX, ballY) {
    // 繪製球顏色
    ctx.fillStyle = ballColor;
    // 繪製球邊框顏色
    ctx.strokeStyle = ballBorderColor;
    // 球邊框寬度
    ctx.lineWidth = 2;
    // 開始一個新的繪圖路徑
    ctx.beginPath();
    // 繪製球體
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    // 繪製邊框線
    ctx.stroke();
    // 填充球體
    ctx.fill();
};

// 檢查反彈
function checkCollision() {
    // 當球碰觸到上牆
    if (ballY <= 0 + ballRadius) {
        // 進行反彈
        ballYDirection *= -1;
    }
    // 當球碰觸到下牆
    if (ballY >= gameHeight - ballRadius) {
        // 進行反彈
        ballYDirection *= -1;
    }
    // 當球碰觸到左牆
    if (ballX <= 0) {
        // 玩家2獲勝得分
        player2Score += 1;
        // 呼叫 updateScore 函數
        updateScore();
        // 呼叫 createBall 函數
        createBall();
        return;
    }
    // 當球碰觸到右牆
    if (ballX >= gameWidth) {
        // 玩家1獲勝得分
        player1Score += 1;
        // 呼叫 updateScore 函數
        updateScore();
        // 呼叫 createBall 函數
        createBall();
        return;
    }

    // 當球體碰觸到面板1的右側
    if (ballX <= (paddle1.x + paddle1.width + ballRadius)) {
        // 且球體在面板中
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            // 將球體的 X軸 調整到球拍的邊緣位置
            ballX = (paddle1.x + paddle1.width) + ballRadius;
            // 進行反彈
            ballXDirection *= -1;
            // 球體移動速度增加
            ballSpeed += 0.5;
        }
    }

    // 當球體碰觸到面板2的左側
    if (ballX >= (paddle2.x - ballRadius)) {
        // 且球體在面板中  
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            // 將球體的 X軸 調整到球拍的邊緣位置
            ballX = paddle2.x - ballRadius;
            // 進行反彈
            ballXDirection *= -1;
            // 球體移動速度增加
            ballSpeed += 0.5;
        }
    }
};

// 控制方向
function changeDirection(event) {
    // 定義鍵盤控制方向事件
    const keyPressed = event.keyCode;

    // W
    const paddle1Up = 87;
    // S
    const paddle1Down = 83;
    // ↑
    const paddle2Up = 38;
    // ↓
    const paddle2Down = 40;

    // 面板移動事件
    switch (keyPressed) {
        // 面板1往上
        case (paddle1Up):
            // 若y軸大於0
            if (paddle1.y > 0) {
                // 面板1的 y軸 依照 paddleSpeed減少
                paddle1.y -= paddleSpeed;
            }
            break;
        // 面板1往下
        case (paddle1Down):
            // 若 y軸 小於 背景高度 - 面板1高度
            if (paddle1.y < gameHeight - paddle1.height) {
                // 面板1的 y軸 依照 paddleSpeed增加
                paddle1.y += paddleSpeed;
            }
            break;
        // 面板2往上
        case (paddle2Up):
            if (paddle2.y > 0) {
                // 面板2的 y軸 依照 paddleSpeed減少
                paddle2.y -= paddleSpeed;
            }
            break;
        // 面板2往下
        case (paddle2Down):
            // 若 y軸 小於 背景高度 - 面板2高度
            if (paddle2.y < gameHeight - paddle2.height) {
                // 面板2的 y軸 依照 paddleSpeed增加
                paddle2.y += paddleSpeed;
            }
            break;
    }
};

// 分數更新
function updateScore() {
    // 印出玩家比數
    scoreText.textContent = `${player1Score} : ${player2Score}`;
};

// 重置遊戲
function resetGame() {
    player1Score = 0;
    player2Score = 0;
    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    };
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    };
    ballSpeed = 1;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalId);
    gameStart();
};