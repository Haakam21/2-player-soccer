function Player(control) {
  this.control = control;
  if (this.control === "player1") { this.x = canvas.width * 0.5 - 100; } // initial x position
  if (this.control === "player2") { this.x = canvas.width * 0.5 + 100; } // initial x position
  this.y = canvas.height * 0.5; // initial y position
  this.radius = 20; // sprite radius
  this.vel = new Vector2D(); // vel vector
  this.acc = 0.75; // acceleration coefficient
  this.fric = 0.9; // friction coefficient
  this.push = 0.5; // player push coefficient
  this.kick = 0.5; // kick coefficient
  this.charge = 100; // charge for wall or projectile
  this.sprite = new Circle(this.x, this.y, this.radius);
  this.update = function() { // update
    if (this.control === "player1") {
      if (keyState[65] && !keyState[68]  && !keyState[87]  && !keyState[83]) {
        this.vel.x -= this.acc;
      }
      if (keyState[87] && !keyState[83]  && !keyState[65]  && !keyState[68]) {
        this.vel.y += this.acc;
      }
      if (keyState[68] && !keyState[65]  && !keyState[87]  && !keyState[83]) {
        this.vel.x += this.acc;
      }
      if (keyState[83] && !keyState[87]  && !keyState[65]  && !keyState[68]) {
        this.vel.y -= this.acc;
      }

      if (keyState[65] && keyState[87]  && !keyState[68]  && !keyState[83]) {
        this.vel.x -= this.acc / Math.sqrt(2);
        this.vel.y += this.acc / Math.sqrt(2);
      }
      if (keyState[68] && keyState[87]  && !keyState[65]  && !keyState[83]) {
        this.vel.x += this.acc / Math.sqrt(2);
        this.vel.y += this.acc / Math.sqrt(2);
      }
      if (keyState[68] && keyState[83]  && !keyState[65]  && !keyState[87]) {
        this.vel.x += this.acc / Math.sqrt(2);
        this.vel.y -= this.acc / Math.sqrt(2);
      }
      if (keyState[65] && keyState[83]  && !keyState[68]  && !keyState[87]) {
        this.vel.x -= this.acc / Math.sqrt(2);
        this.vel.y -= this.acc / Math.sqrt(2);
      }
    }
    if (this.control === "player2") {
      if (keyState[37] && !keyState[39]  && !keyState[38]  && !keyState[40]) {
        this.vel.x -= this.acc;
      }
      if (keyState[38] && !keyState[40]  && !keyState[37]  && !keyState[39]) {
        this.vel.y += this.acc;
      }
      if (keyState[39] && !keyState[37]  && !keyState[38]  && !keyState[40]) {
        this.vel.x += this.acc;
      }
      if (keyState[40] && !keyState[38]  && !keyState[37]  && !keyState[39]) {
        this.vel.y -= this.acc;
      }

      if (keyState[37] && keyState[38]  && !keyState[39]  && !keyState[40]) {
        this.vel.x -= this.acc / Math.sqrt(2);
        this.vel.y += this.acc / Math.sqrt(2);
      }
      if (keyState[39] && keyState[38]  && !keyState[37]  && !keyState[40]) {
        this.vel.x += this.acc / Math.sqrt(2);
        this.vel.y += this.acc / Math.sqrt(2);
      }
      if (keyState[39] && keyState[40]  && !keyState[37]  && !keyState[38]) {
        this.vel.x += this.acc / Math.sqrt(2);
        this.vel.y -= this.acc / Math.sqrt(2);
      }
      if (keyState[37] && keyState[40]  && !keyState[39]  && !keyState[38]) {
        this.vel.x -= this.acc / Math.sqrt(2);
        this.vel.y -= this.acc / Math.sqrt(2);
      }
    }

    this.vel.x *= this.fric;
    this.vel.y *= this.fric;

    this.x += this.vel.x;
    this.y += this.vel.y;

    var i = 0;
    for (i in players) {
      if (players[i] != this) {
        var normal = new Vector2D(this.x - players[i].x, this.y - players[i].y);
        if (normal.magnitude() < this.radius + players[i].radius) {
          normal.negative();
          normal.normalize();
          normal.multiply(this.radius + players[i].radius);
          players[i].x = this.x + normal.x;
          players[i].y = this.y + normal.y;

          players[i].vel.add(normal.normal().multipliedBy(this.vel.magnitude() * this.push + players[i].vel.magnitude()));
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
        }
      }
    }

    if (this.charge < 100) {
      this.charge += 1;
    }
  }
  this.draw = function() { // draw astroids
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    if (this.control === "player1") {
      this.sprite.draw(true, "red", true, 1, "black");
    }
    if (this.control === "player2") {
      this.sprite.draw(true, "blue", true, 1, "black");
    }

    if (this.charge < 100) {
      with (gfx) {
        beginPath();
        arc(this.x, this.y, this.radius + 10, -0.5 * Math.PI - 2 * Math.PI * (this.charge / 100), -0.5 * Math.PI);
        lineWidth = 1;
        strokeStyle = "black";
        stroke();
        closePath();
      }
    }

    var vector = this.vel.normal().multipliedBy(this.radius * 0.5);
    vector.x0 = this.x;
    vector.y0 = this.y;

    vector.draw(true, 1, true, 0.5);
  }
}
