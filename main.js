function drawScreen(cordX, cordY, width, height, positionX = 0, positionY = 0, scale = 1) {
  tela.save()
  tela.fillStyle = pattern;
  tela.translate(positionX, positionY);
  tela.scale(scale, scale);
  tela.fillRect(cordX, cordY, width, height);
  tela.restore()
}

function clrscr(cordX, cordY, width, height) {
  tela.clearRect(cordX, cordY, width, height);
  tela.fillStyle = pattern;
  tela.fillRect(cordX, cordY, width, height);
}


const canvas = document.getElementById("canvas");
const tela = canvas.getContext("2d");
let portrait = window.matchMedia("(orientation: portrait)");
portrait.addEventListener("change", setScreenSizes);
//// 1.5 ratio 2:3
const rows = 10;
const cols = 15;
const sides = 6.35;
let size;
let padding; 
let yTelaInicial;
let screenGap;
let xTelaInicial;
let xTela;
let yTela;
let xHolderInicial;
let yHolderInicial;
// const size = parseInt(canvas.width / (rows + sides));
// const padding = size;
const inicialX = 0;
const inicialY = 0;
const xPreviewInicial = [];
const yPreviewInicial = [];

let xPoints;
let yPoints;
let xLevel;
let yLevel;
let xCountLines;
let yCountLines;
let yTextPoints;
let yTextLevel;
let yTextCountLines;

const btnPause = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  run() {
    canvas.style.cursor = "pointer";
    canvas.onclick = isPaused ? initGame : pauseGame;
  }
};

const btnReset = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  run() {
    canvas.style.cursor = "pointer";
    canvas.onclick = () => location.reload();
  }
};

const btnSettings = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  run() {
    canvas.style.cursor = "pointer";
    canvas.onclick = () => slider.forEach( slide => slide.getAttribute("type") == "range" ? slide.setAttribute("type", "hidden") : slide.setAttribute("type", "range"));
  }
};

const gameFrame = new Image();


setScreenSizes(portrait);

let line = size / 12;
const xPreview = padding * 5;
const yPreview = padding * 5;
const xHolder = padding * 5;
const yHolder = padding * 5;
let textBG;
let deviceIMG = 0;
// const screenGap = canvas.width - xTela;

// const yTelaInicial = parseInt(padding * sides * 1.18);

const sizePreview = padding * 5;
const patternCanvas = document.createElement('canvas')
const patternContext = patternCanvas.getContext("2d");
patternCanvas.width = padding;
patternCanvas.height = padding;
// patternContext.strokeStyle = "#000000";
patternContext.strokeStyle = "#ffffaa";
patternContext.fillStyle = "#000000";
patternContext.lineWidth = .5;
patternContext.rect(0, 0, patternCanvas.width, patternCanvas.height);
patternContext.fill();
patternContext.stroke();
const pattern = tela.createPattern(patternCanvas, 'repeat');

let isMobileDevice = window.matchMedia("(any-hover: none)").matches;
if (isMobileDevice) {
  deviceIMG = 125;
}



