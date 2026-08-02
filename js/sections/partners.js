/**
 * Script cho Partners Section – đếm số stats
 * Tự động chạy khi được load (không dùng DOMContentLoaded)
 */
(function initPartnersStats() {
  // Hàm khởi tạo chính
  function initStats() {
    // Tìm tất cả phần tử .stat-number trong partners section
    const statNumbers = document.querySelectorAll('#partners .stat-number[data-target]');
    if (!statNumbers.length) {
      console.warn('⚠️ Partners: Không tìm thấy .stat-number[data-target] trong #partners');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
          if (isNaN(target)) return;
          animateNumber(el, target, decimals);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => observer.observe(el));
    console.log(`✅ Partners Stats: Đã kích hoạt đếm số cho ${statNumbers.length} phần tử`);
  }

  function animateNumber(el, target, decimals) {
    // Nếu đã đếm xong thì không chạy lại
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    let current = 0;
    const duration = 1800; // 1.8 giây
    const stepTime = 16; // ~60fps
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

  // Khởi tạo ngay lập tức nếu DOM đã sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStats);
  } else {
    // Đợi một chút để đảm bảo các phần tử đã được render
    setTimeout(initStats, 100);
  }

  // Hỗ trợ tải động (nếu có fetch)
  // Lắng nghe sự thay đổi DOM để kích hoạt lại
  const observer = new MutationObserver(() => {
    const statNumbers = document.querySelectorAll('#partners .stat-number[data-target]:not([data-animated])');
    if (statNumbers.length) {
      // Khởi tạo lại cho các phần tử mới
      const tempObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-target'));
            const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
            if (isNaN(target)) return;
            animateNumber(el, target, decimals);
            tempObserver.unobserve(el);
          }
        });
      }, { threshold: 0.3 });
      statNumbers.forEach(el => tempObserver.observe(el));
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();