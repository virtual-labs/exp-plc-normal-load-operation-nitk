const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const imgCanvas = document.getElementById("canvas");
const c = imgCanvas.getContext("2d");
const image = new Image();
image.src = "./images/main.png"; // Replace with your actual image path

const originalWidth = 900;
const originalHeight = 500;
let scaleX = 1,
  scaleY = 1;

// 2nd canvas

let bridgeConnected = false;
let trip = false;
let trip1G = false;
let trip2G = false;
let trip12G = false;

let incomer1 = {
  acb: {
    id: "u1",
    acbSwitch: false,
    acbOn: [109, 219],
    acbOff: [138, 219],
    acbTrip: [160, 219],
  },
  load1Status: {
    id: "d1",
    loadMCCBSwitch: false,
    loadOn: [79, 304],
    loadOff: [109, 304],
    mainLoad: false,
    mainLoadOn: [41, 480],
    mainLoadOff: [72, 480],
    triangle: 52,
  },
  load2Status: {
    id: "d2",
    loadMCCBSwitch: false,
    loadOn: [196, 304],
    loadOff: [220, 304],
    mainLoad: false,
    mainLoadOn: [159, 480],
    mainLoadOff: [186, 480],
    triangle: 165,
  },
};
let incomer2 = {
  acb: {
    id: "u2",
    acbSwitch: false,
    acbOn: [376, 219],
    acbOff: [403, 219],
    acbTrip: [428, 218],
  },
  load3Status: {
    id: "d3",
    loadMCCBSwitch: false,
    loadOn: [310, 304],
    loadOff: [336, 304],
    mainLoad: false,
    mainLoadOn: [280, 480],
    mainLoadOff: [306, 480],
    triangle: 282,
  },
  load4Status: {
    id: "d4",
    loadMCCBSwitch: false,
    loadOn: [427, 304],
    loadOff: [453, 304],
    mainLoad: false,
    mainLoadOn: [393, 480],
    mainLoadOff: [419, 480],
    triangle: 397,
  },
};
let incomerDG = {
  acb: {
    id: "u3",
    acbSwitch: false,
    acbOn: [751, 219],
    acbOff: [778, 219],
    acbTrip: [803, 219],
  },
  load5Status: {
    id: "d5",
    loadMCCBSwitch: false,
    loadOn: [631, 304],
    loadOff: [656, 304],
    mainLoad: false,
    mainLoadOn: [604, 480],
    mainLoadOff: [630, 480],
    triangle: 606,
  },
  load6Status: {
    id: "d6",
    loadMCCBSwitch: false,
    loadOn: [745, 304],
    loadOff: [772, 304],
    mainLoad: false,
    mainLoadOn: [708, 480],
    mainLoadOff: [736, 480],
    triangle: 718,
  },
  load7Status: {
    id: "d6",
    loadMCCBSwitch: false,
    loadOn: [860, 304],
    loadOff: [883, 304],
    mainLoad: false,
    mainLoadOn: [827, 480],
    mainLoadOff: [850, 480],
    triangle: 833,
  },
};

let acbBridge = {
  acb: { id: "slant", acbSwitch: false, acbOn: [515, 232], acbOff: [542, 231] },
};

function resizeCanvas() {
  // Set the canvas width and height to match the CSS size
  const container = imgCanvas.parentElement;
  const rect = container.getBoundingClientRect();
  imgCanvas.width = rect.width;
  imgCanvas.height = rect.height;
  // Redraw the image at the new size
  drawImage();

  // Calculate scaling factors
  scaleX = rect.width / originalWidth;
  scaleY = rect.height / originalHeight;

  // Resize canvas1
  const container2 = canvas.parentElement;
  const rect2 = container.getBoundingClientRect();
  canvas.width = rect2.width;
  canvas.height = rect2.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawOnCanvas1(scaleX, scaleY); // Redraw content on canvas1
}

function drawImage() {
  // Clear the canvas
  c.clearRect(0, 0, imgCanvas.width, imgCanvas.height);

  // Draw the image at the correct size
  c.drawImage(image, 0, 0, imgCanvas.width, imgCanvas.height);
  drawOnCanvas1();
}

image.onload = function () {
  // Initial resize and draw
  resizeCanvas();
  // drawOnCanvas1();
};

// Redraw the image whenever the window is resized
window.addEventListener("resize", resizeCanvas);