function setScreenSizes(isPortrait){    
  tela.clearRect(0, 0, canvas.width, canvas.height);  
  if (isPortrait.matches) {
    canvas.width = 1200;
    canvas.height = 1800;
    size = parseInt(canvas.width / (rows + sides));
    padding = size;
    xTelaInicial = parseInt(inicialX + padding * 1.58);
    yTelaInicial = parseInt(padding * sides * 1.18);
    xTela = padding * rows;
    yTela = padding * cols;
    screenGap = parseInt(padding * 1.75);
    
    xPreviewInicial.push(xTelaInicial + xTela + screenGap);    
    xPreviewInicial.push(xTelaInicial + xTela + screenGap);    
    xPreviewInicial.push(xTelaInicial + xTela + screenGap);
        
    yPreviewInicial.push(yTelaInicial + padding * 1.45);
    yPreviewInicial.push(yTelaInicial + padding * 4.5);
    yPreviewInicial.push(yTelaInicial + padding * 7.6);

    xHolderInicial = xTelaInicial + xTela + screenGap;
    yHolderInicial = yTela + yTelaInicial - padding * 1.9;
    
    xPoints = padding * 6;
    yPoints = padding * 2.25;
    xLevel = padding * 6;
    yLevel = padding * 3.25;
    xCountLines = padding * 6;
    yCountLines = padding * 4.25;
    
    yTextPoints = yPoints* 1.28;
    yTextLevel = yLevel * 1.2;
    yTextCountLines = yCountLines * 1.16;

    btnPause.x = parseInt(padding * 1.7);
    btnPause.y = parseInt(padding  * .38);
    btnPause.width = parseInt(padding * 2);
    btnPause.height = parseInt(padding * 1.1);

    btnReset.x = parseInt(padding * 7.2);
    btnReset.y = parseInt(padding * .38);
    btnReset.width = parseInt(padding * 2);
    btnReset.height = parseInt(padding * 1.1);

    btnSettings.x = parseInt(padding * 12.7);
    btnSettings.y = parseInt(padding * .38);
    btnSettings.width = parseInt(padding * 2);
    btnSettings.height = parseInt(padding * 1.1);
    gameFrame.src = `./assets/images/GameFrame.svg#svgView(viewBox(0,0,150,225))`;
  } else {
    canvas.width = 1800;
    canvas.height = 1200;
    size = parseInt(canvas.height / (rows + sides) * 0.9);
    padding = size;
    xTelaInicial = parseInt(inicialX + padding * 1.58);
    yTelaInicial = parseInt(padding * 1.5);
    xTela = padding * rows;
    yTela = padding * cols;
    screenGap = parseInt(padding * 1.75);

    xPreviewInicial.push(xTelaInicial + xTela + screenGap * 3.53)
    xPreviewInicial.push(xTelaInicial + xTela + screenGap * 5.33);
    xPreviewInicial.push(xTelaInicial + xTela + screenGap * 7.13);
    yPreviewInicial.push(yTelaInicial + padding * 6.25);
    yPreviewInicial.push(yTelaInicial + padding * 6.25);
    yPreviewInicial.push(yTelaInicial + padding * 6.25);

    xHolderInicial = xTelaInicial + xTela + screenGap * 1.35;
    yHolderInicial = yTela + yTelaInicial - padding * 2;

    xPoints = padding * 22.6;
    yPoints = padding * 13.1;
    xLevel = padding * 22.6;
    yLevel = padding * 14.1;
    xCountLines = padding * 22.6;
    yCountLines = padding * 15.14;

    yTextPoints = yPoints * 1.05;
    yTextLevel = yLevel * 1.05;
    yTextCountLines = yCountLines * 1.05;

    btnPause.x = parseInt(padding * 13.6);
    btnPause.y = parseInt(padding  * .38);
    btnPause.width = parseInt(padding * 2);
    btnPause.height = parseInt(padding * 1.1);

    btnReset.x = parseInt(padding * 19.15);
    btnReset.y = parseInt(padding * .38);
    btnReset.width = parseInt(padding * 2);
    btnReset.height = parseInt(padding * 1.1);

    btnSettings.x = parseInt(padding * 24.8);
    btnSettings.y = parseInt(padding * .38);
    btnSettings.width = parseInt(padding * 2);
    btnSettings.height = parseInt(padding * 1.1);

    gameFrame.src = `./assets/images/GameFrame.svg#svgView(viewBox(160,0,245,165))`;
  }
  console.log(canvas.width, canvas.height)
}



//Images
const howToPlay = new Image();
howToPlay.src = `./assets/images/HowToPlay.svg#svgView(viewBox(${deviceIMG},0,120,195))`;

//Audios
const bgm = new Audio('./assets/audios/bgm.ogg');
const blockConfirm = new Audio('./assets/audios/blockConfirm.ogg');
const combo = new Audio('./assets/audios/combo.ogg');
const combo4 = new Audio('./assets/audios/combo4.ogg');

// bgm.loop = true;
bgm.preload = 'auto';
// bgm.autoplay = true;

let reverseX = false;
let reverseY = false;
let reversePos = false;
let isLeft = false;
let isRight = false;
let isDown = false;
let isUp = false;
let isPaused = true;
let gameInterval = 50;
let checkInterval = 100;
let checkTimeout = 500;
let checkId = undefined;
let dropInterval = 1000;
let holding = false;
let countPosition = 0;
let countCheckMovement = 0;
let points = 0;
let countLines = 0;
let increasedPoint = 100;
let level = 1;
let levelup = 1000;
let openModal;
let game;
let check;
let drop;
let imageData;
let storedSettings; 
try {
  storedSettings = JSON.parse(localStorage['settings']);
} catch {
  storedSettings = undefined;
}

const actuallyObject = {};
const objectPosition = {};
const preview = [];
const hold = {};
const objectsHeap = {
  x: [],
  y: [],
  color: []
};
const objectsColor = ['#f5c925', '#d30C7B', '#0030b6', '#368f15', '#ab0000', '#5911aa', '#f17105', '#fffcf9']

const object_L = {
  x: [inicialX, inicialX, inicialX, inicialX + padding],
  y: [inicialY + padding, inicialY, inicialY + padding * 2, inicialY + padding * 2],
  color: objectsColor[0],
  type: "object_L",
  get() { return object_L }
};
const object_J = {
  x: [inicialX + padding, inicialX + padding, inicialX + padding, inicialX],
  y: [inicialY + padding, inicialY, inicialY + padding * 2, inicialY + padding * 2],
  color: objectsColor[1],
  type: "object_J",
  get() { return object_J }
};
const object_Z = {
  x: [inicialX, inicialX + padding, inicialX + padding, inicialX + padding * 2],
  y: [inicialY, inicialY, inicialY + padding, inicialY + padding],
  color: objectsColor[2],
  type: "object_Z",
  get() { return object_Z }
};
const object_S = {
  x: [inicialX + padding * 2, inicialX + padding, inicialX + padding, inicialX],
  y: [inicialY, inicialY, inicialY + padding, inicialY + padding],
  color: objectsColor[3],
  type: "object_S",
  get() { return object_S }
};
const object_O = {
  x: [inicialX, inicialX + padding, inicialX, inicialX + padding],
  y: [inicialY, inicialY, inicialY + padding, inicialY + padding],
  color: objectsColor[4],
  type: "object_O",
  get() { return object_O }
};
const object_T = {
  x: [inicialX, inicialX + padding, inicialX + padding * 2, inicialX + padding],
  y: [inicialY, inicialY, inicialY, inicialY + padding],
  color: objectsColor[5],
  type: "object_T",
  get() { return object_T }
};
const object_I = {
  x: [inicialX, inicialX, inicialX, inicialX],
  y: [inicialY + padding * 2, inicialY + padding, inicialY, inicialY + padding * 3],
  color: objectsColor[6],
  type: "object_I",
  get() { return object_I }
};

