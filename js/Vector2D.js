function Vector2D(x, y, x0, y0) {
	this.x = x || 0;
	this.y = y || 0;
  this.x0 = x0 || 0;
	this.y0 = y0 || 0;
	this.draw = function(drawLine = true, scale = 1, drawArrow = true, arrowScale = 0.1, color = "black", width = 1) {
    this.multiply(scale);

    this.sprite = new LineSegment(this.x0, this.y0, this.x0 + this.x, this.y0 + this.y);

    var perpendicular = new Vector2D(-this.y, this.x , this.x0 + this.x * (1 - arrowScale), this.y0 + this.y * (1 - arrowScale));
    perpendicular.multiply(arrowScale);

    var arrow = [
      new LineSegment(this.x0 + this.x, this.y0 + this.y, perpendicular.x0 + perpendicular.x, perpendicular.y0 + perpendicular.y),
      new LineSegment(this.x0 + this.x, this.y0 + this.y, perpendicular.x0 - perpendicular.x, perpendicular.y0 - perpendicular.y)
    ];

    if (drawLine){
      this.sprite.draw(color, width);
    }

    if (drawArrow) {
      var i = 0;
      for (i in arrow) {
        arrow[i].draw();
      }
    }

    this.divide(scale);
	}
  this.negative = function() {
		this.x = -this.x;
    this.y = -this.y;
	}
	this.add = function(vector) {
		this.x += vector.x;
    this.y += vector.y;
	}
	this.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
	}
	this.multiply = function(multiplier) {
    this.x *= multiplier;
    this.y *= multiplier;
	}
  this.divide = function(divisor) {
    this.x /= divisor;
    this.y /= divisor;
	}
  this.plus = function(vector) {
		return new Vector2D(this.x + vector.x, this.y + vector.y);
	}
	this.minus = function(vector) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
	}
	this.multipliedBy = function(multiplier) {
    return new Vector2D(this.x * multiplier, this.y * multiplier);
	}
  this.dividedBy = function(divisor) {
    return new Vector2D(this.x / divisor, this.y / divisor);
	}
  this.normal = function() {
		return this.dividedBy(this.magnitude());
  }
  this.normalize = function() {
		this.divide(this.magnitude());
  }
  this.magnitude = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	this.cross = function(vector) {
		return this.x * vector.y - this.y * vector.x;
	}
	this.dot = function(vector) {
		return this.x * vector.x + this.y * vector.y;
	}
  this.project = function(segOnto) {
    var onto = new Vector2D(segOnto.x1 - segOnto.x0, segOnto.y1 - segOnto.y0, segOnto.x0, segOnto.y0);
    var d = onto.dot(onto);
    if (d > 0) {
      var dp = this.dot(onto);
      var multiplier = dp / d;
      var rx = onto.x * multiplier;
      var ry = onto.y * multiplier;
      return new Vector2D(rx, ry, segOnto.x0, segOnto.y0);
    }
    return new Vector2D(0, 0, segOnto.x0, segOnto.y0);
  }
}
