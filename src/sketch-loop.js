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
      }
    }
  };
};

const haftoneDot = (s) => {
  s.setup = () => {
    s.createCanvas(480, 120);
    s.fill(255);
    s.stroke(102);
  };

  s.draw = () => {
    for (var y = 32; y <= s.height; y += 8) {
      for (var x = 20; x <= s.width; x += 15) {
        s.ellipse(x + y, y, 16 - y / 10, 16 - y / 10);
      }
    }
  };
};

const robotMove = (s) => {
  var x = 60; // x coordinate
  var y = 420; // y coordinate
  var bodyHeight = 110; // Body height
  var neckHeight = 140; // Neck height
  var radius = 45;
  var ny = y - bodyHeight - neckHeight - radius; // Neck Y
  s.setup = () => {
    s.createCanvas(170, 480);
    s.strokeWeight(2);
    s.ellipseMode(s.RADIUS);
  };

  s.draw = () => {
    s.background(204);
    // Neck
    s.stroke(102);
    s.line(x + 2, y - bodyHeight, x + 2, ny);
    s.line(x + 12, y - bodyHeight, x + 12, ny);
    s.line(x + 22, y - bodyHeight, x + 22, ny);
    s.line(x + 12, ny, x - 18, ny - 43);
    s.line(x + 12, ny, x + 42, ny - 99);
    s.line(x + 12, ny, x + 78, ny + 15);
    s.noStroke();
    s.fill(102);
    s.ellipse(x, y - 33, 33, 33);
    s.fill(0);
    s.rect(x - 45, y - bodyHeight, 90, bodyHeight - 33);
    s.fill(102);
    s.rect(x - 45, y - bodyHeight + 17, 90, 6);
    s.fill(0);
    s.ellipse(x + 12, ny, radius, radius);
    s.fill(255);
    s.ellipse(x + 24, ny - 6, 14, 14);
    s.fill(0);
    s.ellipse(x + 24, ny - 6, 3, 3);
    s.fill(153);
    s.ellipse(x, ny - 8, 5, 5);
    s.ellipse(x + 30, ny - 26, 4, 4);
    s.ellipse(x + 41, ny + 6, 3, 3);
  };
};
new p5(robotMove);
new p5(sketch_1);
new p5(sketch_2);
new p5(pinAndLines);
new p5(haftoneDot);