const object_Cross = {
  x: [inicialX + padding, inicialX, inicialX + padding, inicialX + padding, inicialX + padding * 2],
  y: [inicialY + padding, inicialY + padding, inicialY, inicialY + padding * 2, inicialY + padding],
  color: objectsColor[7],
  type: "object_+",
  get() { return object_Cross }
};

function clone(items) {
  let copia = Array.isArray(items) ? [] : {};;
  for (let i in items) {
    typeof items[i] == 'object' ?
      copia[i] = clone(items[i]) : copia[i] = items[i];
  }
  return copia;
}

function newObject() {
  // const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

  // let random = clone([object_L, object_J, object_Z, object_S, object_O, object_T, object_I, object_Cross]);
  let random = clone([object_L, object_J, object_Z, object_S, object_O, object_T, object_I]);
  try {
    random = random.filter(item => item.type !== preview.at(-1).type);
  } finally {
    const i = Math.floor(Math.random() * (random.length));
    reverseX = false;
    reverseY = false;
    reversePos = false;
    return random[i];
  }
}

function fillObject(cordX, cordY, size, color) {
  tela.save();
  tela.fillStyle = color;
  for (let i = 0; i < cordX.length; i++) {
    tela.save();
    tela.globalAlpha = 0.5;
    tela.fillRect(cordX[i], cordY[i], size, size);

    tela.strokeStyle = color;
    tela.lineWidth = 5;
    tela.beginPath();
    tela.moveTo(cordX[i] + 2, cordY[i] + 2);
    tela.lineTo(cordX[i] + 2 + line, cordY[i] + 2 + line);

    tela.moveTo(cordX[i] - 2 + size, cordY[i] + 2);
    tela.lineTo(cordX[i] - 2 + size - line, cordY[i] + 2 + line);

    tela.moveTo(cordX[i] - 2 + size, cordY[i] - 2 + size);
    tela.lineTo(cordX[i] - 2 + size - line, cordY[i] - 2 + size - line);

    tela.moveTo(cordX[i] + 2, cordY[i] - 2 + size);
    tela.lineTo(cordX[i] + 2 + line, cordY[i] - 2 + size - line);
    tela.closePath();
    tela.stroke();

    tela.restore();
    tela.fillRect(cordX[i] + line, cordY[i] + line, size - line * 2, size - line * 2);
  }
  tela.restore();
};

function startObject(object) {
  tela.resetTransform();
  tela.translate(xTelaInicial, yTelaInicial)
  let move = (Math.floor(Math.random() * ((xTela - Math.max(...object.x)) / padding))) * padding;
  object.x.forEach((pos, i, x) => x[i] = pos + move);
  checkObjectRotate(object.x, object.y)
  let objectAux = preventBlockLeak(object);
  fillObject(objectAux.x, objectAux.y, size, object.color);
}

function previewObject() {
  let preview = newObject();
  fillPreview(preview);
  return preview;
}
function fillPreview(preview) {
  tela.save();
  tela.scale(0.5, 0.5);
  clrscr(inicialX, inicialY, xPreview, yPreview);
  tela.translate(padding, padding)
  fillObject(preview.x, preview.y, size, preview.color);
  tela.restore();
}
function preventBlockLeak(object) {
  let index = object.y.map((aux, yIndex) => {
    let y = object.y.filter(y => y >= 0);
    if (y.includes(aux))
      return yIndex
  }
  ).filter(Number.isFinite);
  let objectAux = { x: [], y: [] };
  for (let i of index) {
    objectAux.x.push(object.x[i])
    objectAux.y.push(object.y[i])
  }
  return objectAux;
}

function nextPreview() {
  tela.save()
  tela.resetTransform();
  preview.forEach((next, i) => {
    tela.save()
    tela.translate(xPreviewInicial[i], yPreviewInicial[i]);
    fillPreview(next);
    tela.restore();
  });
  tela.translate(xPreviewInicial[preview.length], yPreviewInicial[preview.length]);
  preview.push(Object.assign({}, previewObject()));
  tela.restore();
}

function holdObject() {
  if (!holding) {
    let aux = {};
    Object.assign(aux, clone(actuallyObject.get()));
    setHold(aux);
    let objectAux = preventBlockLeak(actuallyObject);
    clrObject(objectAux.x, objectAux.y);
    for (let key in actuallyObject) delete actuallyObject[key];
    for (let key in objectPosition) delete objectPosition[key];
    if (Object.keys(hold).length > 0) {
      Object.assign(actuallyObject, clone(hold.get()));
    }
    else {
      Object.assign(actuallyObject, preview.shift());
      nextPreview();
    }
    startObject(actuallyObject);
    Object.assign(hold, clone(aux.get()));
    countPosition = 0;
    reverseX = false;
    reverseY = false;
    reversePos = false;
  }
  function setHold(object) {
    tela.save();
    tela.resetTransform();
    tela.translate(xHolderInicial, yHolderInicial);
    tela.scale(0.5, 0.5);
    clrscr(inicialX, inicialY, xHolder, yHolder);
    tela.translate(padding, padding);
    fillObject(object.x, object.y, size, object.color);
    tela.restore();
    holding = true;
  }
}

