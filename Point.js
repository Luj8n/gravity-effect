class Point {
  constructor(x, y, mass, density) {
    this.pos = L.createVector2D(x, y);
    this.vel = L.createVector2D();
    this.acc = L.createVector2D();
    this.mass = mass;
    this.density = density;
    this.calcDiameter();
    this.shouldRemove = false;
  }
  toBeRemoved() {
    this.shouldRemove = true;
  }
  calcDiameter() {
    // This is 2D, so density = m / S --> S = m / density
    // S = PI * r^2 and d = 2 * r
    this.diameter = 2 * Math.sqrt(this.mass / (this.density * Math.PI));
  }
  addForce(forceVector) {
    // F = ma --> a = F / m
    this.acc.add(forceVector.div(this.mass));
  }
  addMass(gainedMass) {
    this.mass += gainedMass;
    // refresh the diameter, because it depends on mass
    this.calcDiameter();
  }
  show() {
    L.fill("white");
    L.Ellipse(this.pos.x, this.pos.y, this.diameter);
  }
  interact(allPoints) {
    if (!this.shouldRemove) {
      allPoints.forEach((otherPoint) => {
        if (otherPoint !== this) {
          // if the points intersect, add smaller's mass to the biggers one
          let direction = L.createVector2D(otherPoint.pos.x - this.pos.x, otherPoint.pos.y - this.pos.y);
          direction.normalize();
          let distance = L.dist(this.pos.x, this.pos.y, otherPoint.pos.x, otherPoint.pos.y);
          if (distance < this.diameter / 2 + otherPoint.diameter / 2) {
            if (this.mass >= otherPoint.mass) {
              otherPoint.toBeRemoved();
              // F = ma
              this.addForce(otherPoint.vel.mult(otherPoint.mass));
              this.addMass(otherPoint.mass);
            } else {
              this.toBeRemoved();
              // F = ma
              otherPoint.addForce(this.vel.mult(this.mass));
              otherPoint.addMass(this.mass);
            }
          } else {
            // We know the direction of the force,
            // now we just need to calculate the magnitude (strength) of the force.
            // Gravitational force is F = G * m1 * m2 / r^2, G is just a constant
            let forceMag = (G * this.mass * otherPoint.mass) / Math.pow(distance, 2);
            direction.setMag(forceMag);
            this.addForce(direction);
          }
        }
      });
    }
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc = L.createVector2D();
  }
}
