/**
 * SCRIPT.JS — Чистый JavaScript для портфолио
 * Функции: бегущая строка логотипа, меню, скролл, анимации, карточки
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. УТИЛИТЫ
  // ==========================================================================

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function isMobile() {
    return window.innerWidth <= 1200;
  }

  // ==========================================================================
  // 2. МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
  // ==========================================================================

  const BurgerMenu = {
    burger: null,
    menu: null,
    body: document.body,
    isOpen: false,

    init() {
      this.burger = document.querySelector('.burger');
      this.menu = document.querySelector('.nav__list');

      if (!this.burger || !this.menu) return;

      this.burger.addEventListener('click', () => this.toggle());
      document.addEventListener('click', (e) => this.closeOutside(e));

      // Закрываем меню при клике на любую ссылку внутри него
      this.menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => this.close());
      });

      // Закрываем меню, если экран расширился до десктопа
      window.addEventListener('resize', debounce(() => {
        if (!isMobile() && this.isOpen) this.close();
      }, 200));
    },

    toggle() {
      this.isOpen ? this.close() : this.open();
    },

    open() {
      this.isOpen = true;
      this.burger.classList.add('burger--active');
      this.menu.classList.add('nav__list--open');
      this.body.classList.add('body--menu-open');
      this.burger.setAttribute('aria-expanded', 'true');
    },

    close() {
      this.isOpen = false;
      this.burger.classList.remove('burger--active');
      this.menu.classList.remove('nav__list--open');
      this.body.classList.remove('body--menu-open');
      this.burger.setAttribute('aria-expanded', 'false');
    },

    closeOutside(e) {
      if (this.isOpen && !this.menu.contains(e.target) && !this.burger.contains(e.target)) {
        this.close();
      }
    }
  };

  // ==========================================================================
  // 3. ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
  // ==========================================================================

  const SmoothScroll = {
    headerHeight: 80, // Высота фиксированной шапки

    init() {
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => this.handleClick(e, link));
      });
    },

    handleClick(e, link) {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (!target) return;

      e.preventDefault();

      // Вычисляем позицию с учётом высоты шапки и небольшого отступа
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - this.headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      if (BurgerMenu.isOpen) BurgerMenu.close();
    }
  };

  // ==========================================================================
  // 4. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ПРИ СКРОЛЛЕ
  // ==========================================================================

  const ActiveMenu = {
    sections: [],
    navLinks: [],

    init() {
      this.sections = Array.from(document.querySelectorAll('section[id]'));
      this.navLinks = Array.from(document.querySelectorAll('.nav__list a[href^="#"]'));

      if (this.sections.length === 0) return;

      // Используем IntersectionObserver для высокой производительности
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              this.setActive(id);
            }
          });
        },
        {
          rootMargin: `-${SmoothScroll.headerHeight + 50}px 0px -50% 0px`,
          threshold: 0,
        }
      );

      this.sections.forEach((section) => observer.observe(section));
    },

    setActive(id) {
      this.navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.classList.add('nav__link--active');
        } else {
          link.classList.remove('nav__link--active');
        }
      });
    }
  };

  // ==========================================================================
  // 5. АНИМАЦИИ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
  // ==========================================================================

  const ScrollAnimations = {
    init() {
      const animatedElements = document.querySelectorAll(
        '.animate, .animate-up, .animate-left, .animate-right, .animate-zoom, .animate-fade'
      );

      if (animatedElements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate--visible');
              // Перестаем следить за элементом после анимации (анимируем только 1 раз)
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      animatedElements.forEach((el) => observer.observe(el));
    }
  };

  // ==========================================================================
  // 6. ФИКСИРОВАННАЯ ШАПКА — ТЕНЬ ПРИ СКРОЛЛЕ
  // ==========================================================================

  const StickyHeader = {
    header: null,

    init() {
      this.header = document.querySelector('.header');
      if (!this.header) return;

      const handleScroll = () => {
        if (window.scrollY > 20) {
          this.header.classList.add('header--scrolled');
        } else {
          this.header.classList.remove('header--scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Проверка при загрузке
    }
  };

  // ==========================================================================
  // 7. КЛИКАБЕЛЬНЫЕ КАРТОЧКИ (Вся карточка кликабельна, если есть ссылка)
  // ==========================================================================

  const ClickableCards = {
    init() {
      const cards = document.querySelectorAll('.card');

      cards.forEach((card) => {
        const link = card.querySelector('a.card__link');
        if (!link) return;

        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
          // Не перехватываем клик, если пользователь нажал на кнопку или другую ссылку внутри карточки
          if (e.target.closest('button') || e.target.closest('a:not(.card__link)')) {
            return;
          }
          e.preventDefault();
          link.click();
        });

        // Открываем в новой вкладке при среднем клике (колесиком мыши)
        card.addEventListener('auxclick', (e) => {
          if (e.button === 1) {
            e.preventDefault();
            const url = link.getAttribute('href');
            if (url) window.open(url, '_blank');
          }
        });
      });
    }
  };

  // ==========================================================================
  // 8. ЗАПУСК ВСЕХ МОДУЛЕЙ
  // ==========================================================================

  function init() {
    BurgerMenu.init();
    SmoothScroll.init();
    ActiveMenu.init();
    ScrollAnimations.init();
    StickyHeader.init();
    ClickableCards.init();

    console.log('✅ Portfolio JS initialized successfully');
  }

  // Ждем полной загрузки DOM перед запуском
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();