function rotateObject(object) {
  if (object.type === 'object_+' || cantRotate(object.x, object.y))
    return;

  if (reversePos) {
    reverseX = !reverseX;
  }
  reverseY = !reverseY;
  reversePos = !reversePos;

  let objectAux = preventBlockLeak(object)
  clrObject(objectAux.x, objectAux.y);

  if (reverseY && object.type !== 'object_I') {
    object.y.reverse();
  }
  if (reverseX && object.type === 'object_T' ||
    object.type === 'object_S' ||
    object.type === 'object_J') {
    object.x.reverse();
  }

  let x = object.x.map((x, i) => {
    let aux = [...new Set(object.y)];
    aux = aux.indexOf(object.y[i]);
    x = object.x[0] / padding;
    return (x + aux) * padding;
  });

  let y = object.y.map((y, i) => {
    let aux = [...new Set(object.x)];
    aux = aux.indexOf(object.x[i]);
    y = object.y[0] / padding;
    if (reverseX && (object.type === 'object_L' || object.type === 'object_J') ||
      !reverseY && (object.type === 'object_Z' || object.type === 'object_S') ||
      reverseY && object.type === 'object_T') {
      y--;
    }
    if (object.type === 'object_Z' ||
      object.type === 'object_S' ||
      object.type === 'object_O' ||
      object.type === 'object_L' ||
      object.type === 'object_J'
    ) {
      y--;
    }

    return (y + aux) * padding;
  });

  if (reverseY && object.type !== 'object_T' && object.type !== 'object_I') {
    y.reverse();
  }

  if ((reverseY != reverseX && object.type === 'object_T') || object.type === 'object_S' || object.type === 'object_J') {
    x.reverse();
  }

  object.x.forEach((pos, i, arr) => arr[i] = x[i]);
  object.y.forEach((pos, i, arr) => arr[i] = y[i]);
  checkObjectRotate(object.x, object.y);

  objectAux = preventBlockLeak(object)
  fillObject(objectAux.x, objectAux.y, size, object.color);
}

function moveObject(object, move = 0) {
  if (isPaused)
    return;
  if (Object.keys(object).length > 0 && !checkObjectSides(object.x, object.y, move)) {
    let objectAux = preventBlockLeak(object);
    clrObject(objectAux.x, objectAux.y);
    objectAux.x.forEach((pos, i, x) => x[i] = pos + move);
    objectAux.y.forEach((pos, i, y) => y[i] = pos);
    object.x.forEach((pos, i, x) => x[i] = pos + move);
    object.y.forEach((pos, i, y) => y[i] = pos);
    fillObject(objectAux.x, objectAux.y, size, object.color);

  }
}

function dropObject(object) {
  if (isPaused)
    return;
  if (!checkObjectFloor(object.x, object.y) || object.drop) {
    let objectAux = preventBlockLeak(object);
    clrObject(objectAux.x, objectAux.y);
    object.x.forEach((pos, i, x) => x[i] = pos);
    object.drop ?
      object.y.forEach((pos, i, y) => y[i] = pos + padding * object.drop) :
      object.y.forEach((pos, i, y) => y[i] = pos + padding);
    objectAux = preventBlockLeak(object);
    fillObject(objectAux.x, objectAux.y, size, object.color);
  }
}

function clrObject(cordX, cordY) {
  tela.save();
  tela.resetTransform();
  tela.translate(xTelaInicial, yTelaInicial);
  tela.fillStyle = pattern;
  for (let i = 0; i < cordX.length; i++) {
    tela.fillRect(cordX[i], cordY[i], size, size);
  }
  tela.restore();
}

function clrLine(cordY) {
  tela.save()
  tela.fillStyle = pattern;
  cordY.forEach(y => tela.fillRect(inicialX, y, xTela, size));
  tela.restore();
  sumPoints(cordY.length);
  if (cordY.length === 4) {
    combo4.load();
    combo4.play();
  } else {
    combo.load();
    combo.play();
  }
}

function checkObjectFloor(cordX, cordY) {
  return cordY.some((y, index) => {
    let matchHeap = objectsHeap.y.some((yHeap, indexHeap) => objectsHeap.x[indexHeap] === cordX[index] && yHeap == y + padding);
    return y + padding >= yTela || matchHeap;
  });
}

function checkObjectSides(cordX, cordY, move) {
  return cordX.some((x, index) => {
    let matchHeap = objectsHeap.x.some((xHeap, indexHeap) => objectsHeap.y[indexHeap] === cordY[index] && xHeap == x + move);
    if (move >= 0) {
      return x + move >= xTela || matchHeap;
    } else {
      return x <= inicialX || matchHeap;
    }
  });
}

