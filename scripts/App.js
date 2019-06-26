let userId = '';
const dbRef = firebase.firestore();
let gameId = '';
x = {
    aInternal: 0,
    aListener: function(val) {},
    set a(val) {
      this.aInternal = val;
      this.aListener(val);
    },
    get a() {
      return this.aInternal;
    },
    registerListener: function(listener) {
      this.aListener = listener;
    }
}

let shipsGrid = [];
let shootsGrid = [];
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
    shipsGrid[0][0].contain = 'carrier';
    document.querySelector('#cell_00').classList.add('carrier');
    shipsGrid[1][0].contain = 'carrier';
    document.querySelector('#cell_10').classList.add('carrier');
    shipsGrid[2][0].contain = 'carrier';
    document.querySelector('#cell_20').classList.add('carrier');
    shipsGrid[3][0].contain = 'carrier';
    document.querySelector('#cell_30').classList.add('carrier');
    shipsGrid[4][0].contain = 'carrier';
    document.querySelector('#cell_40').classList.add('carrier');

    //battleship
    shipsGrid[2][4].contain = 'battleship';
    document.querySelector('#cell_24').classList.add('battleship');
    shipsGrid[2][5].contain = 'battleship';
    document.querySelector('#cell_25').classList.add('battleship');
    shipsGrid[2][6].contain = 'battleship';
    document.querySelector('#cell_26').classList.add('battleship');
    shipsGrid[2][7].contain = 'battleship';
    document.querySelector('#cell_27').classList.add('battleship');

    //cruiser
    shipsGrid[6][2].contain = 'cruiser';
    document.querySelector('#cell_62').classList.add('cruiser');
    shipsGrid[7][2].contain = 'cruiser';
    document.querySelector('#cell_72').classList.add('cruiser');
    shipsGrid[8][2].contain = 'cruiser';
    document.querySelector('#cell_82').classList.add('cruiser');

    //submarine
    shipsGrid[5][6].contain = 'submarine';
    document.querySelector('#cell_56').classList.add('submarine');
    shipsGrid[5][7].contain = 'submarine';
    document.querySelector('#cell_57').classList.add('submarine');
    shipsGrid[5][8].contain = 'submarine';
    document.querySelector('#cell_58').classList.add('submarine');

    //destroyer
    shipsGrid[8][9].contain = 'destroyer';
    document.querySelector('#cell_89').classList.add('destroyer');
    shipsGrid[9][9].contain = 'destroyer';
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

function createShootObject() {
    for(let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cellObject = {
                id: `cell_${i}${j}`,
                contain: 'ocean'
            };
            shootsGrid.push(cellObject);
        }
    }
}

function createCell(i, j, boardId) {
    let cell = document.createElement('div');
    cell.className = 'ocean';
    cell.id = `cell_${i}${j}`;
    document.querySelector(`#${boardId}`).appendChild(cell);
    cell.addEventListener("click", shoot);
    return cell;
}

function shoot() {
    x.a = shootsGrid.find(x => x.id === this.id);
}


function startGame() {
    createGrid("ship-board");
    createCellObject();
    addShips();
    createGrid("shoot-board");
    createShootObject();
    
    let gameControlListener = dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
        if(doc.data().sequence === userId && doc.data().phase == 'shoot') {
            // console.log('Phase shoot: Change phase to test-shoot');
            x.registerListener(function(val) {
                dbRef.collection('games').doc(gameId).update({
                    coordinates: val.id,
                    phase: "test-shoot"
                });
              });
                            
        } else if(doc.data().sequence !== userId && doc.data().phase == 'test-shoot') {
            // console.log("phase test-shoot: change phase to mark");
        } else if(doc.data().sequence === userId && doc.data().phase == 'mark') {
            // console.log("phase mark: change sequence to player 2, change phase to shoot");
        }
    });
}

function main() {
    const loaderSpin = document.querySelector("#loader");
    const loaderH2 = document.querySelector("#loaderh2");

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
                phase: 'shoot',
                coordinates: '',
                shootGrid: '',
                gameEnd: false,
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
