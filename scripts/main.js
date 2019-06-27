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
    logInUser();
    matchmaking();
}

main();