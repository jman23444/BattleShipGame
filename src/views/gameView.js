export default function renderGameView() {
    const container = document.createElement('div');
    container.id = 'game-screen';
  
    const title = document.createElement('h2');
    title.textContent = 'Battleship - Gameplay';
    container.appendChild(title);
  
    const turnMessage = document.createElement('p');
    turnMessage.id = 'turn-message';
    turnMessage.textContent = "Player 1's Turn";
    container.appendChild(turnMessage);
  
    const boardsContainer = document.createElement('div');
    boardsContainer.className = 'boards-container';
  
    // Player 1's Board (Own Board - Shows Ships)
    const playerBoard = document.createElement('div');
    playerBoard.className = 'board-container';
    
    const playerLabel = document.createElement('p');
    playerLabel.textContent = "Your Board";
    playerBoard.appendChild(playerLabel);
  
    const playerGrid = document.createElement('div');
    playerGrid.className = 'grid';
    playerGrid.id = 'player-grid';
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.index = i;
      playerGrid.appendChild(cell);
    }
    playerBoard.appendChild(playerGrid);
    boardsContainer.appendChild(playerBoard);
  
    // Player 2's Board (Enemy Board - For Attacks)
    const enemyBoard = document.createElement('div');
    enemyBoard.className = 'board-container';
    
    const enemyLabel = document.createElement('p');
    enemyLabel.textContent = "Enemy Board";
    enemyBoard.appendChild(enemyLabel);
  
    const enemyGrid = document.createElement('div');
    enemyGrid.className = 'grid';
    enemyGrid.id = 'enemy-grid';
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.index = i;
      enemyGrid.appendChild(cell);
    }
    enemyBoard.appendChild(enemyGrid);
    boardsContainer.appendChild(enemyBoard);
  
    container.appendChild(boardsContainer);
  
    return container;
  }