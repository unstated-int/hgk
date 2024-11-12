function draw(predictions) {
  let xFace, yFace, widthFace, heightFace;
  let textArea = document.getElementById("text");
  let weight = null;
  if (predictions.length > 0) {
    let face = predictions.find((item) => item.label === "face");

    // if we have a face
    if (face) {
      // get the coordinates of the face and size
      xFace = face.bbox[0];
      yFace = face.bbox[1];
      widthFace = face.bbox[2];
      heightFace = face.bbox[3];

      // map the coordinates of the face from the canvas to the window
      // x = mapRange(xFace, 0, widthCanvas, 0, widthWindow);

      document.getElementById("x").innerHTML = xFace;
      document.getElementById("y").innerHTML = yFace;
      document.getElementById("width").innerHTML = widthFace;
      document.getElementById("height").innerHTML = heightFace;

      //face position
      // weight = rangeMap(xFace, 0, 521, 32, 228);

      //proxomity
      weight = rangeMap(widthFace, 70, 215, 32, 228);

      textArea.style.fontVariationSettings = `'slnt' ${weight}`;

    }
  }
}

// map function
function rangeMap(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}
