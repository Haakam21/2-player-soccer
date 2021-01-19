function ScoreBoard() {
  this.redGoal = false;
  this.blueGoal = false;
  this.red = 0;
  this.blue = 0;
  this.update = function() {
    if (soccerBall.x > canvas.width - soccerField.fieldInset - soccerField.goalDepth + soccerBall.radius) {
      this.redGoal = true;
      this.red += 1;
    }
    if (soccerBall.x < soccerField.fieldInset + soccerField.goalDepth - soccerBall.radius) {
      this.blueGoal = true;
      this.blue += 1;
    }
  }
  this.draw = function() {
    with (gfx) {
      font = "100 72px Roboto Mono";
      fillStyle = "red";
      textAlign = "right";
      textBaseline = "top";
      transform(1, 0, 0, -1, 0, canvas.height);
      fillText(this.red, canvas.width * 0.5 - 20, 0);
      transform(1, 0, 0, -1, 0, canvas.height);

      font = "100 72px Roboto Mono";
      fillStyle = "blue";
      textAlign = "left";
      textBaseline = "top";
      transform(1, 0, 0, -1, 0, canvas.height);
      fillText(this.blue, canvas.width * 0.5 + 20, 0);
      transform(1, 0, 0, -1, 0, canvas.height);
    }
  }
}
