/**
 * Solutions Section - Modal & Interactions
 */
(function initSolutions() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const modalOverlay = document.getElementById('solutionModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.getElementById('modalClose');

    // Dữ liệu chi tiết cho từng giải pháp
    const solutionData = {
      ngfw: {
        icon: 'bi-shield-lock-fill',
        title: 'Firewall thế hệ mới (NGFW)',
        subtitle: 'Kiểm soát biên mạng toàn diện với hiệu suất cao và bảo mật lớp 7.',
        features: [
          'Kiểm soát lưu lượng theo ứng dụng và người dùng',
          'IPS/IDS tích hợp phát hiện xâm nhập',
          'VPN site-to-site và remote access (IPSec/SSL)',
          'Phân vùng DMZ, Server và mạng nội bộ',
          'Tích hợp với Mạng số liệu chuyên dùng'
        ],
        benefits: [
          'Giảm 70% rủi ro tấn công từ bên ngoài',
          'Quản trị tập trung, báo cáo chi tiết',
          'Tuân thủ quy định về an toàn thông tin'
        ],
        cta: 'Đăng ký tư vấn NGFW'
      },
      soc: {
        icon: 'bi-binoculars-fill',
        title: 'SOC - Giám sát 24/7',
        subtitle: 'Trung tâm điều hành an ninh giám sát và ứng phó sự cố liên tục.',
        features: [
          'Thu thập và phân tích nhật ký hệ thống (SIEM)',
          'Phát hiện bất thường theo hành vi (UEBA)',
          'Quy trình ứng phó sự cố (IRP)',
          'Báo cáo tình trạng an ninh định kỳ',
          'Đội ngũ chuyên gia phân tích 24/7'
        ],
        benefits: [
          'Thời gian phát hiện giảm từ 205 ngày xuống dưới 24 giờ',
          'Phản ứng sự cố kịp thời, hạn chế thiệt hại',
          'Tuân thủ yêu cầu giám sát theo Nghị định 13'
        ],
        cta: 'Đăng ký tư vấn SOC'
      },
      edr: {
        icon: 'bi-laptop-fill',
        title: 'Bảo vệ điểm cuối (EPP/EDR)',
        subtitle: 'Giải pháp bảo vệ toàn diện cho thiết bị đầu cuối.',
        features: [
          'Chống mã độc thế hệ mới (NGAV)',
          'Phát hiện và ứng phó điểm cuối (EDR)',
          'Quản trị tập trung qua một bảng điều khiển',
          'Phân tích hành vi và phong tỏa chủ động',
          'Tích hợp với SOC và SIEM'
        ],
        benefits: [
          'Phát hiện 99% mã độc chưa từng biết (zero-day)',
          'Giảm thời gian khắc phục sự cố tới 80%',
          'Bảo vệ PC, laptop, server với một chính sách'
        ],
        cta: 'Đăng ký tư vấn EDR'
      },
      waf: {
        icon: 'bi-globe2',
        title: 'WAF - Bảo vệ ứng dụng web',
        subtitle: 'Lá chắn bảo vệ website, cổng thông tin và ứng dụng web.',
        features: [
          'Phòng chống OWASP Top 10 (SQLi, XSS, CSRF...)',
          'Chặn bot và tấn công DDoS lớp 7',
          'Tự động cập nhật luật bảo mật',
          'Bảo vệ nhiều website với chính sách riêng',
          'Báo cáo và cảnh báo thời gian thực'
        ],
        benefits: [
          'Bảo vệ Cổng thông tin điện tử theo Nghị định 43',
          'Giảm 95% rủi ro tấn công vào ứng dụng web',
          'Dễ dàng triển khai, không cần sửa code'
        ],
        cta: 'Đăng ký tư vấn WAF'
      },
      backup: {
        icon: 'bi-hdd-stack-fill',
        title: 'Lưu trữ & Sao lưu an toàn',
        subtitle: 'Giải pháp bảo vệ dữ liệu theo mô hình 3-2-1.',
        features: [
          'Hệ thống NAS tập trung, dung lượng lớn',
          'Sao lưu tự động theo lịch trình',
          'Bản sao bất biến (immutable) chống ransomware',
          'Kịch bản khôi phục thảm họa (DR)',
          'Mã hóa dữ liệu khi truyền và lưu trữ'
        ],
        benefits: [
          'Phục hồi nhanh chóng, mất mát dữ liệu tối thiểu',
          'Đáp ứng yêu cầu sao lưu của Nghị định 53',
          'An toàn trước các cuộc tấn công mã hóa tống tiền'
        ],
        cta: 'Đăng ký tư vấn Backup'
      },
      email: {
        icon: 'bi-envelope-paper-fill',
        title: 'An toàn thư điện tử',
        subtitle: 'Bảo vệ hộp thư và dữ liệu thư điện tử khỏi các mối đe dọa.',
        features: [
          'Chặn thư giả mạo (phishing, spear-phishing)',
          'Quét mã độc trong file đính kèm',
          'Phát hiện liên kết độc hại trong thư',
          'Xác thực người gửi (SPF, DKIM, DMARC)',
          'Lưu trữ và mã hóa thư nhạy cảm'
        ],
        benefits: [
          'Giảm 90% nguy cơ bị tấn công qua email',
          'Bảo vệ thông tin nhạy cảm trong giao tiếp',
          'Tuân thủ quy định bảo mật thông tin'
        ],
        cta: 'Đăng ký tư vấn Email Security'
      },
      pentest: {
        icon: 'bi-search-heart-fill',
        title: 'Đánh giá & Kiểm thử xâm nhập',
        subtitle: 'Phát hiện và xử lý các lỗ hổng an ninh trước khi bị khai thác.',
        features: [
          'Dò quét lỗ hổng tự động và thủ công',
          'Kiểm thử xâm nhập (penetration test)',
          'Đánh giá bảo mật ứng dụng web và mobile',
          'Xây dựng hồ sơ cấp độ an toàn',
          'Tư vấn khắc phục và giám sát sau xử lý'
        ],
        benefits: [
          'Phát hiện 85% lỗ hổng tiềm ẩn',
          'Đáp ứng yêu cầu của các quy định về an toàn TT',
          'Nâng cao nhận thức và văn hóa bảo mật'
        ],
        cta: 'Đăng ký tư vấn Pentest'
      },
      iam: {
        icon: 'bi-person-badge-fill',
        title: 'Quản lý truy cập & Xác thực',
        subtitle: 'Kiểm soát chặt chẽ danh tính và quyền truy cập.',
        features: [
          'Xác thực đa yếu tố (MFA)',
          'Phân quyền truy cập dựa trên vai trò (RBAC)',
          'Quản lý tài khoản đặc quyền (PAM)',
          'Đồng bộ danh tính (SSO, LDAP, AD)',
          'Giám sát và ghi nhật ký truy cập'
        ],
        benefits: [
          'Giảm 80% rủi ro tấn công nội bộ',
          'Đáp ứng yêu cầu kiểm soát truy cập theo Nghị định 13',
          'Quản trị tập trung, giảm chi phí vận hành'
        ],
        cta: 'Đăng ký tư vấn IAM'
      }
    };

    // Mở modal
    function openModal(solutionKey) {
      const data = solutionData[solutionKey];
      if (!data) return;

      const featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');
      const benefitsHtml = data.benefits.map(b => `<li>${b}</li>`).join('');

      modalBody.innerHTML = `
        <div class="modal-icon"><i class="bi ${data.icon}"></i></div>
        <h2 class="modal-title">${data.title}</h2>
        <p class="modal-subtitle">${data.subtitle}</p>

        <div class="modal-section">
          <h4><i class="bi bi-check-circle-fill"></i> Tính năng nổi bật</h4>
          <ul>${featuresHtml}</ul>
        </div>

        <div class="modal-section">
          <h4><i class="bi bi-star-fill"></i> Lợi ích mang lại</h4>
          <ul>${benefitsHtml}</ul>
        </div>

        <a href="#registration" class="modal-cta">
          ${data.cta} <i class="bi bi-arrow-right"></i>
        </a>
      `;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Đóng modal
    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      // Đợi animation kết thúc rồi mới clear content (tùy chọn)
    }

    // --- Sự kiện click vào các nút "Xem chi tiết" ---
    document.querySelectorAll('.solution-link').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Không bị ảnh hưởng bởi event bubbling
        const target = this.dataset.target;
        if (target) {
          openModal(target);
        }
      });
    });

    // Đóng khi click overlay
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });

    // Đóng bằng nút close
    closeBtn.addEventListener('click', closeModal);

    // Đóng bằng phím ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    // Cleanup khi section bị unload (dùng cho SPA)
    window.addEventListener('beforeunload', function() {
      document.body.style.overflow = '';
    });
  }
})();