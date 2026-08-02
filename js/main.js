document.addEventListener("DOMContentLoaded", function () {
    // =========================================================
    // 1. DANH SÁCH SECTION
    // =========================================================
    const sections = [
        { id: "header", file: "header.html" },
        { id: "hero", file: "hero.html" },
        { id: "overview", file: "overview.html" },
        { id: "threats", file: "threats.html" },
        { id: "solutions", file: "solutions.html" },
        { id: "models", file: "models.html" },
        { id: "deployment", file: "deployment.html" },
        { id: "speakers", file: "speakers.html" },
        { id: "stats", file: "stats.html" },
        { id: "registration", file: "registration.html" },
        { id: "faq", file: "faq.html" },
        { id: "footer", file: "footer.html" },
    ];

    // =========================================================
    // 2. HÀM TẢI SECTION
    // =========================================================
    function loadSection(containerId, filePath) {
        const container = document.getElementById(containerId);
        if (!container) {
            return Promise.resolve();
        }

        return fetch(`sections/${filePath}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
                }
                return response.text();
            })
            .then((html) => {
                container.innerHTML = html;
            })
            .catch((error) => {
                console.warn(`❌ Lỗi tải section "${containerId}" (${filePath}):`, error);
                container.innerHTML = `
                    <div class="container py-5 text-center">
                        <p class="text-danger mb-0">⚠️ Không thể tải nội dung "${containerId}". Vui lòng thử lại sau.</p>
                    </div>
                `;
            });
    }

    // =========================================================
    // 3. KHỞI TẠO AOS
    // =========================================================
    function initAos() {
        if (typeof AOS === "undefined") {
            console.warn("⚠️ AOS chưa được tải.");
            return;
        }
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 80,
        });
    }

    // =========================================================
    // 4. MENU ĐIỀU HƯỚNG CHÍNH (NAV)
    // =========================================================
    function initNavState() {
        const navLinks = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
        if (!navLinks.length) return;

        const targets = navLinks
            .map((link) => {
                const href = link.getAttribute("href");
                if (!href) return null;
                return document.querySelector(href);
            })
            .filter(Boolean);

        if (!targets.length) return;

        const updateActive = () => {
            const scrollPosition = window.scrollY + 140;
            let currentTarget = targets[0];

            for (const target of targets) {
                if (target.offsetTop <= scrollPosition) {
                    currentTarget = target;
                }
            }

            navLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${currentTarget.id}`;
                link.classList.toggle("active", isActive);
            });
        };

        updateActive();
        window.addEventListener("scroll", updateActive, { passive: true });
    }

    // =========================================================
    // 5. MENU ẢO (VIRTUAL MENU) – LƯỚI 3x3, VÒNG CUNG
    // =========================================================
    function initVirtualMenu() {
        const menuSections = [
            { id: "hero", label: "Trang chủ", icon: "bi-house-fill" },
            { id: "overview", label: "Tổng quan", icon: "bi-info-circle-fill" },
            { id: "threats", label: "Nguy cơ", icon: "bi-exclamation-triangle-fill" },
            { id: "solutions", label: "Giải pháp", icon: "bi-puzzle-fill" },
            { id: "models", label: "Mô hình", icon: "bi-diagram-3-fill" },
            { id: "deployment", label: "Triển khai", icon: "bi-cloud-upload-fill" },
            { id: "speakers", label: "Đối tác", icon: "bi-people-fill" },
            { id: "stats", label: "Số liệu", icon: "bi-bar-chart-fill" },
            { id: "registration", label: "Đăng ký", icon: "bi-ticket-perforated-fill" },
        ];

        const targets = menuSections
            .map((item) => ({
                ...item,
                element: document.getElementById(item.id),
            }))
            .filter((item) => item.element);

        if (!targets.length) return;

        let menu = document.querySelector(".virtual-menu");
        if (!menu) {
            menu = document.createElement("div");
            menu.className = "virtual-menu is-visible";
            menu.innerHTML = `
                <button class="virtual-menu-toggle" aria-expanded="false" aria-label="Mở menu điều hướng">
                    <i class="bi bi-grid-3x3-gap-fill"></i>
                    <span class="virtual-menu-toggle-label">Menu</span>
                </button>
                <div class="virtual-menu-panel" hidden>
                    <div class="virtual-menu-panel-header">
                        <span class="virtual-menu-panel-title">Điều hướng nhanh</span>
                        <button class="virtual-menu-close" aria-label="Đóng menu">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="virtual-menu-grid" role="list"></div>
                </div>
            `;
            document.body.appendChild(menu);
        }

        const toggleBtn = menu.querySelector(".virtual-menu-toggle");
        const panel = menu.querySelector(".virtual-menu-panel");
        const grid = menu.querySelector(".virtual-menu-grid");
        const closeBtn = menu.querySelector(".virtual-menu-close");

        // Tạo lưới 3x3
        grid.innerHTML = targets
            .map((item, index) => {
                const number = String(index + 1).padStart(2, "0");
                return `
                    <a href="#${item.id}" class="virtual-menu-item" data-target="${item.id}" style="--i: ${index};">
                        <span class="virtual-menu-icon">
                            <i class="${item.icon}"></i>
                        </span>
                        <span class="virtual-menu-label">${item.label}</span>
                        <span class="virtual-menu-number">${number}</span>
                    </a>
                `;
            })
            .join("");

        const items = grid.querySelectorAll(".virtual-menu-item");

        const setOpen = (isOpen) => {
            menu.classList.toggle("is-open", isOpen);
            panel.hidden = !isOpen;
            toggleBtn.setAttribute("aria-expanded", String(isOpen));

            if (isOpen) {
                items.forEach((el, idx) => {
                    const delay = 50 + idx * 40;
                    el.style.animationDelay = `${delay}ms`;
                    el.classList.add("arc-enter");
                });
            } else {
                items.forEach((el) => {
                    el.classList.remove("arc-enter");
                    el.style.animationDelay = "0ms";
                });
            }
        };

        toggleBtn.addEventListener("click", () => setOpen(panel.hidden));
        closeBtn.addEventListener("click", () => setOpen(false));

        items.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = link.dataset.target;
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                setOpen(false);
            });
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !panel.hidden) {
                setOpen(false);
            }
        });

        menu.classList.add("is-visible");

        // Cập nhật active item theo scroll
        const updateActiveItem = () => {
            const scrollPos = window.scrollY + 180;
            let activeIndex = 0;
            targets.forEach((item, idx) => {
                if (item.element.offsetTop <= scrollPos) {
                    activeIndex = idx;
                }
            });
            items.forEach((el, idx) => {
                el.classList.toggle("active", idx === activeIndex);
            });
        };

        updateActiveItem();
        window.addEventListener("scroll", updateActiveItem, { passive: true });
    }

    // =========================================================
    // 6. FORM ĐĂNG KÝ
    // =========================================================
    function initForm() {
        document.addEventListener("submit", function (event) {
            const form = event.target.closest("#registrationForm");
            if (!form) return;
            event.preventDefault();
            form.reset();
            // Có thể thay bằng toast thông báo đẹp hơn
            window.alert("✅ Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ sớm để xác nhận thông tin.");
        });
    }

    // =========================================================
    // 7. THÊM CLASS 'screen-section'
    // =========================================================
    function initSectionSizing() {
        const sectionIds = [
            "overview",
            "threats",
            "solutions",
            "models",
            "deployment",
            "speakers",
            "stats",
            "registration",
            "faq",
        ];

        sectionIds.forEach((id) => {
            const wrapper = document.getElementById(id);
            if (!wrapper) return;
            const section = wrapper.querySelector("section");
            if (section) {
                section.classList.add("screen-section");
            }
        });
    }

    // =========================================================
    // 8. TẢI SCRIPT RIÊNG CHO SECTION (nếu có)
    // =========================================================
    function loadScript(filePath) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[data-script-path="${filePath}"]`);
            if (existing) {
                resolve();
                return;
            }
            const script = document.createElement("script");
            script.src = filePath;
            script.async = false;
            script.dataset.scriptPath = filePath;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Không thể tải script ${filePath}`));
            document.body.appendChild(script);
        });
    }

    function loadSectionScripts() {
        // Danh sách script cần load (nếu có)
        const scripts = [
            "js/sections/stats.js",
            "js/sections/threats.js",
            "js/sections/solutions.js",
            "js/sections/hero.js",
            "js/sections/partners.js",
        ];
        // Lọc những script tồn tại (có thể kiểm tra file bằng fetch hoặc chỉ load nếu có)
        // Ở đây ta load tất cả, nếu không có file sẽ báo lỗi nhưng không ảnh hưởng
        return Promise.all(scripts.map((src) => loadScript(src).catch(() => {})));
    }

    // =========================================================
    // 9. KHỞI TẠO SOC DASHBOARD (TRONG MAIN, NẾU CHƯA CÓ HERO.JS)
    // =========================================================
    function initSocDashboard() {
        const dashboard = document.querySelector(".soc-dashboard");
        if (!dashboard) return;

        const totalBlocked = document.getElementById("totalBlocked");
        const kpiChange = document.getElementById("kpiChange");
        const ngfwValue = document.getElementById("ngfwValue");
        const wafValue = document.getElementById("wafValue");
        const threatMalware = document.getElementById("threatMalware");
        const threatBypass = document.getElementById("threatBypass");
        const chartBars = document.querySelectorAll("#chartBars .bar");
        const feedContainer = document.getElementById("feedMessages");

        if (!totalBlocked || !feedContainer) return;

        function updateMetrics() {
            // Tăng tổng chặn
            let current = parseFloat(totalBlocked.innerText.replace(/,/g, ""));
            if (isNaN(current) || current === 0) current = 2.14;
            const increment = Math.random() * 0.05 + 0.01;
            const newVal = (current + increment).toFixed(2);
            totalBlocked.innerText = newVal;

            // Phần trăm thay đổi
            if (kpiChange) {
                const change = (Math.random() * 20 + 300).toFixed(0);
                kpiChange.innerText = `▲ ${change}%`;
            }

            // NGFW / WAF
            if (ngfwValue && wafValue) {
                const ng = Math.floor(Math.random() * 30 + 50);
                const wa = Math.floor(Math.random() * 20 + 20);
                ngfwValue.innerText = ng + "%";
                wafValue.innerText = wa + "%";
            }

            // Threat percentages
            if (threatMalware && threatBypass) {
                const mal = Math.floor(Math.random() * 20 + 55);
                const bypass = Math.floor(Math.random() * 15 + 10);
                threatMalware.innerText = mal + "%";
                threatBypass.innerText = bypass + "%";
            }

            // Cập nhật biểu đồ cột
            if (chartBars.length) {
                const baseData = [145, 173, 157, 234, 280, 1150];
                chartBars.forEach((bar, idx) => {
                    if (idx < baseData.length) {
                        const variance = Math.floor(Math.random() * 30 - 15);
                        const val = Math.max(20, baseData[idx] + variance);
                        const height = Math.min(130, Math.max(20, val / 8));
                        bar.style.height = height + "px";
                        bar.setAttribute("data-value", val);
                    }
                });
            }

            // Thêm feed message mới
            const now = new Date();
            const timeStr = now.toTimeString().slice(0, 8);
            const messages = [
                `[${timeStr}] 🟢 Chặn ${Math.floor(Math.random() * 10 + 1)} email giả mạo`,
                `[${timeStr}] 🔴 Phát hiện tấn công từ ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                `[${timeStr}] 🟡 Cảnh báo truy cập trái phép vào hệ thống nội bộ`,
                `[${timeStr}] 🟢 Cập nhật thành công danh sách đen mới`,
            ];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            const children = feedContainer.children;
            if (children.length >= 3) {
                feedContainer.removeChild(children[children.length - 1]);
            }
            const newDiv = document.createElement("div");
            newDiv.className = "feed-message";
            newDiv.textContent = randomMsg;
            feedContainer.prepend(newDiv);
        }

        // Chạy lần đầu và lặp mỗi 4 giây
        updateMetrics();
        setInterval(updateMetrics, 4000);
    }

    // =========================================================
    // 10. BẮT ĐẦU TẢI CÁC SECTION
    // =========================================================
    Promise.all(sections.map((section) => loadSection(section.id, section.file)))
        .then(() => loadSectionScripts())
        .then(() => {
            initAos();
            initNavState();
            initVirtualMenu();
            initForm();
            initSectionSizing();
            // Refresh AOS
            if (typeof AOS !== "undefined" && typeof AOS.refresh === "function") {
                AOS.refresh();
            }
        })
        .catch((error) => {
            console.error("❌ Lỗi khởi tạo trang:", error);
        });
});
