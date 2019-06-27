function shoot(event) {
    x.a = event.target.id;
}

function startGame() {
    createGrid("ship-board");
    createCellObject();
    addShips();
    createGrid("shoot-board");
    createShootObject();
    const h2Tag = document.querySelector("#loaderh2");

    let gameControlListener = dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
        if(doc.data().sequence !== undefined && doc.data().sequence !== userId && doc.data().phase === 'shoot') {
            h2Tag.innerHTML = "Waiting for second player";
            displayPopUp();
        }
        if(doc.data().sequence === userId && doc.data().phase === 'shoot') {
            closePopUp();
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
                showGameOverScreen(doc.data().sequence);
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

function getPlayer2Id(doc) {
    if(doc.data().player1 === userId) {
        return doc.data().player2;
    }
    return doc.data().player1;
}