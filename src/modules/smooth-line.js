import p5 from 'p5';
export const SmoothLine = (s) => {
  var x = 0;
  var y = 0;
  var px = 0;
  var py = 0;
  var easing = 0.05;
  s.setup = () => {
    s.createCanvas(480, 120);
    s.stroke(0, 102);
  };
  s.draw = () => {
    var targetX = s.mouseX;
    x += (targetX - x) * easing;
    var targetY = s.mouseY;
    y += (targetY - y) * easing;
    var weight = s.dist(x, y, px, py);
    s.strokeWeight(weight);
    s.line(x, y, px, py);
    py = y;
    px = x;
  };
};
