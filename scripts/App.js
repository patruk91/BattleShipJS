let shipsGrid = [];
let ships = {
    carrier: [],
    battleship: [],
    cruiser: [],
    submarine: [],
    destroyer: []
};

function createGrid(boardId) {
    for(let i = 0; i < 10; i++) {
        addCellToRow(i, boardId);
    }
}

function addShips() {
    //carrier
    shipsGrid[0][0].cell = 'carrier';
    document.querySelector('#cell_00').classList.add('carrier');
    shipsGrid[1][0].cell = 'carrier';
    document.querySelector('#cell_10').classList.add('carrier');
    shipsGrid[2][0].cell = 'carrier';
    document.querySelector('#cell_20').classList.add('carrier');
    shipsGrid[3][0].cell = 'carrier';
    document.querySelector('#cell_30').classList.add('carrier');
    shipsGrid[4][0].cell = 'carrier';
    document.querySelector('#cell_40').classList.add('carrier');

    //battleship
    shipsGrid[2][4].cell = 'battleship';
    document.querySelector('#cell_24').classList.add('battleship');
    shipsGrid[2][5].cell = 'battleship';
    document.querySelector('#cell_25').classList.add('battleship');
    shipsGrid[2][6].cell = 'battleship';
    document.querySelector('#cell_26').classList.add('battleship');
    shipsGrid[2][7].cell = 'battleship';
    document.querySelector('#cell_27').classList.add('battleship');

    //cruiser
    shipsGrid[6][2].cell = 'cruiser';
    document.querySelector('#cell_62').classList.add('cruiser');
    shipsGrid[7][2].cell = 'cruiser';
    document.querySelector('#cell_72').classList.add('cruiser');
    shipsGrid[8][2].cell = 'cruiser';
    document.querySelector('#cell_82').classList.add('cruiser');

    //submarine
    shipsGrid[5][6].cell = 'submarine';
    document.querySelector('#cell_56').classList.add('submarine');
    shipsGrid[5][7].cell = 'submarine';
    document.querySelector('#cell_57').classList.add('submarine');
    shipsGrid[5][8].cell = 'submarine';
    document.querySelector('#cell_58').classList.add('submarine');

    //destroyer
    shipsGrid[8][9].cell = 'destroyer';
    document.querySelector('#cell_89').classList.add('destroyer');
    shipsGrid[9][9].cell = 'destroyer';
    document.querySelector('#cell_99').classList.add('destroyer');
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
        let row = [];
        for (let j = 0; j < 10; j++) {
            const cellObject = {
                id: `cell_${i}${j}`,
                position: {
                    x: i,
                    y: j
                },
                contain: 'ocean'
            };
            row.push(cellObject);
        }
        shipsGrid.push(row);
    }
}

function createCell(i, j, boardId) {
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `cell_${i}${j}`;
    document.querySelector(`#${boardId}`).appendChild(cell);
    cell.addEventListener("click", activateCell);
    return cell;
}

function activateCell() {
    this.classList.add('active');
}


function startGame() {
    createGrid("ship-board");
    createCellObject();
    addShips();
    createGrid("shoot-board");


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
                    let listener = dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
                        console.log("test");
                        if(doc.data().status === 'close') {
                            console.log('Start Game');
                            loaderSpin.style.display = "none";
                            loaderH2.remove();
                            startGame(listener());
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
                    let listener = dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
                        console.log("test");
                        if(doc.data().status === 'close') {
                            loaderSpin.style.display = "none";
                            loaderH2.remove();
                            console.log('Start Game');
                            startGame(listener());
                        }
                    });
                });
            });
        }
    })
}

main();
