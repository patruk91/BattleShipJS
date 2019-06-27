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
        let y = coordinates.x - 1;
        let x = coordinates.y - 1;
        for (let startY = 0; startY < totalLinesToCheck; startY++) {
            for (let startX = 0; startX < squaresInLineToCheck; startX++) {
                if (y >= 0 && y < 10 && x >= 0 && x < 10) {
                    if (shipsGrid[`cell_${y}${x}`].contain !== "ocean") {
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
