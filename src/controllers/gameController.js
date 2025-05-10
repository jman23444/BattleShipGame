import { loadingScreen } from '../views/loadingScreen.js';
import renderShipPlacementScreen from '../views/shipPlacement.js';
import ShipPlacementController from './shipPlacementController.js';
import GameplayController from './gamePlayController.js';
import renderGameView from '../views/gameView.js';

export default class GameController {
  constructor() {
    this.gameContainer = document.getElementById('app');
  }

  init() {
    this.showLoadingScreen();
  }

  showLoadingScreen() {
    this.gameContainer.innerHTML = '';
    const screen = loadingScreen(); 
    this.gameContainer.appendChild(screen);

    const startButton = document.getElementById('start-game');
    startButton.addEventListener('click', () => this.showShipPlacementScreen());
  }

  showShipPlacementScreen() {
    this.gameContainer.innerHTML = '';
    const shipPlacementScreen = renderShipPlacementScreen();
    this.gameContainer.appendChild(shipPlacementScreen);
  
    const shipPlacementController = new ShipPlacementController(this);
    // Override the continue button behavior to store ships and proceed
    const continueButton = document.getElementById('continue-btn');
    continueButton.addEventListener('click', () => {
      if (shipPlacementController.placedShips.size === 5) {
        this.placedShips = Array.from(shipPlacementController.placedShips);
        this.showGameplayScreen();
      }
    });
  }

  showGameplayScreen() {
    if (!this.placedShips || this.placedShips.length === 0) {
      console.error('No ships have been placed. Cannot start gameplay.');
      return;
    }
  
    this.gameContainer.innerHTML = '';
    const gameView = renderGameView();
    this.gameContainer.appendChild(gameView);
  
    new GameplayController(this, this.placedShips);
  }

  showGameOverScreen(winner) {
    this.gameContainer.innerHTML = `<h2>Game Over - ${winner} Wins!</h2>`;
  }
}