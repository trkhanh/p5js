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

  setPat
});
