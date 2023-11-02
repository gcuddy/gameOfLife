const leftEdge = [1, 7, 13, 19, 25, 31];
const rightEdge = [6, 12, 18, 24, 30, 36];
const topEdge = [1, 2, 3, 4, 5, 6];
const bottomEdge = [31, 32, 33, 34, 35, 36];

const grid = [1, 2, 3, 4, 5, 6,
  7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36];

const initialAliveCells = [21, 22, 23, 17, 10];

let aliveCells = [...initialAliveCells];
const isAlive = (num) => aliveCells.includes(num)

const gridEl = document.getElementById("grid");
const button = document.getElementById("start-stop-button");
const resetButton = document.getElementById("reset-button");

function init() {
  for (let i = 1; i <= grid.length; i++) {
    const div = document.createElement('div');
    div.classList.add("cell");
    div.setAttribute("data-id", i)
    // div.textContent = i;
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
    let above = i - 6;
    if (above > 0) {
      neighbors.push(above);
    }
    let below = i + 6;
    if (below <= 36) {
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
      let topLeft = i - 7;
      neighbors.push(topLeft);
    }
    if (!topEdge.includes(i) && !rightEdge.includes(i)) {
      let topRight = i - 5;
      neighbors.push(topRight);
    }
    if (!bottomEdge.includes(i) && !leftEdge.includes(i)) {
      let bottomLeft = i + 5;
      neighbors.push(bottomLeft);
    }
    if (!bottomEdge.includes(i) && !rightEdge.includes(i)) {
      let bottomRight = i + 7;
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
    }, 1000);
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