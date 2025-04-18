function validatePlayer() {
    const currIndexPlayer = parseInt(localStorage.getItem('currIndexPlayer'), 10);
    const players = JSON.parse(localStorage.getItem('players'));

    const pathname = window.location.pathname;
    console.log(pathname);

    const isValid =
        players && Array.isArray(players) &&
        currIndexPlayer !== null &&
        currIndexPlayer !== -1 &&
        currIndexPlayer < players.length;

    console.log(isValid);

    if (!isValid && !pathname.endsWith('/index.html')) {
        gameInstance.link('/index.html');
    } else if (isValid && gameInstance.currentLevel === 1 && !pathname.endsWith('/pages/first_level.html')) {
        gameInstance.link('/pages/first_level.html');
    } else if (isValid && gameInstance.currentLevel === 2 && !pathname.endsWith('/pages/second_level.html')) {
        gameInstance.link('/pages/second_level.html');
    } else if (isValid && gameInstance.currentLevel === 3 && !pathname.endsWith('/pages/third_level.html')) {
        gameInstance.link('/pages/third_level.html');

    }
}

validatePlayer();
