// initialize canvas and context
var canvas = document.getElementById("game");
var gfx = canvas.getContext("2d");
gfx.transform(1, 0, 0, -1, 0, canvas.height);

// game state
var gameState = "menu";

// input state
var mx = 0;
var my = 0;
var mouseDown = false;
var keyState = {};

var redWallKeyCode = 54;
var redProjectileKeyCode = 53;
var blueWallKeyCode = 75;
var blueProjectileKeyCode = 76;

// time
var t = 0;

// initialize game objects
var ui = new OverlayedUI();
var soccerField = new Field();
var score = new ScoreBoard();
var players = [new Player("player1"), new Player("player2")];
var soccerBall = new Ball();

// initialize
init();

// main loop
function update() {
  requestAnimationFrame(update);

  gfx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  /*if (t == 300) {
    soccerField = new Field();
    score = new ScoreBoard();
    players = [new Player("player1"), new Player("player2")];
    soccerBall = new Ball();
  }*/

  soccerField.update();
  var i = 0;
  for (i in players) {
    players[i].update();
  }
  soccerBall.update();
  //ui.update();
  score.update();

  if (soccerBall.x < 0 || soccerBall.x > canvas.width || soccerBall.y < 0 || soccerBall.y > canvas.height || score.redGoal || score.blueGoal) {
    soccerField = new Field();
    players = [new Player("player1"), new Player("player2")];
    soccerBall = new Ball();

    score.redGoal = false;
    score.blueGoal = false;
  }

  soccerField.draw();
  var i = 0;
  for (i in players) {
    players[i].draw();
  }
  soccerBall.draw();
  score.draw();
  //ui.draw();

  t = t + 1;
}

// functions
function init() {
  // initialize event listeners
  gfx.canvas.addEventListener('mousemove', function(event) {
    mx = event.clientX - gfx.canvas.offsetLeft;
    my = event.clientY - gfx.canvas.offsetTop;
  });
  gfx.canvas.addEventListener('mousedown', function(event) {
    mouseDown = true;
  });
  gfx.canvas.addEventListener('mouseup', function(event) {
    mouseDown = false;
  });
  document.addEventListener('keydown', function(e) {
    keyState[e.keyCode || e.which] = true;
  });
  document.addEventListener('keyup', function(e) {
    keyState[e.keyCode || e.which] = false;
  });

  requestAnimationFrame(update); // run loop
}

function distanceTo(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function OverlayedUI() {
  this.menu = false;
  this.update = function() {
    var seconds = t / 60;
    if (t < 180) {
      this.string = "Game is up to 3 goals.";
    } else if (seconds >= 3 && seconds < 4) {
      this.string = "Ready.";
    } else if (seconds >= 4 && seconds < 5) {
      this.string = "Set.";
    } else if (seconds >= 5 && seconds < 6) {
      this.string = "Go!";
    } else {
      this.string = "";
    }
  }
  this.draw = function() {
    if (this.menu) {
      with (gfx) {
        beginPath();
        rect(canvas.width * 0.5 - 100, 0, 100, 100);
        lineWidth = 1;
        strokeStyle = "black";
        stroke();
        closePath();

        font = "100 36px Roboto Mono";
        fillStyle = "black";
        textAlign = "right";
        textBaseline = "bottom";
        transform(1, 0, 0, -1, 0, canvas.height);
        fillText("Play?", canvas.width * 0.5, canvas.height);
        transform(1, 0, 0, -1, 0, canvas.height);
      }
    }
    if (this.string != "") {
      with (gfx) {
        font = "100 36px Roboto Mono";
        fillStyle = "black";
        textAlign = "center";
        textBaseline = "bottom";
        transform(1, 0, 0, -1, 0, canvas.height);
        fillText(this.string, canvas.width * 0.5, canvas.height);
        transform(1, 0, 0, -1, 0, canvas.height);
      }
    }
  }
}
