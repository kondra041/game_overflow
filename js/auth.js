const button = document.getElementById('startGameButton');
const input = document.getElementById('inputName');


function addPlayer(array, name) {
    array.push({
        'name': name,
        'score': 0
    });

    localStorage.setItem('players', JSON.stringify(array));
}

if (localStorage.getItem('players') == null) {
    localStorage.setItem('players', JSON.stringify([]));
    localStorage.setItem('currIndexPlayer', -1);
}

button.addEventListener('click', (e) => {
    e.preventDefault();
    if (input.value.trim() === '') {
        alert('Вы не ввели никнейм');
    } else {
        let currIndexPlayer = parseInt(localStorage.getItem('currIndexPlayer'), 10);
        const Players = JSON.parse(localStorage.getItem('players')); // Преобразуем в массив
                
        if (!Players.find(player => player.name === input.value.trim())) {
            addPlayer(Players, input.value.trim());
            currIndexPlayer = Players.length -1;
            localStorage.setItem('currIndexPlayer', currIndexPlayer);

            document.location.href = './pages/first_level.html';
        } else {
            alert('Такой никнейм уже занят. Введите другой.');
        }
    }
});


