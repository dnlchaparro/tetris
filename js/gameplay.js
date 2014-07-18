var ctx = null;
var ended = false;
var onPause = false;
var notStarted = true;
var blockSize = 0;
var ctx = null;
var height = 0;
var speed = 500;
var level = 1;
var score = 0;
var lines = 0;
var linesToNext = 10;
var difficulty = 0;
var ocupiedBlocks = new Array(200);
var timerID;
var currentBlock = new nBlock();


function createCanvas() {
    var body = document.getElementById("body");
    var div = document.createElement("div");
    div.id = "gameContainer";
    var canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    height = $(window).height() - $(window).height() / 10;
    canvas.width = 2 * height;
    canvas.height = height;
    blockSize = canvas.height / 20;
    div.appendChild(canvas);
    body.appendChild(div);
    ctx = canvas.getContext("2d");
    startGame();
};

function startGame() {
    currentBlock.blockType = 0;
    currentBlock.position = 0;
    drawInstructions();
    drawBoard();
    drawScore();
    for (var i = 0; i < 200; i++) {
        ocupiedBlocks[i] = false;
    }
    window.addEventListener('keydown', this.check, false);
};

function drawInstructions() {
    var size = height / 20;
    ctx.fillStyle = "#587fcc";
    roundRect(ctx, 0, height / 3 - 1.1 * size, height * .74, size * 8, size / 2, true, true)
    ctx.fillStyle = "#c4d8e2";
    var font = 'px Verdana';
    ctx.font = size + font;
    ctx.fillText("Instructions:", 10, height / 3);
    var font = 'px Verdana';
    var size = height / 24;
    ctx.font = size + font;
    var i = 2;
    ctx.fillText("Right arrow -> Move Right", 10, height / 3 + i++ * size);
    ctx.fillText("Left arrow -> Move Left", 10, height / 3 + i++ * size);
    ctx.fillText("Up arrow -> Rotate Left", 10, height / 3 + i++ * size);
    ctx.fillText("Down arrow -> Rotate Right", 10, height / 3 + i++ * size);
    ctx.fillText("Enter key -> Start/Pause game", 10, height / 3 + i++ * size);
    ctx.fillText("Spacebar -> drop fast", 10, height / 3 + i++ * size);
};

function drawBoard() {
    for (i = 0; i < 200; i++) {
        var x = i % 10 * blockSize + .75 * height;
        var y = Math.floor(i / 10) * blockSize;
        if (blockSize[i]) {
            ctx.fillStyle = "#587fcc";
            ctx.strokeStyle = "#c4d8e2";
            ctx.lineWidth = 2;
            roundRect(ctx, x, y, blockSize, blockSize, height / 150, true, true);
        } else {
            ctx.fillStyle = "#606060";
            ctx.fillRect(x, y, blockSize, blockSize);
        }
    }
    ctx.strokeStyle = "#c4d8e2";
    ctx.strokeRect(.75 * height, 0, height / 2, height - 1);
    ctx.stroke();
};

function drawScore() {
    var left = 1.35 * height;
    var top = height / 3;
    var size = height / 20;
    ctx.fillStyle = "#587fcc";
    roundRect(ctx, left - .5 * size, top - 1.1 * size, size * 10, size * 1.5, size / 2, true, true);
    roundRect(ctx, left - .5 * size, top - 1.1 * size + 3 * size, size * 10, size * 1.5, size / 2, true, true);
    roundRect(ctx, left - .5 * size, top - 1.1 * size + 6 * size, size * 10, size * 1.5, size / 2, true, true);
    roundRect(ctx, left - .5 * size, top - 1.1 * size + 9 * size, size * 10, size * 1.5, size / 2, true, true);
    var font = "px Verdana";
    ctx.fillStyle = "#c4d8e2";
    ctx.font = "bold " + size + font;
    var lvl = "Level: " + level;
    ctx.fillText(lvl, left, top);
    var lns = "Lines: " + score;
    ctx.fillText(lns, left, top + 3 * size);
    var scr = "Score: " + score;
    ctx.fillText(scr, left, top + 6 * size);
    var nxt = "To Next: " + linesToNext;
    ctx.fillText(nxt, left, top + 9 * size);
};

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
};




////////////////////////////////////////////////////////////////////////////////////////7
function check(e) {
    if (e.keyCode === 13) {
        if (notStarted) {
            notStarted = false;
            onPause = true;
        }
        if (onPause) {
            timerID = setInterval("moveDown()", speed);
        } else {
            clearInterval(timerID);
        }
        onPause = !onPause;
    }
    if (onPause) {
        switch (e.keyCode) {
            case 32: // Fast drop

                break;
            case 37: // Move left

                break;
            case 38: // Rotate Left

                break;
            case 39: // Move right

                break;
            case 40: // Rotate down

                break;
        }
    }
};

function moveDown() {
    if (currentBlock.finished) {
        alert(currentBlock.position);
        if (currentBlock.position != 0) {
            for (i = 0; i < currentBlock.position.length; i++) {
                ocupiedBlocks[i] = true;
            }
        }
        var nextBlock = Math.floor((Math.random() * 7) + 1);
        currentBlock.blockType = nextBlock;
        currentBlock.newBlock();
    } else {
        currentBlock.down();
    }
    drawBoard();
};


function checkColission(position) {
    var collide = false;
    var blockPosition;
    for (i = 0; i < position.length; i++) {
        blockPosition = position[i] + 10;
        if (ocupiedBlocks[blockPosition] || blockPosition > 199) {
            collide = true;
        }
    }
    return collide;
};

////////////////////////////////////////////////////////////////////////////77
function nBlock() {

    this.rotateLeft = function() {};

    this.rotateRight = function() {};


    this.down = function() {
        var collide = checkColission(this.position);
        if (!collide) {
            for (i = 0; i < this.position.length; i++) {
                this.position[i] += 10;
            }
        } else {
            this.finished = true;
        }
    };

    this.newBlock = function() {
        this.finished = false;

        switch (this.blockType) {
            case 0: // l block            
                this.position = 0;
                break;
            case 1: // l block
                this.position = [-10, -9, -8, -7];
                break;
            case 2: // Z block 
                this.position = [-9, -8, -20, -19];
                break;
            case 3: // S block
                this.position = [-10, -9, -19, -18];
                break;
            case 4: // T block
                this.position = [-10, -9, -8, -19];
                break;
            case 5: // Square block
                this.position = [-10, -9, -20, -19];
                break;
            case 6: // Left L block
                this.position = [-10, -9, -8, -20];
                break;
            case 7: // Right L block            
                this.position = [-10, -9, -8, -18];
                break;
        };
    };
};
