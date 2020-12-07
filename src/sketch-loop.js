import p5 from 'p5';

const sketch_1 = (s) => {
  s.setup = () => {
    s.createCanvas(480, 120);
    s.noStroke();
  };

  s.draw = () => {
    s.background(0);
    for (let y = 0; y <= s.height; y += 40) {
      for (let x = 0; x < s.width; x += 40) {
        s.fill(255, 140);
        console.log("draw")
        s.ellipse(x, y, 40, 40);
      }
    }
  };
};
new p5(sketch_1);
