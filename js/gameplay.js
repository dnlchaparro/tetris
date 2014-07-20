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
var canRotate = true;
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
    currentBlock.finished = true;
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
        var hasNoBlock = true;
        for (j = 0; j < currentBlock.position.length; j++) {
            if (currentBlock.position[j] === i) {
                hasNoBlock = false;
            }
        }
        if (hasNoBlock) {
            var x = i % 10 * blockSize + .75 * height;
            var y = Math.floor(i / 10) * blockSize;
            if (ocupiedBlocks[i]) {
                ctx.fillStyle = "#587fcc";
                ctx.strokeStyle = "#c4d8e2";
                ctx.lineWidth = 2;
                roundRect(ctx, x, y, blockSize, blockSize, height / 150, true, true);
            } else {
                ctx.fillStyle = "#060606";
                ctx.fillRect(x, y, blockSize, blockSize);
            }
        }
    }
    ctx.strokeStyle = "#c4d8e2";
    ctx.strokeRect(.75 * height, 0, height / 2, height - 1);
};


function drawCurrentBlock() {
    if (currentBlock.position != 0) {
        for (i = 0; i < currentBlock.position.length; i++) {
            if (currentBlock.position[i] >= 0) {
                j = currentBlock.position[i];
                var x = j % 10 * blockSize + .75 * height;
                var y = Math.floor(j / 10) * blockSize;
                ctx.fillStyle = "#ff0000";
                ctx.strokeStyle = "#ff6666";
                ctx.lineWidth = 2;
                roundRect(ctx, x, y, blockSize, blockSize, height / 150, true, false);
            }
        }
    }
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
    if (!onPause) {        
        switch (e.keyCode) {
            case 32: // Fast drop
                moveDown();
                break;
            case 37: // Move left                
                moveLeft();                
                break;
            case 38: // Rotate Left
                for (i = 0; i < currentBlock.position.length; i++) {
                        if (currentBlock.position[i] >= 190 || ocupiedBlocks[currentBlock.position[i] + 10]) {
                            canRotate = false;
                        }
                    }
                if (canRotate) {
                   rotateLeft();
                    }                                   
                break;
            case 39: // Move right
                moveRight();
                break;
            case 40: // Rotate right            
                for (i = 0; i < currentBlock.position.length; i++) {
                        if (currentBlock.position[i] >= 190 || ocupiedBlocks[currentBlock.position[i] + 10]) {
                            canRotate = false;
                        }
                    }
                if (canRotate) { 
                    rotateRight();
                    }
                break;
        }
    }
};

function moveDown() {
    if (currentBlock.finished) {        
        if (currentBlock.position !== 0) {
            for (i = 0; i < currentBlock.position.length; i++) {
                ocupiedBlocks[currentBlock.position[i]] = true;
            }
        }
        checkLine();
        var nextBlock = Math.floor((Math.random() * 7) + 1);
        currentBlock.blockType = nextBlock;
        //currentBlock.blockType = 5;
        currentBlock.finished = false;
        currentBlock.state = 0;
        currentBlock.newBlock();
    } else {
        currentBlock.down();
        drawCurrentBlock();
    }
    drawBoard();
};


function moveLeft() {
    var movePossible = true;
    for (i = 0; i < currentBlock.position.length; i++) {
        if (currentBlock.position[i] % 10 === 0) {
            movePossible = false;
        }
        if (ocupiedBlocks[currentBlock.position[i] - 1] === true) {
            movePossible = false;
        }
    }
    if (movePossible) {
        for (i = 0; i < currentBlock.position.length; i++) {
            currentBlock.position[i] = currentBlock.position[i] - 1;
        }
    }
};


