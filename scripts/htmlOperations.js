function displayPopUp() {
    let modal = document.getElementById("modal");
    modal.style.display = "block";
    let loader = document.querySelector('#loader');
    loader.className = "loader";
}

function closePopUp() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";
}

function renderShootsGrid(shootObject) {
    Object.keys(shootObject).forEach(function(cellId) {
        document.querySelector(`#shoot-board #${cellId}`).classList.add(shootObject[cellId].contain);
    });
}

function renderShipsGrid(shipsObject) {
    Object.keys(shipsObject).forEach(function (cellId) {
        document.querySelector(`#ship-board #${cellId}`).classList.add(shipsObject[cellId].contain);
    });
}

function createGrid(boardId) {
    for(let i = 0; i < 10; i++) {
        addCellToRow(i, boardId);
    }
    if(boardId === "shoot-board"){
        document.querySelector(`#${boardId}`).addEventListener("click", shoot);
    }
}

function addCellToRow(i, boardId) {
    const rowCells = document.createElement("div");
    rowCells.className = "row";
    const board = document.querySelector(`#${boardId}`);

    for (let j = 0; j < 10; j++) {
        let cell = createCell(i, j, boardId);
        rowCells.appendChild(cell);
    }
    board.appendChild(rowCells);
}

function createCellObject() {
    for(let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            shipsGrid[`cell_${i}${j}`] = {
                contain: 'ocean'
            };
        }
    }
}

function createShootObject() {
    for(let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            shootsGrid[`cell_${i}${j}`] = {
                contain: 'ocean'
            };
        }
    }
}

function createCell(i, j, boardId) {
    let cell = document.createElement('div');
    cell.className = 'ocean';
    cell.id = `cell_${i}${j}`;
    document.querySelector(`#${boardId}`).appendChild(cell);
    return cell;
}

function showGameOverScreen(user) {
    if(user == userId) {
        alert("You win!");
    } else {
        alert("You lost!");
    }
}