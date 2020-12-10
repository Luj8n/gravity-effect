class Point {
  constructor(x, y, mass, density) {
    this.pos = L.createVector2D(x, y);
    this.vel = L.createVector2D();
    this.acc = L.createVector2D();
    this.mass = mass;
    this.density = density;
    this.calcDiameter();
  }
  calcDiameter() {
    // This is 2D, so density = m / S --> S = m / density
    // S = PI * r^2 and d = 2 * r
    this.diameter = 2 * Math.sqrt(this.mass / this.density / Math.PI);
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
    L.Ellipse(this.pos.x, this.pos.y, this.diameter * 2);
  }
  interact(allPoints) {
    let newPoints = [...allPoints];
    allPoints.forEach((point) => {
      if (point !== this) {
        // if the points intersect, add smaller's mass to the biggers one
        let difference = L.createVector2D(point.pos.x - this.pos.x, point.pos.y - this.pos.y);
        if (difference.mag() < this.diameter / 2 + point.diameter / 2) {
          if (this.mass >= point.mass) {
            this.addMass(point.mass);
            newPoints = newPoints.filter((el) => el !== point);
          } else {
            point.addMass(this.mass);
            newPoints = newPoints.filter((el) => el !== this);
          }
        } else {
          // We know the direction of the force,
          // now we just need to calculate the magnitude (strength) of the force.
          // Gravitational force is F = G * m1 * m2 / r^2, G is just a constant
          let forceMag = (G * this.mass * point.mass) / difference.mag();
          difference.setMag(forceMag);
          this.addForce(difference);
        }
      }
    });
    return newPoints;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc = L.createVector2D();
  }
}
