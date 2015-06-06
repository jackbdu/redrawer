var w = window.innerWidth;
var h = window.innerHeight;
var shapes = [];
var points = [];
var viewerMode = false;
var i = 0;
var j = 1;
var clear = true;

var ref = new Firebase("redrawer.firebaseIO.com");
var shapesRef = ref.child("drawings");

function setup() {
  createCanvas(w, h);
  smooth();
}

function draw() {
  if (clear) {
    background(0);
    clear = false;
  }
  stroke(255);
  strokeWeight(5);
  if (mouseIsPressed && !viewerMode) {
    if (pmouseX != 0 || pmouseY != 0) {
      line(pmouseX, pmouseY, mouseX, mouseY);
      points.push({x: mouseX, y:mouseY});
    }
  } else if (touchIsDown && !viewerMode) {
    if (ptouchX != 0 && ptouchY != 0) {
      line(ptouchX, ptouchY, touchX, touchY);
      points.push({x: touchX, y:touchY});
    }
  } else {
    points = [];
  }
  if (viewerMode) {

    smooth();
    if (i < shapes.length) {
      if (j < shapes[i].length) {
        line(shapes[i][j-1].x, shapes[i][j-1].y, shapes[i][j].x, shapes[i][j].y);
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

function share() {
  var newShapesRef = shapesRef.push();
  newShapesRef.set({shapes: shapes});
  alert("jackbdu.me/redrawer/drawings/#"+newShapesRef.path.o[1]);
}

function clearAll() {
  clear = true;
  shapes = [];
}
