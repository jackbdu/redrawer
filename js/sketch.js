var w = window.innerWidth;
var h = window.innerHeight;
var shapes = [];
var points = [];
var viewerMode = false;
var i = 0;
var j = 1;
var clear = true;
var bgColor = 0;
var bgChanged = false;
var weight = 5;
var increase = true;
var strokeColors;
var strokeN = 0;

var ref = new Firebase("redrawer.firebaseIO.com");
var shapesRef = ref.child("drawings");

function setup() {
  var redColor = color(255, 0, 0);
  var greenColor = color(0, 255, 0);
  var blueColor = color(0, 0, 255);
  var darkGray = color(50, 50, 50);
  var lightGray = color(200, 200, 200);
  strokeColors = new Array(lightGray, darkGray, redColor, greenColor, blueColor);
  createCanvas(w, h);
  smooth();
}

function draw() {
  if (clear) {
    background(bgColor);
    clear = false;
  }
  stroke(strokeColors[strokeN]);
  strokeWeight(weight);
  if (bgChanged) {
    for (var k = 0; k < shapes.length; k++) {
      strokeN = shapes[k][-1];
      console.log(strokeN);
      stroke(strokeColors[strokeN]);
      for (var l = 1; l < shapes[k].length; l++) {
        line(shapes[k][l-1].x*w, shapes[k][l-1].y*h, shapes[k][l].x*w, shapes[k][l].y*h);
      }
    }
    bgChanged = false;
  }
  if (mouseIsPressed && !viewerMode) {
    if (pmouseX != 0 || pmouseY != 0) {
      line(pmouseX, pmouseY, mouseX, mouseY);
      points.push({x: mouseX/w, y:mouseY/h});
    }
  } else if (touchIsDown && !viewerMode) {
    if (ptouchX != 0 && ptouchY != 0) {
      line(ptouchX, ptouchY, touchX, touchY);
      points.push({x: touchX/w, y:touchY/h});
    }
  } else {
    points = [];
    points[-1] = strokeN;
  }

  if (viewerMode) {
    smooth();
    if (i < shapes.length) {
      strokeN = shapes[i][-1];
      stroke(strokeColors[strokeN]);
      if (j < shapes[i].length) {
        line(shapes[i][j-1].x*w, shapes[i][j-1].y*h, shapes[i][j].x*w, shapes[i][j].y*h);
        j++;
      } else {
        i++;
        j = 1;
      }
    }
  }
}

function mouseReleased() {
  if (points.length != 0) {
    shapes.push(points);
  }
}

function touchEnded() {
  if (points.length != 0) {
    shapes.push(points);
  }
}

function touchStarted() {
  ptouchX = touchX;
  ptouchY = touchY;
}

function share() {
  var newShapesRef = shapesRef.push();
  newShapesRef.set({shapes: shapes, bgColor: bgColor});
  alert("jackbdu.me/redrawer/drawings/#"+newShapesRef.path.o[1]);
}

function clearAll() {
  clear = true;
  shapes = [];
}

function toggleBackground() {
  if (bgColor == 0) {
    bgColor = 255;
  } else {
    bgColor = 0;
  }
  bgChanged = true;
  clear = true;
}

function toggleColor() {
  if (strokeN < strokeColors.length - 1) {
    strokeN++;
  } else {
    strokeN = 0;
  }
}
