import Gameboard from '../models/board.js';
import Ship from '../models/ship.js';

export default class GameplayController {
  constructor(gameController, playerShips) {
    this.gameController = gameController;
    this.playerBoard = new Gameboard();
    this.enemyBoard = new Gameboard();
    this.currentPlayer = 'player'; // 'player' or 'enemy'
    this.gameOver = false;

    // Place Player 1's ships (from ShipPlacementController)
    playerShips.forEach(([type, { position, orientation }]) => {
      const row = Math.floor(position / 10);
      const col = position % 10;
      const shipSizes = { carrier: 5, battleship: 4, submarine: 3, cruiser: 3, destroyer: 2 };
      const ship = new Ship(type, shipSizes[type]);
      this.playerBoard.placeShip(ship, row, col, orientation);
    });

    // Place Player 2's (enemy) ships randomly
    const enemyShips = [
      { type: 'carrier', length: 5 },
      { type: 'battleship', length: 4 },
      { type: 'submarine', length: 3 },
      { type: 'cruiser', length: 3 },
      { type: 'destroyer', length: 2 },
    ];
    enemyShips.forEach(({ type, length }) => {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const ship = new Ship(type, length);
        placed = this.enemyBoard.placeShip(ship, row, col, orientation);
      }
    });

    this.init();
  }

  init() {
    // Render Player 1's board (show ships)
    const playerGrid = document.getElementById('player-grid');
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const index = row * 10 + col;
        const cell = playerGrid.children[index];
        if (this.playerBoard.grid[row][col] instanceof Ship) {
          cell.classList.add('occupied');
        }
      }
    }

    // Add click event listener to enemy grid for attacks
    const enemyGrid = document.getElementById('enemy-grid');
    enemyGrid.addEventListener('click', (e) => {
      if (this.gameOver || this.currentPlayer !== 'player') return;
      const cell = e.target.closest('.grid-cell');
      if (!cell) return;

      const index = parseInt(cell.dataset.index);
      const row = Math.floor(index / 10);
      const col = index % 10;

      this.playerAttack(row, col, cell);
    });
  }

  playerAttack(row, col, cell) {
    const hit = this.enemyBoard.receiveAttack(row, col);
    cell.classList.add(hit ? 'hit' : 'miss');

    const sunkShipType = this.enemyBoard.getSunkShip(row, col);
    if (sunkShipType) {
      alert(`Enemy's ${sunkShipType} has been sunk!`);
    }

    if (this.enemyBoard.allShipsSunk()) {
      this.gameOver = true;
      alert('Player 1 Wins!');
      this.gameController.showGameOverScreen('Player 1');
      return;
    }

    this.currentPlayer = 'enemy';
    document.getElementById('turn-message').textContent = "Enemy's Turn";

    setTimeout(() => this.enemyAttack(), 1000);
  }

  enemyAttack() {
    if (this.gameOver) return;

    let row, col, cell;
    do {
      const index = Math.floor(Math.random() * 100);
      row = Math.floor(index / 10);
      col = index % 10;
      cell = document.getElementById('player-grid').children[index];
    } while (typeof this.playerBoard.grid[row][col] === 'string');

    const hit = this.playerBoard.receiveAttack(row, col);
    cell.classList.add(hit ? 'hit' : 'miss');

    const sunkShipType = this.playerBoard.getSunkShip(row, col);
    if (sunkShipType) {
      alert(`Your ${sunkShipType} has been sunk!`);
    }

    if (this.playerBoard.allShipsSunk()) {
      this.gameOver = true;
      alert('Enemy Wins!');
      this.gameController.showGameOverScreen('Enemy');
      return;
    }

    this.currentPlayer = 'player';
    document.getElementById('turn-message').textContent = "Player 1's Turn";
  }
}