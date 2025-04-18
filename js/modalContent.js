const btnOpenRaiting = document.getElementById('openModalRaiting');
btnOpenRaiting.addEventListener('click', showModalRaiting);

const questionBtn = document.getElementById('questionBtn');
questionBtn.addEventListener('click', showRules);
document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'm') { // Проверяем, что нажата клавиша "M"
        showRules();
    }
    
});

const restartGameBtn = document.getElementById('restartGameBtn');
restartGameBtn.addEventListener('click', () => {
    let confirmRestart = confirm('Вы уверены, что хотите перезапустить игру сначала?');
    if(confirmRestart){
        gameInstance.restartGame();
    }
});


function showRules(){
    const modalBody = document.getElementById("modalBody");
    modalBody.style.textAlign = 'left';
    let content = '<strong>Описание игры:</strong> Игра представляет собой головоломку, где игроку нужно сортировать разноцветные жидкости в колбах так, чтобы каждая колба содержала жидкость только одного цвета. В процессе игры сложность увеличивается: добавляются новые цвета, большее количество колб, ограниченное время, а колбы начинают двигаться по замкнутым траекториям.  Это испытание на внимательность, стратегическое мышление и скорость. <br><br> ';
    content += '<strong>Правила игры:</strong> <ul><li>Переливать жидкости можно только тогда, когда верхний слой совпадает по цвету или колба пуста. </li> <li>Следите за вместимостью колбы: если уровень жидкости превышает лимит, переливание невозможно.</li><li>На последнем уровне игрок должен успеть завершить сортировку до истечения таймера, несмотря на движение колб. </li> <li>Успешно завершив все уровни, игрок получает итоговые баллы.</li></ul>';
    showModal('Правила игры', content);
}



function showModalRaiting(){

const currPlayers = JSON.parse(localStorage.getItem('players'));
const currentPlayerName = currPlayers[parseInt(localStorage.getItem('currIndexPlayer'), 10)].name; // Преобразуем в число

let tableHTML = `
    <table class="raitingTable">
        <thead>
            <tr>
                <td>Место</td>
                <td>Пользователь</td>
                <td>Баллы</td>
            </tr>
        </thead>
        <tbody>
`;

currPlayers.sort((a, b) => b.score - a.score); 
currPlayers.forEach((player, index) => {
    tableHTML += `
        <tr ${player.name === currentPlayerName ? 'class="myCell"' : ''}>
            <td>${index + 1}</td>
            <td>${player.name} ${player.name === currentPlayerName ? '(Вы)' : ''}</td>
            <td>${player.score}</td>
        </tr>
    `;
});

tableHTML += `
        </tbody>
    </table>
`;

showModal('РЕЙТИНГ УЧАСТНИКОВ', tableHTML);

}