function cantRotate(cordX, cordY) {
  let x = [...new Set(cordX)].length;
  let y = [...new Set(cordY)].length;
  let move = (Math.abs(x - y)) * padding;
  let cantRotate = false;
  let isInvalidY = false;
  let isInvalidRightX = cordX.some((x, index) => objectsHeap.x.some((xHeap, indexHeap) => objectsHeap.y[indexHeap] === cordY[index] && xHeap > x && xHeap <= x + move || x + move >= xTela));
  let isInvalidLeftX = cordX.some((x, index) => objectsHeap.x.some((xHeap, indexHeap) => objectsHeap.y[indexHeap] === cordY[index] && xHeap < x && xHeap >= x - move || x - move < inicialX));
  if (isInvalidLeftX && isInvalidRightX)
    isInvalidY = cordY.some(y => objectsHeap.y.some(yHeap => yHeap === y - padding * 2));
  if (isInvalidRightX && isInvalidLeftX && isInvalidY && x < y)
    cantRotate = true
  return cantRotate;
}

function checkObjectRotate(cordX, cordY) {
  let matchBefore = true;
  let matchAfter = true;
  let matchHeapBefore = true;
  let matchHeapAfter = true;
  let matchUnder = true;

  while (matchBefore || matchAfter || matchHeapBefore || matchHeapAfter || matchUnder) {
    matchBefore = cordX.some(x => x >= xTela);
    matchAfter = cordX.some(x => x < inicialX);
    matchUnder = cordY.some(y => y >= yTela);

    let matchHeap = cordX.filter((x, index) => {
      return objectsHeap.x.some((xHeap, indexHeap) => {
        return objectsHeap.y[indexHeap] == cordY[index] && xHeap == x
      });
    });
    let aux = cordX.filter(x => matchHeap.some(xHeap => x < xHeap)).length;
    matchHeapBefore = matchHeap.length > 0 && aux >= 1;
    matchHeapAfter = matchHeap.length > 0 && aux === 0;
    let matchReverse = false;
    if (matchHeapBefore)
      matchReverse = cordY.some(y => objectsHeap.x.some((xHeap, indexHeap) => objectsHeap.y[indexHeap] === y && (xHeap === Math.min(...cordX) - padding || Math.min(...cordX) - padding < inicialX)));
    if (matchHeapAfter)
      matchReverse = cordY.some(y => objectsHeap.x.some((xHeap, indexHeap) => objectsHeap.y[indexHeap] === y && (xHeap === Math.max(...cordX) + padding || Math.max(...cordX) + padding >= xTela)));

    for (let i in cordX) {

      if ((matchBefore || matchHeapBefore) && !matchReverse) {
        cordX[i] -= padding;
      }
      if ((matchAfter || matchHeapAfter) && !matchReverse) {
        cordX[i] += padding;
      }

      if (matchReverse || matchUnder) {
        cordY[i] -= padding;
      }
    };
  }
}

function checkLine() {
  let removeLine = objectsHeap.y.map((yHeap, indexHeap) => {
    let aux = objectsHeap.x.filter((x, indexHeapX) => yHeap == objectsHeap.y[indexHeapX]);
    if (aux.length == (xTela / padding)) {
      return indexHeap;
    }
  }).filter(Number.isFinite);
  let removeY = objectsHeap.y.filter((y, i) => removeLine.includes(i));
  removeY = [...new Set(removeY)];
  let drop = objectsHeap.y.map((y, i) => removeY.every(aux => aux !== y) && y < removeY[0] && i).filter(Number.isFinite);
  if (removeLine.length > 0) {
    clrLine(removeY);
    let dropList = [];
    for (let i of drop) {
      let dropline = removeY.reduce((acc, cur) => {
        if (cur > objectsHeap.y[i])
          acc++;
        return acc;
      }, 0);
      dropList.push({
        x: [objectsHeap.x[i]],
        y: [objectsHeap.y[i]],
        color: objectsHeap.color[i],
        drop: dropline
      });
    }
    dropList.sort((a, b) => b.y - a.y);
    objectsHeap.x = objectsHeap.x.filter((x, i) => !removeLine.includes(i));
    objectsHeap.y = objectsHeap.y.filter((y, i) => !removeLine.includes(i)).map(y => {
      for (let i in dropList) {
        dropList[i].y.includes(y) ? y += padding * dropList[i].drop : y
      }
      return y;
    });
    objectsHeap.color = objectsHeap.color.filter((color, i) => !removeLine.includes(i));
    for (let i in dropList) dropObject(dropList[i]);
  }
}


const startMovement = {
  async left() {
    if (!isLeft) {
      isLeft = true;
      try {
        while (isLeft) {
          await waitTime(100);
          moveObject(actuallyObject, -(padding));
        }
        throw 499
      } catch {
        isLeft = false;
      }
    }
  },
  async right() {
    if (!isRight) {
      isRight = true;
      try {
        while (isRight) {
          await waitTime(100);
          moveObject(actuallyObject, padding);
        }
      } catch {
        isRight = false;
      }
    }
  },
  async down() {
    if (!isDown) {
      isDown = true;
      try {
        drop = clearInterval(drop);
        while (isDown) {
          await waitTime(100)
          runDrop();
        }
        drop = setInterval(runDrop, dropInterval);
      } catch {
        isDown = false;
      }
    }
  }
}



