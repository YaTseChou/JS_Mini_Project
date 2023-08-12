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
const boardBackground = "white";
// 定義蛇的顏色
const snakeColor = "lightgreen";
// 定義蛇的邊框顏色
const snakeBorder = "black";
// 定義食物的顏色
const foodColor = "red";
// 定義單位大小
const unitSize = 25;
// 預設初始狀態為 false
let running = false;
// 定義 X軸
let xVelocity = unitSize;
// 定義 Y軸
let yVelocity = 0;
// 定義食物 X軸
let foodX;
// 定義食物 Y軸
let foodY;
// 定義分數
let score = 0;
// 定義蛇的初始位置
let snake = [
    { x: 0, y: 0 }
];

// 鍵盤按鈕事件
window.addEventListener("keydown", changeDirection);
// reset 按鈕點擊事件
resetBtn.addEventListener("click", resetGame);

// 呼叫 gameStart 函數
gameStart();

// 開始遊戲
function gameStart() {
    // 將遊戲狀態更改 開始遊戲
    running = true;
    // 分數顯示
    scoreText.textContent = score;
    // 呼叫 createFood 函數
    createFood();
    // 呼叫 drawFood 函數
    drawFood();
    // 呼叫 nextTick 函數
    nextTick();
};

function nextTick() {
    // 設定時間循環
    if (running) {
        setTimeout(() => {
             // 呼叫 clearBoard 函數
            clearBoard();
             // 呼叫 drawFood 函數
            drawFood();
             // 呼叫 moveSnake 函數
            moveSnake();
             // 呼叫 drawSnake 函數
            drawSnake();
             // 呼叫 checkGameOver 函數
            checkGameOver();
             // 呼叫 nextTick 函數
            nextTick();
        }, 125);
    }
    else {
        // 呼叫 displayGameOver 函數
        displayGameOver();
    }
};

// 清除
function clearBoard() {
    // 渲染背景顏色
    ctx.fillStyle = boardBackground;
    // 渲染矩形大小
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

// 產生食物
function createFood() {
    // 呼叫 randomFood 產生亂數
    function randomFood(min, max) {
        // 
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        // 回傳隨機數字
        return randNum;
    }

    // 使用 randomFood 函數 取得食物 X軸 位置
    foodX = randomFood(0, gameWidth - unitSize);
    // 使用 randomFood 函數 取得食物 Y軸 位置
    foodY = randomFood(0, gameWidth - unitSize);
};

// 繪製食物
function drawFood() {
    // 繪製食物顏色
    ctx.fillStyle = foodColor;
    // 填充矩形
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

// 蛇移動
function moveSnake() {
    // 定義頭的位置
    const head = {
        // X軸
        x: snake[0].x + xVelocity,
        // Y軸
        y: snake[0].y + yVelocity
    };

    // 添加新物體在 head 之前
    snake.unshift(head);
    // 當 蛇頭的 X.Y軸 與食物的 X.Y軸 相同 判定為吃到食物
    if (snake[0].x == foodX && snake[0].y == foodY) {
        // 分數 +1
        score += 1;
        // 更新分數
        scoreText.textContent = score;
        // 呼叫 createFood 函數 產生食物
        createFood();
    }
    else {
        // 移除蛇最後的一個單位
        snake.pop();
    }
};

// 繪製蛇
function drawSnake() {
    // 繪製蛇顏色
    ctx.fillStyle = snakeColor;
    // 繪製蛇邊框
    ctx.strokeStyle = snakeBorder;
    // 繪製蛇身體
    snake.forEach(snakePart => {
        // 填充蛇身體的顏色
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        // 填充蛇邊框的顏色
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

// 控制方向
function changeDirection(event) {
    // 定義鍵盤控制方向事件
    const keyPressed = event.keyCode;

    // ←
    const left = 37;
    // ↑
    const up = 38;
    // →
    const right = 39;
    // ↓
    const down = 40;
    // 定義向上時 Y軸 的值
    const goingUp = (yVelocity == -unitSize);
    // 定義向上時 Y軸 的值
    const goingDown = (yVelocity == unitSize);
    // 定義向右時 X軸 的值
    const goingRight = (xVelocity == unitSize);
    // 定義向左時 X軸 的值
    const goingLeft = (xVelocity == -unitSize);

    // 蛇移動事件
    switch (true) {
        // 往左
        case (keyPressed == left && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        // 往上
        case (keyPressed == up && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        // 往右
        case (keyPressed == right && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        // 往下
        case (keyPressed == down && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

// 檢查遊戲是否結束
function checkGameOver() {
    switch (true) {
        // 當蛇的頭碰到左牆
        case (snake[0].x < 0):
            // 更新遊戲狀態
            running = false;
            break;
        // 當蛇的頭碰到右牆
        case (snake[0].x >= gameWidth):
            // 更新遊戲狀態
            running = false;
            break;
        // 當蛇的頭碰到上牆
        case (snake[0].y < 0):
            // 更新遊戲狀態
            running = false;
            break;
        // 當蛇的頭碰到下牆
        case (snake[0].y >= gameHeight):
            // 更新遊戲狀態
            running = false;
            break;
    }

    // 利用 for 迴圈定義蛇身體的每一單位
    for(let i = 1; i < snake.length; i++){
        // 若蛇頭的 X.Y軸 與蛇身體的 X.Y軸 相同 判定為遊戲結束
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            // 更新遊戲狀態
            running = false;
        }
    }
};

// 顯示遊戲結束字樣
function displayGameOver() { 
    // 設定字體
    ctx.font = "50px MV Boli";
    // 設定顏色
    ctx.fillStyle = "black";
    // 設定文字位置
    ctx.textAlign = "center";
    // 設定文字及大小
    ctx.fillText("GAMEOVER!", gameWidth / 2, gameHeight / 2);
    // 更改遊戲狀態 暫停遊戲
    running = false;
};

// 重置遊戲
function resetGame() { 
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: 0, y: 0 }
    ];

    gameStart();
};

