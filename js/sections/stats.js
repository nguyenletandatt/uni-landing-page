(function() {
  function initStats() {
    // Tìm tất cả các số cần đếm trong toàn bộ trang
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-count'));
          const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
          if (isNaN(target)) return;
          animateNumber(el, target, decimals);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => observer.observe(el));
  }

  function animateNumber(el, target, decimals) {
    let current = 0;
    const duration = 1800;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current.toFixed(decimals);
    }, stepTime);
  }

  // Khởi tạo ngay lập tức nếu DOM đã sẵn sàng, hoặc đợi DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStats);
  } else {
    initStats();
  }
})();