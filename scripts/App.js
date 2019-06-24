const grid = [];

function createGrid() {
    for(let i = 0; i < 10; i++) {
        addCellToRow(i);
    }
}

function addCellToRow(i) {
    let row = [];
    for (let j = 0; j < 10; j++) {
        createCell(row, i, j);
    }
    grid.push(row);
}

function createCell(row, i, j) {
    row.push(`cell_${i}${j}`);
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `cell_${i}${j}`;
    document.querySelector('#ship-board').appendChild(cell);
    cell.addEventListener("click", activateCell);
}

function activateCell() {
    this.classList.add('active');
}

function main() {
    createGrid();
}

main();