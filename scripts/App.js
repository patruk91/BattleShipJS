let grid = [];
let ships = {
    carrier: [],
    battleship: [],
    cruiser: [],
    submarine: [],
    destroyer: []
};

function createGrid() {
    for(let i = 0; i < 10; i++) {
        addCellToRow(i);
    }
    addShips();
}

function addShips() {
    //carrier
    grid[0][0].cell = 'carrier';
    document.querySelector('#cell_00').classList.add('carrier');
    grid[1][0].cell = 'carrier';
    document.querySelector('#cell_10').classList.add('carrier');
    grid[2][0].cell = 'carrier';
    document.querySelector('#cell_20').classList.add('carrier');
    grid[3][0].cell = 'carrier';
    document.querySelector('#cell_30').classList.add('carrier');
    grid[4][0].cell = 'carrier';
    document.querySelector('#cell_40').classList.add('carrier');

    //battleship
    grid[2][4].cell = 'battleship';
    document.querySelector('#cell_24').classList.add('battleship');
    grid[2][5].cell = 'battleship';
    document.querySelector('#cell_25').classList.add('battleship');
    grid[2][6].cell = 'battleship';
    document.querySelector('#cell_26').classList.add('battleship');
    grid[2][7].cell = 'battleship';
    document.querySelector('#cell_27').classList.add('battleship');

    //cruiser
    grid[6][2].cell = 'cruiser';
    document.querySelector('#cell_62').classList.add('cruiser');
    grid[7][2].cell = 'cruiser';
    document.querySelector('#cell_72').classList.add('cruiser');
    grid[8][2].cell = 'cruiser';
    document.querySelector('#cell_82').classList.add('cruiser');

    //submarine
    grid[5][6].cell = 'submarine';
    document.querySelector('#cell_56').classList.add('submarine');
    grid[5][7].cell = 'submarine';
    document.querySelector('#cell_57').classList.add('submarine');
    grid[5][8].cell = 'submarine';
    document.querySelector('#cell_58').classList.add('submarine');

    //destroyer
    grid[8][9].cell = 'destroyer';
    document.querySelector('#cell_89').classList.add('destroyer');
    grid[9][9].cell = 'destroyer';
    document.querySelector('#cell_99').classList.add('destroyer');
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
    const cellObject = {
        id: `cell_${i}${j}`,
        position: {
            x: i,
            y: j
        },
        contain: 'ocean'
    };

    row.push(cellObject);
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `cell_${i}${j}`;
    document.querySelector('#ship-board').appendChild(cell);
    // cell.addEventListener("click", activateCell);
    return cell;
}

function activateCell() {
    this.classList.add('active');
}

function startGame() {
    createGrid();

}

function main() {
    const loaderSpin = document.querySelector("#loader");
    const loaderH2 = document.querySelector("#loaderh2");


    let userId = '';
    const dbRef = firebase.firestore();
    let gameId = '';

    window.addEventListener("beforeunload", e => {
        firebase.auth().signInAnonymously();
    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
        userId = firebaseUser.uid;

        dbRef.collection('users').doc(userId).set({
            inGame: "",
        })
    });

    dbRef.collection('games').where('status', '==', 'open').get().then(snapshot => {
        if(snapshot.docs.length !== 0) {
            dbRef.collection('games').doc(snapshot.docs[0].id).update({
                player2: userId,
                status: 'close'
            }).then(() => {
                dbRef.collection('users').doc(userId).update({
                    inGame: snapshot.docs[0].id
                });
            }).then(() => {
                dbRef.collection('users').doc(userId).get().then(gameName => {
                    gameId = gameName.data().inGame;
                }).then(() => {
                    dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
                        if(doc.data().status === 'close') {
                            console.log('Start Game');
                            loaderSpin.style.display = "none";
                            loaderH2.remove();
                            startGame(userId);
                        }
                    });
                });
            });
        } else {
            loaderSpin.className = "loader";
                dbRef.collection('games').add({
                player1: userId,
                player2: '',
                sequence: userId,
                status: 'open'
            }).then(docRef => {
                dbRef.collection('users').doc(userId).update({
                    inGame: docRef.id
                });
            }).then(() => {
                dbRef.collection('users').doc(userId).get().then(gameName => {
                    gameId = gameName.data().inGame;
                }).then(() => {
                    dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
                        if(doc.data().status === 'close') {
                            loaderSpin.style.display = "none";
                            loaderH2.remove();
                            console.log('Start Game');
                            startGame();
                        }
                    });
                });
            });
        }
    })
}

main();
