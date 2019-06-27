function logInUser() {
    userId = "player1" + Math.floor(Math.random() * 1000000);
    dbRef.collection('users').doc(userId).set({
        inGame: "",
    })

}

function endMatchmaking() {
    let listener = dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
        if(doc.data().status === 'close') {
            console.log('Start Game');
            document.querySelector("#loaderh2").innerHTML = "";
            startGame(listener());
        }
    });
}

function handleConnectionWithNoGameOpen(snapshot, loaderH2, loaderSpin) {
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
            if (gameId !== "") {
                endMatchmaking();
            }
        });
    });
}

function handleConnectionToExistingGame(loaderSpin) {
    displayPopUp();
    document.querySelector("#loader").className = "loader";
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
            if (gameId !== "") {
                endMatchmaking();
            }
        });
    });
}

function matchmaking() {
    dbRef.collection('games').where('status', '==', 'open').get().then(snapshot => {
        if (snapshot.docs.length !== 0) {
            handleConnectionWithNoGameOpen(snapshot);
        }
        else {
            handleConnectionToExistingGame();
        }
    });
}