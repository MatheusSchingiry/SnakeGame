const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const score = document.querySelector('.scoreValue');
const finalScore = document.querySelector('.finalScore > span');
const menu = document.querySelector('.menuScreen');
const buttonPlay = document.querySelector('.btn-play');

const initialPosition = {x: 270, y: 240};
const size = 30;
const points = 10;
const plusVelocity = 12.5;
let direction, loopID;
let velocity = 300;

let snake = [
    initialPosition
]

const incrementScore = () => {
    score.innerHTML = +score.innerHTML + points;
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: "red"
}

function drawFood(){

    const { x, y, color} = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

function drawSnake()
{
    ctx.fillStyle = "green";
    snake.forEach((position, index) => {
        if(index == snake.length - 1)
        {
            ctx.fillStyle = "lightgreen";
        }
        ctx.fillRect(position.x, position.y, size, size);
    })
}

function moveSnake(){
    const head = snake[snake.length -1];

    if(!direction) return;
    if(direction == "right")
    {
        snake.push({x: head.x + size, y: head.y});
    }
    if(direction == "left")
    {
        snake.push({x: head.x - size, y: head.y});
    }
    if(direction == "up")
    {
        snake.push({x: head.x, y: head.y - size});
    }
    if(direction == "down")
    {
        snake.push({x: head.x, y: head.y + size});
    }
    
    snake.shift();
}

function drawGrid(){
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for(var i = 30; i < canvas.width; i += 30)
    {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function randomizerFood()
{
    let x = randomPosition();
    let y = randomPosition();

    while(snake.find((position) => position.x == x && position.y == y)) {
        x = randomPosition();
        y = randomPosition();
    }

    food.x = x;
    food.y = y;
}

function checkEat(){
    const head = snake[snake.length -1];

    if (head.x == food.x && head.y == food.y)
    {
        incrementScore();
        snake.push(head);
        randomizerFood();

        if(velocity >= 100)
        {
            velocity = velocity - plusVelocity;
        }
    }
}

function gameOver()
{
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}

function checkColition()
{
    const head = snake[snake.length - 1];
    const neckIndex = snake.length - 2;
    const canvasLimit = canvas.width - size;

    const wallColidion = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    const snakeColidion = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    })

    if(wallColidion || snakeColidion)
    {
        gameOver();
    }
}

function gameLoop(){
    clearInterval(loopID);
    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkColition();

    loopID = setTimeout(() => {
        gameLoop();
    }, velocity)
}

gameLoop();

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left"){
        direction = "right";
    }

    if (key == "ArrowLeft" && direction != "right"){
        direction = "left";
    }

    
    if (key == "ArrowDown" && direction != "up"){
        direction = "down";
    }
    
    if (key == "ArrowUp" && direction != "down"){
        direction = "up";
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    randomizerFood();
    snake = [initialPosition];
})