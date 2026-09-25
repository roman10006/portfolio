// Управление видео
document.addEventListener('DOMContentLoaded', function() {
    const video1 = document.querySelector('.video-1');
    const video2 = document.querySelector('.video-2');
    
    // Убедимся, что видео воспроизводятся
    if (video1) {
        video1.play().catch(e => console.log('Video 1 play failed:', e));
    }
    if (video2) {
        video2.play().catch(e => console.log('Video 2 play failed:', e));
    }
});

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Активная ссылка при прокрутке
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});