export const CircleMovement = (s) => {
  var x;
  var offset = 60;
  var angle = 0.0;
  var angleDirection = 1;
  var speed = 0.05;
  var scalar = 30;
  var canvas = { w: 240, h: 120 };

  s.setup = () => {
    s.createCanvas(canvas.w, canvas.h);
    s.background(204);

  };

  s.draw = () => {

    var x = offset + s.cos(angle) * scalar;
    var y = offset + s.sin(angle) * scalar;
    s.ellipse(x, y, 40, 40);
    angle += speed;
  };
};
