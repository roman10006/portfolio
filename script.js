/* ==========================================================================
   SCRIPT.JS — Чистый JavaScript для портфолио
   Функции: меню, плавный скролл, анимации, подменю, карточки
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // 1. УТИЛИТЫ
  // ==========================================================================

  /**
   * Throttle — ограничивает частоту вызова функции
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce — вызывает функцию после паузы
   */
  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Проверка мобильного устройства
   */
  function isMobile() {
    return window.innerWidth <= 960;
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

      // Закрытие при клике на ссылку в меню
      this.menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => this.close());
      });

      // Закрытие при изменении размера окна (если перешли на десктоп)
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
      if (
        this.isOpen &&
        !this.menu.contains(e.target) &&
        !this.burger.contains(e.target)
      ) {
        this.close();
      }
    },
  };

  // ==========================================================================
  // 3. ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
  // ==========================================================================

  const SmoothScroll = {
    headerHeight: 0,

    init() {
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => this.handleClick(e, link));
      });

      this.updateHeaderHeight();
      window.addEventListener('resize', debounce(() => this.updateHeaderHeight(), 200));
    },

    updateHeaderHeight() {
      const header = document.querySelector('.header');
      this.headerHeight = header ? header.offsetHeight : 0;
    },

    handleClick(e, link) {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (!target) return;

      e.preventDefault();

      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - this.headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Закрываем мобильное меню после клика
      if (BurgerMenu.isOpen) BurgerMenu.close();
    },
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

      // Используем IntersectionObserver для эффективности
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
    },
  };

  // ==========================================================================
  // 5. ВЫПАДАЮЩЕЕ ПОДМЕНЮ
  // ==========================================================================

  const Submenu = {
    init() {
      const items = document.querySelectorAll('.has-submenu');

      items.forEach((item) => {
        const link = item.querySelector(':scope > a');
        const submenu = item.querySelector('.submenu');
        const arrow = item.querySelector('.submenu-arrow');

        if (!link || !submenu) return;

        // Создаём стрелочку, если её нет
        if (!arrow) {
          const arrowEl = document.createElement('span');
          arrowEl.className = 'submenu-arrow';
          arrowEl.innerHTML = '<svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
          link.appendChild(arrowEl);
        }

        // Десктоп: hover
        if (!isMobile()) {
          item.addEventListener('mouseenter', () => this.open(item));
          item.addEventListener('mouseleave', () => this.close(item));
        }

        // Мобильный: клик
        link.addEventListener('click', (e) => {
          if (isMobile()) {
            e.preventDefault();
            this.toggleMobile(item);
          }
        });
      });

      // Пересоздаём обработчики при ресайзе
      window.addEventListener('resize', debounce(() => {
        // Сбрасываем все открытые подменю
        document.querySelectorAll('.has-submenu--open').forEach((item) => {
          item.classList.remove('has-submenu--open');
        });
      }, 300));
    },

    open(item) {
      if (isMobile()) return;
      item.classList.add('has-submenu--open');
    },

    close(item) {
      item.classList.remove('has-submenu--open');
    },

    toggleMobile(item) {
      const isOpen = item.classList.contains('has-submenu--open');

      // Закрываем все остальные подменю на том же уровне
      const siblings = item.parentElement.querySelectorAll('.has-submenu');
      siblings.forEach((sibling) => {
        if (sibling !== item) sibling.classList.remove('has-submenu--open');
      });

      item.classList.toggle('has-submenu--open', !isOpen);
    },
  };

  // ==========================================================================
  // 6. АНИМАЦИИ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
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
              observer.unobserve(entry.target); // Анимируем только один раз
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      animatedElements.forEach((el) => observer.observe(el));
    },
  };

  // ==========================================================================
  // 7. КЛИКАБЕЛЬНЫЕ КАРТОЧКИ
  // ==========================================================================

  const ClickableCards = {
    init() {
      const cards = document.querySelectorAll('.card');

      cards.forEach((card) => {
        const link = card.querySelector('a.card__link');
        if (!link) return;

        // Делаем всю карточку кликабельной
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          // Не перехватываем клики по кнопкам и другим ссылкам внутри
          if (e.target.closest('button') || e.target.closest('a:not(.card__link)')) {
            return;
          }
          e.preventDefault();
          link.click();
        });

        // Открываем в новой вкладке при среднем клике
        card.addEventListener('auxclick', (e) => {
          if (e.button === 1) {
            e.preventDefault();
            const url = link.getAttribute('href');
            if (url) window.open(url, '_blank');
          }
        });
      });
    },
  };

  // ==========================================================================
  // 8. ФИКСИРОВАННАЯ ШАПКА — ИЗМЕНЕНИЕ ПРИ СКРОЛЛЕ
  // ==========================================================================

  const StickyHeader = {
    header: null,

    init() {
      this.header = document.querySelector('.header');
      if (!this.header) return;

      const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
          this.header.classList.add('header--scrolled');
        } else {
          this.header.classList.remove('header--scrolled');
        }
      }, 100);

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Проверяем сразу при загрузке
    },
  };

  // ==========================================================================
  // 9. ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ (нативная + fallback)
  // ==========================================================================

  const LazyImages = {
    init() {
      const images = document.querySelectorAll('img[data-src]');

      if ('loading' in HTMLImageElement.prototype) {
        // Нативная поддержка — просто меняем src
        images.forEach((img) => {
          img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        });
      } else {
        // Fallback через IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              if (img.dataset.srcset) img.srcset = img.dataset.srcset;
              observer.unobserve(img);
            }
          });
        });

        images.forEach((img) => observer.observe(img));
      }
    },
  };

  // ==========================================================================
  // 10. ЗАПУСК ВСЕХ МОДУЛЕЙ
  // ==========================================================================

  function init() {
    BurgerMenu.init();
    SmoothScroll.init();
    ActiveMenu.init();
    Submenu.init();
    ScrollAnimations.init();
    ClickableCards.init();
    StickyHeader.init();
    LazyImages.init();

    console.log('✅ Portfolio JS initialized');
  }

  // Запуск после полной загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();