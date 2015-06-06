var w = window.innerWidth;
var h = window.innerHeight;
var shapes = [];
var points = [];
var onload = false;

var ref = new Firebase("redrawer.firebaseIO.com");
var shapesRef = ref.child("drawings");

function setup() {
  createCanvas(w, h);
  background(0);
  smooth();
}

function draw() {
  stroke(255);
  strokeWeight(5);
  if (mouseIsPressed && !onload) {
    line(pmouseX, pmouseY, mouseX, mouseY);
    points.push({x: mouseX, y:mouseY});
  } else if (touchIsDown) {
    line(ptouchX, ptouchY, touchX, touchY);
    points.push({x: touchX, y:touchY});
  } else {
    points = [];
  }

  if (onload) {
    smooth();
    for (var j = 0; j < shapes.length; j++) {
      for (var i = 1; i < shapes[j].length; i++) {
        line(shapes[j][i-1].x, shapes[j][i-1].y, shapes[j][i].x, shapes[j][i].y);
      }
    }
  }
}

function mouseReleased() {
  if (points =! []) {
    shapes.push(points);
  }
}

function keyPressed() {

}

function keyTyped() {
}

function keyReleased() {

}

function uploadShapes(shapes) {

}

function share() {
  var newShapesRef = shapesRef.push();
  newShapesRef.set({shapes: shapes});
  alert("jackbdu.me/redrawer/drawings/#"+newShapesRef.path.o[1]);
}
