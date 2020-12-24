export const RobotGame = (s) => {
  var canvas = { w: 720, h: 480 };
  var img;
  var bot1, bot2, bot3, landscape;
  var easing = 0.05,
    offset = 0;

  s.preload = () => {
    bot1 = s.loadImage('https://reso-nance.org/public/atelier-drawbot/code/processing/05b_oop_robot/data/robot1.svg');
    bot2 = s.loadImage('https://reso-nance.org/public/atelier-drawbot/code/processing/05b_oop_robot/data/robot2.svg');
    bot3 = s.loadImage('https://reso-nance.org/public/atelier-drawbot/code/processing/05b_oop_robot/data/robot2.svg');
    landscape = s.loadImage('https://banner2.cleanpng.com/20180527/pwy/kisspng-zermatt-saas-fee-randa-switzerland-stalden-montre-5b0a8f83aecb89.547866811527418755716.jpg');
  };
  s.setup = () => {
    s.createCanvas(canvas.w, canvas.h);
  };

  s.draw = () => {
    s.background(landscape);
    var targetOffset = map(s.mouseY, 0, height, -40, 40);
    offset += (targetOffset - offset) * easing;

    // Draw the left robot
    s.image(bot1, 85 + offset, 65);
    // Draw the right robot smaller and give it a smaller offset
    var smallerOffset = offset * 0.7;
    s.image(bot2, 510 + smallerOffset, 140, 78, 248);
    // Draw the smallest robot, give it a smaller offset
    smallerOffset *= -0.5;
    s.image(bot3, 410 + smallerOffset, 225, 39, 124);
  };
};
