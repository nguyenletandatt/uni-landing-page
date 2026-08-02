/**
 * Script cho Section Threats: đếm số và progress bar animation
 * Sẽ được gọi sau khi section được load
 */
(function initThreats() {
  // Đợi DOM ready (nếu cần)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const numberElements = document.querySelectorAll('.threat-stat .number-value');
    if (!numberElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          // Đếm số
          animateNumber(el, target);

          // Kích hoạt progress bar (nếu có)
          const card = el.closest('.threat-card');
          if (card) {
            card.classList.add('visible');
            const progressFill = card.querySelector('.progress-fill');
            if (progressFill) {
              const width = progressFill.getAttribute('data-width');
              if (width) {
                // Sử dụng CSS variable để transition hoạt động
                progressFill.style.setProperty('--progress-width', width + '%');
                // Trigger reflow để transition chạy
                void progressFill.offsetWidth;
                progressFill.style.width = width + '%';
              }
            }
          }

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    numberElements.forEach(el => observer.observe(el));
  }

  function animateNumber(el, target) {
    let current = 0;
    const duration = 1500; // 1.5 giây
    const stepTime = 16; // ~60fps
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current);
    }, stepTime);
  }
})();