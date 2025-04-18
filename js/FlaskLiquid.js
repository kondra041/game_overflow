
// var gameInstance = new Game();

const waterSound = new Audio('../water.mp3');
waterSound.volume = 0.5;

const errorSound = new Audio('../error.mp3');
errorSound.volume = 0.5;


class Liquid {
    constructor(type, height, ratio = 1) {
        this.type = type;
        this.height = height;
        this.ratio = ratio;
        this.psevdoHeight = this.height * this.ratio;
    }

    setHeight(newHeight) {
        this.height = newHeight;
    }

    getColor() {
        return this.type
    }

}

class Flask {
    constructor(id, heightFlask = 2, ratio = 1, unionLiquid = false) {
        this.id = id;
        this.heightFlask = heightFlask;  // множитель высоты (2, 3, 4 и т.д.)
        this.ratio = ratio;
        this.flaskHeightPX = 100 * heightFlask; 
        this.psevdoHeight = this.heightFlask * this.ratio // 

        this.liquids = [];
        this.unionLiquid = unionLiquid;  // Параметр для объединения жидкостей

        let flaskContainer = document.createElement('div');
        flaskContainer.classList.add('flaskCont');


        this.container = document.createElement('div');
        this.container.classList.add('flaskCont');

        this.spanHeight = document.createElement('div');
        this.spanHeight.classList.add('spanHeight');
        this.spanHeight.innerHTML = this.psevdoHeight;


        this.element = document.createElement('div');
        this.element.id = this.id;
        this.element.classList.add('flask');
        this.element.style.height = `${this.flaskHeightPX}px`;
        console.log();  // Применяем высоту колбы в пикселях

        this.container.appendChild(this.element);
        this.container.appendChild(this.spanHeight);


        this.element.flaskInstance = this;

        this.element.setAttribute('draggable', 'true');
        this.element.addEventListener("dragstart", this.startDrag.bind(this));
        this.element.addEventListener("drop", this.drop.bind(this));
        this.element.addEventListener("dragover", this.onDragOver.bind(this));
        this.element.addEventListener("dragleave", this.onDragLeave.bind(this));
    }

    getRemainingSpace() {
        const usedSpace = this.liquids.reduce((total, liquid) => total + liquid.psevdoHeight, 0);
        return this.psevdoHeight - usedSpace;
    }

    transferLiquids(draggedFlask) {
        const liquidToTransfer = draggedFlask.liquids.pop();

        if (!liquidToTransfer) {
            console.log("Нет жидкости для перелива!");
            errorSound.play();
            return;
        }

        const totalHeightAfterTransfer = this.getTotalHeight() + liquidToTransfer.psevdoHeight;

        // Проверка, не превышает ли высота жидкости максимальную высоту колбы
        if (totalHeightAfterTransfer > this.psevdoHeight) {
            console.log("Превышение максимальной вместимости! Перелив невозможен.");
            draggedFlask.liquids.push(liquidToTransfer);
            errorSound.play();
            return;
        }

        // Логика переливания
        if (this.liquids.length > 0) {
            const targetTopLiquid = this.liquids[this.liquids.length - 1];

            if (targetTopLiquid.type !== liquidToTransfer.type) {
                this.addLiquid(new Liquid(liquidToTransfer.type, liquidToTransfer.height, liquidToTransfer.ratio));
            } else {
                if (this.unionLiquid) {
                    targetTopLiquid.setHeight(targetTopLiquid.height + liquidToTransfer.height);
                } else {
                    this.addLiquid(new Liquid(liquidToTransfer.type, liquidToTransfer.height, liquidToTransfer.ratio));
                }
            }
        } else {
            this.addLiquid(new Liquid(liquidToTransfer.type, liquidToTransfer.height, liquidToTransfer.ratio));
        }

        this.updateLiquid();
        draggedFlask.updateLiquid();

        waterSound.play();
    }

    startDrag(event) {
        window.draggedFlask = this;
        event.dataTransfer.setData("text", this.id);
    }

