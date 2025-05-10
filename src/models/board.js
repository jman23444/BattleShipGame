export default class Gameboard {
    constructor() {
      this.grid = Array(10).fill().map(() => Array(10).fill(null));
      this.ships = [];
    }
  
    placeShip(ship, startRow, startCol, orientation) {
      const positions = [];
      for (let i = 0; i < ship.length; i++) {
        const row = orientation === 'horizontal' ? startRow : startRow + i;
        const col = orientation === 'horizontal' ? startCol + i : startCol;
        if (row >= 10 || col >= 10 || this.grid[row][col] !== null) {
          return false; // Invalid placement
        }
        positions.push({ row, col });
      }
  
      positions.forEach(({ row, col }) => {
        this.grid[row][col] = ship;
      });
      this.ships.push({ ship, positions });
      return true;
    }
  
    receiveAttack(row, col) {
      if (row < 0 || row >= 10 || col < 0 || col >= 10) {
        return false;
      }
      const cell = this.grid[row][col];
      if (typeof cell === 'string') {
        return false; // Already attacked
      }
      if (cell === null) {
        this.grid[row][col] = 'miss';
        return false;
      }
      cell.hit();
      this.grid[row][col] = 'hit';
      return true;
    }
  
    allShipsSunk() {
      return this.ships.every(({ ship }) => ship.isSunk());
    }
  
    getSunkShip(row, col) {
      if (this.grid[row][col] !== 'hit') {
        return null;
      }
      const shipEntry = this.ships.find(({ ship, positions }) =>
        positions.some(pos => pos.row === row && pos.col === col)
      );
      if (shipEntry && shipEntry.ship.isSunk()) {
        return shipEntry.ship.type;
      }
      return null;
    }
  }