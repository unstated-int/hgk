const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

window.onOpenCvReady = function () {
  statusEl.textContent = "✅ OpenCV loaded";
  startCamera();
};

async function startCamera() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
    processFrame();
  };
}

function processFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  let src = cv.imread(canvas);
  let hsv = new cv.Mat();
  cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

  // Yellow range
  let lowYellow = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [20, 100, 100, 0]);
  let highYellow = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [30, 255, 255, 255]);
  let maskYellow = new cv.Mat();
  cv.inRange(hsv, lowYellow, highYellow, maskYellow);

  // Green range
  let lowGreen = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [40, 50, 50, 0]);
  let highGreen = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [80, 255, 255, 255]);
  let maskGreen = new cv.Mat();
  cv.inRange(hsv, lowGreen, highGreen, maskGreen);

  // Combine masks
  let combinedMask = new cv.Mat();
  cv.bitwise_or(maskYellow, maskGreen, combinedMask);

  // Find contours
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(combinedMask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // Draw contours and angle
  for (let i = 0; i < contours.size(); i++) {
    let cnt = contours.get(i);
    if (cnt.size().height < 1) continue;

    let rotatedRect = cv.minAreaRect(cnt);
    let vertices = cv.RotatedRect.points(rotatedRect);

    // draw rectangle
    ctx.beginPath();
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < 4; j++) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.closePath();
    ctx.stroke();

    // draw angle
    ctx.fillStyle = "yellow";
    ctx.font = "16px monospace";
    ctx.fillText(`${rotatedRect.angle.toFixed(1)}°`, rotatedRect.center.x, rotatedRect.center.y);
  }

  // Cleanup
  src.delete(); hsv.delete();
  lowYellow.delete(); highYellow.delete(); maskYellow.delete();
  lowGreen.delete(); highGreen.delete(); maskGreen.delete();
  combinedMask.delete(); contours.delete(); hierarchy.delete();

  requestAnimationFrame(processFrame);
}
