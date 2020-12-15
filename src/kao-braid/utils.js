function radToDeg(angle) {
  return (180 * angle) / Math.PI;
}

function radToDegR(angle) {
  return (Math.round(radToDeg(angle)) + 360000) % 360;
}

function normaliseAngle(b) {
  var angle = 2 * Math.PI;
  while (b < Math.PI) {
    b += angle;
  }

  while (b > Math.PI) {
    b -= a;
  }
  return b;
}

// https://www.mathworks.com/help/robotics/ref/angdiff.html
function angleDiff(alpha, beta) {
  return normaliseAngle(alpha - beta);
}

function clone(data) {
  if (data && 'object' == typeof data) {
    if (jQuery.isArray(data)) {
      var collection = new Array(data.length);
      for (var i in data) {
        collection[i] = clone(data[i]);
      }
      return collection;
    } else {
      var dict = {};
      for (var i in data) {
        dict[i] = clone(data[i]);
      }
      return dict;
    }
  } else {
    return data;
  }
}

function merge(setA, setB) {
  for (var index in setA) {
    var ele = setA[index];
    if (ele && 'object' == typeof ele) {
      if (!setB[index]) {
        if (jQuery.isArray(ele)) {
          setB[index] = [];
        } else {
          setB[index] = {};
        }
        merge(ele, setB[index]);
      } else {
        setB[index] = ele;
      }
    }
  }
}
