var ref = new Firebase("redrawer.firebaseIO.com");

var shapesRef = ref.child("drawings");

function addShape(shapes) {
	shapesRef.push({
		shapes: shapes
	});
}
