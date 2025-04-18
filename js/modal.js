// modal.js

const openModalRaiting = document.getElementById("openModalRaiting");
const modalHeader = document.getElementById("modalHeader");
const modal = document.getElementById("modal");

const closeModalBtn = document.getElementById("closeModalBtn");
const modalBody = document.getElementById("modalBody");

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
    
});

function showModal(header, body, canClose = true) {

  modalHeader.innerHTML = header;
  modalBody.innerHTML = body;

  modal.style.display = "flex";
  setTimeout(function () {
    modal.style.bottom = "0"; 
  }, 10);

  if (canClose) {

    closeModalBtn.style.display = "block"; 
    closeModalBtn.addEventListener("click", closeModal);

    window.addEventListener("click", handleClickOutsideModal);

  } else {
    closeModalBtn.style.display = "none";
  }

}

function closeModal() {
  modal.style.bottom = "-100%";
  window.removeEventListener("click", handleClickOutsideModal);
  setTimeout(function () {
    modal.style.display = "none";
  }, 500); 
}

function handleClickOutsideModal(event){
  if (event.target === modal) {
    modal.style.bottom = "-100%";
    setTimeout(function () {
      modal.style.display = "none";
    }, 500);
  }
}


// Функция для отображения модального окна с сообщением о завершении уровня
function showLevelCompletedMessage() {
  modalBody.innerHTML = `
    <h2>Уровень завершён!</h2>
    <p>Поздравляем, вы прошли уровень!</p>
    <button id="nextLevelBtn">Перейти на следующий уровень</button>
  `;

  modal.style.display = "flex";
  setTimeout(function () {
    modal.style.bottom = "0"; // Плавное появление снизу
  }, 10);

  // Обработчик для кнопки перехода на следующий уровень
  document.getElementById("nextLevelBtn").addEventListener("click", function () {

    console.log("Переход на следующий уровень");
    modal.style.bottom = "-100%";
    setTimeout(function () {
      modal.style.display = "none";
    }, 500);
  });
}
