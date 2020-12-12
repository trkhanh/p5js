export function ColourList(c) {
  var b;
  this.colours = new Array();
  this.maxColours = c;
  this.lastColourUsed = false;
  for (b = 0; b < arguments.length; b++) {
    if (b == 0 && typeof arguments[b] == 'number') {
      this.maxColours = arguments[b];
      continue;
    }
    this.addColour(arguments[b]);
  }
  var a = this;
  colourSource.linkTo(function (d) {
    a.newColour(d);
  });
}
