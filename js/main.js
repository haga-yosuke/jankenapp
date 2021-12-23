'use strict';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// キャンバスのサイズ
canvas.width = 500;
canvas.height = 650;

document.body.appendChild(canvas);

// 画像読み込み
const img1 = new Image();
img1.src = 'img/paddle2.png';

const img2 = new Image();
img2.src = 'img/ball.png';

// ボールの詳細
const ball = {
    x: null,
    y: null,
    width: 40,
    height: 60,
    speed: 4,
    dx: null,
    dy: null,

    update: function () {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.drawImage(img2, 0, 0, img2.width, img2.height, this.x, this.y, this.width, this.height);

        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

        this.x += this.dx;
        this.y += this.dy;
    }
}

// パドルの詳細
const paddle = {
    X: null,
    y: null,
    width: 150,
    height: 60,
    speed: 0,

    update: function () {
       
        this.x += this.speed;
        
        ctx.drawImage(img1, 0, 0, img1.width, img1.height, this.x, this.y, this.width, this.height);
        

    }
}

// ブロックの詳細
const block = {
    width: null,
    height: 30,
    data: [],


    update: function () {
        this.data.forEach(brick => {
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            ctx.stroke();
        })
    }
}

const level = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
]

// 初期化
const init = () => {
    paddle.x = canvas.width / 2 - paddle.width / 2;
    paddle.y = canvas.height - paddle.height;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2 + 50;
    ball.dx = ball.speed;
    ball.dy = ball.speed;

    block.width = canvas.width / level[0].length;

    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            if (level[i][j]) {
                block.data.push({
                    x: block.width * j,
                    y: block.height * i,
                    width: block.width,
                    height: block.height
                })
            }
        }
    }
}


const collide = (obj1, obj2) => {
    return obj1.x < obj2.x + obj2.width &&
        obj2.x < obj1.x + obj1.width &&
        obj1.y < obj2.y + obj2.height &&
        obj2.y < obj1.y + obj1.height;
}

const loop = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    paddle.update();
    ball.update();
    block.update();

    if (collide(ball, paddle)) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.height;
    }

    block.data.forEach((brick, index) => {
        if (collide(ball, brick)) {
            ball.dy *= -1;
            block.data.splice(index, 1);
        }
    })
    window.requestAnimationFrame(loop);
}

//imgの読み込みを待つ
img1.addEventListener('load', () => {
    init();
    loop();
});

img2.addEventListener('load', () => {
    init();
    loop();
});


// パドル操作
document.addEventListener('keydown', e => {
    if (e.key == 'ArrowLeft') paddle.speed = -6;
    if (e.key == 'ArrowRight') paddle.speed = 6;
});

document.addEventListener('keyup', () => paddle.speed = 0);