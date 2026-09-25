// Параллакс эффект при скролле
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Плавное появление текста
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroTitle.style.transition = 'all 1s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
});