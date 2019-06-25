const grid = [];

function createGrid() {
    for(let i = 0; i < 10; i++) {
        addCellToRow(i);
    }
}

function addCellToRow(i) {
    let row = [];
    const rowCells = document.createElement("div");
    rowCells.className = "row";
    const board = document.querySelector(".grid");

    for (let j = 0; j < 10; j++) {
        let cell = createCell(row, i, j);
        rowCells.appendChild(cell);
    }
    board.appendChild(rowCells);
    grid.push(row);

}

function createCell(row, i, j) {
    row.push(`cell_${i}${j}`);
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `cell_${i}${j}`;
    document.querySelector('#ship-board').appendChild(cell);
    cell.addEventListener("click", activateCell);
    return cell;
}

function activateCell() {
    this.classList.add('active');
}

function main() {
    createGrid();
}

main();