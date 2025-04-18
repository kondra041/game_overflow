//game.js

const handsSound = new Audio('../hands.mp3');
handsSound.volume = 0.2;

class Game {
    constructor() {
        
        const savedState = JSON.parse(localStorage.getItem('gameState'));

        this.difficulty = '';
        this.currentLevel = 1;
        this.score = 0;
        this.addScore = 0;
        this.allTasks = 0;
        this.remainingTime = 0;
        this.tasks = [];
        this.currentTask = {};
        this.completedTasks = 0;
        this.basePoints = 10;
        this.penaltyPoints = -5;

        if(savedState){
            this.currentLevel = savedState.currentLevel;
            this.difficulty = savedState.difficulty;
            this.remainingTime = savedState.remainingTime;
        }else{
            this.saveState();
        }
    }

    // перемешивание
    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
    
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    } 

    saveState() {
        const gameState = {
            difficulty: this.difficulty,
            currentLevel: this.currentLevel,
            remainingTime: this.remainingTime,
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    savePlayerScore(newScore) {
        const playersKey = "players";
        const currentIndexKey = "currIndexPlayer";
    
        const players = JSON.parse(localStorage.getItem(playersKey)) || [];
        const currIndex = parseInt(localStorage.getItem(currentIndexKey), 10) || 0;
    
        if (currIndex >= 0 && currIndex < players.length) {
            players[currIndex].score += newScore; // Обновляем очки текущего игрока
        } else {
            console.warn("Текущий индекс игрока некорректен или отсутствует.");
            return;
        }
    
        localStorage.setItem(playersKey, JSON.stringify(players));
        console.log(`Очки игрока '${players[currIndex].name}'изменены на ${newScore}.`);
    }

    zeroPoints(){
        const playersKey = "players";
        const currentIndexKey = "currIndexPlayer";
    
        const players = JSON.parse(localStorage.getItem(playersKey)) || [];
        const currIndex = parseInt(localStorage.getItem(currentIndexKey), 10) || 0;
    
        if (currIndex >= 0 && currIndex < players.length) {
            players[currIndex].score = 0; // Обновляем очки текущего игрока
        }
    
        localStorage.setItem(playersKey, JSON.stringify(players));
        console.log(`Очки игрока '${players[currIndex].name}' обновлены до 0.`);
    }

    addPoints(num){
        this.score+=num;
        this.saveState();
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    updateTimerCircle(remainingTime, totalTime) {
        const progressCircle = document.querySelector('.timer-circle .progress');
        const timerText = document.getElementById('timerText');

        const circleRadius = 45; // Радиус круга
        const circleCircumference = 2 * Math.PI * circleRadius; // Окружность круга

        const offset = circleCircumference * (1 - remainingTime / totalTime);

        progressCircle.style.strokeDashoffset = offset;

        timerText.textContent = `${remainingTime} сек`;
    }

    startTimer(totalTime) {
        const timerBox = document.getElementById('timerBox');
        timerBox.style.display = 'block';
    
        let remainingTime = totalTime;
    
        this.timerInterval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(this.timerInterval);  // Остановить таймер
                this.timerInterval = null;  // Очистить переменную
                this.endLevel(false);
                return;
            }
    
            // Обновляем визуальный таймер
            this.updateTimerCircle(remainingTime, totalTime);
            remainingTime--;
        }, 1000);
    }
    

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null; 
        }
    }
    
    getCurrentTask() {
        return this.currentTask;
    }

    reload(){
        document.location.reload();
    }

    nextLevel() {
        this.currentLevel++;
        this.savePlayerScore(this.addScore);
        this.addScore = 0;
        this.saveState();
        return this.currentLevel;
    }

    restartLevel(){
        document.location.reload();
    }

    getaddScore(){
        return this.addScore;
    }


    endLevel(isSuccess) {
        

        if (isSuccess) {

            this.stopTimer();
            handsSound.play();

            let addScore = gameInstance.getaddScore();

            switch (this.getCurrentLevel()) {
                case 1:
                    showModal('Уровень 1 пройден!', 'Полученные баллы:' + addScore + '<br><br><a class="btnGreen" href="./second_level.html">Перейти на 2 уровень</a>', false);
                    break;
                case 2:
                    showModal('Уровень 2 пройден!', 'Полученные баллы: ' + addScore + '<br><br> <a class="btnGreen" href="./third_level.html">Перейти на 3 уровень</a>', false);
                    break;
                case 3:
                    showModal('Игра пройдена!', 'Поздравляем! Вы прошли игру. Можете выполнить следующие действия: <br> <button class="btnGreen" onClick="showModalRaiting()" href="#">Посмотреть рейтинг</button> <br> <button class="btnRed" onClick="gameInstance.restartGame()" href="#">Пройти игру заново</button> <br> <button class="btnRed" onClick="gameInstance.logoutPlayer()" href="#">Выйти из игры</button>', false);
                    break;
            }

            this.nextLevel();

        } else {
            console.log("Время вышло! Уровень не пройден.");
            
            const modalContent = document.createElement('div');
            if (gameInstance.currentLevel < 3) {
                modalContent.innerHTML = `
                    <div>Жаль, но Вы не успели пройти уровень.<br>
                        Вы можете перейти на ${this.currentLevel + 1} уровень, но с потерей баллов (-50).
                    </div>
                    <br>
                    <button id="nextLevelBtn" class="btnGreen">На ${this.currentLevel + 1} уровень</button> 
                    <br> 
                    <button id="restartGameBtn" class="btnRed" onclick="document.location.reload();">Пройти уровень заново</button>
                `;
            } else {
                modalContent.innerHTML = `
                    <div>Жаль, но Вы не успели пройти уровень.<br></div>
                    <br>
                    <button id="restartGameBtn" class="btnRed" onclick="document.location.reload();">Пройти уровень заново</button>
                `;
            }
        
            // Открываем модальное окно
            showModal('Время вышло', modalContent.innerHTML, false);
        
            const nextLevelBtn = document.getElementById('nextLevelBtn');
            const restartGameBtn = document.getElementById('restartGameBtn');
        
            // Обработчик для кнопки "На следующий уровень"
            if (nextLevelBtn) {
                console.log("Кнопка 'На следующий уровень' найдена!");
                nextLevelBtn.addEventListener('click', () => {
                    console.log("Переход на следующий уровень...");
                    this.handleNextLostPoint();
                });
            } else {
                console.error("Кнопка 'На следующий уровень' не найдена!");
            }
        
            // Обработчик для кнопки "Перезапуск игры"
            if (restartGameBtn) {
                console.log("Кнопка 'Перезапуск игры' найдена!");
                restartGameBtn.addEventListener('click', () => {
                    console.log("Перезапуск игры...");
                    document.location.reload(); 
                });
            } else {
                console.error("Кнопка 'Перезапуск игры' не найдена!");
            }
        }
        
        
        
        
    }


    handleNextLostPoint() {
        this.savePlayerScore(-50);
        this.nextLevel();
        switch (this.getCurrentLevel()) {
            case 2:
                this.link('/pages/second_level.html');
                break;
            case 3:
                this.link('/pages/third_level.html');
                break;
            case 4:
                showModal('Игра пройдена!', 'Поздравляю! Вы прошли игру <br> <button class="btnGreen" onClick="showModalRaiting()" href="#">Посмотреть рейтинг</button>', false);
                break;
        }
        
    }

    restartGame() {
        this.currentLevel = 1;
        this.score = 0;
        this.remainingTime = 0;
        this.zeroPoints();
        this.saveState();
        this.link('/pages/first_level.html');
    }

    logoutPlayer(){
        localStorage.setItem('currIndexPlayer', -1);
        localStorage.removeItem('gameState');
        this.link('/index.html');
    }


    addTask(task) {
        console.log('дина',this.tasks.length);
        console.log(this.tasks);
        this.tasks.push(task);
        this.allTasks++;

    }

    renderNextTask() {
        console.log('новая задача');

        const gameContainer = document.querySelector('.gameContainer');
        const taskTextContainer = document.querySelector('.taskTextContainer');



        if (this.tasks.length > 0) {
            const currentTask = this.tasks.shift();

            gameContainer.innerHTML = '';
            taskTextContainer.innerHTML = '';
            this.currentTask = currentTask;
            currentTask.task();

            taskTextContainer.innerHTML = currentTask.text;
            taskTextContainer.classList.add('highlight');
            
            setTimeout(() => {
                taskTextContainer.classList.remove('highlight');
            }, 1000);
        }else{
            console.log('Все задачи выполнены!');
            this.endLevel(true);
            return;
        }

    }

    getTasks(){
        return this.tasks;
    }

    completeTask() {
        const taskTextContainer = document.querySelector('.taskTextContainer');
        const gameContainer = document.querySelector('.gameContainer');


        taskTextContainer.innerHTML = 'Молодец! Задача выполнена - переходим к следующей.';
        gameContainer.innerHTML = '';
        taskTextContainer.classList.add('highlight');
        setTimeout(() => {
            taskTextContainer.classList.remove('highlight');
        }, 1000);


        this.completedTasks++;
        console.log(`Задач всего: ${this.allTasks}/`);
    }

    link(href) {
        const origin = window.location.pathname;
        const arr = origin.split('/');
    
        // Если текущая страница не index.html, корректируем путь
        if (arr[arr.length - 1] !== 'index.html') {
            arr.pop(); arr.pop(); // выходим из папки
            const newPath = arr.join('/') + href; // Формируем новый путь
            location = newPath;
        } else {
            // Если находимся на index.html, формируем путь относительно корня
            location = '.' + href;
        }
    }
    
    
    
}

var gameInstance = new Game();