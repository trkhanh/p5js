export const FindCursor = (s) => {
  var x;
  var offset = 10;

  s.setup = () => {
    s.createCanvas(240, 120);
    x = s.width / 2;
  };

  s.draw = () => {
    s.background(204);
    if (s.mouseX > x) {
      x += 0.5;
      offset = -10;
    }

    if (s.mouseX < x) {
      x -= 0.5;
      offset = 10;
    }
    s.line(x, 0, x, s.height);
    s.line(s.mouseX, s.mouseY, s.mouseX + offset, s.mouseY - 10);
    s.line(s.mouseX, s.mouseY, s.mouseX + offset, s.mouseY + 10);
    s.line(s.mouseX, s.mouseY, s.mouseX + offset*3, s.mouseY);
  };
};
