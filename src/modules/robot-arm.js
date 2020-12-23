export const RobotArm = (s) => {
  var x;
  var offset = 10;
  var angle = 0.0;
  var angleDirection = 1;
  var speed = 0.005;
  var canvas = { w: 240, h: 120 };

  s.setup = () => {
    s.createCanvas(canvas.w, canvas.h);
  };

  s.draw = () => {
    s.background(204);

    // Move to start pos
    s.translate(90, 50);
    s.rotate(angle);
    s.strokeWeight(12);
    s.line(0, 0, 40, 0);

    // Move to next joint
    s.translate(40, 0);
    s.rotate(angle * 2);
    s.strokeWeight(12 / 2);
    s.line(0, 0, 30, 0);
    // Move to next joint
    s.translate(30, 0);
    s.rotate(angle * 2.5);
    s.strokeWeight(3);
    s.line(0, 0, 20, 0);

    angle += speed * angleDirection;
    if (angle > s.QUATER_PI || angle < 0) {
      angle *= -1;
    }
  };
};
