const levelSelectContainer = document.getElementById('levelSelectContainer');
const gameContainer = document.querySelector('.gameContainer');
const easyCard = document.getElementById('easyCard');
const mediumCard = document.getElementById('mediumCard');

var gameInstance = new Game();

// Измените `setupEasyLevel` для добавления задач

function getRandomHeight(height, num) {
    let remainingHeight = height; // Оставшаяся высота для распределения
    const heights = [];

    // Генерация случайных высот для каждого из num элементов
    for (let i = 0; i < num - 1; i++) {
        // Генерируем случайную высоту, но так, чтобы оставалась высота для других элементов
        const randomHeight = Math.floor(Math.random() * (remainingHeight / (num - i))) + 1; 
        heights.push(randomHeight);
        remainingHeight -= randomHeight; // Уменьшаем оставшуюся высоту
    }

    // Последняя часть получит оставшуюся высоту
    heights.push(remainingHeight);

    return heights;
}

function getRandomColor() {
    const colors = ['red', 'blue', 'green', 'purple'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex]; // Возвращаем случайный цвет
}

function setupEasyLevel() {
    gameInstance.tasks = []; // Очищаем задачи
    gameInstance.completedTasks = 0;

    gameInstance.addTask({
        text: 'Перелить жидкость в правую колбу', // ID целевой колбы
        task: function () {

            let genRatio = Math.round(Math.random() * 10 + 1);

            const flask1 = new Flask('flask1', 3, genRatio);
            const flask2 = new Flask('flask2', 3, genRatio);

            const heights1 = getRandomHeight(flask1.psevdoHeight, 2);
    
            const liquidColor = getRandomColor(); 
            const liquid1Height = heights1[0];
            const liquid2Height = heights1[1];

            console.log(heights1);
    
            const liquid1 = new Liquid(liquidColor, liquid1Height / genRatio, genRatio);
            const liquid2 = new Liquid(liquidColor, liquid2Height / genRatio, genRatio);
            flask1.addLiquid(liquid1);
            flask2.addLiquid(liquid2); 
   
            gameContainer.appendChild(flask1.container);
            gameContainer.appendChild(flask2.container);
        },

        checkTask: function() {
            console.log("срабатывает");
            const rightFlask = document.querySelector('#flask2').flaskInstance; // Находим flask2
            if (!rightFlask) {
                console.error('Flask2 not found');
                return false;
            }
            const totalHeight = rightFlask.getTotalHeight(); 
            const heightFlask = rightFlask.psevdoHeight;
            console.log(totalHeight, heightFlask);

            return totalHeight == heightFlask; // Проверяем, полностью ли заполнена колба
        }
    });

    gameInstance.addTask({
        
        text: 'Перелить жидкость в левую колбу',
        task: function () {

            let genRatio = Math.round(Math.random() * 10 + 1);

            const flask1 = new Flask('flask1', 3, genRatio);
            const flask2 = new Flask('flask2', 3, genRatio);

            const heights1 = getRandomHeight(flask2.psevdoHeight, 2);
    
            const liquidColor = getRandomColor(); 
            const liquid1Height = heights1[0];
            const liquid2Height = heights1[1];
    
            const liquid1 = new Liquid(liquidColor, liquid1Height / genRatio, genRatio);
            const liquid2 = new Liquid(liquidColor, liquid2Height / genRatio, genRatio); 
    
            flask1.addLiquid(liquid1);
            flask2.addLiquid(liquid2); 
   
            gameContainer.appendChild(flask1.container);
            gameContainer.appendChild(flask2.container);
        },

        checkTask: function() {
            console.log("срабатывает");
            const leftFlask = document.querySelector('#flask1').flaskInstance; // Находим flask2
            if (!leftFlask) {
                console.error('Flask1 not found');
                return false;
            }
            const totalHeight = leftFlask.getTotalHeight(); // Получаем текущую высоту жидкости
            const heightFlask = leftFlask.psevdoHeight; // Максимальная вместимость
            console.log(totalHeight, heightFlask);

            return totalHeight == heightFlask; // Проверяем, полностью ли заполнена колба
        }
    });

    gameInstance.tasks = gameInstance.shuffleArray(gameInstance.tasks);

    gameInstance.addScore = 100;

    gameInstance.renderNextTask();
}


