function getRandomNumber() {
    return Math.floor(Math.random() * 9);
}

function getRandomDirection() {
    let range = Math.round(Math.random());
    if (range === 0) {
        return "h";
    } else {
        return "v";
    }
}



function placesShips() {
    let numbersOfShips = 5;
    let shipsArrayNames = Object.keys(ships);
    shipsArrayNames.pop();


    for (let i = 0; i < numbersOfShips; i++) {
        let isShipPlaced = false;
        while (!isShipPlaced) {
            let coordinates = {};
            coordinates.x = getRandomNumber();
            coordinates.y = getRandomNumber();
            let shipLength = ships[shipsArrayNames[i]].length;
            let direction = getRandomDirection();
            if (testShipPlacement(coordinates, shipLength, direction)) {
                isShipPlaced = true;
                for (let k = 0; k < shipLength; k++) {
                    shipsGrid[`cell_${coordinates.x}${coordinates.y}`].contain = shipsArrayNames[i];
                    if (direction === "h") {
                        coordinates.y += 1;
                    } else {
                        coordinates.x += 1;
                    }
                }
            }
        }
    }
}

function testShipPlacement(coordinates, shipLength, direction) {
    if (checkIfShipInMap(coordinates, shipLength, direction)) {
        let EXTRA_SQUARES = 2;
        let totalLinesToCheck = getLinesToCheck(direction, shipLength, EXTRA_SQUARES);
        let squaresInLineToCheck = getSquaresToCheck(direction, shipLength, EXTRA_SQUARES);
        let y = coordinates.x;
        let x = coordinates.y;
        for (let startY = 0; startY < totalLinesToCheck; startY++) {
            for (let startX = 0; startX < squaresInLineToCheck; startX++) {
                if (0 <= y && y <10 && 0 <= x && x < 10) {
                    if (shipsGrid[`cell_${y}${x}`] === "ocean") {
                        // or StartY, StartX
                        return false;
                    }
                }
                x++;
            }
            x = coordinates.y - 1;
            y++;
        }
        return true;
    }
    return false;
}
function getLinesToCheck(direction, shipLength, extraSquares) {
    let HORIZONTAL_LINES_TO_CHECK = 3;
    if (direction === "h") {
        return HORIZONTAL_LINES_TO_CHECK;
    } else {
        return shipLength + extraSquares;
    }
}

function getSquaresToCheck(direction, shipLength, extraSquares) {
    let VERTICAL_SQUARES_TO_CHECK = 3;
    if (direction === "h") {
        return shipLength + extraSquares;
    } else {
        return VERTICAL_SQUARES_TO_CHECK;
    }
}

function checkIfShipInMap(coordinates, length, direction) {
    let BORDER = 10;
    if (direction === "h") {
        return (coordinates.y + length) < BORDER;
    } else if (direction === "v") {
        return (coordinates.x + length) < BORDER;
    } else {
        return false;
    }
}


function addShips() {



    // console.log(getRandomNumber());

    // //carrier
    // shipsGrid["cell_00"].contain = 'carrier';
    // document.querySelector('#cell_00').classList.add('carrier');
    // shipsGrid["cell_10"].contain = 'carrier';
    // document.querySelector('#cell_10').classList.add('carrier');
    // shipsGrid["cell_20"].contain = 'carrier';
    // document.querySelector('#cell_20').classList.add('carrier');
    // shipsGrid["cell_30"].contain = 'carrier';
    // document.querySelector('#cell_30').classList.add('carrier');
    // shipsGrid["cell_40"].contain = 'carrier';
    // document.querySelector('#cell_40').classList.add('carrier');
    //
    // //battleship
    // shipsGrid["cell_24"].contain = 'battleship';
    // document.querySelector('#cell_24').classList.add('battleship');
    // shipsGrid["cell_25"].contain = 'battleship';
    // document.querySelector('#cell_25').classList.add('battleship');
    // shipsGrid["cell_26"].contain = 'battleship';
    // document.querySelector('#cell_26').classList.add('battleship');
    // shipsGrid["cell_27"].contain = 'battleship';
    // document.querySelector('#cell_27').classList.add('battleship');
    //
    // //cruiser
    // shipsGrid["cell_62"].contain = 'cruiser';
    // document.querySelector('#cell_62').classList.add('cruiser');
    // shipsGrid["cell_72"].contain = 'cruiser';
    // document.querySelector('#cell_72').classList.add('cruiser');
    // shipsGrid["cell_82"].contain = 'cruiser';
    // document.querySelector('#cell_82').classList.add('cruiser');
    //
    // //submarine
    // shipsGrid["cell_56"].contain = 'submarine';
    // document.querySelector('#cell_56').classList.add('submarine');
    // shipsGrid["cell_57"].contain = 'submarine';
    // document.querySelector('#cell_57').classList.add('submarine');
    // shipsGrid["cell_58"].contain = 'submarine';
    // document.querySelector('#cell_58').classList.add('submarine');
    //
    // //destroyer
    // shipsGrid["cell_89"].contain = 'destroyer';
    // document.querySelector('#cell_89').classList.add('destroyer');
    // shipsGrid["cell_99"].contain = 'destroyer';
    // document.querySelector('#cell_99').classList.add('destroyer');
}