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

var ref = new Firebase("redrawer.firebaseIO.com");
var shapesRef = ref.child("drawings");

function setup() {
  createCanvas(w, h);
  smooth();
}

function draw() {
  if (clear) {
    background(bgColor);
    clear = false;
  }
  stroke(255-bgColor);
  strokeWeight(weight);
  if (bgChanged) {
    for (var k = 0; k < shapes.length; k++) {
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
  }

  if (viewerMode) {
    smooth();
    if (i < shapes.length) {
      if (j < shapes[i].length) {
        println("aa");
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
