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
  //// 1.5 ratio 2:3
  const rows = 10;
  const cols = 15;
  const sides = 6.35;
  const size = parseInt(canvas.width / (rows + sides));
  const line = 2;
  const padding = size;
  const inicialX = 0;
  const inicialY = 0;
  // const xTelaInicial = xHolder + screenGap;
  const xTela = padding * rows;
  const yTela = padding * cols;
  const xPreview = padding * 5;
  const yPreview = padding * 5;
  const xHolder = padding * 5;
  const yHolder = padding * 5;
  let textBG;
  // const screenGap = canvas.width - xTela;
  const screenGap = parseInt(padding * 1.92);
  const xTelaInicial = parseInt(inicialX + padding * 1.58);
  const yTelaInicial = parseInt(padding * sides * 1.18);
  const xPreviewInicial = xTelaInicial + xTela + screenGap;
  const yPreviewInicial = yTelaInicial + padding * 1.5;
  const xHolderInicial = xTelaInicial + xTela + screenGap;
  const yHolderInicial = yTela + yTelaInicial - padding * 2;
  const sizePreview = padding * 5;
  const patternCanvas = document.createElement('canvas')
  const patternContext = patternCanvas.getContext("2d");
  patternCanvas.width = padding;
  patternCanvas.height = padding;
  patternContext.strokeStyle = "#ffffaa";
  patternContext.fillStyle = "#000000";
  patternContext.lineWidth = 0.3;
  patternContext.rect(0, 0, patternCanvas.width + .6, patternCanvas.height + .6);
  patternContext.fill();
  patternContext.stroke();
  const pattern = tela.createPattern(patternCanvas, 'repeat');

  //Images
  var howToPlay = new Image();
  howToPlay.src = './assets/images/HowToPlay.svg';
  var gameFrame = new Image();
  gameFrame.src = './assets/images/GameFrame.svg';

  //Audios
  const bgm = new Audio('./assets/audios/bgm.ogg');
  const blockConfirm = new Audio('./assets/audios/blockConfirm.ogg');
  const combo = new Audio('./assets/audios/combo.ogg');
  const combo4 = new Audio('./assets/audios/combo4.ogg');

  bgm.loop = true;
  // bgm.preload = 'auto';
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

  const btnReset = {
    x: parseInt(sizePreview * 1.11),
    y: parseInt(padding * .38),
    width: parseInt(padding * 2),
    height: parseInt(padding * 1.1),
    run() {
      canvas.style.cursor = "pointer";
      canvas.onclick = () => location.reload();
    }
  };

  const btnPause = {
    x: parseInt(sizePreview * 2.56),
    y: parseInt(padding * .38),
    width: parseInt(padding * 2),
    height: parseInt(padding * 1.1),
    run() {
      canvas.style.cursor = "pointer";
      canvas.onclick = isPaused ? initGame : pauseGame;
    }
  };


  const actuallyObject = {};
  const objectPosition = {};
  const preview = [];
  const hold = {};
  const objectsHeap = {
    x: [],
    y: [],
    color: []
  };
  const objectsColor = ['Orange', 'Pink', 'Purple', 'Green', 'Blue', 'Red', 'Yellow', 'Gray']

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

    const random = clone([object_L, object_J, object_Z, object_S, object_O, object_T, object_I, object_Cross]);
    const i = Math.floor(Math.random() * (random.length));
    reverseX = false;
    reverseY = false;
    reversePos = false;
    return random[i];
  }

  function fillObject(cordX, cordY, size, color) {
    tela.save();
    tela.fillStyle = color;
    for (let i = 0; i < cordX.length; i++) {
      tela.save();
      tela.globalAlpha = 0.5;
      tela.fillRect(cordX[i] + 1, cordY[i] + 1, size, size);

      tela.strokeStyle = "black";
      tela.lineWidth = 2;
      tela.beginPath();
      tela.moveTo(cordX[i] + 1, cordY[i] + 1);
      tela.lineTo(cordX[i] + 1 + line, cordY[i] + 1 + line);

      tela.moveTo(cordX[i] + 1, cordY[i] + 1 + size);
      tela.lineTo(cordX[i] + 1 + line, cordY[i] + 1 + size - line);

      tela.moveTo(cordX[i] + 1 + size, cordY[i] + 1);
      tela.lineTo(cordX[i] + 1 + size - line, cordY[i] + 1 + line);

      tela.moveTo(cordX[i] + 1 + size, cordY[i] + 1 + size);
      tela.lineTo(cordX[i] + 1 + size - line, cordY[i] + 1 + size - line);
      tela.closePath();
      tela.stroke();

      tela.restore();
      tela.fillRect(cordX[i] + 4, cordY[i] + 4, size - 6, size - 6);
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
    tela.translate(xPreviewInicial, yPreviewInicial)
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
    for (i of index) {
      objectAux.x.push(object.x[i])
      objectAux.y.push(object.y[i])
    }
    return objectAux;
  }

  function nextPreview() {
    tela.save()
    tela.resetTransform();
    preview.forEach((preview) => {
      fillPreview(preview);
      tela.translate(0, yPreviewInicial * .33);
    });
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
    if (object.type === 'object_+' || cantRotate(object.x, object.y)) {
      return;
    }
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
      tela.fillRect(cordX[i] + 1, cordY[i] + 1, size, size);
    }
    tela.restore();
  }

  function clrLine(cordY) {
    tela.save()
    tela.fillStyle = pattern;
    cordY.forEach(y => tela.fillRect(inicialX, y + 1, xTela, size));
    tela.restore();
    sumPoints(cordY.length);
    cordY.length === 4 ? combo4.play() : combo.play();
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
    let x = [...new Set(cordX)];
    let move = (cordX.length - x.length) * padding;
    let isInvalidRightX = cordX.some((x, index) => objectsHeap.x.some((xHeap, indexHeap) => objectsHeap.y[indexHeap] === cordY[index] && xHeap > x && xHeap <= x + move || x + move >= xTela));
    let isInvalidLeftX = cordX.some((x, index) => objectsHeap.x.some((xHeap, indexHeap) => objectsHeap.y[indexHeap] === cordY[index] && xHeap < x && xHeap >= x - move || x - move < inicialX));
    let isInvalidY = cordY.some(y => objectsHeap.y.some((yHeap, indexHeap) => objectsHeap.y[indexHeap] === y && yHeap === cordY[0] - padding));
    return isInvalidRightX && isInvalidLeftX && isInvalidY;
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
        return objectsHeap.x.filter((xHeap, indexHeap) => {
          return objectsHeap.y[indexHeap] == cordY[index] && xHeap == x
        }).length > 0;
      });
      let aux = cordX.filter(x => matchHeap.filter(xHeap => x < xHeap)).length;
      matchHeapBefore = matchHeap.length > 0 && aux >= 1;
      matchHeapAfter = matchHeap.length > 0 && aux === 0;
      let matchReverse = false;
      if (matchHeapBefore)
        matchReverse = cordX.some(x => objectsHeap.x.includes(x - padding));
      if (matchHeapAfter)
        matchReverse = cordX.some(x => objectsHeap.x.includes(x + padding));

      cordX.forEach((x, i) => {

        if ((matchBefore || matchHeapBefore) && !matchReverse) {
          cordX[i] -= padding;
        }
        if ((matchAfter || matchHeapAfter) && !matchReverse) {
          cordX[i] += padding;
        }

        if (matchReverse || matchUnder) {
          cordY[i] -= padding;
        }
      });
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
          await getIsDown();
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
      setTimeout(() => resolve(), ms)
    })
  }

  async function getIsDown() {
    while (isDown) {
      await waitTime(100)
      runDrop();
    }
  }

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchend', handleTouchEnd, false);

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
  }

  function handleTouchMove(evt) {
    if (!xDown || !yDown || isPaused || Object.keys(actuallyObject).length <= 0) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;


    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    isMoved = true;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (Math.abs(xDiff) > padding * 0.25) {
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
    } else {
      if (Math.abs(yDiff) > padding * 0.75) {
        if (yDiff > 0) {
          isDown = false;
          isUp = true;
        } else {
          startMovement.down();
        }
      }
    }
  }

  function handleTouchEnd(evt) {
    if (openModal.isOpen)
      openModal.highlightedButton(false)
    if (isPaused || Object.keys(actuallyObject).length <= 0)
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
      if (reversePos) {
        reverseX = !reverseX;
      }
      reverseY = !reverseY;
      rotateObject(actuallyObject);
      reversePos = !reversePos;
    }

    isMoved = false;


  }

  document.addEventListener('keydown', ({ key, repeat }) => {
    if (Object.keys(actuallyObject).length > 0 && !isPaused || key.toLowerCase() === 'p') {
      if (!repeat) {
        switch (key.toLowerCase()) {
          case 'arrowup':
            if (reversePos) {
              reverseX = !reverseX;
            }
            reverseY = !reverseY;
            rotateObject(actuallyObject);
            reversePos = !reversePos;
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
            holdObject();
            break;
          case ' ': case 'enter':
            while (!checkObjectFloor(actuallyObject.x, actuallyObject.y)) {
              runDrop();
            }
            checkGame(true);
            break;
        }
      }
      switch (key) {
        case 'ArrowLeft':
          if (!isRight)
            startMovement.left();
          break;
        case 'ArrowRight':
          if (!isLeft)
            startMovement.right();
          break;
        case 'ArrowDown':
          startMovement.down();
          break;
        default:
          break;
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
      tela.translate(xPreviewInicial, yPreviewInicial);
      for (i = 0; i < 3; i++) {
        preview.push(Object.assign({}, previewObject()));
        tela.translate(0, yPreviewInicial * .33);
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
      startObject(actuallyObject);
      nextPreview();
    }
    checkLevelUp();
    tela.save();
    tela.resetTransform();
    tela.beginPath();
    tela.font = "100px Verdana";
    tela.save();
    tela.fillStyle = textBG;
    tela.fillRect(sizePreview * 1.2, sizePreview - padding * 2.8, tela.measureText(level).width, 85);
    tela.fillRect(sizePreview * 2.6, sizePreview - padding * 2.8, tela.measureText(countLines).width, 85);
    tela.fillRect(sizePreview + padding, sizePreview - padding * 1.1, tela.measureText(points).width, 85);
    tela.restore();
    tela.fillText(level, sizePreview * 1.2, sizePreview - padding * 1.7);
    tela.fillText(countLines, sizePreview * 2.6, sizePreview - padding * 1.7);
    tela.fillText(points, sizePreview + padding, sizePreview);
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

    tela.beginPath();
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


    // tela.closePath();
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
          tela.clearRect(x, y, width, height)
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
      drawScreen(inicialX, inicialY, xPreview, yPreview, xPreviewInicial, yPreviewInicial, 0.5);
      drawScreen(inicialX, inicialY, xPreview, yPreview, xPreviewInicial, yPreviewInicial * 1.33, 0.5);
      drawScreen(inicialX, inicialY, xPreview, yPreview, xPreviewInicial, yPreviewInicial * 1.66, 0.5);
      openModal = modal();
      tela.save();
      tela.resetTransform();
      tela.beginPath();
      textBG = `rgba(${new Array(...tela.getImageData(sizePreview + padding, sizePreview, 1, 1).data).map((a, i) => i === 3 ? a / 255 : a)})`;
      tela.closePath();
      tela.restore();
    }
  });

  window.addEventListener('mousemove', (event) => {
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

  bgm.addEventListener('timeupdate', () => {
    let buffer = .77
    if (this.currentTime > this.duration - buffer) {
      this.currentTime = 0
      this.play();
    }
  });
