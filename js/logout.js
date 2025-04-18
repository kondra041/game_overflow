const logoutButton = document.getElementById('logoutButton');


logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmLogot = confirm('Вы уверены, что желаете покинуть игру окончательно?');
    if(confirmLogot){
        gameInstance.logoutPlayer();
    }
});
