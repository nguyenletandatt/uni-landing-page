/**
 * Solutions – Shield Connections & Typing Effect
 */
(function initSolutions() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    function init() {
        const modalOverlay = document.getElementById("solutionModal");
        const modalBody = document.getElementById("modalBody");
        const closeBtn = document.getElementById("modalClose");
        const solutionsSection = document.getElementById("solutions");
        const svg = document.querySelector(".connections-svg");

        // ============================================
        // 1. VẼ ĐƯỜNG KẾT NỐI (SVG)
        // ============================================
        function drawConnections() {
            if (!svg) return;
            const board = svg.closest(".solutions-graphic-board");
            if (!board) return;
            const boardRect = board.getBoundingClientRect();

            // Tìm khiên trung tâm
            const shield = board.querySelector(".solutions-shield");
            if (!shield) return;
            const shieldRect = shield.getBoundingClientRect();
            const cx = shieldRect.left + shieldRect.width / 2 - boardRect.left;
            const cy = shieldRect.top + shieldRect.height / 2 - boardRect.top;

            // Tìm tất cả các thẻ (trừ core-panel)
            const cards = board.querySelectorAll(".solution-callout");
            let lines = [];

            cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const x = rect.left + rect.width / 2 - boardRect.left;
                const y = rect.top + rect.height / 2 - boardRect.top;
                lines.push({ x1: cx, y1: cy, x2: x, y2: y });
            });

            // Vẽ SVG
            const width = boardRect.width;
            const height = boardRect.height;
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            svg.setAttribute("width", width);
            svg.setAttribute("height", height);

            let svgContent = "";
            lines.forEach((line) => {
                svgContent += `<line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" 
                                stroke="rgba(139, 220, 255, 0.25)" stroke-width="1.8" 
                                stroke-dasharray="5 6" />`;
                // Thêm điểm phát sáng nhỏ ở đầu các đường (optional)
                svgContent += `<circle cx="${line.x2}" cy="${line.y2}" r="2.5" fill="rgba(139, 220, 255, 0.3)" />`;
            });
            svg.innerHTML = svgContent;
        }

        // Gọi vẽ lần đầu và khi resize
        if (svg) {
            // Đợi 1 tick để layout ổn định
            requestAnimationFrame(() => {
                drawConnections();
            });
        }

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 1199) {
                    drawConnections();
                } else {
                    if (svg) svg.innerHTML = ""; // Xóa trên mobile
                }
            }, 200);
        });

        // ============================================
        // 2. MODAL (giữ nguyên logic cũ)
        // ============================================
        const solutionData = {
            ngfw: {
                icon: "bi-shield-lock-fill",
                title: "Firewall thế hệ mới (NGFW)",
                subtitle: "Kiểm soát biên mạng toàn diện với hiệu suất cao và bảo mật lớp 7.",
                features: [
                    "Kiểm soát lưu lượng theo ứng dụng và người dùng",
                    "IPS/IDS tích hợp phát hiện xâm nhập",
                    "VPN site-to-site và remote access (IPSec/SSL)",
                    "Phân vùng DMZ, Server và mạng nội bộ",
                    "Tích hợp với Mạng số liệu chuyên dùng",
                ],
                benefits: [
                    "Giảm 70% rủi ro tấn công từ bên ngoài",
                    "Quản trị tập trung, báo cáo chi tiết",
                    "Tuân thủ quy định về an toàn thông tin",
                ],
                cta: "Đăng ký tư vấn NGFW",
            },
            soc: {
                icon: "bi-binoculars-fill",
                title: "SOC – Giám sát 24/7",
                subtitle: "Trung tâm điều hành an ninh giám sát và ứng phó sự cố liên tục.",
                features: [
                    "Thu thập và phân tích nhật ký hệ thống (SIEM)",
                    "Phát hiện bất thường theo hành vi (UEBA)",
                    "Quy trình ứng phó sự cố (IRP)",
                    "Báo cáo tình trạng an ninh định kỳ",
                    "Đội ngũ chuyên gia phân tích 24/7",
                ],
                benefits: [
                    "Thời gian phát hiện giảm từ 205 ngày xuống dưới 24 giờ",
                    "Phản ứng sự cố kịp thời, hạn chế thiệt hại",
                    "Tuân thủ yêu cầu giám sát theo Nghị định 13",
                ],
                cta: "Đăng ký tư vấn SOC",
            },
            edr: {
                icon: "bi-laptop-fill",
                title: "Bảo vệ điểm cuối (EPP/EDR)",
                subtitle: "Giải pháp bảo vệ toàn diện cho thiết bị đầu cuối.",
                features: [
                    "Chống mã độc thế hệ mới (NGAV)",
                    "Phát hiện và ứng phó điểm cuối (EDR)",
                    "Quản trị tập trung qua một bảng điều khiển",
                    "Phân tích hành vi và phong tỏa chủ động",
                    "Tích hợp với SOC và SIEM",
                ],
                benefits: [
                    "Phát hiện 99% mã độc chưa từng biết (zero-day)",
                    "Giảm thời gian khắc phục sự cố tới 80%",
                    "Bảo vệ PC, laptop, server với một chính sách",
                ],
                cta: "Đăng ký tư vấn EDR",
            },
            waf: {
                icon: "bi-globe2",
                title: "WAF – Bảo vệ ứng dụng web",
                subtitle: "Lá chắn bảo vệ website, cổng thông tin và ứng dụng web.",
                features: [
                    "Phòng chống OWASP Top 10 (SQLi, XSS, CSRF...)",
                    "Chặn bot và tấn công DDoS lớp 7",
                    "Tự động cập nhật luật bảo mật",
                    "Bảo vệ nhiều website với chính sách riêng",
                    "Báo cáo và cảnh báo thời gian thực",
                ],
                benefits: [
                    "Bảo vệ Cổng thông tin điện tử theo Nghị định 43",
                    "Giảm 95% rủi ro tấn công vào ứng dụng web",
                    "Dễ dàng triển khai, không cần sửa code",
                ],
                cta: "Đăng ký tư vấn WAF",
            },
            backup: {
                icon: "bi-hdd-stack-fill",
                title: "Lưu trữ & Sao lưu an toàn",
                subtitle: "Giải pháp bảo vệ dữ liệu theo mô hình 3-2-1.",
                features: [
                    "Hệ thống NAS tập trung, dung lượng lớn",
                    "Sao lưu tự động theo lịch trình",
                    "Bản sao bất biến (immutable) chống ransomware",
                    "Kịch bản khôi phục thảm họa (DR)",
                    "Mã hóa dữ liệu khi truyền và lưu trữ",
                ],
                benefits: [
                    "Phục hồi nhanh chóng, mất mát dữ liệu tối thiểu",
                    "Đáp ứng yêu cầu sao lưu của Nghị định 53",
                    "An toàn trước các cuộc tấn công mã hóa tống tiền",
                ],
                cta: "Đăng ký tư vấn Backup",
            },
            email: {
                icon: "bi-envelope-paper-fill",
                title: "An toàn thư điện tử",
                subtitle: "Bảo vệ hộp thư và dữ liệu thư điện tử khỏi các mối đe dọa.",
                features: [
                    "Chặn thư giả mạo (phishing, spear-phishing)",
                    "Quét mã độc trong file đính kèm",
                    "Phát hiện liên kết độc hại trong thư",
                    "Xác thực người gửi (SPF, DKIM, DMARC)",
                    "Lưu trữ và mã hóa thư nhạy cảm",
                ],
                benefits: [
                    "Giảm 90% nguy cơ bị tấn công qua email",
                    "Bảo vệ thông tin nhạy cảm trong giao tiếp",
                    "Tuân thủ quy định bảo mật thông tin",
                ],
                cta: "Đăng ký tư vấn Email Security",
            },
            pentest: {
                icon: "bi-search-heart-fill",
                title: "Đánh giá & Kiểm thử xâm nhập",
                subtitle: "Phát hiện và xử lý các lỗ hổng an ninh trước khi bị khai thác.",
                features: [
                    "Dò quét lỗ hổng tự động và thủ công",
                    "Kiểm thử xâm nhập (penetration test)",
                    "Đánh giá bảo mật ứng dụng web và mobile",
                    "Xây dựng hồ sơ cấp độ an toàn",
                    "Tư vấn khắc phục và giám sát sau xử lý",
                ],
                benefits: [
                    "Phát hiện 85% lỗ hổng tiềm ẩn",
                    "Đáp ứng yêu cầu của các quy định về an toàn TT",
                    "Nâng cao nhận thức và văn hóa bảo mật",
                ],
                cta: "Đăng ký tư vấn Pentest",
            },
            iam: {
                icon: "bi-person-badge-fill",
                title: "Quản lý truy cập & Xác thực",
                subtitle: "Kiểm soát chặt chẽ danh tính và quyền truy cập.",
                features: [
                    "Xác thực đa yếu tố (MFA)",
                    "Phân quyền truy cập dựa trên vai trò (RBAC)",
                    "Quản lý tài khoản đặc quyền (PAM)",
                    "Đồng bộ danh tính (SSO, LDAP, AD)",
                    "Giám sát và ghi nhật ký truy cập",
                ],
                benefits: [
                    "Giảm 80% rủi ro tấn công nội bộ",
                    "Đáp ứng yêu cầu kiểm soát truy cập theo Nghị định 13",
                    "Quản trị tập trung, giảm chi phí vận hành",
                ],
                cta: "Đăng ký tư vấn IAM",
            },
        };

        function openModal(key) {
            const data = solutionData[key];
            if (!data) return;
            modalBody.innerHTML = `
                <div class="modal-icon"><i class="bi ${data.icon}"></i></div>
                <h2 class="modal-title">${data.title}</h2>
                <p class="modal-subtitle">${data.subtitle}</p>
                <div class="modal-section">
                    <h4><i class="bi bi-check-circle-fill"></i> Tính năng nổi bật</h4>
                    <ul>${data.features.map((f) => `<li>${f}</li>`).join("")}</ul>
                </div>
                <div class="modal-section">
                    <h4><i class="bi bi-star-fill"></i> Lợi ích mang lại</h4>
                    <ul>${data.benefits.map((b) => `<li>${b}</li>`).join("")}</ul>
                </div>
                <a href="#registration" class="modal-cta">${data.cta} <i class="bi bi-arrow-right"></i></a>
            `;
            modalOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeModal() {
            modalOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }

        document.querySelectorAll(".solution-link").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const target = btn.dataset.target;
                if (target) openModal(target);
            });
        });

        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeModal();
        });
        closeBtn.addEventListener("click", closeModal);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modalOverlay.classList.contains("active")) closeModal();
        });

        // ============================================
        // 3. TYPING EFFECT ĐỒNG THỜI
        // ============================================
        function revealText(node, fullText, speed) {
            return new Promise((resolve) => {
                let index = 0;
                node.textContent = "";
                const tick = () => {
                    if (index < fullText.length) {
                        node.textContent += fullText.charAt(index);
                        index++;
                        setTimeout(tick, speed);
                    } else {
                        resolve();
                    }
                };
                tick();
            });
        }

        function prepareTypedField(el) {
            if (!el || el.dataset.typedSource) return;
            el.dataset.typedSource = el.textContent.trim();
            el.textContent = "";
        }

        function resetRevealState() {
            document.querySelectorAll(".solution-callout").forEach((card) => {
                card.classList.remove("is-revealed");
                const title = card.querySelector(".solution-title");
                const desc = card.querySelector(".solution-desc");
                if (title && title.dataset.typedSource) title.textContent = title.dataset.typedSource;
                if (desc && desc.dataset.typedSource) desc.textContent = desc.dataset.typedSource;
            });
        }

        async function playSolutionReveal() {
            if (!solutionsSection || solutionsSection.dataset.revealPlayed === "true") return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                document.querySelectorAll(".solution-callout").forEach((card) => {
                    card.classList.add("is-revealed");
                    const title = card.querySelector(".solution-title");
                    const desc = card.querySelector(".solution-desc");
                    if (title && title.dataset.typedSource) title.textContent = title.dataset.typedSource;
                    if (desc && desc.dataset.typedSource) desc.textContent = desc.dataset.typedSource;
                });
                solutionsSection.dataset.revealPlayed = "true";
                return;
            }

            const cards = Array.from(solutionsSection.querySelectorAll(".solution-callout"));
            if (!cards.length) return;

            cards.forEach((card) => {
                prepareTypedField(card.querySelector(".solution-title"));
                prepareTypedField(card.querySelector(".solution-desc"));
            });

            solutionsSection.dataset.revealPlayed = "true";
            cards.forEach((card) => card.classList.add("is-revealed"));

            const tasks = [];
            cards.forEach((card) => {
                const title = card.querySelector(".solution-title");
                const desc = card.querySelector(".solution-desc");
                if (title && title.dataset.typedSource) tasks.push(revealText(title, title.dataset.typedSource, 11));
                if (desc && desc.dataset.typedSource) tasks.push(revealText(desc, desc.dataset.typedSource, 7));
            });
            await Promise.all(tasks);
        }

        if (solutionsSection) {
            const observer = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            playSolutionReveal();
                            obs.disconnect();
                        }
                    });
                },
                { threshold: 0.25 },
            );

            resetRevealState();
            observer.observe(solutionsSection);
        }
    }
})();


