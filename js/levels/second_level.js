// first_level.js
// var gameInstance = new Game();

const levelSelectContainer = document.getElementById('levelSelectContainer');
const gameContainer = document.querySelector('.gameContainer');
const easyCard = document.getElementById('easyCard');
const mediumCard = document.getElementById('mediumCard');

function setupLevel() {

    gameInstance.tasks = [];
    gameInstance.completedTasks = 0;

    let volume = 0;

    for (var i = 0; i < 3; i++) {
        gameInstance.addTask({
            text: ``,

            task: function () {

                let genRatio = Math.round(Math.random() * 10 + 1);

                let maxPsevdoHeight = 4 * genRatio;

                var arrVolumes = [];

                const flasks = [
                    new Flask("flask1", 4, genRatio),
                    new Flask("flask2", 4, genRatio),
                    new Flask("flask3", 4, genRatio),
                    new Flask("flask4", 4, genRatio),
                    new Flask("flask5", 4, genRatio),
                    new Flask("flask5", 4, genRatio)
                ];

                const liquidColors = getArrayRandomColor(3); // получаем массив из 3 случайных цветов

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

                    for (var i = 0; i < liquids.length; i++) {

                        let firstLiquid = liquids[i].psevdoHeight;
                        let sumLiquid = liquids[i].psevdoHeight;
                        let twoLiquid = liquids[i].psevdoHeight;

                        for (var j = i + 1; j < liquids.length; j++) {

                            if (j == i + 1) {
                                twoLiquid = firstLiquid + liquids[j].psevdoHeight;
                                if (twoLiquid <= maxPsevdoHeight) {
                                    arrVolumes.push(twoLiquid);
                                }

                            }
                            sumLiquid += liquids[j].psevdoHeight;

                            if (sumLiquid <= maxPsevdoHeight) {
                                arrVolumes.push(sumLiquid);
                            }
                        }
                    }

                    for (var i = 0; i < flasks.length; i++) {
                        if (arrVolumes.includes(flasks[i].getTotalHeight())) {
                            arrVolumes = arrVolumes.filter(item => item !== flasks[i].getTotalHeight());
                        }
                    }

                    randVolume = arrVolumes[Math.floor(Math.random() * arrVolumes.length)];
                    volume = randVolume;

                    console.log(arrVolumes);

                    this.text = `Перелей ${volume} литра в одну колбу`;

                } while (volume == undefined);

                for (let flask of flasks) {
                    gameContainer.appendChild(flask.container);
                }
            },

            checkTask: function () {
                console.log('проверка задачи');

                // Проверяем, если в какой-либо колбе будет ровно нужный объем
                const flasks = Array.from(document.querySelectorAll('.flask')).map(flask => flask.flaskInstance);
                for (let flask of flasks) {
                    if (flask.getTotalHeight() === volume) { // Проверка на нужный объем
                        return true;
                    }
                }

                return false; // Если ни в одной колбе не получилось нужный объем, задача не решена
            }
        });

    }

    gameInstance.renderNextTask();
}

// Генератор случайного числа в заданном диапазоне
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генератор случайного цвета
function getRandomColor() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    return colors[getRandomInt(0, colors.length - 1)];
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

easyCard.addEventListener('click', () => startGame('easy'));
mediumCard.addEventListener('click', () => startGame('medium'));

function startGame(difficulty) {

    levelSelectContainer.style.display = 'none';


    if (difficulty === 'easy') {
        gameInstance.startTimer(35);

        setupLevel();
    } else {
        gameInstance.startTimer(25);
        setupLevel();
    }
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