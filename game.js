document.addEventListener('DOMContentLoaded', () => {
    const difficultySelect = document.getElementById('difficultySelect');
    const startButton = document.getElementById('startButton');
    
    // Если сложности нет в localStorage, то по умолчанию будет 'easy'
    let gameState = JSON.parse(localStorage.getItem('gameState')) || { difficulty: 'easy', currentLevel: 1 };

    // Обработчик для выбора сложности
    difficultySelect.addEventListener('change', (e) => {
        gameState.difficulty = e.target.value;
        localStorage.setItem('gameState', JSON.stringify(gameState));
    });

    // Старт игры
    startButton.addEventListener('click', () => {
        gameState.currentLevel = 1; // Начинаем с первого уровня
        localStorage.setItem('gameState', JSON.stringify(gameState));
        window.location.href = 'level1.html'; // Переход на уровень 1
    });
});


function link(href){
    if(pathname == 'index.html'){
        widndow.location = '.'+href;
    }else{
        // выйти из этой папки в корневую и перейти по адресу
    }
}

link('/')