    drop(event) {
        console.log('drop');
        event.preventDefault();
        const draggedFlask = window.draggedFlask;

        // Проверяем, если дроп был в бочку
        const barrelElement = event.target.closest('.barrelBox');
        if (barrelElement) {
            const barrel = barrelElement.flaskInstance;
            if (barrel && draggedFlask && draggedFlask.liquids.length > 0) {
                barrel.onDrop(event);  // Переливаем жидкость в бочку
            } else {
                errorSound.play();
            }
        } else {
            // Если дроп не в бочку, проверяем нормальный процесс перелива
            if (draggedFlask && draggedFlask !== this && this.canTransfer(draggedFlask)) {
                this.transferLiquids(draggedFlask);
            } else {
                errorSound.play();
            }
        }

        // Проверка выполнения текущего задания
        const currentTask = gameInstance.getCurrentTask();
        if (currentTask.checkTask()) {
            gameInstance.completeTask();

            // После выполнения задания, проверяем, есть ли следующие задания
            if (gameInstance.getTasks().length !== 0) {
                setTimeout(() => {
                    gameInstance.renderNextTask();
                }, 2500);
            } else {
                gameInstance.renderNextTask();
            }
        }

        this.element.classList.remove('hovered');
    }


    updateLiquid() {
        this.element.innerHTML = '';  // Очищаем все содержимое

        // Если объединение разрешено, проверяем, есть ли одинаковые жидкости и объединяем их
        if (this.unionLiquid) {
            let groupedLiquids = [];

            this.liquids.forEach(liquid => {
                // Группируем жидкости по типу
                let existingGroup = groupedLiquids.find(group => group.type === liquid.type);
                if (existingGroup) {
                    existingGroup.height += liquid.height;
                    existingGroup.psevdoHeight += liquid.psevdoHeight;

                } else {
                    groupedLiquids.push({ type: liquid.type, height: liquid.height, psevdoHeight: liquid.psevdoHeight});
                }
            });

            // Создаем элементы для каждой группы жидкости
            groupedLiquids.forEach(group => {
                const liquidElement = document.createElement("div");
                liquidElement.classList.add("liquid");
                liquidElement.style.background = new Liquid(group.type, group.height, group.psevdoHeight).getColor();
                liquidElement.style.height = `${group.height * 100}px`;

                const heightText = document.createElement("span");
                heightText.classList.add("liquid-height-text");
                heightText.innerText = `${group.psevdoHeight}`;
                liquidElement.appendChild(heightText);

                this.element.appendChild(liquidElement);
            });
        } else {
            // Для каждой жидкости создаем новый элемент
            this.liquids.forEach(liquid => {
                const liquidElement = document.createElement("div");
                liquidElement.classList.add("liquid");
                liquidElement.style.background = liquid.getColor();
                liquidElement.style.height = `${liquid.height * 100}px`;

                const heightText = document.createElement("span");
                heightText.classList.add("liquid-height-text");
                heightText.innerText = `${liquid.psevdoHeight}`;
                liquidElement.appendChild(heightText);

                this.element.appendChild(liquidElement);
            });
        }
    }


    onDragOver(event) {
        event.preventDefault();
        this.element.classList.add('hovered');
    }

    onDragLeave(event) {
        this.element.classList.remove('hovered');
    }

    canTransfer(draggedFlask) {
        if (this.liquids.length === 0) {
            // Проверяем высоту верхней жидкости в draggedFlask и сравниваем с доступным объемом
            const topLiquid = draggedFlask.liquids[draggedFlask.liquids.length - 1];
            if(! (topLiquid.psevdoHeight <= this.getRemainingSpace())){
                gameInstance.addScore -= 10;
                return false;
            }else{
                gameInstance.addScore += 5;
                return true;
            }
        }

        const targetTopLiquid = this.liquids[this.liquids.length - 1];
        const draggedTopLiquid = draggedFlask.liquids[draggedFlask.liquids.length - 1];
        if (targetTopLiquid.type !== draggedTopLiquid.type) {
            errorSound.play();
            gameInstance.addScore -= 10;
            return false;
        }else{
            gameInstance.addScore += 5;
        }

        const totalHeightAfterTransfer = this.getTotalHeight() + draggedTopLiquid.psevdoHeight;
        return totalHeightAfterTransfer <= this.psevdoHeight;
    }

    pasteLiquid(liquid){
        this.liquids.push(liquid);

        const liquidElement = document.createElement("div");
        liquidElement.classList.add("liquid");
        liquidElement.style.background = liquid.getColor();
        liquidElement.style.height = `${liquid.height * 100}px`;

        const heightText = document.createElement("span");
        heightText.classList.add("liquid-height-text");
        heightText.innerText = `${liquid.psevdoHeight}`;
        liquidElement.appendChild(heightText);

        console.log(liquid.psevdoHeight);

        this.element.appendChild(liquidElement);
    }

    addLiquid(liquid) {
        this.liquids.push(liquid);
        this.updateLiquid();
    }

