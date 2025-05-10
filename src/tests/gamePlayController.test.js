import { fireEvent } from '@testing-library/dom';
import renderGameView from '../views/gameView.js';
import GameplayController from '../controllers/gamePlayController.js';
import Gameboard from '../models/board.js';
import Ship from '../models/ship.js';

describe('GameplayController', () => {
  let gameControllerMock;
  let container;
  let gameplayController;

  beforeEach(() => {
    // Mock timers to control setTimeout
    jest.useFakeTimers();

    // Mock the global alert function
    global.alert = jest.fn();

    // Mock GameController
    gameControllerMock = {
      showGameOverScreen: jest.fn(),
    };

    // Mock player ships (simulating output from ShipPlacementController)
    const playerShips = [
      ['destroyer', { position: 0, orientation: 'horizontal', size: 2 }],
    ];

    // Render the game view
    container = renderGameView();
    document.body.appendChild(container);

    // Mock Gameboard.placeShip to control enemy ship placement
    jest.spyOn(Gameboard.prototype, 'placeShip').mockImplementation(function (ship, row, col, orientation) {
      if (this === gameplayController?.enemyBoard) {
        // Place enemy destroyer at indices 10-11 (row 1, cols 0-1)
        this.grid[1][0] = ship;
        this.grid[1][1] = ship;
        this.ships.push({ ship, positions: [{ row: 1, col: 0 }, { row: 1, col: 1 }] });
        return true;
      }
      // Use the original method for the player board
      return Gameboard.prototype.placeShip.call(this, ship, row, col, orientation);
    });

    // Initialize GameplayController
    gameplayController = new GameplayController(gameControllerMock, playerShips);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('initializes player board with placed ships', () => {
    const playerGrid = document.getElementById('player-grid');
    const cell0 = playerGrid.children[0];
    const cell1 = playerGrid.children[1];
    expect(cell0.classList.contains('occupied')).toBe(true);
    expect(cell1.classList.contains('occupied')).toBe(true);
  });

  test('displays Player 1 turn message initially', () => {
    const turnMessage = document.getElementById('turn-message');
    expect(turnMessage.textContent).toBe("Player 1's Turn");
  });

  test('player can attack enemy grid and mark hit', () => {
    const enemyGrid = document.getElementById('enemy-grid');
    const cell10 = enemyGrid.children[10]; // Enemy destroyer at index 10
    fireEvent.click(cell10);

    expect(cell10.classList.contains('hit')).toBe(true);
  });

  test('player can attack enemy grid and mark miss', () => {
    const enemyGrid = document.getElementById('enemy-grid');
    const cell20 = enemyGrid.children[20]; // No ship at index 20
    fireEvent.click(cell20);

    expect(cell20.classList.contains('miss')).toBe(true);
  });

  test('switches to enemy turn after player attack', () => {
    const enemyGrid = document.getElementById('enemy-grid');
    const cell20 = enemyGrid.children[20];
    fireEvent.click(cell20);

    const turnMessage = document.getElementById('turn-message');
    expect(turnMessage.textContent).toBe("Enemy's Turn");
  });

  test('enemy attacks player grid after delay', () => {
    const enemyGrid = document.getElementById('enemy-grid');
    const cell20 = enemyGrid.children[20];
    fireEvent.click(cell20);

    // Fast-forward the timer to trigger the enemy attack
    jest.runAllTimers();

    const playerGrid = document.getElementById('player-grid');
    const attackedCell = Array.from(playerGrid.children).find(cell =>
      cell.classList.contains('hit') || cell.classList.contains('miss')
    );
    expect(attackedCell).toBeTruthy();
  });

  test('announces sunk ship and ends game when all enemy ships are sunk', () => {
    const enemyGrid = document.getElementById('enemy-grid');
    const cell10 = enemyGrid.children[10]; // Enemy destroyer at 10-11
    const cell11 = enemyGrid.children[11];

    fireEvent.click(cell10);
    fireEvent.click(cell11);

    expect(global.alert).toHaveBeenCalledWith("Enemy's destroyer has been sunk!");
    expect(global.alert).toHaveBeenCalledWith("Player 1 Wins!");
    expect(gameControllerMock.showGameOverScreen).toHaveBeenCalledWith('Player 1');
  });
});