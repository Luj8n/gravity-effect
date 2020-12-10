const G = 0.01;

let points = [];

function setup() {
  L.createCanvas(900, 900);
}

addEventListener("click", addPoint);

function addPoint(e) {
  points.push(new Point(e.clientX, e.clientY, 100, 10));
}

function draw() {
  L.background("#222222");
  let currentPoints = [...points];
  points.forEach((point) => {
    currentPoints = point.interact(currentPoints);
    point.update();
    point.show();
  });
  points = currentPoints;
}
