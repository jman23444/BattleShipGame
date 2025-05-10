import { fireEvent, waitFor } from '@testing-library/dom';
import renderShipPlacementScreen from '../views/shipPlacement.js';
import ShipPlacementController from '../controllers/shipPlacementController.js';

describe.skip('Ship Placement Screen', () => {
  let gameControllerMock;
  let container;

  beforeEach(() => {
    // Mock the gameController
    gameControllerMock = {
      showGameplayScreen: jest.fn(),
    };

    // Render the ship placement screen
    container = renderShipPlacementScreen();
    document.body.appendChild(container);

    // Initialize the controller
    new ShipPlacementController(gameControllerMock);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders a 10x10 grid', () => {
    const grid = document.getElementById('placement-grid');
    expect(grid.children).toHaveLength(100); // 10x10 grid
    expect(grid).toHaveClass('grid');
  });

  test('renders all unplaced ships in a vertical stack', () => {
    const shipList = document.querySelector('.ship-list');
    const ships = shipList.querySelectorAll('.ship');
    expect(ships).toHaveLength(5); // Carrier, Battleship, Submarine, Cruiser, Destroyer

    const shipSizes = [5, 4, 3, 3, 2];
    ships.forEach((ship, index) => {
      const segments = ship.querySelectorAll('.ship-segment');
      expect(segments).toHaveLength(shipSizes[index]);
    });
  });

  test('renders a Continue button that is initially disabled', () => {
    const continueButton = document.getElementById('continue-btn');
    expect(continueButton).toBeDisabled();
  });

  test('highlights a ship when clicked and marks it as active', () => {
    const ship = document.querySelector('.ship[data-type="carrier"]');
    fireEvent.click(ship);
    expect(ship).toHaveClass('active');
  });

  test('shows a ghost preview on grid hover with an active ship', () => {
    const ship = document.querySelector('.ship[data-type="destroyer"]'); // Size 2
    fireEvent.click(ship);

    const cell = document.querySelector('.grid-cell[data-index="0"]');
    fireEvent.mouseMove(cell);

    const cell0 = document.querySelector('.grid-cell[data-index="0"]');
    const cell1 = document.querySelector('.grid-cell[data-index="1"]');
    expect(cell0).toHaveClass('preview', 'valid');
    expect(cell1).toHaveClass('preview', 'valid');
  });

  test('shows a red preview for invalid placement (out-of-bounds)', () => {
    const ship = document.querySelector('.ship[data-type="carrier"]'); // Size 5
    fireEvent.click(ship);

    const cell = document.querySelector('.grid-cell[data-index="9"]'); // Last column
    fireEvent.mouseMove(cell);

    const cell9 = document.querySelector('.grid-cell[data-index="9"]');
    expect(cell9).toHaveClass('preview', 'invalid');
  });

  test('places a ship on the grid when clicking a valid preview location', () => {
    const ship = document.querySelector('.ship[data-type="destroyer"]'); // Size 2
    fireEvent.click(ship);

    const cell = document.querySelector('.grid-cell[data-index="0"]');
    fireEvent.mouseMove(cell);
    fireEvent.click(cell);

    const cell0 = document.querySelector('.grid-cell[data-index="0"]');
    const cell1 = document.querySelector('.grid-cell[data-index="1"]');
    expect(cell0).toHaveClass('occupied');
    expect(cell1).toHaveClass('occupied');

    const shipInInventory = document.querySelector('.ship[data-type="destroyer"]');
    expect(shipInInventory).toBeNull(); // Ship removed from inventory
  });

  test('removes a placed ship and returns it to inventory when clicked', () => {
    const ship = document.querySelector('.ship[data-type="destroyer"]'); // Size 2
    fireEvent.click(ship);

    const cell = document.querySelector('.grid-cell[data-index="0"]');
    fireEvent.mouseMove(cell);
    fireEvent.click(cell);

    // Click the placed ship to remove it
    fireEvent.click(cell);

    const cell0 = document.querySelector('.grid-cell[data-index="0"]');
    expect(cell0).not.toHaveClass('occupied');

    const shipInInventory = document.querySelector('.ship[data-type="destroyer"]');
    expect(shipInInventory).not.toBeNull(); // Ship returned to inventory
  });

  test('toggles ship orientation when clicking an active ship', () => {
    const ship = document.querySelector('.ship[data-type="destroyer"]');
    fireEvent.click(ship);
    expect(ship.dataset.orientation).toBe('horizontal');

    fireEvent.click(ship);
    expect(ship.dataset.orientation).toBe('vertical');
  });

  test('deselects the active ship when clicking outside grid or inventory', () => {
    const ship = document.querySelector('.ship[data-type="destroyer"]');
    fireEvent.click(ship);
    expect(ship).toHaveClass('active');

    fireEvent.click(document.body);
    expect(ship).not.toHaveClass('active');
  });

  test('shows an error when clicking Continue before all ships are placed', async () => {
    const continueButton = document.getElementById('continue-btn');
    fireEvent.click(continueButton);

    const errorMessage = document.getElementById('error-message');
    expect(errorMessage).toHaveStyle('display: block');
    expect(errorMessage).toHaveTextContent('Please place all your ships before continuing.');

    await waitFor(() => {
      expect(errorMessage).toHaveStyle('display: none');
    }, { timeout: 3500 });
  });

  test('enables the Continue button when all ships are placed', () => {
    const ships = [
      { type: 'carrier', size: 5, startIndex: 0 },
      { type: 'battleship', size: 4, startIndex: 10 },
      { type: 'submarine', size: 3, startIndex: 20 },
      { type: 'cruiser', size: 3, startIndex: 30 },
      { type: 'destroyer', size: 2, startIndex: 40 },
    ];

    ships.forEach(({ type, startIndex }) => {
      const ship = document.querySelector(`.ship[data-type="${type}"]`);
      fireEvent.click(ship);
      const cell = document.querySelector(`.grid-cell[data-index="${startIndex}"]`);
      fireEvent.mouseMove(cell);
      fireEvent.click(cell);
    });

    const continueButton = document.getElementById('continue-btn');
    expect(continueButton).not.toBeDisabled();
  });
});