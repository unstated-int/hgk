import { getDetections } from "./assets/video_process.js";

//DOM elements
const video = (window.video = document.getElementById("webcam_canvas"));
const canvas = (window.canvas = document.getElementById("out_canvas"));

//dimensions for canvas
canvas.width = 480;
canvas.height = 360;

//constraints for webcam
const constraints = {
  audio: false,
  video: true,
  video: { width: 1280, height: 720 },
};

//success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

//potential error
function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}
//webcam
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(handleSuccess)
  .catch(handleError);

function angle2DFromCorners(det) {
  const dx = det.corners[1].x - det.corners[0].x;
  const dy = det.corners[1].y - det.corners[0].y;
  return (Math.atan2(dy, dx) * 180) / Math.PI; // gradi
}

//loop for detections
function loop() {
  // console.log("detections:", getDetections());
  requestAnimationFrame(loop);

  if (getDetections().length > 0) {

    const detection = getDetections().find((det) => det.id === 0);

    if (detection) {
      const angle = angle2DFromCorners(detection);
      const specimen = document.getElementById("specimen");
      // specimen.style.transform = `rotate(${angle}deg)`;

      //weight in relation of degree
      const newWeight = 100 + (angle / 180) * 100;
      specimen.style.fontVariationSettings = `'wght' ${newWeight}`;
      //letter spacing in relation of degree
      const newLetterSpacing = 0 + (angle / 180) * 10;
      // specimen.style.letterSpacing = `${newLetterSpacing}px`;
    }
  }
}
loop();
