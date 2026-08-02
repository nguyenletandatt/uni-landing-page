/**
 * Script cho Hero Section – SOC Dashboard động
 * Cập nhật số liệu, biểu đồ, feed mỗi 4 giây
 */
(function initHeroDashboard() {
  // Đợi DOM và các phần tử sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const dashboard = document.getElementById('socDashboard');
    if (!dashboard) return;

    const loading = document.getElementById('socLoading');
    const content = document.getElementById('socContent');

    // Hiển thị loading, sau 1 giây chuyển sang content
    setTimeout(() => {
      if (loading) loading.style.display = 'none';
      if (content) content.style.display = 'block';
      // Bắt đầu cập nhật dữ liệu
      startUpdating();
    }, 1000);
  }

  function startUpdating() {
    // Cập nhật lần đầu
    updateMetrics();
    // Lặp mỗi 4 giây
    setInterval(updateMetrics, 4000);
  }

  function updateMetrics() {
    // --- Cập nhật tổng số chặn ---
    const totalEl = document.getElementById('totalBlocked');
    if (totalEl) {
      // Giả lập tăng nhẹ
      let current = parseFloat(totalEl.textContent.replace(',', ''));
      if (isNaN(current) || current === 0) current = 2.14;
      const increment = (Math.random() * 0.03 + 0.01);
      const newVal = (current + increment).toFixed(2);
      totalEl.textContent = newVal;
    }

    // --- Cập nhật % thay đổi ---
    const changeEl = document.getElementById('kpiChange');
    if (changeEl) {
      const change = (Math.random() * 20 + 300).toFixed(0);
      changeEl.textContent = `▲ ${change}%`;
    }

    // --- Cập nhật NGFW / WAF ---
    const ngfw = document.getElementById('ngfwValue');
    const waf = document.getElementById('wafValue');
    if (ngfw && waf) {
      const ng = Math.floor(Math.random() * 30 + 50);
      const wa = Math.floor(Math.random() * 20 + 20);
      ngfw.textContent = ng + '%';
      waf.textContent = wa + '%';
    }

    // --- Cập nhật Threat breakdown ---
    const malware = document.getElementById('threatMalware');
    const bypass = document.getElementById('threatBypass');
    if (malware && bypass) {
      const mal = Math.floor(Math.random() * 20 + 55);
      const byp = Math.floor(Math.random() * 15 + 10);
      malware.textContent = mal + '%';
      bypass.textContent = byp + '%';
    }

    // --- Cập nhật biểu đồ cột ---
    const bars = document.querySelectorAll('#chartBars .bar');
    if (bars.length) {
      // Tạo dữ liệu mới (6 giá trị)
      const newData = [];
      for (let i = 0; i < 6; i++) {
        newData.push(Math.floor(Math.random() * 200 + 50));
      }
      bars.forEach((bar, idx) => {
        if (idx < newData.length) {
          const val = newData[idx];
          const height = Math.min(130, Math.max(20, val / 8));
          bar.style.height = height + 'px';
          bar.setAttribute('data-value', val);
        }
      });
    }

    // --- Cập nhật Live Feed ---
    const feedContainer = document.getElementById('feedMessages');
    if (feedContainer) {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const messages = [
        `[${timeStr}] 🟢 Chặn ${Math.floor(Math.random()*10+1)} email giả mạo cơ quan nhà nước`,
        `[${timeStr}] 🔴 Phát hiện tấn công brute-force từ ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        `[${timeStr}] 🟡 Cảnh báo truy cập trái phép vào hệ thống nội bộ`,
        `[${timeStr}] 🟢 Cập nhật thành công danh sách đen mới (${Math.floor(Math.random()*100+50)} signatures)`,
        `[${timeStr}] 🔴 Phát hiện lỗ hổng zero-day trong ứng dụng web`,
        `[${timeStr}] 🟢 Đã ngăn chặn ${Math.floor(Math.random()*5+1)} cuộc tấn công DDoS`
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      // Giữ tối đa 4 dòng
      const children = feedContainer.children;
      if (children.length >= 4) {
        feedContainer.removeChild(children[children.length - 1]);
      }
      const newDiv = document.createElement('div');
      newDiv.className = 'feed-message';
      newDiv.textContent = randomMsg;
      feedContainer.prepend(newDiv);
    }

    // --- Cập nhật trạng thái LIVE (nhấp nháy) ---
    const badge = document.getElementById('liveBadge');
    if (badge) {
      badge.style.opacity = Math.random() > 0.5 ? '1' : '0.7';
    }
  }
})();