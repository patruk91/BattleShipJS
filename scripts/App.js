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
    const loaderh2 = document.querySelector("#loaderh2");

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
                            loaderh2.remove();
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