function moveRight() {
    var movePossible = true;
    for (i = 0; i < currentBlock.position.length; i++) {
        if (currentBlock.position[i] % 10 === 9) {
            movePossible = false;
        }
        if (ocupiedBlocks[currentBlock.position[i] + 1] === true) {
            movePossible = false;
        }
    }
    if (movePossible) {
        for (i = 0; i < currentBlock.position.length; i++) {
            currentBlock.position[i] += 1;
        }
    }
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


function nBlock() {

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
        this.state = 0;
        canRotate = true;
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

rotateLeft = function() {
    switch (currentBlock.blockType) {
        case 1: // l block
            //currentBlock.position = [-10, -9, -8, -7];
            rotateRight();
            break;
        case 2: // Z block 
            //currentBlock.position = [-9, -8, -20, -19];
            rotateRight();
            break;
        case 3: // S block
            // currentBlock.position = [-10, -9, -19, -18];
            rotateRight();
            break;
        case 4: // T block
            // currentBlock.position = [-10, -9, -8, -19];            
            temp1 = currentBlock.position[1];
            temp2 = currentBlock.position[3];
            temp3 = currentBlock.position[0];
            switch (currentBlock.state) {
                case 0:                
                    temp0 = currentBlock.position[1] + 10;
                    temp4 = 3;
                break;
                case 1:
                    temp0 = currentBlock.position[1] - 1;
                    temp4 = 0;
                break;
                case 2:
                    temp0 = currentBlock.position[1] - 10;
                    temp4 = 1;
                break;
                case 3:
                    temp0 = currentBlock.position[1] + 1;
                    temp4 = 2;
                break;
            }                        

            var notColides = colisionTBlock([temp0, temp1, temp2, temp3], temp4);
            if (notColides) {
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[2] = temp2;
                currentBlock.position[3] = temp3;
                currentBlock.state = temp4;
            }

            break;
        case 5: // Square block
            // currentBlock.position = [-10, -9, -20, -19];
            // Do Notinhg
            break;
        case 6: // Left L block
            // currentBlock.position = [-10, -9, -8, -20];
            temp1 = currentBlock.position[1];
            switch (currentBlock.state) {                
                case 0:
                    temp0 = currentBlock.position[1] + 10;
                    temp2 = currentBlock.position[1] - 10;
                    temp3 = currentBlock.position[0] + 10;
                    temp4 = 3;
                break;
                case 1:                
                    temp0 = currentBlock.position[1] - 1;
                    temp2 = currentBlock.position[1] + 1;
                    temp3 = currentBlock.position[0] - 1;
                    temp4 = 0;
                break;
                case 2:
                    temp0 = currentBlock.position[1] - 10;
                    temp2 = currentBlock.position[1] + 10;
                    temp3 = currentBlock.position[0] - 10;
                    temp4 = 1;
                break;
                case 3:
                    temp0 = currentBlock.position[1] + 1;
                    temp2 = currentBlock.position[1] - 1;
                    temp3 = currentBlock.position[0] + 1;
                    temp4 = 2;
                break;
            }

            var notColides = colisionLLBlock([temp0, temp1, temp2, temp3], temp4);
            if (notColides) {
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[2] = temp2;
                currentBlock.position[3] = temp3;
                currentBlock.state = temp4;
            }
            break;
        case 7: // Right L block            
            // currentBlock.position = [-10, -9, -8, -18];
            temp1 = currentBlock.position[1];
            switch (currentBlock.state) {                
                case 0:
                    temp0 = currentBlock.position[1] + 10;
                    temp2 = currentBlock.position[1] - 10;
                    temp3 = currentBlock.position[0] - 10;
                    temp4 = 3;
                break;
                case 1:                
                    temp0 = currentBlock.position[1] - 1;
                    temp2 = currentBlock.position[1] + 1;
                    temp3 = currentBlock.position[0] + 1;
                    temp4 = 0;
                break;
                case 2:
                    temp0 = currentBlock.position[1] - 10;
                    temp2 = currentBlock.position[1] + 10;
                    temp3 = currentBlock.position[0] + 10;
                    temp4 = 1;
                break;
                case 3:
                    temp0 = currentBlock.position[1] + 1;
                    temp2 = currentBlock.position[1] - 1;
                    temp3 = currentBlock.position[0] - 1;
                    temp4 = 2;
                break;
            }

            var notColides = colisionRLBlock([temp0, temp1, temp2, temp3], temp4);
            if (notColides) {
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[2] = temp2;
                currentBlock.position[3] = temp3;
                currentBlock.state = temp4;
            }
            break;
    }
};

rotateRight = function() {
    switch (currentBlock.blockType) {
        case 1: // l block
            //currentBlock.position = [-10, -9, -8, -7];            
            if (currentBlock.state === 0) {
                temp0 = currentBlock.position[2] - 20;
                temp1 = currentBlock.position[2] - 10;
                temp2 = currentBlock.position[2] + 10;
                temp3 = 1;
            } else {
                temp0 = currentBlock.position[2] - 2;
                temp1 = currentBlock.position[2] - 1;
                temp2 = currentBlock.position[2] + 1;
                temp3 = 0;
            }
            var notColides = colisionBlock([temp0, temp1, currentBlock.position[2], temp2]);
            if (notColides) {
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[3] = temp2;
                currentBlock.state = temp3;
            }
            break;
        case 2: // Z block 
            // currentBlock.position = [-9, -8, -20, -19];            
            if (currentBlock.state === 0) {
                    temp0 = currentBlock.position[3];
                    temp1 = currentBlock.position[0];
                    temp2 = currentBlock.position[2] + 2;
                    temp3 = currentBlock.position[1] - 20;
                    temp4 = 1;
                } else {
                    temp0 = currentBlock.position[1];
                    temp1 = currentBlock.position[1] + 1;
                    temp2 = currentBlock.position[0] - 1;
                    temp3 = currentBlock.position[0];
                    temp4 = 0;
                }
            var notColides = colisionBlock([temp0, temp1, temp2, temp3]);
            if (notColides) {                
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[2] = temp2;
                currentBlock.position[3] = temp3;
                currentBlock.state = temp4;
            }
            break;
        case 3: // S block
            // currentBlock.position = [-10, -9, -19, -18];
            if (currentBlock.state === 0) {
                    temp0 = currentBlock.position[2] - 10;
                    temp1 = currentBlock.position[2];
                    temp2 = currentBlock.position[3];
                    temp3 = currentBlock.position[3] + 10;
                    temp4 = 1;
                } else {
                    temp0 = currentBlock.position[3] - 2;
                    temp1 = currentBlock.position[1] + 10;
                    temp2 = currentBlock.position[1];
                    temp3 = currentBlock.position[2];
                    temp4 = 0;
                }
            var notColides = colisionSBlock([temp0, temp1, temp2, temp3]);
            if (notColides) {                
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[2] = temp2;
                currentBlock.position[3] = temp3;
                currentBlock.state = temp4;
            }
            break;
        case 4: // T block
            // currentBlock.position = [-10, -9, -8, -19];
            temp0 = currentBlock.position[3];
            temp1 = currentBlock.position[1];
            temp3 = currentBlock.position[2];
            switch (currentBlock.state) {
                case 0:
                    temp2 = currentBlock.position[1] + 10;                    
                    temp4 = 1;
                break;
                case 1:
                    temp2 = currentBlock.position[1] - 1;
                    temp4 = 2;
                break;
                case 2:
                    temp2 = currentBlock.position[1] - 10;
                    temp4 = 3;
                break;
                case 3:
                    temp2 = currentBlock.position[1] + 1;
                    temp4 = 0;
                break;
            }

            var notColides = colisionTBlock([temp0, temp1, temp2, temp3], temp4);
            if (notColides) {
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[2] = temp2;
                currentBlock.position[3] = temp3;
                currentBlock.state = temp4;
            }

            break;
        case 5: // Square block
            // currentBlock.position = [-10, -9, -20, -19];
            // Do Nothing
            break;
        case 6: // Left L block
            //currentBlock.position = [-10, -9, -8, -20];
            temp1 = currentBlock.position[1];
            switch (currentBlock.state) {                
                case 0:
                    temp0 = currentBlock.position[1] - 10;
                    temp2 = currentBlock.position[1] + 10;
                    temp3 = currentBlock.position[2] - 10;
                    temp4 = 1;
                break;
                case 1:                
                    temp0 = currentBlock.position[1] + 1;
                    temp2 = currentBlock.position[1] - 1;
                    temp3 = currentBlock.position[2] + 1;
                    temp4 = 2;
                break;
                case 2:
                    temp0 = currentBlock.position[1] + 10;
                    temp2 = currentBlock.position[1] - 10;
                    temp3 = currentBlock.position[2] + 10;
                    temp4 = 3;
                break;
                case 3:
                    temp0 = currentBlock.position[1] - 1;
                    temp2 = currentBlock.position[1] + 1;
                    temp3 = currentBlock.position[2] - 1;
                    temp4 = 0;
                break;
            }

            var notColides = colisionLLBlock([temp0, temp1, temp2, temp3], temp4);
            if (notColides) {
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[2] = temp2;
                currentBlock.position[3] = temp3;
                currentBlock.state = temp4;
            }
            break;
        case 7: // Right L block            
            // currentBlock.position = [-10, -9, -8, -18];
            temp1 = currentBlock.position[1];
            switch (currentBlock.state) {                
                case 0:
                    temp0 = currentBlock.position[1] - 10;
                    temp2 = currentBlock.position[1] + 10;
                    temp3 = currentBlock.position[2] + 10;
                    temp4 = 1;
                break;
                case 1:                
                    temp0 = currentBlock.position[1] + 1;
                    temp2 = currentBlock.position[1] - 1;
                    temp3 = currentBlock.position[2] - 1;
                    temp4 = 2;
                break;
                case 2:
                    temp0 = currentBlock.position[1] + 10;
                    temp2 = currentBlock.position[1] - 10;
                    temp3 = currentBlock.position[2] - 10;
                    temp4 = 3;
                break;
                case 3:
                    temp0 = currentBlock.position[1] - 1;
                    temp2 = currentBlock.position[1] + 1;
                    temp3 = currentBlock.position[2] + 1;
                    temp4 = 0;
                break;
            }

            var notColides = colisionRLBlock([temp0, temp1, temp2, temp3], temp4);
            if (notColides) {
                currentBlock.position[0] = temp0;
                currentBlock.position[1] = temp1;
                currentBlock.position[2] = temp2;
                currentBlock.position[3] = temp3;
                currentBlock.state = temp4;
            }
            break;
    }
};

function colisionBlock(position) {
    var notCollide = true;
    var blockPosition;
    for (i = 0; i < position.length; i++) {
        blockPosition = position[i];
        if (ocupiedBlocks[blockPosition] || blockPosition > 199) {
            notCollide = false;
        }
    }
    if (currentBlock.state === 1) { // Vertical
        var max = Math.max.apply(null, position);
        var min = Math.min.apply(null, position);
        if (max % 10 < min % 10) {
            notCollide = false;
        }
    }
    return notCollide;
};


function colisionSBlock(position) {
    var notCollide = true;
    var blockPosition;
    for (i = 0; i < position.length; i++) {
        blockPosition = position[i];
        if (ocupiedBlocks[blockPosition] || blockPosition > 199) {
            notCollide = false;
        }
    }
    if (currentBlock.state === 1) { // Vertical
        if (position[0] % 10 > position[1] % 10) {
            notCollide = false;
        }
    }
    return notCollide;
};

function colisionTBlock(position, state) {
    var notCollide = true;
    var blockPosition;
    for (i = 0; i < position.length; i++) {
        blockPosition = position[i];
        if (ocupiedBlocks[blockPosition] || blockPosition > 199) {
            notCollide = false;
        }
    }
    switch(state) {
        case 0:
            if(position[0] % 10 > position[1] % 10) {notCollide = false;}
            if(position[2] % 10 < position[1] % 10) {notCollide = false;}
        break;        
        case 2:
            if(position[0] % 10 < position[1] % 10) {notCollide = false;}
            if(position[2] % 10 > position[1] % 10) {notCollide = false;}
        break;
    }    
    return notCollide;
};

function colisionLLBlock(position, state) {
    var notCollide = true;
    var blockPosition;
    for (i = 0; i < position.length; i++) {
        blockPosition = position[i];
        if (ocupiedBlocks[blockPosition] || blockPosition > 199) {
            notCollide = false;
        }
    }
    if(ocupiedBlocks[position[0] - 1] || ocupiedBlocks[position[0] + 1]
                || ocupiedBlocks[position[2] + 1] || ocupiedBlocks[position[0] - 1]) {notCollide = false;}
    switch(state) {
        case 0:
            if(position[0] % 10 > position[2] % 10) {notCollide = false;}
        break;        
        case 2:
            if(position[0] % 10 < position[2] % 10) {notCollide = false;}
        break;
    }
    return notCollide;
};

function colisionRLBlock(position, state) {
    var notCollide = true;
    var blockPosition;
    for (i = 0; i < position.length; i++) {
        blockPosition = position[i];
        if (ocupiedBlocks[blockPosition] || blockPosition > 199) {
            notCollide = false;
        }
    }
    if(ocupiedBlocks[position[0] - 1] || ocupiedBlocks[position[0] + 1]
                || ocupiedBlocks[position[2] + 1] || ocupiedBlocks[position[0] - 1]) {notCollide = false;}
    switch(state) {
        case 0:
            if(position[0] % 10 > position[2] % 10) {notCollide = false;}            
        break;        
        case 2:
            if(position[0] % 10 < position[2] % 10) {notCollide = false;}            
        break;
    }
    return notCollide;
};

function checkLine() {    
    var completedLines = new Array();
    count = 0;
    for (i = 0; i < currentBlock.position.length; i++) {
        var line = Math.floor(currentBlock.position[i] / 10);
        var lineCompleted = true;
        for (j = 0; j < 10; j++) {
            if(!ocupiedBlocks[line * 10 + j]) {
                lineCompleted = false;
            }
        }
        if (lineCompleted && completedLines.indexOf(line * 10) == -1) {completedLines[count++] = line * 10;}
    }

    completedLines.sort(function(a, b){return a-b});    

    for (i = 0; i < completedLines.length; i++) {
        for (k = completedLines[i] + 9; k > 9; k--) {
            ocupiedBlocks[k] = ocupiedBlocks[k - 10];
        }
        for(j = 0; j < 10; j++) {
            ocupiedBlocks[j] = false;
        }
    }
};
