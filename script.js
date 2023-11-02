let columns = 10;
let interval = 1000;

function buildSide(start) {
  const edge = [];
  let i = start;
  while (i <= columns * columns) {
    edge.push(i);
    i += columns;
  }
  return edge;
}

const leftEdge = buildSide(1);
const rightEdge = buildSide(columns);
const topEdge = Array.from({ length: columns }, (_, i) => i + 1);
const bottomEdge = Array.from({ length: columns }, (_,i) => i + ((columns*columns)-columns+1))


const grid = Array.from({ length: columns * columns }, (_, i) => i + 1);

const initialAliveCells = [21, 22, 23, 17, 10];

let aliveCells = [...initialAliveCells];
const isAlive = (num) => aliveCells.includes(num)

const gridEl = document.getElementById("grid");
const button = document.getElementById("start-stop-button");
const resetButton = document.getElementById("reset-button");
const intervalInput = document.getElementById("interval-input");

function init() {
  gridEl.style.setProperty('--columns', columns)
  intervalInput.value = 1000;
  for (let i = 1; i <= grid.length; i++) {
    const div = document.createElement('div');
    div.classList.add("cell");
    div.setAttribute("data-id", i)
    
    div.textContent = i;
    gridEl.appendChild(div);
  }
}

function render() {
  const allCells = gridEl.querySelectorAll('[data-id]')
  allCells.forEach(el => {
    el.classList.remove('alive');
  })
  const aliveEls = gridEl.querySelectorAll(aliveCells.map(c => '[data-id="' + c + '"]').join(", "));
  // [data-id="1"], [data-id="2"], etc
  aliveEls.forEach(el => {
    el.classList.add("alive");
  })
}

function cycle() {
  let nextAliveCells = [];
  for (let i = 1; i <= grid.length; i++) {
    const alive = isAlive(i);
    const neighbors = [];
    let above = i - columns;
    if (above > 0) {
      neighbors.push(above);
    }
    let below = i + columns;
    if (below <= columns^2) {
      neighbors.push(below);
    }
    if (!rightEdge.includes(i)) {
      // handle left edge logic
      let right = i + 1;
      neighbors.push(right);
    }
    if (!leftEdge.includes(i)) {
      let left = i - 1;
      neighbors.push(left);
    }
    if (!leftEdge.includes(i) && !topEdge.includes(i)) {
      let topLeft = i - columns-1;
      neighbors.push(topLeft);
    }
    if (!topEdge.includes(i) && !rightEdge.includes(i)) {
      let topRight = i - columns+1;
      neighbors.push(topRight);
    }
    if (!bottomEdge.includes(i) && !leftEdge.includes(i)) {
      let bottomLeft = i + columns-1;
      neighbors.push(bottomLeft);
    }
    if (!bottomEdge.includes(i) && !rightEdge.includes(i)) {
      let bottomRight = i + columns+1;
      neighbors.push(bottomRight);
    }
    const aliveNeighbors = neighbors.filter(n => isAlive(n))
    const deadNeighbors = neighbors.filter(n => !isAlive(n));
    if (alive && (aliveNeighbors.length === 2 || aliveNeighbors.length === 3)) {
      nextAliveCells.push(i);
    } else if (!alive && aliveNeighbors.length === 3) {
      nextAliveCells.push(i);
    }
  }
  aliveCells = nextAliveCells;
}

init();
render();

let playing = false;

let intervalId;

function stop() {
  playing = false;
  button.textContent = "Start";
  clearInterval(intervalId)
}

function toggle() {
  if (playing) {
    stop();
    // handle logic of stopping
  } else {
    button.textContent = "Stop";
    playing = true;
    // set interval
    intervalId = setInterval(() => {
      cycle();
      render();
    }, 500);
  }
}


button.addEventListener("click", toggle)
resetButton.addEventListener("click", () => {
  stop();
  aliveCells = initialAliveCells;
  render();
})

gridEl.addEventListener("click", (event) => {
  console.log(event)

  const id = Number(event.target.dataset.id);
  if (aliveCells.includes(id)) {
    // then get rid of the id
    aliveCells = aliveCells.filter(cell => cell !== id)
  } else {
    aliveCells.push(id);
  }

  render();
})

intervalInput.addEventListener("input", (event) => {
  interval = event.target.value;
})