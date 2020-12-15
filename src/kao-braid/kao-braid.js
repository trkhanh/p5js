$(document).ready(function () {
  if (
    document.implementation.hasFeature(
      'http://www.w3.org/TR/SVG11/feature#Shape',
      '1.0'
    )
  ) {
    $('.cdo-nojq').hide();
  }

  if (
    !!document.createElementNS &&
    !!document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      .createSVGRect
  ) {
    $('.cdo-nojq').hide();
  }

  setPatternLinks('herringbone');
  $.ajaxSetup({
    timeout: 20000,
  });

  // Todo: implement colourSource class @assign: Quan
  // The color souces must have method to LinkTo this kaoPattern
});

import { ColourList } from './lib';

function Adjustable(c, e, f, a, g, b) {
  if (e === undefined) {
    var d = c.split(',');
    this.name = d[0];
    this.key = d[1];
    this.minValue = parseInt(d[2]);
    this.increment = parseInt(d[3]);
    this.maxValue = parseInt(d[4]);
    this.currentValue = parseInt(d[5]);
  } else {
    this.name = c;
    this.key = e;
    this.minValue = f;
    this.increment = a;
    this.maxValue = g;
    this.currentValue = b;
  }

  var braid = {
    container: '#kaoCanvas',
    url: 'basic.php',
    adjustables: new Array(),
    oldAjustables: null,
    stateAdjustables: new Array(),
    minHeight: 440,
    maxHeight: 600,
    height: 800,
    width: 300,
    border: 10,
    scale: 40,
    stitchSize: 0,
    minX: +Infinity,
    nimY: +Infinity,
    maxX: 0,
    maxY: 0,
    rightPos: 0,
    bottPos: 0,
    numThreads: 16,
    maxThreads: 64,
    delay: 1000,
    attempts: 3,
    startPosX: 470,
    startPosY: 200,
    threadColours: new Array(),
    stitches: new Array(),
    paths: new Array(),
    mouseDown: false,
    currColour: '#ff0000',
    currId: '#ff0000',
    lastColour: 'white',
    colourNumber: 0,
    colourList: new ColourList(32),
    colours: new Array(),
    groups: new Array(),
    angles: new Array(),
    undo: new Array(),
    redo: new Array(),
    newMove: true,
    kmButtons: new Array(),
    formats: '',
    threadAngle: 15,
    reset: () => {
      (this.delay = 1000), (this.attempts = 3);
    },

    /**
     *
     * @param {String} data
     */
    setState: function (data) {
      var a = 1,
        b;

      if (data.substr(0, 3) == '001') {
        a = parseInt(data.substr(3, 2), 16);
        data = data.substr(5);
      }

      for (var i = 0; i < a; i++) {
        this.stateAdjustables[i] = parseInt(data.substr(2 * i, 2), 16);
      }

      data = data.substr(a * 2);
      this.numThreads = data.length / 6;

      for (var i = 0; i < this.numThreads; i++) {
        b = `#${data.substr(i * 6, 6)}`;
        this.threadColours[i] = b;
        this.colourList.
      }

      ddata;
    },
  };
}
