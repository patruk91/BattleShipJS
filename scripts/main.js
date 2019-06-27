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
                    if (gameId !== "") {
                        let listener = dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
                            if(doc.data().status === 'close') {
                                console.log('Start Game');
                                loaderSpin.style.display = "none";
                                loaderH2.innerHTML = "";
                                startGame(listener());
                            }
                        });
                    }
                });
            });
        } else {
            displayPopUp();
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
                    if (gameId !== "") {
                        let listener = dbRef.collection('games').doc(gameId).onSnapshot(function(doc) {
                            if(doc.data().status === 'close') {
                                loaderH2.innerHTML = "";
                                console.log('Start Game');
                                closePopUp();
                                startGame(listener());
                            }
                        });
                    }
                });
            });
        }
    })
}

main();