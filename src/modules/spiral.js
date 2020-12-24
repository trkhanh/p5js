export const Spirals = (s) => {
  var x;
  var offset = 60;
  var angle = 0.0;
  var speed = 0.05;
  var scalar = 2;
  var canvas = { w: 240, h: 240 };

  s.setup = () => {
    s.createCanvas(canvas.w, canvas.h);
    s.fill(0);
    s.background(204);

  };

  s.draw = () => {

    var x = offset + s.cos(angle) * scalar;
    var y = offset + s.sin(angle) * scalar;
    s.ellipse(x, y, 2, 2);
    angle += speed;
    scalar += speed;
  };
};
