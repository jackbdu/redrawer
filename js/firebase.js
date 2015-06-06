var ref = new Firebase("redrawer.firebaseIO.com");

var shapesRef = ref.child("drawings");

function uploadShapes(shapes) {
  shapesRef.push({
    shapes: shapes
  });
}