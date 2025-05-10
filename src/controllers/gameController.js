import { loadingScreen } from '../views/loadingScreen.js';
import renderShipPlacementScreen from '../views/shipPlacement.js';
import ShipPlacementController from './shipPlacementController.js';

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

    new ShipPlacementController(this);
  }

  showGameplayScreen() {
    // Placeholder for the next phase
    this.gameContainer.innerHTML = '<h2>Gameplay Screen Placeholder</h2>';
  }
}