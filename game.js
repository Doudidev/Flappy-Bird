// game.js

document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.querySelector(".game-container");
    const gameCanvas = document.getElementById("gameCanvas");
    const scoreDisplay = document.getElementById("score");
    const startBtn = document.getElementById("startBtn");
    const flapSound = document.getElementById("flapSound");
    const hitSound = document.getElementById("hitSound");
    const pointSound = document.getElementById("pointSound");
    let score = 0;
    let bird;
    let birdTop = 200;
    let birdLeft = 100;
    let gravity = 2;
    let isGameRunning = false;
    let pipes = [];

    function createBird() {
        bird = document.createElement("div");
        bird.style.position = "absolute";
        bird.style.width = "40px";
        bird.style.height = "40px";
        bird.style.background = "url('birdo.png') no-repeat center center / cover";
        bird.style.borderRadius = "50%";
        bird.style.top = `${birdTop}px`;
        bird.style.left = `${birdLeft}px`;
        gameCanvas.appendChild(bird);
    }

    function startGame() {
        isGameRunning = true;
        startBtn.style.display = "none";
        score = 0;
        pipes = [];
        birdTop = 200;
        gameCanvas.innerHTML = "";
        createBird();
        gameLoop();
    }

    function gameLoop() {
        if (!isGameRunning) return;

        birdTop += gravity;
        bird.style.top = `${birdTop}px`;

        if (birdTop >= gameContainer.clientHeight - 40 || birdTop <= 0) {
            hitSound.play();
            endGame();
            return;
        }

        movePipes();
        checkCollision();

        requestAnimationFrame(gameLoop);
    }

    function movePipes() {
        for (let pipe of pipes) {
            pipe.left -= 2;
            pipe.topPipe.style.left = `${pipe.left}px`;
            pipe.bottomPipe.style.left = `${pipe.left}px`;

            if (pipe.left < -60) {
                score++;
                pointSound.play();
                scoreDisplay.textContent = score;
                pipe.topPipe.remove();
                pipe.bottomPipe.remove();
                pipes.shift();
            }
        }

        if (pipes.length === 0 || pipes[pipes.length - 1].left < gameContainer.clientWidth - 300) {
            createPipe();
        }
    }

    function createPipe() {
        const pipeGap = 150;
        const pipeHeight = Math.floor(Math.random() * (gameContainer.clientHeight - 300)) + 100;
        const pipeLeft = gameContainer.clientWidth;

        const topPipe = document.createElement("div");
        topPipe.style.position = "absolute";
        topPipe.style.width = "60px";
        topPipe.style.height = `${pipeHeight}px`;
        topPipe.style.background = "url('pipeup.png') no-repeat center center / cover";
        topPipe.style.top = "0";
        topPipe.style.left = `${pipeLeft}px`;

        const bottomPipe = document.createElement("div");
        bottomPipe.style.position = "absolute";
        bottomPipe.style.width = "60px";
        bottomPipe.style.height = `${gameContainer.clientHeight - pipeHeight - pipeGap}px`;
        bottomPipe.style.background = "url('pipedown.png') no-repeat center center / cover";
        bottomPipe.style.bottom = "0";
        bottomPipe.style.left = `${pipeLeft}px`;

        gameCanvas.appendChild(topPipe);
        gameCanvas.appendChild(bottomPipe);

        pipes.push({
            left: pipeLeft,
            topPipe: topPipe,
            bottomPipe: bottomPipe
        });
    }

    function checkCollision() {
        for (let pipe of pipes) {
            if (
                birdLeft < pipe.left + 60 &&
                birdLeft + 40 > pipe.left &&
                (birdTop < pipe.topPipe.clientHeight ||
                    birdTop + 40 > gameContainer.clientHeight - pipe.bottomPipe.clientHeight)
            ) {
                hitSound.play();
                endGame();
                return;
            }
        }
    }

    function endGame() {
        isGameRunning = false;
        startBtn.style.display = "block";
    }

    function controlBird(e) {
        if (e.key === " " || e.type === "touchstart") {
            flapSound.play();
            birdTop -= 50;
        }
    }

    startBtn.addEventListener("click", startGame);
    document.addEventListener("keydown", controlBird);
    document.addEventListener("touchstart", controlBird);
});