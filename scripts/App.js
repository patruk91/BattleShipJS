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
};

let shipsGrid = {};
let shootsGrid = {};
let ships = {
    carrier: [1 ,1 ,1 ,1 ,1],
    battleship: [1 ,1 ,1 ,1],
    cruiser: [1 ,1 ,1],
    submarine: [1 ,1 ,1],
    destroyer: [1 ,1],
    areAllShipSunk: function () {
        return this.carrier.length + this.battleship.length + this.cruiser.length + this.submarine.length + this.destroyer;
    }
};

function createGrid(boardId) {
    for(let i = 0; i < 10; i++) {
        addCellToRow(i, boardId);
    }
}

function addShips() {
    //carrier
    shipsGrid["cell_00"].contain = 'carrier';
    document.querySelector('#cell_00').classList.add('carrier');
    shipsGrid["cell_10"].contain = 'carrier';
    document.querySelector('#cell_10').classList.add('carrier');
    shipsGrid["cell_20"].contain = 'carrier';
    document.querySelector('#cell_20').classList.add('carrier');
    shipsGrid["cell_30"].contain = 'carrier';
    document.querySelector('#cell_30').classList.add('carrier');
    shipsGrid["cell_40"].contain = 'carrier';
    document.querySelector('#cell_40').classList.add('carrier');

    //battleship
    shipsGrid["cell_24"].contain = 'battleship';
    document.querySelector('#cell_24').classList.add('battleship');
    shipsGrid["cell_25"].contain = 'battleship';
    document.querySelector('#cell_25').classList.add('battleship');
    shipsGrid["cell_26"].contain = 'battleship';
    document.querySelector('#cell_26').classList.add('battleship');
    shipsGrid["cell_27"].contain = 'battleship';
    document.querySelector('#cell_27').classList.add('battleship');

    //cruiser
    shipsGrid["cell_62"].contain = 'cruiser';
    document.querySelector('#cell_62').classList.add('cruiser');
    shipsGrid["cell_72"].contain = 'cruiser';
    document.querySelector('#cell_72').classList.add('cruiser');
    shipsGrid["cell_82"].contain = 'cruiser';
    document.querySelector('#cell_82').classList.add('cruiser');

    //submarine
    shipsGrid["cell_56"].contain = 'submarine';
    document.querySelector('#cell_56').classList.add('submarine');
    shipsGrid["cell_57"].contain = 'submarine';
    document.querySelector('#cell_57').classList.add('submarine');
    shipsGrid["cell_58"].contain = 'submarine';
    document.querySelector('#cell_58').classList.add('submarine');

    //destroyer
    shipsGrid["cell_89"].contain = 'destroyer';
    document.querySelector('#cell_89').classList.add('destroyer');
    shipsGrid["cell_99"].contain = 'destroyer';
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
    cell.addEventListener("click", shoot);
    return cell;
}

function shoot() {
    x.a = this.id;
}


function showGameOverScreen(user) {
    if(user == userId) {
        alert("You win!");
    } else {
        alert("You lost!");
    }
}

function startGame() {
    createGrid("ship-board");
    createCellObject();
    addShips();
    createGrid("shoot-board");
    createShootObject();
    const h2Tag = document.querySelector("#loaderh2");

    let gameControlListener = dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
        if(doc.data().sequence === userId && doc.data().phase === 'shoot') {
            console.log('Phase shoot: Change phase to test-shoot');             //////TODO: remove
            h2Tag.innerHTML = "Shoot";
            x.registerListener(function(val) {
                dbRef.collection('games').doc(gameId).update({
                    coordinates: val,
                    phase: "test-shoot"
                });
              });
                            
        } else if(doc.data().sequence !== userId && doc.data().phase === 'test-shoot') {
            console.log("phase test-shoot: change phase to mark");             //////TODO: remove
            let isGameOver = false;
            let coordinates = doc.data().coordinates;
            let shipCellContain = shipsGrid[coordinates].contain;
            if (shipCellContain === "ocean") {
                shootsGrid[coordinates].contain = "miss";
            } else {
                shootsGrid[coordinates].contain = shipCellContain;
                ships[shipCellContain].pop();
                if (ships.areAllShipSunk() == 0) {
                    isGameOver = true;
                }
            }
            dbRef.collection('games').doc(gameId).update({
                phase: "mark",
                shootGrid: JSON.stringify(shootsGrid),
                gameEnd: isGameOver
            }).then(() => {
                if(isGameOver) {
                    showGameOverScreen(doc.data().sequence);
                }
            });
        } else if(doc.data().sequence === userId && doc.data().phase === 'mark') {
            let player2Id = getPlayer2Id(doc);
            console.log("phase mark: change sequence to player 2, change phase to shoot");             //////TODO: remove
            renderShootsGrid(JSON.parse(doc.data().shootGrid));
            if(doc.data().gameEnd == true) {
                showGameOverScreen();
            } else {
                dbRef.collection('games').doc(gameId).update({
                    phase: "shoot",
                    coordinates: '',
                    shootGrid: '',
                    sequence: player2Id
                });
            }
        }
    });
}

function renderShootsGrid(shootObject) {
    Object.keys(shootObject).forEach(function(cellId) {
        document.querySelector(`#shoot-board #${cellId}`).classList.add(shootObject[cellId].contain);
    });
}

function getPlayer2Id(doc) {
    if(doc.data().player1 === userId) {
        return doc.data().player2;
    }
    return doc.data().player1;
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
                            loaderH2.innerHTML = "";
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
                            loaderH2.innerHTML = "";
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
