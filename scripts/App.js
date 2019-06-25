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
    cell.addEventListener("click", activateCell);
    return cell;
}

function activateCell() {
    this.classList.add('active');
}

function createGame(gameCollection, userId, dbRef) {
    gameCollection.add({
        player1: userId,
        player2: '',
        sequence: userId,
        status: 'open'
    }).then(docRef => {
        dbRef.collection('users').doc(userId).update({
            inGame: docRef.id
        })
    })
}

function addPlayer(gameCollection, docOfAllActiveGames, userId) {
    const firstActiveGame = docOfAllActiveGames[0];
    gameCollection.doc(firstActiveGame.id).update({
        player2: userId,
        status: 'close'
    });
}

function userSignIn() {
    window.addEventListener("beforeunload", e => {
        firebase.auth().signInAnonymously();
    });
}

function main() {
    userSignIn();
    let userId = "";
    const dbRef = firebase.firestore();
    createGrid();


    firebase.auth().onAuthStateChanged(user => {
        userId = user.uid;
        dbRef.collection('users').doc(userId).set({
            inGame: "",
        })
    });


    const gameCollection = dbRef.collection('games');
    gameCollection.where('status', '==', 'open').get().then(snapshot => {
        const docOfAllActiveGames = snapshot.docs;
        if(docOfAllActiveGames.length !== 0) {
            addPlayer(gameCollection, docOfAllActiveGames, userId);
            dbRef.collection('users').doc(userId).update({
                inGame: snapshot.docs[0].id
            })
        } else {
            createGame(gameCollection, userId, dbRef);
        }
    })

}

main();
