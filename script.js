var canvas;
var context;
var ballPosX = 392;
var ballPosY = 292;
var ballSpeedX = 6;
var ballSpeedY = 6;

var fps = 60;

var leftPaddlePosY = 250;
var rightPaddlePosY = 250;

const BALL_SIZE = 16;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 16;

var playerScore = 0;
var computerScore = 0;

var lblComputerScore;
var lblPlayerScore;

window.onload = function(){
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");

    lblPlayerScore = document.getElementById("playerScore");
    lblComputerScore = document.getElementById("computerScore");
    lblPlayerScore.innerHTML = 0;
    lblComputerScore.innerHTML = 0;
    
    setInterval(function (){
        draw();
        move();
    }, 1000/fps);

    canvas.addEventListener("mousemove", 
        function(event){
            var mousePos = mousePosition(event);
            leftPaddlePosY = mousePos.y - (PADDLE_HEIGHT/2);
    });
}

function draw(){
    // background
    colorRect(0, 0, canvas.width, canvas.height, "black");
    // ball
    colorRect(ballPosX, ballPosY, BALL_SIZE, BALL_SIZE, "white");
    // left paddle
    colorRect(0, leftPaddlePosY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
    // right paddle
    colorRect(canvas.width-PADDLE_WIDTH, rightPaddlePosY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
}

function move(){
    computerPaddle();

    ballPosX += ballSpeedX;
    ballPosY += ballSpeedY;
    
    if(ballPosX > canvas.width){
        if(touchRightPaddle()){
            ballSpeedX = -ballSpeedX;  
            ballSpeedY = (ballPosY - (rightPaddlePosY + (PADDLE_HEIGHT/2))) * 0.25;            
        }
        else{            
            lblPlayerScore.innerHTML = playerScore++;
            resetBall();
        }
    }
    if(ballPosX < 0){
        if(touchLeftPaddle()){
            ballSpeedX = -ballSpeedX;  
            ballSpeedY = (ballPosY - (leftPaddlePosY + (PADDLE_HEIGHT/2))) * 0.25;
        }
        else{
            lblComputerScore.innerHTML = computerScore++; 
            resetBall();
        }
    }
    if(ballPosY > canvas.height - BALL_SIZE || ballPosY < 0){
        ballSpeedY = -ballSpeedY;
    }
}

function touchRightPaddle(){
    return ballPosY > rightPaddlePosY && ballPosY < (rightPaddlePosY + PADDLE_HEIGHT);
}

function touchLeftPaddle(){
    return ballPosY > leftPaddlePosY && ballPosY < (leftPaddlePosY + PADDLE_HEIGHT);
}

function colorRect(x, y, width, height, color){
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
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
        playerScore = 0;
        computerScore = 0;
        lblPlayerScore.innerHTML = playerScore;        
        lblComputerScore.innerHTML = computerScore;
    }
    ballSpeedX = -ballSpeedX;
    ballPosX = canvas.width/2 - (BALL_SIZE/2);
    ballPosY = canvas.height/2 - (BALL_SIZE/2);
}

function computerPaddle(){
    if(rightPaddlePosY + (PADDLE_HEIGHT/2) < ballPosY - 50){
        rightPaddlePosY += 10;
    }
    else if(rightPaddlePosY + (PADDLE_HEIGHT/2) > ballPosY + 50){
        rightPaddlePosY -= 10;
    }
}

function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

