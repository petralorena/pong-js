// HTML elements
var canvas;
var context;
var lblComputerScore;
var lblPlayerScore;

// frames per second
var fps = 60;

// constants
const BALL_SIZE = 16;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 16;

// game state
var winScreen = false;
var playerScore = 0;
var computerScore = 0;

// ball and paddles variables for position
var ballPosX;
var ballPosY;
var ballSpeedX = 10;
var ballSpeedY = 0;
var leftPaddlePosY;
var rightPaddlePosY;

window.onload = function(){
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");

    ballPosX = (canvas.width/2) - (BALL_SIZE/2);
    ballPosY = (canvas.height/2) - (BALL_SIZE/2);
    leftPaddlePosY = (canvas.height/2) - (PADDLE_HEIGHT/2);
    rightPaddlePosY = leftPaddlePosY;

    lblPlayerScore = document.getElementById("playerScore");
    lblComputerScore = document.getElementById("computerScore");
    lblPlayerScore.innerHTML = 0;
    lblComputerScore.innerHTML = 0;

    ballSpeedY = getRandom(-6, 6);
    
    setInterval(function (){
        draw();
        move();
    }, 1000/fps);

    canvas.addEventListener("mousemove", 
    function(event){
        var mousePos = mousePosition(event);
        leftPaddlePosY = mousePos.y - (PADDLE_HEIGHT/2);
    });

    canvas.addEventListener("mousedown", 
        function(event){
            if(winScreen){
                playerScore = 0;
                computerScore = 0;
                lblPlayerScore.innerHTML = playerScore;        
                lblComputerScore.innerHTML = computerScore;
                document.getElementById("continue").style.display = "none";
                winScreen = false;
            }
    });
}

function draw(){
    colorRect(0, 0, canvas.width, canvas.height, "black");

    if(winScreen){
        document.getElementById("continue").style.display = "block";
        return;
    }

    drawNet();

    colorRect(ballPosX, ballPosY, BALL_SIZE, BALL_SIZE, "white");
    colorRect(0, leftPaddlePosY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
    colorRect(canvas.width-PADDLE_WIDTH, rightPaddlePosY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
}

function drawNet(){
    for(var i=0; i < canvas.height; i+=20){
        colorRect(canvas.width/2-1, i, 6, 6, "grey");
    }
}

function colorRect(x, y, width, height, color){
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function move(){
    if(winScreen){
        return;
    }

    moveComputerPaddle();
    ballPosX += ballSpeedX;
    ballPosY += ballSpeedY;    

    // collision with right paddle
    if(touchRightPaddle()){
        ballSpeedX = -ballSpeedX;  
        ballSpeedY = (ballPosY - (rightPaddlePosY + (PADDLE_HEIGHT/2))) * getRandom(0.20, 0.25);            
    }
    else if(ballPosX > canvas.width){     
        playerScore++;       
        lblPlayerScore.innerHTML = playerScore;
        resetBall();
    }
    // collision with left paddle
    else if(touchLeftPaddle()){
        ballSpeedX = -ballSpeedX;  
        ballSpeedY = (ballPosY - (leftPaddlePosY + (PADDLE_HEIGHT/2))) * getRandom(0.20, 0.25);
    }
    else if (ballPosX < 0){
        computerScore++;
        lblComputerScore.innerHTML = computerScore; 
        resetBall();
    }
    // collision with walls
    else if(ballPosY > canvas.height - BALL_SIZE && ballSpeedY >= 0 || ballPosY < 0 && ballSpeedY <= 0){
        ballSpeedY = -(ballSpeedY);
    }
}

function touchRightPaddle(){
    return ballPosY + BALL_SIZE >= rightPaddlePosY 
        && ballPosY <= (rightPaddlePosY + PADDLE_HEIGHT)
        && ballPosX + BALL_SIZE > canvas.width-PADDLE_WIDTH;
}

function touchLeftPaddle(){
    return ballPosY + BALL_SIZE >= leftPaddlePosY 
        && ballPosY <= (leftPaddlePosY + PADDLE_HEIGHT)
        && ballPosX < PADDLE_WIDTH;
}

function mousePosition(event){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function resetBall(){
    if(playerScore == 5 || computerScore == 5){
        winScreen = true;
    }
    ballSpeedY = getRandom(-8,9);
    ballSpeedX = -ballSpeedX;
    ballPosX = canvas.width/2 - (BALL_SIZE/2);
    ballPosY = canvas.height/2 - (BALL_SIZE/2);
}

function moveComputerPaddle(){
    if(rightPaddlePosY + (PADDLE_HEIGHT/2) < ballPosY - 50){
        rightPaddlePosY += 10;
    }
    else if(rightPaddlePosY + (PADDLE_HEIGHT/2) > ballPosY + 50){
        rightPaddlePosY -= 10;
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}




