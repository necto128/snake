const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

let box = 32;
let mode = "Normal"
let score = 0;
let speedx = 1
let food = {
    x: Math.floor((Math.random() * 17 + 1)) * box,
    y: Math.floor((Math.random() * 15 + 3)) * box,
};

let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

document.addEventListener("keydown", direction);

let dir;

function direction(event) {
    if (event.keyCode == 37 && dir != "right")
        dir = "left";
    else if (event.keyCode == 38 && dir != "down")
        dir = "up";
    else if (event.keyCode == 39 && dir != "left")
        dir = "right";
    else if (event.keyCode == 40 && dir != "up")
        dir = "down";
}

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y)
            clearInterval(game);
    }
}

function drawGame() {
    ctx.drawImage(ground, 0, 0);

    ctx.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);
    ctx.fillText("x" + speedx, box * 7, box * 1.7);
    ctx.fillText("mode:" + mode, box * 9, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        };
    } else {
        snake.pop();
    }

    if (
        snakeX < box ||
        snakeX > box * 17 ||
        snakeY < 3 * box ||
        snakeY > box * 17 ||
        checkCollision(snakeX, snakeY) // вызываем функцию проверки столкновений
    ) {
        clearInterval(game);
        alert("Game over!");
    }

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    snake.unshift(newHead);
    if (mode == "Hard") {
        drawCubes(); // вызываем функцию отрисовки кубиков
    }

}

let cubes = [];

function createCubes() {
    for (let i = 0; i < 10; i++) {
        let cube = generateUniqueCube();
        cubes.push(cube);
    }
}

function generateUniqueCube() {
    let cube = {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box
    };

    // Проверяем, чтобы новый кубик не совпадал с змеей
    for (let i = 0; i < snake.length; i++) {
        if (cube.x === snake[i].x && cube.y === snake[i].y) {
            return generateUniqueCube();
        }
    }

    // Проверяем, чтобы новый кубик не совпадал с другими кубиками
    for (let i = 0; i < cubes.length; i++) {
        if (cube.x === cubes[i].x && cube.y === cubes[i].y) {
            return generateUniqueCube();
        }
    }

    return cube;
}

function drawCubes() {
    cubes.forEach(cube => {
        ctx.fillStyle = "gray";
        ctx.fillRect(cube.x, cube.y, box, box);
    });
}

function checkCollision(x, y) {
    for (let i = 0; i < cubes.length; i++) {
        if (x == cubes[i].x && y == cubes[i].y) {
            return true; // возвращаем true, если есть столкновение
        }
    }
    return false; // возвращаем false, если нет столкновения
}

// Внутри функции restartGame вызываем функцию createCubes, чтобы создать кубики

function restartGame() {
    clearInterval(game);
    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };
    food = {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box,
    };
    dir = undefined;
    score = 0;

    if (mode == "Hard") {
        cubes = [];
        createCubes(); // вызываем функцию создания кубиков
        // Проверяем, чтобы новая еда не совпадала с кубиками
        for (let i = 0; i < cubes.length; i++) {
            while (food.x === cubes[i].x && food.y === cubes[i].y) {
                food = {
                    x: Math.floor((Math.random() * 17 + 1)) * box,
                    y: Math.floor((Math.random() * 15 + 3)) * box,
                };
            }
        }
    }




    game = setInterval(drawGame, 200);
}

let game = setInterval(drawGame, 200);
createCubes()
    // Добавляем обработчик события для кнопки "Refresh"
const refreshButton = document.getElementById("refresh-button");
refreshButton.addEventListener("click", restartGame);


// Добавляем обработчик события для кнопки "скорости"
const speedButton_x1 = document.getElementById("x1");
speedButton_x1.addEventListener("click", () => {
    speedGame(200);
    speedx = 1;
});

const speedButton_x2 = document.getElementById("x2");
speedButton_x2.addEventListener("click", () => {
    speedGame(150);
    speedx = 2;
});

const speedButton_x4 = document.getElementById("x4");
speedButton_x4.addEventListener("click", () => {
    speedGame(50);
    speedx = 4;
});

const modeButton_normal = document.getElementById("normal");
modeButton_normal.addEventListener("click", () => {
    mode = "Normal";
});

const modeButton_hard = document.getElementById("hard");
modeButton_hard.addEventListener("click", () => {
    mode = "Hard";
});

function speedGame(speed) {

    clearInterval(game);
    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };
    food = {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box,
    };
    dir = undefined;
    score = 0;
    console.log(speed);
    game = setInterval(drawGame, speed);
}