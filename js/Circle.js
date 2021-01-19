function Circle(x, y, radius, dynamic, vx, vy) {
	this.x = x;
	this.y = y;
	this.radius = radius;
  this.dynamic = dynamic || false;
  if (this.dynamic) {
    this.vel = new Vector2D(vx, vy);
  }
  this.update = function() {
    if (this.dynamic) {
      this.x += this.vel.x;
      this.y += this.vel.y;
    }
  }
	this.draw = function(fillCircle = true, fillColor = "white", strokeCircle = true, strokeWidth = 1, strokeColor = "black") {
		with (gfx) {
			beginPath();
      if (strokeCircle) {
        arc(this.x, this.y, this.radius - strokeWidth, 0, 2 * Math.PI);
      } else {
        arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      }
			fillStyle = fillColor;
      if (fillCircle) {
        fill();
      }
      lineWidth = strokeWidth;
			strokeStyle = strokeColor;
      if (strokeCircle) {
        stroke();
      }
			closePath();
		}
	}
}
