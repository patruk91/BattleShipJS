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