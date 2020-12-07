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
        console.log('draw');
        s.ellipse(x, y, 40, 40);
      }
    }
  };
};

const sketch_2 = (s) => {
  s.setup = () => {
    s.createCanvas(480, 120);
    s.noStroke();
  };

  s.draw = () => {
    s.background(0);
    for (let y = 0; y < s.height + 40; y += 40) {
      s.fill(224, 140);
      s.ellipse(0, y, 40, 40);
    }
    for (let x = 0; x < s.width + 40; x += 40) {
      s.fill(224, 140);
      s.ellipse(x, 0, 40, 40);
    }
  };
};

const pinAndLines = (s) => {
  s.setup = () => {
    s.createCanvas(480, 120);
    s.fill(255);
    s.stroke(102);
  };

  s.draw = () => {
    for (let y = 20; y <= s.height - 20; y += 10) {
      for (let x = 20; x < s.width - 20; x += 10) {
        s.fill(255, 140);
        s.ellipse(x, y, 4, 4);
        s.line(x, y, s.width/2, s.height/2);
      }
    }
  };
};


new p5(sketch_1);
new p5(sketch_2);
new p5(pinAndLines);