function waitTime(ms) {
  return new Promise((resolve, reject) => {
    if (isPaused)
      reject();
    setTimeout(resolve, ms)
  })
}

async function getDown() {
  while (isDown) {
    await waitTime(100)
    runDrop();
  }
}

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

var xDown = null;
var yDown = null;
var isMoved = false;
var lastTime = 0;
let timer = [];

function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches;
}

function handleTouchStart(evt) {
  if (isPaused || Object.keys(actuallyObject).length <= 0)
    return;

  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
  lastTime = evt.timeStamp;

  if (bgmSlider.getAttribute("type") == "range" && yDown > yTelaInicial / 3) hideSettings();
}

function handleTouchMove(evt) {
  if (!xDown || !yDown || isPaused || yDown < yTelaInicial / 3 || Object.keys(actuallyObject).length <= 0) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;


  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;
  isMoved = true;
  
  if (Math.abs(xDiff) > padding * 0.3) {
    try {
      if (xDiff > 0) {
        moveObject(actuallyObject, -(padding));
      } else {
        moveObject(actuallyObject, padding);
      }
    } finally {
      xDown = xUp;
    }
  }
  if (Math.abs(yDiff) > padding * 0.75) {
    if (yDiff > 0) {
      isDown = false;
      isUp = true;
    } else {
      startMovement.down();
    }
  }
}

function handleTouchEnd(evt) {
  if (openModal.isOpen)
    openModal.highlightedButton(false)
  if (isPaused || yDown < yTelaInicial / 3 || Object.keys(actuallyObject).length <= 0)
    return;

  if (isMoved) {
    if (isDown) {
      if (evt.timeStamp - lastTime < 200) {
        while (!checkObjectFloor(actuallyObject.x, actuallyObject.y)) {
          runDrop();
        }
        checkGame(true);
        lastTime = 0;
      }
      isDown = false;
    } else {
      if (isUp && evt.timeStamp - lastTime < 500) {
        holdObject();
        isUp = false;
      }
    }
  } else {
    rotateObject(actuallyObject);
  }

  isMoved = false;


}

document.addEventListener('keydown', (event) => {
  event.preventDefault();  
  let { key, repeat} = event; 
  if (Object.keys(actuallyObject).length > 0 && !isPaused || key.toLowerCase() === 'p') {
    if (!repeat) {
      let isVisible = bgmSlider.getAttribute("type") == "range";
      switch (key.toLowerCase()) {
        case 'arrowup':
          isVisible && hideSettings();
          rotateObject(actuallyObject);
          break;
        case 'p':
          if (isPaused) {
            initGame();
          }
          else {
            pauseGame();
          }
          break;
        case 'c':
          isVisible && hideSettings();
          holdObject();
          break;
        case ' ': case 'enter':
          isVisible && hideSettings();
          while (!checkObjectFloor(actuallyObject.x, actuallyObject.y)) {
            runDrop();
          }
          checkGame(true);
          break;
        case 'arrowleft':
          isVisible && hideSettings();
          isRight = false;
          startMovement.left();
          break;
        case 'arrowright':
          isVisible && hideSettings();
          isLeft = false;
          startMovement.right();
          break;
        case 'arrowdown':
          isVisible && hideSettings();
          startMovement.down();
          break;
        default:
          break;
      }
    }
  }
});

document.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'ArrowDown':
      isDown = false;
      break;
    case 'ArrowLeft':
      isLeft = false;
      break;
    case 'ArrowRight':
      isRight = false;
      break;
    default:
      break;
  }
});

function initGame() {
  if (!preview.length) {
    tela.save();
    tela.resetTransform();
    for (let i = 0; i < yPreviewInicial.length; i++) {
      tela.translate(xPreviewInicial[i], yPreviewInicial[i]);
      preview.push(Object.assign({}, previewObject()));
    }
    tela.restore();
  }
  openModal.highlightedButton(false);
  canvas.style.cursor = "default";
  openModal.dispatch();
  openModal.isOpen = false;
  game = setInterval(runGame, gameInterval);;
  check = setInterval(checkGame, checkInterval)
  drop = setInterval(runDrop, dropInterval);
  bgm.play();
  isPaused = false;
}

function pauseGame() {
  if (!isPaused) {
    openModal = modal();
    clearInterval(game);
    drop = clearInterval(drop);
    clearInterval(check);
    bgm.pause();
    isPaused = true;
  }
}

