export const SimpleScale = (s) => {
  var canvas = { w: 480, h: 240 };

  s.setup = () => {
    s.createCanvas(canvas.w, canvas.h);
  };

  s.draw = () => {
    s.translate(s.mouseX, s.mouseY);
    var scalar = s.mouseX/60.0
    s.scale(scalar);
    s.strokeWeight(1.0/scalar)
    s.rect(-15, -15, 30, 30);
  };
};
