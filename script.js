document.addEventListener('DOMContentLoaded', function() {
  // Элементы DOM
  const maybeBtn = document.getElementById("maybeBtn");
  const yesBtn = document.getElementById("yesBtn");
  const question = document.getElementById("question");
  const subtext = document.getElementById("subtext");
  const beforeGif = document.getElementById("beforeGif");
  const afterGif = document.getElementById("afterGif");
  const confettiCanvas = document.getElementById("confettiCanvas");
  const swipeHint = document.getElementById("swipeHint");
  const buttonsContainer = document.querySelector('.buttons');
  
  // Состояние
  let yesScale = 1;
  let maybeScale = 1;
  let clicks = 0;
  let confettiActive = false;
  let isProcessingClick = false;
  let finalMessageShown = false; // Флаг для финального сообщения
  
  // Тексты для кнопки "Может быть"
  const maybeTexts = [
    { text: "Может быть... 🙃", scale: 0.9, message: "Хм, интересно..." },
    { text: "Ты уверен? 😅", scale: 0.8, message: "Ты точно уверен в этом?" },
    { text: "Не торопи меня! 😉", scale: 0.7, message: "Давай не будем спешить!" },
    { text: "Дай подумать... 🤔", scale: 0.6, message: "Я должна всё обдумать..." },
    { text: "Не разбивай мне сердце! 💔", scale: 0.5, message: "А вдруг не получится?" },
    { text: "Ой, ладно... 😊", scale: 0.4, message: "Кажется, ты меня убеждаешь!" },
    { text: "Хорошо, уговорил! 💛", scale: 0.3, message: "Ладно, я сдаюсь!" }
  ];
  
  // Инициализация
  initApp();
  
  function initApp() {
    // Настройка Canvas для конфетти
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    // Скрыть подсказку через 5 секунд
    setTimeout(() => {
      swipeHint.style.opacity = '0';
      setTimeout(() => swipeHint.style.display = 'none', 300);
    }, 5000);
    
    // Адаптация к ориентации
    window.addEventListener('resize', handleResize);
    handleResize();
  }
  
  function handleResize() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    // Скрыть подсказку на больших экранах
    if (window.innerWidth >= 768) {
      swipeHint.style.display = 'none';
    }
  }
  
  // Кнопка "Может быть..."
  maybeBtn.addEventListener("click", handleMaybeClick);
  maybeBtn.addEventListener("touchstart", handleMaybeClick, { passive: true });
  
  async function handleMaybeClick() {
    if (isProcessingClick) return;
    isProcessingClick = true;
    
    if (navigator.vibrate) navigator.vibrate(20);
    
    const maybeIndex = Math.min(clicks, maybeTexts.length - 1);
    
    // Увеличиваем кнопку "Да"
    yesScale += 0.6;
    yesBtn.style.transform = `scale(${yesScale})`;
    
    // Показываем сообщение
    showMessage(maybeTexts[maybeIndex].message);
    
    // Меняем текст кнопки
    maybeBtn.querySelector('.btn-text').textContent = maybeTexts[maybeIndex].text;
    
    // Анимация уменьшения
    maybeScale = maybeTexts[maybeIndex].scale;
    maybeBtn.style.transition = 'transform 0.4s ease';
    maybeBtn.style.transform = `scale(${maybeScale})`;
    
    if (yesScale > 1.5) yesBtn.style.zIndex = 20;
    
    for (let i = 0; i < 2; i++) createHeart();
    
    // Увеличиваем счетчик кликов
    clicks++;
    
    // Если это последний текст
    if (maybeIndex === maybeTexts.length - 1) {
      setTimeout(() => {
        maybeBtn.style.opacity = '0';
        maybeBtn.style.transform = 'scale(0.1)';
        maybeBtn.style.pointerEvents = 'none';
        
        // Создаем сердечки
        for (let i = 0; i < 8; i++) setTimeout(() => createHeart(), i * 150);
      }, 400);
    }
    
    setTimeout(() => {
      isProcessingClick = false;
    }, 400);
  }
  
  // Показать всплывающее сообщение
  function showMessage(text) {
    const oldMessage = document.querySelector('.popup-message');
    if (oldMessage) oldMessage.remove();
    
    const message = document.createElement('div');
    message.className = 'popup-message';
    message.textContent = text;
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 107, 139, 0.95);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 18px;
      font-weight: 600;
      z-index: 1000;
      box-shadow: 0 5px 20px rgba(0,0,0,0.3);
      animation: popupFade 1.8s ease forwards;
      text-align: center;
      max-width: 80%;
      word-wrap: break-word;
      pointer-events: none;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
      }
    }, 1500);
  }
  
  // Добавляем стили для всплывающих сообщений
  const popupStyle = document.createElement('style');
  popupStyle.textContent = `
    @keyframes popupFade {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
      30% { transform: translate(-50%, -50%) scale(1); }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(popupStyle);
  
  // Кнопка "Да, конечно!"
  yesBtn.addEventListener("click", handleYesClick);
  yesBtn.addEventListener("touchstart", handleYesClick, { passive: true });
  
  function handleYesClick() {
    if (finalMessageShown) return; // Защита от повторного нажатия
    finalMessageShown = true;
    
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    // Скрываем кнопку "Может быть"
    maybeBtn.style.opacity = '0';
    maybeBtn.style.transform = 'scale(0.1)';
    maybeBtn.style.pointerEvents = 'none';
    
    // Увеличиваем кнопку "Да"
    yesScale = 3;
    yesBtn.style.transform = `scale(${yesScale})`;
    yesBtn.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
    yesBtn.style.zIndex = 30;
    yesBtn.style.boxShadow = '0 10px 30px rgba(255, 107, 139, 0.6)';
    
    // Показываем сообщение
    showMessage("Ура! Ты сделала правильный выбор! 💖");
    
    // ОДИН ЕДИНСТВЕННЫЙ вызов для смены контента
    setTimeout(() => {
      showFinalContent();
    }, 800);
  }
  
  // Функция показа финального контента (вызывается только один раз!)
  function showFinalContent() {
    // Скрываем старый контент
    beforeGif.classList.add('hidden');
    subtext.style.display = 'none';
    
    // Показываем новый GIF
    afterGif.classList.remove('hidden');
    
    // Скрываем кнопки
    buttonsContainer.style.opacity = '0';
    buttonsContainer.style.transform = 'translateY(20px)';
    buttonsContainer.style.pointerEvents = 'none';
    
    // Меняем фон
    document.body.style.background = 'linear-gradient(135deg, #ff6b8b 0%, #ff9a9e 100%)';
    
    // Сердечки
    for (let i = 0; i < 20; i++) setTimeout(() => createHeart(), i * 80);
    
    // Конфетти
    startConfetti();
    
    // Меняем основной текст вопроса (ОДИН РАЗ!)
    question.innerHTML = `
      <span class="greeting">Ура! Ты согласилась! 🎉</span>
      <span class="main-text">С днём Святого Валентина,<br>Айжанка! 💖</span>
    `;
    question.style.color = 'white';
    question.style.textShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    // Добавляем финальное сообщение (ОДИН РАЗ!)
    const finalText = document.createElement('p');
    finalText.className = 'final-message';
    finalText.innerHTML = 'Спасибо, что делаешь мои дни светлее! 🌷<br>Этот месяц был чудесным благодаря тебе! ✨';
    finalText.style.cssText = `
      color: white;
      margin-top: 25px;
      font-size: 17px;
      line-height: 1.5;
      opacity: 0;
      animation: fadeIn 1s ease 0.5s forwards;
      text-shadow: 0 1px 3px rgba(0,0,0,0.2);
      max-width: 90%;
      margin-left: auto;
      margin-right: auto;
    `;
    
    // Убеждаемся, что добавляем только один раз
    const existingFinalText = document.querySelector('.final-message');
    if (!existingFinalText) {
      question.parentNode.appendChild(finalText);
    }
    
    // Добавляем анимацию
    const finalStyle = document.createElement('style');
    finalStyle.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(finalStyle);
  }
  
  // Создание летающих сердечек
  function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '💖';
    
    const startX = Math.random() * window.innerWidth;
    const size = 20 + Math.random() * 25;
    
    heart.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${window.innerHeight + 20}px;
      font-size: ${size}px;
      z-index: 100;
      pointer-events: none;
      animation: floatUp ${2 + Math.random() * 3}s ease-in forwards;
      opacity: ${0.7 + Math.random() * 0.3};
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 5000);
  }
  
  // Добавляем CSS для анимации сердечек
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Конфетти
  function startConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    
    const ctx = confettiCanvas.getContext('2d');
    const particles = [];
    const particleCount = 120;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        size: Math.random() * 8 + 4,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 + 2,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }
    
    function drawConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.fillStyle = p.color;
        
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(p.x, p.y, p.size, p.size * 0.7);
        }
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        p.speedX += (Math.random() - 0.5) * 0.2;
        p.speedY += Math.random() * 0.1 + 0.05;
        
        if (p.y > confettiCanvas.height) {
          p.y = 0;
          p.x = Math.random() * confettiCanvas.width;
        }
      }
      
      if (confettiActive) {
        requestAnimationFrame(drawConfetti);
      }
    }
    
    drawConfetti();
    
    setTimeout(() => {
      confettiActive = false;
    }, 6000);
  }
  
  // Предотвращение скролла
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
  });
});