function Ball() {
  this.x = canvas.width * 0.5; // x position
  this.y = canvas.height * 0.5; // y poisiton
  this.radius = 10; // sprite radius
  this.vel = new Vector2D(); // vel vector
  this.fric = 0.975; // friction coefficient
  this.bounce = 0.5; // bounce factor
  this.perfectRandom = 5;
  this.sprite = new Circle(this.x, this.y, this.radius);
  this.update = function() { // update
    this.vel.x *= this.fric;
    this.vel.y *= this.fric;

    this.x += this.vel.x;
    this.y += this.vel.y;

    var i = 0;
    for (i in players) {
      var normal = new Vector2D(this.x - players[i].x, this.y - players[i].y);
      if (normal.magnitude() < this.radius + players[i].radius) {
        normal.normalize();
        normal.multiply(this.radius + players[i].radius);
        this.x = players[i].x + normal.x;
        this.y = players[i].y + normal.y;

        this.vel.add(normal.normal().multipliedBy(players[i].vel.magnitude() * players[i].kick + this.vel.magnitude()));

        if (Math.abs(this.vel.normal().x) === 0 && Math.abs(this.vel.normal().y) === 1) {
          this.vel.x = Math.random() * this.perfectRandom * 2 - this.perfectRandom;
        }

        if (Math.abs(this.vel.normal().x) === 1 && Math.abs(this.vel.normal().y) === 0) {
          this.vel.y = Math.random() * this.perfectRandom * 2 - this.perfectRandom;
        }
      }
    }

    var i = 0;
    for (i in soccerField.objects) {
      if (soccerField.objects[i] instanceof LineSegment) {
        var lineSeg = soccerField.objects[i];

        var fromSeg0 = new Vector2D(this.x - lineSeg.x0, this.y - lineSeg.y0, lineSeg.x0, lineSeg.y0);
        var fromSeg1 = new Vector2D(this.x - lineSeg.x1, this.y - lineSeg.y1, lineSeg.x1, lineSeg.y1);

        var projection1 = fromSeg0.project(lineSeg);
        var projection2 = fromSeg1.project(lineSeg);

        var normal = new Vector2D(this.x - (projection1.x0 + projection1.x), this.y - (projection1.y0 + projection1.y));

        if (normal.magnitude() < this.radius && (projection1.magnitude() < lineSeg.length() && projection2.magnitude() < lineSeg.length())) {
          normal.normalize();
          normal.multiply(this.radius);
          this.x = projection1.x0 + projection1.x + normal.x;
          this.y = projection1.y0 + projection1.y + normal.y;

          normal.normalize();
          this.vel = this.vel.minus(normal.multipliedBy(2 * this.vel.dot(normal)));
        }
        else {
          if (fromSeg0.magnitude() < this.radius) {
            fromSeg0.normalize();

            this.x = lineSeg.x0 + fromSeg0.x * this.radius;
            this.y = lineSeg.y0 + fromSeg0.y * this.radius;

            this.vel = this.vel.minus(fromSeg0.multipliedBy(2 * this.vel.dot(fromSeg0)));
          }
          if (fromSeg1.magnitude() < this.radius) {
            fromSeg1.normalize();

            this.x = lineSeg.x1 + fromSeg1.x * this.radius;
            this.y = lineSeg.y1 + fromSeg1.y * this.radius;

            this.vel = this.vel.minus(fromSeg1.multipliedBy(2 * this.vel.dot(fromSeg1)));
          }
        }
      }
      if (soccerField.objects[i] instanceof Circle) {
        var circle = soccerField.objects[i];
        var normal = new Vector2D(this.x - circle.x, this.y - circle.y);
        if (normal.magnitude() < this.radius + circle.radius) {
          normal.normalize();
          normal.multiply(this.radius + circle.radius);
          this.x = circle.x + normal.x;
          this.y = circle.y + normal.y;

          this.vel.add(normal.normal().multipliedBy(circle.vel.magnitude() * soccerField.projectilePush + this.vel.magnitude()));

          if (Math.abs(this.vel.normal().x) === 0 && Math.abs(this.vel.normal().y) === 1) {
            this.vel.x = Math.random() * this.perfectRandom * 2 - this.perfectRandom;
          }

          if (Math.abs(this.vel.normal().x) === 1 && Math.abs(this.vel.normal().y) === 0) {
            this.vel.y = Math.random() * this.perfectRandom * 2 - this.perfectRandom;
          }
        }
      }
    }
  }
  this.draw = function() { // draw ball
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.draw(true, "white", true, 1, "black");
  }
}
