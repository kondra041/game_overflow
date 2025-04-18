const levelSelectContainer = document.getElementById('levelSelectContainer');
const gameContainer = document.querySelector('.gameContainer');
const easyCard = document.getElementById('easyCard');
const mediumCard = document.getElementById('mediumCard');


// Функция для случайного выбора анимации
function getRandomAnimation() {
    const animations = [
        // 'moveRandom1',
        // 'moveRandom2',
        'moveCircle',
        'moveEllipse',
        'myOrbit'
    ];
    const randomIndex = Math.floor(Math.random() * animations.length);
    return animations[randomIndex];
}

// Функция для генерации случайной задержки анимации (от 1 до 2 секунд)
function getRandomDelay() {
    return (Math.random() + 1).toFixed(1); 
}

// Функция для назначения случайной траектории с задержкой
function assignRandomTrajectory(flask) {
    // Получаем случайную анимацию
    const randomAnimation = getRandomAnimation();
    
    // Генерируем случайную задержку
    const randomDelay = getRandomDelay();
    
    // Применяем анимацию с задержкой к элементу
    flask.element.style.animation = `${randomAnimation} 2s infinite ${randomDelay}s`;
}


function setupLevel() {
    gameInstance.tasks = []; 
    let volume = 0;

    for(var i = 0; i < 3; i++) {

    gameInstance.addTask({
        text: `Перелей ${volume} л в бочку`,

        task: function () {


            let genRatio = Math.round(Math.random() * 10 + 1);

            let maxPsevdoHeight = 3 * genRatio;

            var arrVolumes = [];

            const flasks = [
                new Flask("flask1", 3, genRatio),
                new Flask("flask2", 3, genRatio),
                new Flask("flask3", 3, genRatio),
                new Flask("flask4", 3, genRatio),
                new Flask("flask5", 3, genRatio),
            ];

            const liquidColors = getArrayRandomColor(3);

            do {


            // Генерация случайных высот жидкостей для каждого цвета
            const [liquid1Height, liquid2Height] = getRandomHeight(flasks[0].psevdoHeight, 2);
            const [liquid3Height, liquid4Height] = getRandomHeight(flasks[0].psevdoHeight, 2); 
            const [liquid5Height, liquid6Height] = getRandomHeight(flasks[0].psevdoHeight, 2);

            // Создаем массив жидкостей
            const liquids = [
                new Liquid(liquidColors[0], liquid1Height / genRatio, genRatio),
                new Liquid(liquidColors[0], liquid2Height / genRatio, genRatio),
                new Liquid(liquidColors[0], liquid3Height / genRatio, genRatio),
                new Liquid(liquidColors[0], liquid4Height / genRatio, genRatio),
                new Liquid(liquidColors[0], liquid5Height / genRatio, genRatio),
                new Liquid(liquidColors[0], liquid6Height / genRatio, genRatio),
            ];

            // Распределяем жидкости по колбам так, чтобы жидкости одинакового цвета не попадали в одну колбу
            let colorIndex = { [liquidColors[0]]: 0, [liquidColors[1]]: 0, [liquidColors[2]]: 0 };

            liquids.forEach(liquid => {
                const availableFlasks = flasks.filter(flask => flask.getRemainingSpace() >= liquid.psevdoHeight);
                if (availableFlasks.length > 0) {
                    // Находим индекс для этого цвета, чтобы распределить его в разные колбы
                    const color = liquid.type;
                    const flaskIndex = (colorIndex[color]++) % availableFlasks.length;
                    availableFlasks[flaskIndex].pasteLiquid(liquid);
                }
            });

            for(var i = 0; i < liquids.length; i++){

                let firstLiquid = liquids[i].psevdoHeight;
                let sumLiquid = liquids[i].psevdoHeight;
                let twoLiquid = liquids[i].psevdoHeight;

                for(var j = i+1; j < liquids.length; j++){

                    if(j == i+1){
                        twoLiquid = firstLiquid + liquids[j].psevdoHeight;
                        if(twoLiquid <= maxPsevdoHeight){
                            arrVolumes.push(twoLiquid);
                        }

                    }
                    sumLiquid += liquids[j].psevdoHeight;

                    if(sumLiquid <= maxPsevdoHeight){
                        arrVolumes.push(sumLiquid);
                    } 
                }
            }

            for(var i = 0; i < flasks.length; i++){
                if(arrVolumes.includes(flasks[i].getTotalHeight())){
                    arrVolumes = arrVolumes.filter(item => item !== flasks[i].getTotalHeight());
                }
            }

            randVolume = arrVolumes[Math.floor(Math.random() * arrVolumes.length)];
            volume = randVolume;

            console.log(arrVolumes);

            this.text = `Перелей ${volume} литра(-ов) в бочку`;
            
        }while(volume == undefined);

            let heightContainer = gameContainer.clientHeight;
            let WidthContainer = gameContainer.clientWidth;

            console.log(heightContainer, WidthContainer);
            gameContainer.style.display = 'block';

            // Добавляем колбы в контейнер игры
            flasks.forEach((flask, index) => {
                flask.element.setAttribute('data-trajectory', (index % 2) + 1);
                flask.element.style.position = `absolute`;
                flask.element.style.top = `${Math.max(100, Math.random() * heightContainer - 200)}px`;
                flask.element.style.left = `${Math.max(150, Math.random() * WidthContainer - 150)}px`;
                gameContainer.appendChild(flask.element);
                assignRandomTrajectory(flask);
            });

            // Создаем объект бочки и сохраняем его в gameInstance
            gameInstance.barrel = new Barrel(volume);
            gameContainer.appendChild(gameInstance.barrel.container);
        },

        checkTask: function () {

            return gameInstance.barrel.currentVolume === volume;
        }
    });

}

    // Перерисовываем задачу
    gameInstance.renderNextTask();
}

easyCard.addEventListener('click', () => startGame('easy'));
mediumCard.addEventListener('click', () => startGame('medium'));

function startGame(difficulty) {
    levelSelectContainer.style.display = 'none';

    if(difficulty === 'easy'){
        gameInstance.startTimer(30);
        setupLevel();
    } else {
        gameInstance.startTimer(25);
        setupLevel();
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
