export const LoadImage = (s) => {
  var canvas = { w: 480, h: 240 };
  var img;

  s.preload = () => {
    img = s.loadImage('https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png');
  };
  s.setup = () => {
    s.createCanvas(canvas.w, canvas.h);
  };

  s.draw = () => {
    s.image(img, 0, 0);
  };
};
