export default class ShipPlacementController {
  constructor(gameController) {
    this.gameController = gameController;
    this.grid = document.getElementById('placement-grid');
    this.shipList = document.querySelector('.ship-list');
    this.continueButton = document.getElementById('continue-btn');
    this.errorMessage = document.getElementById('error-message');
    this.activeShip = null;
    this.placedShips = new Map();
    this.previewCells = [];
    this.isValidPlacement = false;

    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.grid') && !e.target.closest('.ship')) {
        this.deselectShip();
      }
    });

    this.shipList.addEventListener('click', (e) => {
      const ship = e.target.closest('.ship');
      if (!ship) return;

      if (ship === this.activeShip) {
        this.toggleOrientation(ship);
        return;
      }

      this.deselectShip();
      this.activeShip = ship;
      ship.classList.add('active');
    });

    this.grid.addEventListener('click', (e) => {
      const cell = e.target.closest('.grid-cell');
      if (!cell) return;

      const index = parseInt(cell.dataset.index);
      const shipInfo = this.findShipAtIndex(index);
      console.log('Ship info:', shipInfo);

      if (shipInfo) {
        this.removeShipFromGrid(shipInfo);
        this.deselectShip();
        this.activeShip = document.querySelector(`.ship[data-type="${shipInfo.type}"]`);
        this.activeShip.classList.add('active');
        return;
      }

      if (this.activeShip) {
        if (this.isValidPlacement) {
          this.placeShip(index);
        }
      }
    });

    this.grid.addEventListener('mousemove', (e) => {
      if (!this.activeShip) return;
      const cell = e.target.closest('.grid-cell');
      if (!cell) return;

      const index = parseInt(cell.dataset.index);
      this.updatePreview(index);
    });

    this.grid.addEventListener('mouseleave', () => {
      this.clearPreview();
    });

    this.continueButton.addEventListener('click', () => {
      if (this.placedShips.size < 5) {
        this.errorMessage.style.display = 'block';
        setTimeout(() => {
          this.errorMessage.style.display = 'none';
        }, 3000);
      } else {
        this.gameController.showGameplayScreen();
      }
    });
  }

  toggleOrientation(ship) {
    const orientation = ship.dataset.orientation;
    ship.dataset.orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
    ship.style.flexDirection = orientation === 'horizontal' ? 'column' : 'row';
    if (this.previewCells.length > 0) {
      const lastIndex = parseInt(this.previewCells[0].dataset.index);
      this.updatePreview(lastIndex);
    }
  }

  updatePreview(startIndex) {
    this.clearPreview();

    const size = parseInt(this.activeShip.dataset.size);
    const orientation = this.activeShip.dataset.orientation;
    const cells = this.grid.children;

    this.previewCells = [];
    this.isValidPlacement = true;

    for (let i = 0; i < size; i++) {
      let index = startIndex;
      if (orientation === 'horizontal') {
        index = startIndex + i;
      } else {
        index = startIndex + i * 10;
      }

      if (index >= 100 || (orientation === 'horizontal' && Math.floor(index / 10) !== Math.floor(startIndex / 10))) {
        this.isValidPlacement = false;
        break;
      }

      const cell = cells[index];
      if (cell.classList.contains('occupied')) {
        this.isValidPlacement = false;
      }

      this.previewCells.push(cell);
    }

    this.previewCells.forEach(cell => {
      cell.classList.add('preview', this.isValidPlacement ? 'valid' : 'invalid');
    });
  }

  clearPreview() {
    this.previewCells.forEach(cell => {
      cell.classList.remove('preview', 'valid', 'invalid');
    });
    this.previewCells = [];
    this.isValidPlacement = false;
  }

  placeShip(startIndex) {
    const type = this.activeShip.dataset.type;
    const orientation = this.activeShip.dataset.orientation;
    const size = parseInt(this.activeShip.dataset.size);

    this.previewCells.forEach(cell => {
      cell.classList.add('occupied');
      cell.dataset.shipType = type;
    });

    this.placedShips.set(type, { position: startIndex, orientation, size });

    this.activeShip.remove();
    this.activeShip = null;

    if (this.placedShips.size === 5) {
      this.continueButton.disabled = false;
    }
  }

  findShipAtIndex(index) {
    console.log('Placed ships:', Array.from(this.placedShips.entries()));
    for (const [type, { position, orientation, size }] of this.placedShips) {
      console.log('Finding ship at index:', index, 'for type:', type, 'at position:', position, 'with orientation:', orientation, 'and size:', size);

      const indices = [];
      for (let i = 0; i < size; i++) {
        let idx = position;
        if (orientation === 'horizontal') {
          idx = position + i;
        } else {
          idx = position + i * 10;
        }
        indices.push(idx);
      }

      console.log('Indices occupied by this ship:', indices);
      if (indices.includes(index)) {
        return { type, position, orientation, size };
      }
    }
    return null;
  }

  removeShipFromGrid(shipInfo) {
    console.log('Removing ship from grid:', shipInfo);

    const { type, position, orientation, size } = shipInfo;
    const cells = this.grid.children;

    for (let i = 0; i < size; i++) {
      let index = position;
      if (orientation === 'horizontal') {
        index = position + i;
      } else {
        index = position + i * 10;
      }

      const cell = cells[index];
      if (cell) {
        cell.classList.remove('occupied', 'preview', 'valid', 'invalid');
        delete cell.dataset.shipType;
      }
    }

    this.placedShips.delete(type);

    const shipDiv = document.createElement('div');
    shipDiv.className = 'ship';
    shipDiv.dataset.type = type;
    shipDiv.dataset.size = size;
    shipDiv.dataset.orientation = 'horizontal';
    for (let i = 0; i < size; i++) {
      const shipSegment = document.createElement('div');
      shipSegment.className = 'ship-segment';
      shipDiv.appendChild(shipSegment);
    }
    this.shipList.appendChild(shipDiv);

    this.continueButton.disabled = this.placedShips.size < 5;
  }

  deselectShip() {
    if (this.activeShip) {
      this.activeShip.classList.remove('active');
      this.activeShip = null;
    }
    this.clearPreview();
  }
}