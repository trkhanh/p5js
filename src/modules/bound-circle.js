export const BoundCircle = (s) => {
  var x = 120;
  var y = 60;
  var radius = 12;
  s.setup = () => {
    s.createCanvas(240, 120);
    s.ellipseMode(s.RADIUS);
  };

  s.draw = () => {
    s.background(204);
    var d = s.dist(s.mouseX, s.mouseY, x, y);
    if (d < radius) {
      radius++;
      s.fill(0);
    } else {
      s.fill(255);
    }

    s.ellipse(x, y, radius, radius);
  };
};
