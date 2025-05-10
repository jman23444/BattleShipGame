import './styles/main.css';
import './styles/reset.css';
// import { loadingScreen } from './views/loadingScreen';
import GameController from './controllers/gameController.js';

// Initialize the game controller
// const gameController = new GameController();
// gameController.init();

document.addEventListener('DOMContentLoaded', () => {
    const gameController = new GameController();
    gameController.init();
  });