function runGame() {
  if (Object.keys(actuallyObject).length === 0) {
    Object.assign(actuallyObject, preview.shift());
    nextPreview();
    startObject(actuallyObject);
  }
  checkLevelUp();
  tela.save();
  tela.resetTransform();
  tela.beginPath();
  tela.font = "60px Verdana";
  tela.save();
  tela.fillStyle = textBG;
  const pointsWidth = parseInt(tela.measureText(points).width);
  const levelWidth = parseInt(tela.measureText(level).width);
  const countLinesWidth = parseInt(tela.measureText(countLines).width);
  const height = 50;
  tela.clearRect(xPoints, yPoints, pointsWidth, height);
  tela.clearRect(xLevel, yLevel, levelWidth, height);
  tela.clearRect(xCountLines, yCountLines, countLinesWidth, height);
  tela.fillRect(xPoints , yPoints, pointsWidth, height);
  tela.fillRect(xLevel, yLevel, levelWidth, height);
  tela.fillRect(xCountLines, yCountLines, countLinesWidth, height);
  tela.restore();
  tela.fillText(points, xPoints, yTextPoints);
  tela.fillText(level, xLevel, yTextLevel);
  tela.fillText(countLines, xCountLines, yTextCountLines);
  tela.closePath();
  tela.restore();
  if (Math.min(...objectsHeap.y) < inicialY) {
    drop = clearInterval(drop);
    clearInterval(check);
    clearInterval(game);

    bgm.pause();
    alert('Game OVER !!!');
    if (confirm) { location.reload() }
  }

}

function checkGame(checkMove = false) {
  if (Object.keys(actuallyObject).length > 0 && checkObjectFloor(actuallyObject.x, actuallyObject.y)) {

    if (typeof checkId === 'undefined' && !checkMove) {
      checkId = setTimeout(checkMovement, checkTimeout);
    }

    checkMove = !checkMove ? (countCheckMovement === 5 || countPosition === 2) : true;
    if (checkMove) {
      objectsHeap.x.push(...actuallyObject.x);
      objectsHeap.y.push(...actuallyObject.y);
      objectsHeap.color.push(...Array(actuallyObject.x.length).fill(actuallyObject.color))
      checkLine();
      for (let key in actuallyObject) delete actuallyObject[key];
      for (let key in objectPosition) delete objectPosition[key];
      holding = false;
      countCheckMovement = 0;
      countPosition = 0;
      blockConfirm.load();
      blockConfirm.play();
    }
  }
}

function checkMovement() {
  if (Object.keys(objectPosition).length === 0) {
    Object.assign(objectPosition, clone(actuallyObject));
  }
  let samePosition = objectPosition.x.every((x, i) => actuallyObject.x[i] === x) && objectPosition.y.every((y, i) => actuallyObject.y[i] === y)
  if (samePosition) {
    countPosition++;
  } else {
    countPosition = 0;
    for (let key in objectPosition) delete objectPosition[key];
  }
  countCheckMovement++;
  checkId = clearTimeout(checkId);
  let isPosition = countCheckMovement === 5 || countPosition === 2;
  return isPosition;
}

function modal() {
  tela.save();
  tela.resetTransform();
  let x = parseInt(xTelaInicial + padding * 2.20);
  let y = parseInt(yTelaInicial + yTela - padding * 2.8);
  let width = parseInt(padding * 5.63);
  let height = parseInt(padding * 1.03);
  let curve = parseInt(padding / 2.5);
  let lineWidth = 0.5;
  const imageCord = [xTelaInicial + padding, yTelaInicial + padding, xTela - padding * 2, yTela - padding * 2]
  let buttonStart;
  let background = tela.getImageData(...imageCord);

  if (howToPlay.complete) {
    tela.drawImage(howToPlay, ...imageCord);
    buttonStart = tela.getImageData(x, y, width, height);
  }
  else {
    howToPlay.onload = () => {
      tela.drawImage(howToPlay, ...imageCord);
      buttonStart = tela.getImageData(x, y, width, height);
    }
  }


  tela.restore();


  return {
    x,
    y,
    height,
    width,
    isOpen: true,
    dispatch: () => {
      tela.save();
      tela.resetTransform();
      tela.clearRect(...imageCord);
      tela.putImageData(background, xTelaInicial + padding, yTelaInicial + padding);
      tela.restore();
    },
    highlightedButton: (isHighLighted) => {
      if (isHighLighted) {
        tela.save();
        tela.resetTransform();
        tela.strokeStyle = "rgba(242, 207, 72, 0.3)";
        tela.lineWidth = lineWidth
        tela.fillStyle = "rgba(242, 207, 72, 0.3)";
        tela.moveTo(x + curve, y + lineWidth);
        tela.lineTo(x + width - curve, y + lineWidth);
        tela.quadraticCurveTo(x + width, y, x + width - lineWidth, y + curve);
        tela.lineTo(x + width - lineWidth, y + height - curve);
        tela.quadraticCurveTo(x + width - lineWidth, y + height - lineWidth, x + width - curve, y + height - lineWidth);
        tela.lineTo(x + curve + lineWidth, y + height - lineWidth);
        tela.quadraticCurveTo(x + lineWidth, y + height - lineWidth, x + lineWidth, y + height - curve);
        tela.lineTo(x + lineWidth, y + curve);
        tela.quadraticCurveTo(x + lineWidth, y, x + curve, y + lineWidth);
        tela.putImageData(buttonStart, x, y);
        tela.stroke();
        tela.fill();
        tela.restore();
        canvas.style.cursor = "pointer";
        canvas.onclick = initGame;
      } else {
        tela.save();
        // tela.clearRect(x, y, width, height)
        tela.putImageData(buttonStart, x, y);
        tela.restore();
        canvas.style.cursor = "default";
        canvas.onclick = null;
      }
    }
  }
}

