const Players = JSON.parse(localStorage.getItem('players')) || [];
const currPlayerIndex = parseInt(localStorage.getItem('currIndexPlayer'), 10);
const LetterName = document.getElementById('LetterName');

// Убедимся, что данные игрока существуют
if (Players[currPlayerIndex]) {
const playerName = Players[currPlayerIndex].name;
const score = Players[currPlayerIndex].score;

LetterName.innerHTML = `${playerName} (${score} баллов)`;

} else {
    console.error("Игрок не найден или индекс некорректен.");
}
