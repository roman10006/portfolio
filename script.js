// Ожидание полной загрузки структуры документа
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Управление уведомлением о Cookie
    const cookieNotice = document.getElementById('cookieNotice');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    // Проверка локального хранилища на наличие отметки о согласии
    if (localStorage.getItem('cookiesAccepted')) {
        cookieNotice.style.display = 'none';
    } else {
        cookieNotice.style.display = 'flex';
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieNotice.style.display = 'none';
    });

    // 2. Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Обработка отправки контактной формы (имитация)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Сообщение успешно сформировано. В реальном проекте здесь будет интеграция с почтовым сервисом или Telegram-ботом.');
            contactForm.reset();
        });
    }
});