function getMousePos(canvas, evt, button) {
  var rect = canvas.getBoundingClientRect();
  let pos = {
    x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
  };
  if (pos.x >= button.x && pos.y >= button.y && pos.x <= button.width + button.x && pos.y <= button.height + button.y) {
    return true;
  }
}

window.addEventListener('blur', pauseGame);

window.addEventListener('DOMContentLoaded', (evt) => {
  evt.preventDefault();
  gameFrame.onload = () => {
    tela.drawImage(gameFrame, inicialX, inicialY, canvas.width, canvas.height);
    drawScreen(inicialX, inicialY, xHolder, yHolder, xHolderInicial, yHolderInicial, 0.5);
    drawScreen(inicialX, inicialY, xTela, yTela, xTelaInicial, yTelaInicial);
    yPreviewInicial.forEach((yPreviewInicial, i) => {
      drawScreen(inicialX, inicialY, xPreview, yPreview, xPreviewInicial[i], yPreviewInicial, 0.5);
    })

    openModal = modal();

    if (storedSettings) {
      slider.forEach(slide=> {
        const name = slide.getAttribute("name");
        const value = storedSettings[name] ? storedSettings[name] : slide.getAttribute("value");
        slide.setAttribute("value", value);
        slide.dispatchEvent(new Event('input'))
      
      }); 
    } else {
      colorSlider.dispatchEvent(new Event('input'));
      bgmSlider.setAttribute("value", parseInt(bgm.volume * 100));
      effectSlider.setAttribute("value", parseInt(combo.volume  * 100));
    }

  }
});

canvas.addEventListener('mousemove', (event) => {
  event.preventDefault();
  if (openModal.isOpen) {
    if (getMousePos(canvas, event, openModal)) {
      openModal.highlightedButton(true);
      return;
    }
    else
      openModal.highlightedButton(false);
  }
  if (getMousePos(canvas, event, btnPause)) {
    btnPause.run();
    return;
  }
  if (getMousePos(canvas, event, btnReset)) {
    btnReset.run();
    return;
  }
  if (getMousePos(canvas, event, btnSettings)) {
    btnSettings.run();
    return;
  }

  canvas.style.cursor = "default";
  canvas.onclick = null;

});

function runDrop() {
  if (Object.keys(actuallyObject).length > 0)
    dropObject(actuallyObject);
}

function sumPoints(lines) {
  let sum = lines > 1 ? (lines * increasedPoint + lines * increasedPoint / 2) : lines * increasedPoint;
  points += sum + sum * (lines * 0.5);
  countLines += lines;
}

function checkLevelUp() {
  let isLevelUP = points >= levelup * level;
  if (isLevelUP) {
    level++;
    dropInterval -= 50;
    if (drop) {
      drop = clearInterval(drop);
      drop = setInterval(runDrop, dropInterval);
    }
  }
}

bgm.addEventListener('timeupdate', (sound) => {
  let buffer = .1337
  if (bgm.currentTime >= bgm.duration - buffer) {
    bgm.load();
    bgm.play();
  }
});

const slider = document.querySelectorAll('.slide');
const colorSlider = slider[0];
const bgmSlider = slider[1];
const effectSlider = slider[2];

colorSlider.addEventListener('input', changeColor);
bgmSlider.addEventListener('input', changeBGMSound);
effectSlider.addEventListener('input', changeEffectSound);

function hideSettings() {
  slider.forEach( slide => slide.setAttribute("type", "hidden"));
}

function changeColor(e) {
  let value = e.target.value / 360;
  imageData = tela.getImageData(inicialX, inicialY, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = Math.floor(data[i + 3]);
    if (alpha >=75 && alpha <= 220) {
      let newRgb = hslToRgb(value, 1, .5);
      data[i] = newRgb.r;
      data[i + 1] = newRgb.g;
      data[i + 2] = newRgb.b;
    }
  }
  tela.putImageData(imageData, inicialX, inicialY);
  textBG = `rgba(${new Array(...tela.getImageData(xPoints, yPoints - 1, 1, 1).data).map((a, i) => i === 3 ? a /255 : a)})`;
  let color = {color: e.target.value};
  storeSettings(color);
}

function hslToRgb(h, s, l) {
  let r, g, b;
  let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  let p = 2 * l - q;
  r = hue2rgb(p, q, h + 1 / 3);
  g = hue2rgb(p, q, h);
  b = hue2rgb(p, q, h - 1 / 3);

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  return ({
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  });
}
function changeBGMSound(e) {
  bgm.volume = e.target.value / 100;  
  bgmSlider.setAttribute("value", parseInt(bgm.volume * 100));
  let soundBGM = {soundBGM: bgmSlider.getAttribute("value")};
  storeSettings(soundBGM);
}

function changeEffectSound(e) {
  blockConfirm.volume = e.target.value / 100;
  combo.volume = e.target.value / 100;
  combo4.volume = e.target.value / 100;
  effectSlider.setAttribute("value", parseInt(combo.volume * 100));
  let soundEffect = {soundEffect: effectSlider.getAttribute("value")};
  storeSettings(soundEffect);
}

function storeSettings(value) {
  localStorage['settings'] = storedSettings !== undefined ? JSON.stringify(Object.assign(storedSettings, value)) : JSON.stringify(value);
}