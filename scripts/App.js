function shoot(event) {
    x.a = event.target.id;
}

function startGame() {
    createUI();
    handleGamePhases();
}

function handleGamePhases() {
    dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
        if(isPlayerWaitingForOponentShoot(doc)) {
            handlePlayerWaitingForOponentShoot();
        } else if(isPlayerTurnToShoot(doc)) {
            handlePlayerShootPhase();          
        } else if(shouldPlayerTestOponentShoot(doc)) {
            handleTestingOponentShoot(doc);
        } else if(shouldPlayerRenderShootsAndEndRound(doc)) {
            handleRenderShoot(doc);
            endRoundOrEndGame(doc);
        }
    });
}

function endRoundOrEndGame(doc) {
    if (doc.data().gameEnd == true) {
        showGameOverScreen(doc.data().sequence);
    }
    else {
        updateDatabaseToEndRound(doc);
    }
}

function updateDatabaseToEndRound(doc) {
    let player2Id = getPlayer2Id(doc);
    dbRef.collection('games').doc(gameId).update({
        phase: "shoot",
        coordinates: '',
        shootGrid: '',
        sequence: player2Id
    });
}

function handleRenderShoot(doc) {
    console.log("phase mark: change sequence to player 2, change phase to shoot");
    renderShootsGrid(JSON.parse(doc.data().shootGrid));
}

function handleTestingOponentShoot(doc) {
    console.log("phase test-shoot: change phase to mark");
    let isGameOver = false;
    let coordinates = doc.data().coordinates;
    isGameOver = markShootBasedOnCoordiantes(coordinates, isGameOver);
    sendShootGreedToDatabase(isGameOver, doc);
}

function sendShootGreedToDatabase(isGameOver, doc) {
    dbRef.collection('games').doc(gameId).update({
        phase: "mark",
        shootGrid: JSON.stringify(shootsGrid),
        gameEnd: isGameOver
    }).then(() => {
        if (isGameOver) {
            showGameOverScreen(doc.data().sequence);
        }
    });
}

function markShootBasedOnCoordiantes(coordinates, isGameOver) {
    let shipCellContain = shipsGrid[coordinates].contain;
    if (shipCellContain === "ocean") {
        shootsGrid[coordinates].contain = "miss";
    }
    else {
        markShipAfterHit(coordinates, shipCellContain);
        isGameOver = testIfGameIsOver(isGameOver);
    }
    return isGameOver;
}

function markShipAfterHit(coordinates, shipCellContain) {
    shootsGrid[coordinates].contain = shipCellContain;
    ships[shipCellContain].pop();
}

function testIfGameIsOver(isGameOver) {
    if (ships.areAllShipSunk() == 0) {
        isGameOver = true;
    }
    return isGameOver;
}

function shouldPlayerRenderShootsAndEndRound(doc) {
    return doc.data().sequence === userId && doc.data().phase === 'mark';
}

function shouldPlayerTestOponentShoot(doc) {
    return doc.data().sequence !== userId && doc.data().phase === 'test-shoot';
}

function isPlayerTurnToShoot(doc) {
    return doc.data().sequence === userId && doc.data().phase === 'shoot';
}

function isPlayerWaitingForOponentShoot(doc) {
    return doc.data().sequence !== undefined && doc.data().sequence !== userId && doc.data().phase === 'shoot';
}

function handlePlayerShootPhase() {
    startShootPhase();
    x.registerListener(function (val) {
        updateGameInFirebaseAfterShoot(val);
    });
}

function updateGameInFirebaseAfterShoot(val) {
    dbRef.collection('games').doc(gameId).update({
        coordinates: val,
        phase: "test-shoot"
    });
}

function startShootPhase() {
    closePopUp();
    console.log('Phase shoot: Change phase to test-shoot');
    document.querySelector("#loaderh2").innerHTML = "Shoot";
}

function handlePlayerWaitingForOponentShoot() {
    document.querySelector("#loaderh2").innerHTML = "Waiting for second player";
    displayPopUp();
}

function createUI() {
    createGrid("ship-board");
    createCellObject();
    addShips();
    createGrid("shoot-board");
    createShootObject();
}

function getPlayer2Id(doc) {
    if(doc.data().player1 === userId) {
        return doc.data().player2;
    }
    return doc.data().player1;
}