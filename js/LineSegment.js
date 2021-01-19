function LineSegment(x0, y0, x1, y1, dynamic) {
	this.x0 = x0 || 0;
	this.y0 = y0 || 0;
	this.x1 = x1 || 0;
	this.y1 = y1 || 0;
  this.dynamic = dynamic || false;
	this.draw = function(color = "black", width = 1) {
    with (gfx) {
      beginPath();
      moveTo(this.x0, this.y0);
      lineTo(this.x1, this.y1);
      lineWidth = width;
      strokeStyle = color;
      stroke();
      closePath();
		}
	}
	this.length = function() {
		return Math.sqrt((this.x1 - this.x0) * (this.x1 - this.x0) + (this.y1 - this.y0) * (this.y1 - this.y0));
	}
}
