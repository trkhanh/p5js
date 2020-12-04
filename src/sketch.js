import p5 from 'p5';

const sketch_1 = (s) => {
  s.setup = () => {
    s.createCanvas(400, 120);
  };

  s.draw = () => {
    s.background(204);
    // Left creature
    s.beginShape();
    s.fill(255);
    s.vertex(50, 120);
    s.vertex(100, 90);
    s.vertex(110, 60);
    s.vertex(80, 20);
    s.vertex(210, 60);
    s.vertex(160, 80);
    s.vertex(200, 90);
    s.vertex(140, 100);
    s.vertex(130, 120);
    s.endShape();
    s.fill(0);
    s.ellipse(155, 60, 8, 8);
    s.fill(255);
    s.beginShape();
    s.vertex(370, 120);
    s.vertex(360, 90);
    s.vertex(290, 80);
    s.vertex(340, 70);
    s.vertex(280, 50);
    s.vertex(420, 10);
    s.vertex(390, 50);
    s.vertex(410, 90);
    s.vertex(460, 120);
    s.endShape();
    s.fill(0);
    s.ellipse(345, 50, 10, 10);
  };
};

const sketch_2 = (s) => {
  s.setup = () => {
    s.createCanvas('400', '400');
  };

  s.draw = () => {
    if (s.mousePressed) {
      s.fill(0);
    } else {
      s.fill(255);
    }

    s.ellipse(s.mouseX, s.mouseY, 80, 80);
  };
};

const sketch_3 = (s) => {
  s.setup = () => {
    s.createCanvas(720, 480);
    s.strokeWeight(2);
    s.ellipseMode(s.RADIUS);
  };

  s.draw = () => {
    s.background(204);

    //Neck
    s.stroke(102);
    s.line(266, 257, 266, 162);
    s.line(280, 257, 280, 162);
    s.line(295, 257, 295, 162);

    // Antennae
    s.line(276, 155, 246, 112); // Small
    s.line(276, 155, 306, 56); // Tall
    s.line(276, 155, 342, 170); // Medium

    // Body
    s.noStroke(); // Disable stroke
    s.fill(255, 0, 0); // Set fill to gray
    s.ellipse(264, 377, 33, 33); // Antigravity orb
    s.fill(0); // Set fill to black
    s.rect(219, 257, 90, 120); // Main body
    s.fill(102); // Set fill to gray
    s.rect(219, 274, 90, 6); // Gray stripe

    // Head
    s.fill(0); // Set fill to black
    s.ellipse(276, 155, 45, 45); // Head
    s.fill(255); // Set fill to white
    s.ellipse(288, 150, 14, 14); // Large eye
    s.fill(0); // Set fill to black
    s.ellipse(288, 150, 3, 3); // Pupil
    s.fill(153); // Set fill to light gray
    s.ellipse(263, 148, 5, 5); // Small eye 1
    s.ellipse(296, 130, 4, 4); // Small eye 2
    s.ellipse(305, 162, 3, 3); // Small eye 3
  };
};

const sketch_4 = (s) => {
  var y = 150;
  var d = 130;

  s.setup = () => {
    s.createCanvas(720, 480);
    s.strokeWeight(2);
    s.ellipseMode(s.RADIUS);
  };

  s.draw = () => {
    s.ellipse(80, y, d, d);
    s.ellipse(255, y, d, d);
    s.ellipse(430, y, d, d);
  };
};

const sketch_5 = (s) => {
  var t = 0;
  var SEPARATION = 20;
  var COUNT = 5;
  var i;

  s.setup = () => {
    s.createCanvas(800, 800);
  };

  s.draw = () => {
    s.background(255);
    t = t + 0.2;

    if (t > SEPARATION) {
      t = 0;
    }
    var j = 0;
    for (y = 0; y < height; y += (SEPARATION * COUNT) / 2) {
      j++;

      for (
        x = ((j % 2) * SEPARATION * COUNT) / 2;
        x < width + SEPARATION * COUNT;
        x += SEPARATION * COUNT
      ) {
        s.ellipse(x, y, SEPARATION * COUNT, SEPARATION * COUNT);
        for (i = COUNT - 1; i >= 0; i--) {
          s.ellipse(x, y, t + SEPARATION * i, t + SEPARATION * i);
        }
      }
      for (
        x = (((j + 1) % 2) * SEPARATION * COUNT) / 2;
        x < width;
        x += SEPARATION * COUNT
      ) {
        s.ellipse(x, y, SEPARATION * COUNT, SEPARATION * COUNT);
        for (i = COUNT - 1; i >= 0; i--) {
          s.ellipse(x, y, t + SEPARATION * i, t + SEPARATION * i);
        }
      }
    }
  };
};

window.sketchInstance = new p5(sketch_2);
window.sketchInstance2 = new p5(sketch_1);
window.sketchInstance3 = new p5(sketch_3);
window.sketchInstance4 = new p5(sketch_4);
window.sketchInstance5 = new p5(sketch_5);
