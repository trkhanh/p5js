export const Own = (s) => {
  var canvas = { w: 480, h: 120 };

  s.setup = () => {
    s.createCanvas(canvas.w, canvas.h);
  };

  s.draw = () => {
    s.background(204);
    s.translate(110, 110);
    s.stroke(0);
    s.strokeWeight(70);
    s.line(0, -35, 0, -65); // Body
    s.noStroke();
    s.fill(204);
    s.ellipse(-17.5, -65, 35, 35); // Left eye dome
    s.ellipse(17.5, -65, 35, 35); // Right eye dome
    s.arc(0, -65, 70, 70, 0, PI); // Chin
    s.fill(0);
    s.ellipse(-14, -65, 8, 8); // Left eye
    s.ellipse(14, -65, 8, 8); // Right eye
    s.quad(0, -58, 4, -51, 0, -44, -4, -51); // Beak
    s.translate(70, 0);
    s.stroke(0);
    s.strokeWeight(70);
    s.line(0, -35, 0, -65); // Body
    s.noStroke();
    s.fill(255);
    s.ellipse(-17.5, -65, 35, 35); // Left eye dome
    s.ellipse(17.5, -65, 35, 35); // Right eye dome
    s.arc(0, -65, 70, 70, 0, PI); // Chin
    s.fill(0);
    s.ellipse(-14, -65, 8, 8); // Left eye
    s.ellipse(14, -65, 8, 8); // Right eye
    s.quad(0, -58, 4, -51, 0, -44, -4, -51); // Beak
  };
};