    updateLiquid() {
        this.element.innerHTML = '';

        if (this.unionLiquid) {
            // Если объединение разрешено, проверяем, есть ли одинаковые жидкости и объединяем их
            let groupedLiquids = [];

            this.liquids.forEach(liquid => {
                // Группируем жидкости по типу
                let existingGroup = groupedLiquids.find(group => group.type === liquid.type);
                if (existingGroup) {
                    existingGroup.height += liquid.height;
                    existingGroup.psevdoHeight += liquid.psevdoHeight;

                } else {
                    groupedLiquids.push({ type: liquid.type, height: liquid.height, psevdoHeight: liquid.psevdoHeight });
                }
            });

            groupedLiquids.forEach(group => {
                const liquidElement = document.createElement("div");
                liquidElement.classList.add("liquid");
                liquidElement.style.background = new Liquid(group.type, group.height).getColor();
                liquidElement.style.height = `${group.height * 100}px`;

                const heightText = document.createElement("span");
                heightText.classList.add("liquid-height-text");
                heightText.innerText = `${group.psevdoHeight}`;
                liquidElement.appendChild(heightText);

                console.log(groupedLiquids);

                this.element.appendChild(liquidElement);
            });
        } else {
            this.liquids.forEach(liquid => {
                const liquidElement = document.createElement("div");
                liquidElement.classList.add("liquid");
                liquidElement.style.background = liquid.getColor();
                liquidElement.style.height = `${liquid.height * 100}px`;

                const heightText = document.createElement("span");
                heightText.classList.add("liquid-height-text");
                heightText.innerText = `${liquid.psevdoHeight}`;
                liquidElement.appendChild(heightText);

                console.log(liquid.psevdoHeight);

                this.element.appendChild(liquidElement);
            });
        }
    }

    getTotalHeight() {
        return this.liquids.reduce((sum, liquid) => sum + liquid.psevdoHeight, 0);
    }
}

class Barrel {
    constructor(volume) {
        this.volume = volume;  // Начальный объем бочки
        this.currentVolume = 0; // Текущий объем в бочке (по умолчанию 0)

        this.container = document.createElement('div');
        this.container.classList.add('barrelCont');

        this.spanHeight = document.createElement('div');
        this.spanHeight.classList.add('spanHeight');
        this.spanHeight.innerHTML = `${this.currentVolume} л. / ${this.volume} л.`;

        this.element = document.createElement('div');
        this.element.classList.add('barrelBox');
        this.element.addEventListener("dragover", this.onDragOver.bind(this));
        this.element.addEventListener("dragleave", this.onDragLeave.bind(this));
        this.element.addEventListener("drop", this.onDrop.bind(this));

        this.container.appendChild(this.element);
        this.container.appendChild(this.spanHeight);
    }

    onDragOver(event) {
        event.preventDefault();
        this.element.classList.add('hovered');
    }

    onDragLeave(event) {
        this.element.classList.remove('hovered');
    }

    onDrop(event) {
        event.preventDefault();
        const draggedFlask = window.draggedFlask;

        // Проверяем, если колба содержит жидкость
        if (draggedFlask && draggedFlask.liquids.length > 0) {
            const topLiquid = draggedFlask.liquids[draggedFlask.liquids.length - 1];  // Получаем верхнюю жидкость из колбы
            const liquidHeight = topLiquid.psevdoHeight;  // Получаем высоту жидкости 

            // Проверка, если в бочке достаточно места для жидкости
            if (this.currentVolume + liquidHeight <= this.volume) {
                // Переливаем жидкость в бочку
                this.currentVolume += liquidHeight;  // Увеличиваем объем в бочке
                this.updateBarrelVolume();  // Обновляем отображаемый объем

                // Убираем верхнюю жидкость из колбы
                draggedFlask.liquids.pop();  // Удаляем верхнюю жидкость

                // Также удаляем элемент DOM, который представляет жидкость
                draggedFlask.updateLiquid();  // Перерисовываем жидкость в колбе

                waterSound.play();
                this.onDragLeave();

                // проверка задачи
                const currentTask = gameInstance.getCurrentTask();
                if (currentTask.checkTask()) {
                    gameInstance.completeTask();

                    // После выполнения задания, проверяем, есть ли следующие задания
                    if (gameInstance.getTasks().length != 0) {
                        setTimeout(() => {
                            gameInstance.renderNextTask();
                        }, 2500);
                    } else {
                        gameInstance.renderNextTask();
                    }
                }

            } else {
                this.onDragLeave();
                console.log("Нет достаточного места в бочке для этой жидкости.");
                errorSound.play();
            }
        }
    }

    updateBarrelVolume() {
        this.spanHeight.innerHTML = `${this.currentVolume} л. / ${this.volume} л.`;  // Обновляем отображаемый объем
    }
}
