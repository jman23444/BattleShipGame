const loadingScreen = () => {
    const container = document.createElement('div');
    container.id = 'loading-screen';
  
    const title = Object.assign(document.createElement('h1'), {
      textContent: 'BATTLE SHIP'
    });
  
    const startButton = Object.assign(document.createElement('button'), {
      id: 'start-game',
      textContent: 'START GAME'
    });
  
    container.append(title, startButton);
    return container;
  };

  export { loadingScreen };