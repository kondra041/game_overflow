// script.js
const bubbleContainer = document.querySelector('.bubble-container');

function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  
  const size = Math.random() * 20 + 10;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.bottom = `-${size}px`;
  
  bubble.style.animationDelay = `${Math.random() * 3}s`;
  
  bubbleContainer.appendChild(bubble);
  
  setTimeout(() => {
    bubble.remove();
  }, 6000);
}

setInterval(createBubble, 300);
