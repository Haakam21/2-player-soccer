function Field() {
  this.wallDistance = 60;
  this.wallWidth = 180;
  this.wallCharge = 100;
  this.projectileRadius = 30;
  this.projectileSpeed = 10;
  this.projectilePush = 0.5;
  this.projectileCharge = 100;
  this.fieldInset = 1;
  this.goalWidth = 360;
  this.goalDepth = 60;
  this.cornerDepth = 30;
  this.centerCircleRadius = 80;
  this.a = {x: this.fieldInset, y: canvas.height * 0.5 + this.goalWidth * 0.5 - this.goalDepth};
  this.b = {x: this.fieldInset + this.goalDepth, y: canvas.height * 0.5 + this.goalWidth * 0.5};
  this.c = {x: this.fieldInset + this.goalDepth, y: canvas.height - this.fieldInset - this.cornerDepth};
  this.d = {x: this.fieldInset + this.goalDepth + this.cornerDepth, y: canvas.height - this.fieldInset};
  this.e = {x: canvas.width - this.fieldInset - this.goalDepth - this.cornerDepth, y: canvas.height - this.fieldInset};
  this.f = {x: canvas.width - this.fieldInset - this.goalDepth, y: canvas.height - this.fieldInset - this.cornerDepth};
  this.g = {x: canvas.width - this.fieldInset - this.goalDepth, y: canvas.height * 0.5 + this.goalWidth * 0.5};
  this.h = {x: canvas.width - this.fieldInset, y: canvas.height * 0.5 + this.goalWidth * 0.5 - this.goalDepth};
  this.i = {x: canvas.width - this.fieldInset, y: canvas.height * 0.5 - this.goalWidth * 0.5 + this.goalDepth};
  this.j = {x: canvas.width - this.fieldInset - this.goalDepth, y: canvas.height * 0.5 - this.goalWidth * 0.5};
  this.k = {x: canvas.width - this.fieldInset - this.goalDepth, y: this.fieldInset + this.cornerDepth};
  this.l = {x: canvas.width - this.fieldInset - this.goalDepth - this.cornerDepth, y: this.fieldInset};
  this.m = {x: this.fieldInset + this.goalDepth + this.cornerDepth, y: this.fieldInset};
  this.n = {x: this.fieldInset + this.goalDepth, y: this.fieldInset + this.cornerDepth};
  this.o = {x: this.fieldInset + this.goalDepth, y: canvas.height * 0.5 - this.goalWidth * 0.5};
  this.p = {x: this.fieldInset, y: canvas.height * 0.5 - this.goalWidth * 0.5 + this.goalDepth};
  this.objects = [
    new LineSegment(this.a.x, this.a.y, this.b.x, this.b.y),
    new LineSegment(this.b.x, this.b.y, this.c.x, this.c.y),
    new LineSegment(this.c.x, this.c.y, this.d.x, this.d.y),
    new LineSegment(this.d.x, this.d.y, this.e.x, this.e.y),
    new LineSegment(this.e.x, this.e.y, this.f.x, this.f.y),
    new LineSegment(this.f.x, this.f.y, this.g.x, this.g.y),
    new LineSegment(this.g.x, this.g.y, this.h.x, this.h.y),
    new LineSegment(this.h.x, this.h.y, this.i.x, this.i.y),
    new LineSegment(this.i.x, this.i.y, this.j.x, this.j.y),
    new LineSegment(this.j.x, this.j.y, this.k.x, this.k.y),
    new LineSegment(this.k.x, this.k.y, this.l.x, this.l.y),
    new LineSegment(this.l.x, this.l.y, this.m.x, this.m.y),
    new LineSegment(this.m.x, this.m.y, this.n.x, this.n.y),
    new LineSegment(this.n.x, this.n.y, this.o.x, this.o.y),
    new LineSegment(this.o.x, this.o.y, this.p.x, this.p.y),
    new LineSegment(this.p.x, this.p.y, this.a.x, this.a.y)
  ];
  this.update = function() {
    for (i in players) {
      if ((players[i].control === "player1" && keyState[redWallKeyCode]) || (players[i].control === "player2" && keyState[blueWallKeyCode])) {
        if (players[i].charge >= this.wallCharge && players[i].vel.magnitude() !== 0) {
          var normal = players[i].vel.normal();
          var perpendicular = new LineSegment(normal.multipliedBy(this.wallDistance).x - normal.multipliedBy(this.wallWidth / 2).y, normal.multipliedBy(this.wallDistance).y + normal.multipliedBy(this.wallWidth / 2).x, normal.multipliedBy(this.wallDistance).x + normal.multipliedBy(this.wallWidth / 2).y, normal.multipliedBy(this.wallDistance).y - normal.multipliedBy(this.wallWidth / 2).x);
          this.objects.push(new LineSegment(players[i].x + perpendicular.x0, players[i].y + perpendicular.y0, players[i].x + perpendicular.x1, players[i].y + perpendicular.y1, true));
          players[i].charge -= this.wallCharge;
        }
      }
      if ((players[i].control === "player1" && keyState[redProjectileKeyCode]) || (players[i].control === "player2" && keyState[blueProjectileKeyCode])) {
        if (players[i].charge >= this.projectileCharge && players[i].vel.magnitude() !== 0) {
          var normal = players[i].vel.normal();
          this.objects.push(new Circle(players[i].x + normal.multipliedBy(players[i].radius + this.projectileRadius).x, players[i].y + normal.multipliedBy(players[i].radius + this.projectileRadius).y, this.projectileRadius, true, normal.multipliedBy(this.projectileSpeed).x, normal.multipliedBy(this.projectileSpeed).y));
          players[i].charge -= this.projectileCharge;
        }
      }
    }

    var i = 0;
    for (i in this.objects) {
      if (this.objects[i] instanceof LineSegment) {
        var lineSeg = this.objects[i];

        if (lineSeg.dynamic) {
          var j = 0;
          for (j in this.objects) {
            if (this.objects[j] instanceof Circle) {
              var fromSeg0 = new Vector2D(this.objects[j].x - lineSeg.x0, this.objects[j].y - lineSeg.y0, lineSeg.x0, lineSeg.y0);
              var fromSeg1 = new Vector2D(this.objects[j].x - lineSeg.x1, this.objects[j].y - lineSeg.y1, lineSeg.x1, lineSeg.y1);

              var projection1 = fromSeg0.project(lineSeg);
              var projection2 = fromSeg1.project(lineSeg);

              var normal = new Vector2D(this.objects[j].x - (projection1.x0 + projection1.x), this.objects[j].y - (projection1.y0 + projection1.y));

              if (normal.magnitude() < this.objects[j].radius && (projection1.magnitude() < lineSeg.length() && projection2.magnitude() < lineSeg.length())) {
                normal.normalize();
                normal.multiply(this.objects[j].radius);
                this.objects[j].x = projection1.x0 + projection1.x + normal.x;
                this.objects[j].y = projection1.y0 + projection1.y + normal.y;

                normal.normalize();
                this.objects[j].vel = this.objects[j].vel.minus(normal.multipliedBy(2 * this.objects[j].vel.dot(normal)));

                this.objects.splice(i, 1);
              }
              else {
                if (fromSeg0.magnitude() < this.objects[j].radius) {
                  fromSeg0.normalize();

                  this.objects[j].x = lineSeg.x0 + fromSeg0.x * this.objects[j].radius;
                  this.objects[j].y = lineSeg.y0 + fromSeg0.y * this.objects[j].radius;

                  this.objects[j].vel = this.objects[j].vel.minus(fromSeg0.multipliedBy(2 * this.objects[j].vel.dot(fromSeg0)));

                  this.objects.splice(i, 1);
                } else if (fromSeg1.magnitude() < this.objects[j].radius) {
                  fromSeg1.normalize();

                  this.objects[j].x = lineSeg.x1 + fromSeg1.x * this.objects[j].radius;
                  this.objects[j].y = lineSeg.y1 + fromSeg1.y * this.objects[j].radius;

                  this.objects[j].vel = this.objects[j].vel.minus(fromSeg1.multipliedBy(2 * this.objects[j].vel.dot(fromSeg1)));

                  this.objects.splice(i, 1);
                }
              }
            }
          }
        }
        /*var j = 0;
        for (j in this.objects) {
          if (this.objects[j] instanceof Circle) {
            var fromSeg0 = new Vector2D(this.objects[j].x - lineSeg.x0, this.objects[j].y - lineSeg.y0, lineSeg.x0, lineSeg.y0);
            var fromSeg1 = new Vector2D(this.objects[j].x - lineSeg.x1, this.objects[j].y - lineSeg.y1, lineSeg.x1, lineSeg.y1);

            var projection1 = fromSeg0.project(lineSeg);
            var projection2 = fromSeg1.project(lineSeg);

            var normal = new Vector2D(this.objects[j].x - (projection1.x0 + projection1.x), this.objects[j].y - (projection1.y0 + projection1.y));

            if (normal.magnitude() < this.objects[j].radius && (projection1.magnitude() < lineSeg.length() && projection2.magnitude() < lineSeg.length())) {
              normal.normalize();
              normal.multiply(this.objects[j].radius);
              this.objects[j].x = projection1.x0 + projection1.x + normal.x;
              this.objects[j].y = projection1.y0 + projection1.y + normal.y;

              normal.normalize();
              this.objects[j].vel = this.objects[j].vel.minus(normal.multipliedBy(2 * this.objects[j].vel.dot(normal)));

              if (lineSeg.dynamic) { this.objects.splice(i, 1); }
            }
            else {
              if (fromSeg0.magnitude() < this.objects[j].radius) {
                fromSeg0.normalize();

                this.objects[j].x = lineSeg.x0 + fromSeg0.x * this.objects[j].radius;
                this.objects[j].y = lineSeg.y0 + fromSeg0.y * this.objects[j].radius;

                this.objects[j].vel = this.objects[j].vel.minus(fromSeg0.multipliedBy(2 * this.objects[j].vel.dot(fromSeg0)));

                if (lineSeg.dynamic) { this.objects.splice(i, 1); }
              } else if (fromSeg1.magnitude() < this.objects[j].radius) {
                fromSeg1.normalize();

                this.objects[j].x = lineSeg.x1 + fromSeg1.x * this.objects[j].radius;
                this.objects[j].y = lineSeg.y1 + fromSeg1.y * this.objects[j].radius;

                this.objects[j].vel = this.objects[j].vel.minus(fromSeg1.multipliedBy(2 * this.objects[j].vel.dot(fromSeg1)));

                if (lineSeg.dynamic) { this.objects.splice(i, 1); }
              }
            }
          }
        }*/
      }
      if (this.objects[i] instanceof Circle) {
        this.objects[i].update();
        if (this.objects[i].x < 0 - this.objects[i].radius || this.objects[i].x > game.width + this.objects[i].radius || this.objects[i].y < 0 - this.objects[i].radius || this.objects[i].y > game.radius + this.objects[i].radius) {
          this.objects.splice(i, 1);
        }
      }
    }
  }
  this.draw = function() {
    var centerCircle = new Circle (canvas.width * 0.5, canvas.height * 0.5, this.centerCircleRadius);
    var centerLine = new LineSegment(canvas.width * 0.5, canvas.height - this.fieldInset, canvas.width * 0.5, this.fieldInset);
    var redGoalLine = new LineSegment(this.b.x, this.b.y, this.o.x, this.o.y);
    var blueGoalLine = new LineSegment(this.j.x, this.j.y, this.g.x, this.g.y);

    centerCircle.draw(false, "white", true, 1, "black");
    centerLine.draw("black", 1);
    redGoalLine.draw("red", 1);
    blueGoalLine.draw("blue", 1);

    var i = 0;
    for (i in this.objects) {
      if (this.objects[i] instanceof LineSegment) {
        this.objects[i].draw();
      }
      if (this.objects[i] instanceof Circle) {
        this.objects[i].draw(false);
      }
    }
  }
}
