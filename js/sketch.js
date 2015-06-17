var w = window.innerWidth;
var h = window.innerHeight;
var shapes = [];
var points = [];
var colors = [];
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
var effectN = 0;
var view = false;

var ref = new Firebase("redraw.firebaseIO.com");
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
  blockScroll();
  if (clear) {
    background(bgColor);
    clear = false;
  }
  stroke(strokeColors[strokeN]);
  strokeWeight(weight);
  if (bgChanged) {
    for (var k = 0; k < shapes.length; k++) {
      stroke(strokeColors[colors[k]]);
      for (var l = 1; l < shapes[k].length; l++) {
        line(shapes[k][l-1].x*w, shapes[k][l-1].y*h, shapes[k][l].x*w, shapes[k][l].y*h);
      }
    }
    bgChanged = false;

  }
  if (mouseIsPressed && !viewerMode) {
    if (pmouseX != 0 || pmouseY != 0) {
      if (points.length == 0) {
        if (mouseY > 55) {
          line(mouseX, mouseY, mouseX, mouseY);
          points.push({x: mouseX/w, y:mouseY/h});
        }
      } else {
        line(pmouseX, pmouseY, mouseX, mouseY);
        points.push({x: mouseX/w, y:mouseY/h});
      }
    }
  } else if (touchIsDown && !viewerMode) {
    if (ptouchX != 0 && ptouchY != 0) {
      if (points.length == 0) {
        if (touchY > 55) {
          line(touchX, touchY, touchX, touchY);
          points.push({x: touchX/w, y:touchY/h});
        }
      } else {
        line(ptouchX, ptouchY, touchX, touchY);
        points.push({x: touchX/w, y:touchY/h});
      }
    }
  } else {
    points = [];
  }

  if (viewerMode || view) {
    smooth();
    if (i < shapes.length && !view) {
      stroke(strokeColors[colors[i]]);
      if (j < shapes[i].length) {
        line(shapes[i][j-1].x*w, shapes[i][j-1].y*h, shapes[i][j].x*w, shapes[i][j].y*h);
        j++;
      } else {
        i++;
        j = 1;
      }
    } else {
      background(bgColor);
      if (effectN === 0) {
        if (weight > 9) {
          increase = false;
        } else if (weight < 4) {
          increase = true;
        }
        if (increase) {
          weight += 0.3;
        } else {
          weight -= 0.1;
        }
      } else {
        weight = 5;
      }
      for (var k = 0; k < shapes.length; k++) {
        stroke(strokeColors[colors[k]]);
        for (var l = 1; l < shapes[k].length; l++) {
          var x1 = shapes[k][l-1].x*w;
          var y1 = shapes[k][l-1].y*h;
          var x2 = shapes[k][l].x*w;
          var y2 = shapes[k][l].y*h;
          line(x1, y1, x2, y2);
          if (effectN === 1) {
            ellipse(x1+random(4)-random(4), y1+random(4)-random(4), 2+random(2), 2+random(2));
            ellipse(x2+random(4)-random(4), y2+random(4)-random(4), 2+random(2), 2+random(2));
          } else if (effectN === 2) {
            var offset = random(5);
            line(x1+offset, y1+offset, x2+offset, y2+offset);
            offset = random(5);
            line(x1-offset, y1-offset, x2-offset, y2-offset);
          }
        }
      }
    }
  }

  // if(touchIsDown) {

  //   fill(255,0,0);
  //   strokeWeight(1);
  //   stroke(255);
  //   textSize(30);
  //   text(points.length.toString(), 100, 200);
  // }

}

function mouseReleased() {
  if (points.length != 0) {
    shapes.push(points);
    colors.push(strokeN);
  }
}

function mousePressed() {
  pmouseX = mouseX;
  pmouseY = mouseY;
}

function touchEnded() {
  touchIsDown = false;
  if (points.length != 0) {
    shapes.push(points);
    colors.push(strokeN);
  }
}

function share() {
  var newShapesRef = shapesRef.push();
  newShapesRef.set({shapes: shapes, bgColor: bgColor, colors: colors, effectN: effectN});
  alert("jackbdu.me/redrawer/drawings/?"+newShapesRef.path.o[1]);
}

function clearAll() {
  clear = true;
  shapes = [];
  colors = [];
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

function changeColor() {
  if (strokeN < strokeColors.length - 1) {
    strokeN++;
  } else {
    strokeN = 0;
  }
}

function viewEdit() {
  view = !view;
}

function changeEffect() {
  if (effectN < 2) {
    effectN++;
  } else {
    effectN = 0;
  }
}

// block scrolling in iphone
function blockScroll() {
  $("body").swipe({
    swipe:function(event, direction, distance, duration, fingerCount) {
      var swipeDirection = direction;
    }
  });
}