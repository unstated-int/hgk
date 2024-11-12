function draw(predictions) {
  let textArea = document.getElementById("text");
  let weight = null;

  if (predictions.length > 0) {

    if (predictions.length > 0) {
      ///console.log(predictions)
      let close = predictions.filter((item) => item.label === "closed");
      if (close.length >= 1) {
        let xClose = close[0].bbox[0];
        let yClose = close[0].bbox[1];
        document.getElementById("x").innerHTML = xClose;
        document.getElementById("y").innerHTML = yClose;

        weight = rangeMap(yClose, 0, 400, 32, 228);
        textArea.style.fontVariationSettings = `'wght' ${weight}`;
      }
    }
  }
}

// map function
function rangeMap(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}
