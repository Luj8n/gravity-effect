const G = 0.1;

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
  points.forEach((point) => {
    point.interact(points);
  });
  points = points.filter((point) => {
    return !point.shouldRemove;
  });
  points.forEach((point) => {
    point.update();
  });
  points.forEach((point) => {
    point.show();
  });
}