function drawLine() {
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(300, 150);
  ctx.stroke();
  ctx.closePath();
}

function drawArc(left, top, color, clearLeft, clearTop) {
  ctx.clearRect(clearLeft * scaleX - 20, clearTop * scaleY - 20, 100, 50);
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.ellipse(left * scaleX, top * scaleY, 5, 9, 0, 0, 4 * Math.PI);
  ctx.fill();
}
function drawEqTriangle(ctx, side, cx, cy, color) {
  ctx.save();
  ctx.clearRect(cx * scaleX - 10, cx * scaleY - 10, 20, 20);
  let h = side * (Math.sqrt(3) / 2);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  // ctx.save();
  ctx.translate(cx * scaleX, cy * scaleY);
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(-side / 2, -h / 2);
  ctx.lineTo(side / 2, -h / 2);
  ctx.lineTo(0, h / 2);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
  ctx.closePath();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function clearCanvas() {
  ctx.clearRect(66, 296, 100, 50);
}

function switchToggle(ele) {
  if (ele.id == "u1" || ele.id == "d1" || ele.id == "d2") {
    switch (ele.id) {
      case "u1":
        incomer1.acb.acbSwitch = !incomer1.acb.acbSwitch;
        changeSwitch(incomer1.acb.acbSwitch, ele.id);
        toggleIndicatorACB(incomer1.acb);
        toggleIncomer12MainIndicator();
        // overAllConnectionControl();
        break;
      case "d1":
        incomer1.load1Status.loadMCCBSwitch =
          !incomer1.load1Status.loadMCCBSwitch;
        changeSwitch(incomer1.load1Status.loadMCCBSwitch, ele.id);
        toggleIndicatorLoad(incomer1.load1Status);
        toggleIncomer12MainIndicator();
        break;
      case "d2":
        incomer1.load2Status.loadMCCBSwitch =
          !incomer1.load2Status.loadMCCBSwitch;
        changeSwitch(incomer1.load2Status.loadMCCBSwitch, ele.id);
        toggleIndicatorLoad(incomer1.load2Status);
        toggleIncomer12MainIndicator();
        break;
      default:
        break;
    }
  }
  if (ele.id == "u2" || ele.id == "d3" || ele.id == "d4") {
    switch (ele.id) {
      case "u2":
        incomer2.acb.acbSwitch = !incomer2.acb.acbSwitch;
        changeSwitch(incomer2.acb.acbSwitch, ele.id);
        toggleIndicatorACB(incomer2.acb);
        toggleIncomer12MainIndicator();
        break;
      case "d3":
        incomer2.load3Status.loadMCCBSwitch =
          !incomer2.load3Status.loadMCCBSwitch;
        changeSwitch(incomer2.load3Status.loadMCCBSwitch, ele.id);
        toggleIndicatorLoad(incomer2.load3Status);
        toggleIncomer12MainIndicator();
        break;
      case "d4":
        incomer2.load4Status.loadMCCBSwitch =
          !incomer2.load4Status.loadMCCBSwitch;
        changeSwitch(incomer2.load4Status.loadMCCBSwitch, ele.id);
        toggleIndicatorLoad(incomer2.load4Status);
        toggleIncomer12MainIndicator();
        break;
      default:
        break;
    }
  }
  if (ele.id == "u3" || ele.id == "d5" || ele.id == "d6" || ele.id == "d7") {
    switch (ele.id) {
      case "u3":
        incomerDG.acb.acbSwitch = !incomerDG.acb.acbSwitch;
        changeSwitch(incomerDG.acb.acbSwitch, ele.id);
        toggleIndicatorACB(incomerDG.acb);
        toggleIncomerDGMainIndicator();
        break;
      case "d5":
        incomerDG.load5Status.loadMCCBSwitch =
          !incomerDG.load5Status.loadMCCBSwitch;
        changeSwitch(incomerDG.load5Status.loadMCCBSwitch, ele.id);
        toggleIndicatorLoad(incomerDG.load5Status);
        toggleIncomerDGMainIndicator();
        break;
      case "d6":
        incomerDG.load6Status.loadMCCBSwitch =
          !incomerDG.load6Status.loadMCCBSwitch;
        changeSwitch(incomerDG.load6Status.loadMCCBSwitch, ele.id);
        toggleIndicatorLoad(incomerDG.load6Status);
        toggleIncomerDGMainIndicator();
        break;
      case "d7":
        incomerDG.load7Status.loadMCCBSwitch =
          !incomerDG.load7Status.loadMCCBSwitch;
        changeSwitch(incomerDG.load7Status.loadMCCBSwitch, ele.id);
        toggleIndicatorLoad(incomerDG.load7Status);
        toggleIncomerDGMainIndicator();
        break;
      default:
        break;
    }
  }
  if (ele.id == "slant") {
    acbBridge.acb.acbSwitch = !acbBridge.acb.acbSwitch;
    bridgeConnected = checkForBridge();
    changeSwitch(acbBridge.acb.acbSwitch, ele.id);
    toggleIndicatorACB(acbBridge.acb);
    if (bridgeConnected) {
      overAllConnectionControl();
    } else {
      toggle12();
      toggleDG();
    }
  }
}

function changeSwitch(status, id) {
  if (id == "slant") {
    document.getElementById(id).src = status
      ? "./images/slantClose.png"
      : "./images/slantOpen.png";
  } else {
    document.getElementById(id).src = status
      ? "./images/swClose.png"
      : "./images/swOpen.png";
  }
}

function toggleIndicatorACB(acb) {
  trip =
    ((incomer1.acb.acbSwitch && incomerDG.acb.acbSwitch && bridgeConnected) ||
      (incomer2.acb.acbSwitch && incomerDG.acb.acbSwitch && bridgeConnected) ||
      (incomer1.acb.acbSwitch &&
        incomerDG.acb.acbSwitch &&
        incomer2.acb.acbSwitch &&
        bridgeConnected) ||
      (!incomer1.acb.acbSwitch &&
        !incomerDG.acb.acbSwitch &&
        !incomer2.acb.acbSwitch &&
        bridgeConnected)) &&
    bridgeConnected
      ? true
      : false;
  if (!trip) {
    if (acb.acbSwitch) {
      drawArc(
        acb.acbOn[0],
        acb.acbOn[1],
        "#00ff00",
        acb.acbOff[0],
        acb.acbOff[1]
      );
    } else {
      drawArc(
        acb.acbOff[0],
        acb.acbOff[1],
        "#ff0000",
        acb.acbOn[0],
        acb.acbOn[1]
      );
    }
    if (incomer1.acb.acbSwitch) {
      drawArc(
        incomer1.acb.acbOn[0],
        incomer1.acb.acbOn[1],
        "#00ff00",
        incomer1.acb.acbOff[0],
        incomer1.acb.acbOff[1]
      );
    }
    if (incomer2.acb.acbSwitch) {
      drawArc(
        incomer2.acb.acbOn[0],
        incomer2.acb.acbOn[1],
        "#00ff00",
        incomer2.acb.acbOff[0],
        incomer2.acb.acbOff[1]
      );
    }
    if (incomerDG.acb.acbSwitch) {
      drawArc(
        incomerDG.acb.acbOn[0],
        incomerDG.acb.acbOn[1],
        "#00ff00",
        incomerDG.acb.acbOff[0],
        incomerDG.acb.acbOff[1]
      );
    }
  } else if (trip) {
    toggleIndicatorACBTripped(acb);
  }
}

function toggleIndicatorACBTripped(acb) {
  if (incomer1.acb.acbSwitch) {
    drawArcForTrip(incomer1.acb.acbTrip[0], incomer1.acb.acbTrip[1], "yellow");
  } else {
    drawArc(
      incomer1.acb.acbOff[0],
      incomer1.acb.acbOff[1],
      "#ff0000",
      incomer1.acb.acbOn[0],
      incomer1.acb.acbOn[1]
    );
  }
  if (incomer2.acb.acbSwitch) {
    drawArcForTrip(incomer2.acb.acbTrip[0], incomer2.acb.acbTrip[1], "yellow");
  } else {
    drawArc(
      incomer2.acb.acbOff[0],
      incomer2.acb.acbOff[1],
      "#ff0000",
      incomer2.acb.acbOn[0],
      incomer2.acb.acbOn[1]
    );
  }
  if (incomerDG.acb.acbSwitch) {
    drawArcForTrip(
      incomerDG.acb.acbTrip[0],
      incomerDG.acb.acbTrip[1],
      "yellow"
    );
  } else {
    drawArc(
      incomerDG.acb.acbOff[0],
      incomerDG.acb.acbOff[1],
      "#ff0000",
      incomerDG.acb.acbOn[0],
      incomerDG.acb.acbOn[1]
    );
  }
  drawArc(
    acbBridge.acb.acbOn[0],
    acbBridge.acb.acbOn[1],
    "#00ff00",
    acbBridge.acb.acbOff[0],
    acbBridge.acb.acbOff[1]
  );
  // }
}
function toggleIndicatorLoad(load) {
  if (load.loadMCCBSwitch) {
    drawArc(
      load.loadOn[0],
      load.loadOn[1],
      "#00ff00",
      load.loadOff[0],
      load.loadOff[1]
    );
  } else {
    drawArc(
      load.loadOff[0],
      load.loadOff[1],
      "#ff0000",
      load.loadOn[0],
      load.loadOn[1]
    );
  }
}

function toggleMainLoad(load) {
  if (load.mainLoad) {
    drawArc(
      load.mainLoadOn[0],
      load.mainLoadOn[1],
      "#00ff00",
      load.mainLoadOff[0],
      load.mainLoadOff[1]
    );
  } else {
    drawArc(
      load.mainLoadOff[0],
      load.mainLoadOff[1],
      "#ff0000",
      load.mainLoadOn[0],
      load.mainLoadOn[1]
    );
  }
}

function drawOnCanvas1() {
  toggleIndicatorACB(incomer1.acb);
  toggleIndicatorLoad(incomer1.load1Status);
  toggleIndicatorLoad(incomer1.load2Status);

  toggleIndicatorACB(incomer2.acb);
  toggleIndicatorLoad(incomer2.load3Status);
  toggleIndicatorLoad(incomer2.load4Status);
  toggleIndicatorACB(incomerDG.acb);

  toggleIndicatorLoad(incomerDG.load5Status);
  toggleIndicatorLoad(incomerDG.load6Status);
  toggleIndicatorLoad(incomerDG.load7Status);

  toggleIndicatorACB(acbBridge.acb);

  toggleMainLoad(incomer1.load1Status);
  drawEqTriangle(ctx, 24, incomer1.load1Status.triangle, 430, "#ff0000");
  toggleMainLoad(incomer1.load2Status);
  drawEqTriangle(ctx, 24, incomer1.load2Status.triangle, 430, "#ff0000");

  toggleMainLoad(incomer2.load3Status);
  drawEqTriangle(ctx, 24, incomer2.load3Status.triangle, 430, "#ff0000");
  toggleMainLoad(incomer2.load4Status);
  drawEqTriangle(ctx, 24, incomer2.load4Status.triangle, 430, "#ff0000");

  toggleMainLoad(incomerDG.load5Status);
  drawEqTriangle(ctx, 24, incomerDG.load5Status.triangle, 430, "#ff0000");
  toggleMainLoad(incomerDG.load6Status);
  drawEqTriangle(ctx, 24, incomerDG.load6Status.triangle, 430, "#ff0000");
  toggleMainLoad(incomerDG.load7Status);
  drawEqTriangle(ctx, 24, incomerDG.load7Status.triangle, 430, "#ff0000");
  // drawImage();
}

function toggleIncomer12MainIndicator() {
  bridgeConnected = checkForBridge();
  if (!bridgeConnected) {
    toggle12();
  } else {
    overAllConnectionControl();
  }
}

function toggleIncomerDGMainIndicator() {
  bridgeConnected = checkForBridge();
  if (!bridgeConnected) {
    toggleDG();
  } else {
    overAllConnectionControl();
  }
}

function toggle12() {
  if (incomer1.acb.acbSwitch || incomer2.acb.acbSwitch) {
    toggle12Switches();
  } else {
    controlLoadIncomer12(false);
  }
  if (!incomer1.acb.acbSwitch && !incomer2.acb.acbSwitch) {
    controlLoadIncomer12(false);
  }
}
function toggle12Switches() {
  if (incomer1.load1Status.loadMCCBSwitch) {
    mainLoadIndicatorSetting(incomer1.load1Status, true);
  } else {
    mainLoadIndicatorSetting(incomer1.load1Status, false);
  }
  if (incomer1.load2Status.loadMCCBSwitch) {
    mainLoadIndicatorSetting(incomer1.load2Status, true);
  } else {
    mainLoadIndicatorSetting(incomer1.load2Status, false);
  }
  if (incomer2.load3Status.loadMCCBSwitch) {
    mainLoadIndicatorSetting(incomer2.load3Status, true);
  } else {
    mainLoadIndicatorSetting(incomer2.load3Status, false);
  }
  if (incomer2.load4Status.loadMCCBSwitch) {
    mainLoadIndicatorSetting(incomer2.load4Status, true);
  } else {
    mainLoadIndicatorSetting(incomer2.load4Status, false);
  }
}
function toggleDG() {
  if (incomerDG.acb.acbSwitch) {
    toggleDGSwitches();
  } else {
    controlLoadIncomerDG(false);
  }
}
function toggleDGSwitches() {
  if (incomerDG.load5Status.loadMCCBSwitch) {
    mainLoadIndicatorSetting(incomerDG.load5Status, true);
  } else {
    mainLoadIndicatorSetting(incomerDG.load5Status, false);
  }
  if (incomerDG.load6Status.loadMCCBSwitch) {
    mainLoadIndicatorSetting(incomerDG.load6Status, true);
  } else {
    mainLoadIndicatorSetting(incomerDG.load6Status, false);
  }
  if (incomerDG.load7Status.loadMCCBSwitch) {
    mainLoadIndicatorSetting(incomerDG.load7Status, true);
  } else {
    mainLoadIndicatorSetting(incomerDG.load7Status, false);
  }
}
function mainLoadIndicatorSetting(outputLoad, status) {
  outputLoad.mainLoad = status;
  toggleMainLoad(outputLoad);
  let color = outputLoad.mainLoad ? "#00ff00" : "#ff0000";
  drawEqTriangle(ctx, 24, outputLoad.triangle, 430, color);
}

function controlLoadIncomer12(status) {
  mainLoadIndicatorSetting(incomer1.load1Status, status);
  mainLoadIndicatorSetting(incomer1.load2Status, status);
  mainLoadIndicatorSetting(incomer2.load3Status, status);
  mainLoadIndicatorSetting(incomer2.load4Status, status);
}

function controlLoadIncomerDG(status) {
  mainLoadIndicatorSetting(incomerDG.load5Status, status);
  mainLoadIndicatorSetting(incomerDG.load6Status, status);
  mainLoadIndicatorSetting(incomerDG.load7Status, status);
}

function checkForBridge() {
  return acbBridge.acb.acbSwitch ? true : false;
}

function turnOffAllLoad() {
  mainLoadIndicatorSetting(incomer1.load1Status, false);
  mainLoadIndicatorSetting(incomer1.load2Status, false);
  mainLoadIndicatorSetting(incomer2.load3Status, false);
  mainLoadIndicatorSetting(incomer2.load4Status, false);
  mainLoadIndicatorSetting(incomerDG.load5Status, false);
  mainLoadIndicatorSetting(incomerDG.load6Status, false);
  mainLoadIndicatorSetting(incomerDG.load7Status, false);
}

function overAllConnectionControl() {
  if (trip) {
    trip1G = incomer1.acb.acbSwitch && incomerDG.acb.acbSwitch ? true : false;
    trip2G = incomer2.acb.acbSwitch && incomerDG.acb.acbSwitch ? true : false;
    trip12G =
      incomer1.acb.acbSwitch &&
      incomer2.acb.acbSwitch &&
      incomerDG.acb.acbSwitch
        ? true
        : false;
    turnOffAllLoad();
  } else {
    toggle12Switches();
    toggleDGSwitches();
  }
}

function drawArcForTrip(left, top, color) {
  ctx.clearRect(left * scaleX - 100, top * scaleY - 20, 100, 50);
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.ellipse(left * scaleX, top * scaleY, 5, 9, 0, 0, 4 * Math.PI);
  ctx.fill();
}
// onload();

function circuitStatus() {
  // console.log(`trip1G: ${trip1G}`)
  // console.log(`trip2G: ${trip2G}`)
  // console.log(`trip12G: ${trip12G}`)
  console.log(`1: ${incomer1.acb.acbSwitch}`);
  console.log(`2: ${incomer2.acb.acbSwitch}`);
  console.log(`DG: ${incomerDG.acb.acbSwitch}`);
  console.log(`bridge: ${bridgeConnected}`);
  console.log(`Trip: ${trip}`);
}

function toggleTip(ele) {
  ele.style.opacity = ele.style.opacity == 1 ? 0 : 1;
}