function setupMediumLevel() {
    gameInstance.tasks = [];
    gameInstance.completedTasks = 0;

    for (let i = 1; i <= 3; i++) {
        let genRatio = Math.round(Math.random() * 10 + 1);

        gameInstance.addTask({
            text: `Перелить жидкости одинаковых цветов в свои колбы - Задача ${i}`,
            task: function () {
                const flasks = [
                    new Flask("flask1", 4, genRatio),
                    new Flask("flask2", 4, genRatio),
                    new Flask("flask3", 4, genRatio),
                    new Flask("flask4", 4, genRatio),
                    new Flask("flask5", 4, genRatio),
                ];

                const liquidColors = getArrayRandomColor(3); // получаем массив из 3 случайных цветов

                // Генерация случайных высот жидкостей для каждого цвета
                const [liquid1Height, liquid2Height] = getRandomHeight(flasks[0].psevdoHeight, 2); // red
                const [liquid3Height, liquid4Height] = getRandomHeight(flasks[0].psevdoHeight, 2); // blue
                const [liquid5Height, liquid6Height] = getRandomHeight(flasks[0].psevdoHeight, 2); // green

                // Создаем массив жидкостей
                const liquids = [
                    new Liquid(liquidColors[0], liquid1Height / genRatio, genRatio),
                    new Liquid(liquidColors[0], liquid2Height / genRatio, genRatio),
                    new Liquid(liquidColors[1], liquid3Height / genRatio, genRatio),
                    new Liquid(liquidColors[1], liquid4Height / genRatio, genRatio),
                    new Liquid(liquidColors[2], liquid5Height / genRatio, genRatio),
                    new Liquid(liquidColors[2], liquid6Height / genRatio, genRatio),
                ];

                // Распределяем жидкости по колбам так, чтобы жидкости одинакового цвета не попадали в одну колбу
                let colorIndex = { [liquidColors[0]]: 0, [liquidColors[1]]: 0, [liquidColors[2]]: 0 };

                liquids.forEach(liquid => {
                    const availableFlasks = flasks.filter(flask => flask.getRemainingSpace() >= liquid.psevdoHeight);
                    if (availableFlasks.length > 0) {
                        // Находим индекс для этого цвета, чтобы распределить его в разные колбы
                        const color = liquid.type;
                        const flaskIndex = (colorIndex[color]++) % availableFlasks.length;
                        availableFlasks[flaskIndex].addLiquid(liquid);
                    }
                });

                // Добавляем колбы в DOM
                for (let flask of flasks) {
                    gameContainer.appendChild(flask.container);
                }
            },
            checkTask: function () {
                const flasks = Array.from(document.querySelectorAll('.flask')).map(flask => flask.flaskInstance);
                const uniqueColors = new Set();

                for (let flask of flasks) {
                    const colors = flask.liquids.map(liquid => liquid.type);

                    if (colors.length > 0) {
                        if (new Set(colors).size > 1) {
                            return false; // Если в колбе несколько разных цветов, задача не выполнена
                        }
                        if (uniqueColors.has(colors[0])) {
                            return false; // Если цвет уже был, то задача не выполнена
                        }
                        uniqueColors.add(colors[0]);
                    }
                }

                return true; // Если все колбы содержат жидкости одного цвета, задача выполнена
            }
        });
    }

    gameInstance.renderNextTask();
}

easyCard.addEventListener('click', () => startGame('easy'));
mediumCard.addEventListener('click', () => startGame('medium'));

function startGame(difficulty) {

    levelSelectContainer.style.display = 'none';

    if(difficulty == 'easy'){
        gameInstance.startTimer(15);

        setupEasyLevel();
    }else{
        gameInstance.startTimer(30);

        setupMediumLevel();
    }
}

function getArrayRandomColor(num) {
    const colors = [
        "red", "cornflowerblue", "green", "yellow", "orange", 
        "purple", "pink", "cyan", "lime", "brown"
    ];

    if (num > colors.length) {
        throw new Error("Запрошено больше цветов, чем доступно в палитре!");
    }

    const shuffledColors = colors.sort(() => Math.random() - 0.5);
    return shuffledColors.slice(0, num);
}