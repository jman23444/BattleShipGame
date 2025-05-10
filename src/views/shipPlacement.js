

export default function renderShipPlacementScreen() {
    const container = document.createElement('div');
    container.id = 'ship-placement-screen';
  
    const title = document.createElement('h2');
    title.textContent = 'Position Your Battle Ships';
    container.appendChild(title);
  
    const rotateInfo = document.createElement('p');
    rotateInfo.textContent = 'Tap To Rotate Ship';
    container.appendChild(rotateInfo);
  
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
  
    // Create 10x10 grid
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.id = 'placement-grid';
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.index = i;
      grid.appendChild(cell);
    }
    gameContainer.appendChild(grid);
  
    // Create ship inventory
    const shipList = document.createElement('div');
    shipList.className = 'ship-list';
    const ships = [
      { type: 'carrier', size: 5 },
      { type: 'battleship', size: 4 },
      { type: 'submarine', size: 3 },
      { type: 'cruiser', size: 3 },
      { type: 'destroyer', size: 2 },
    ];
    ships.forEach(ship => {
      const shipDiv = document.createElement('div');
      shipDiv.className = 'ship';
      shipDiv.dataset.type = ship.type;
      shipDiv.dataset.size = ship.size;
      shipDiv.dataset.orientation = 'horizontal';
      for (let i = 0; i < ship.size; i++) {
        const shipSegment = document.createElement('div');
        shipSegment.className = 'ship-segment';
        shipDiv.appendChild(shipSegment);
      }
  
      shipList.appendChild(shipDiv);
    });
    gameContainer.appendChild(shipList);
  
    container.appendChild(gameContainer);
  
    // Continue button (initially disabled)
    const continueButton = document.createElement('button');
    continueButton.id = 'continue-btn';
    continueButton.textContent = 'Continue';
    continueButton.disabled = true;
    container.appendChild(continueButton);
  
    // Error message (hidden by default)
    const errorMessage = document.createElement('p');
    errorMessage.id = 'error-message';
    errorMessage.style.display = 'none';
    errorMessage.style.color = 'red';
    errorMessage.textContent = 'Please place all your ships before continuing.';
    container.appendChild(errorMessage);
  
    return container;
  }