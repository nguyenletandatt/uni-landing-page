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

    const introOverlay = document.getElementById("pageIntro");

    function hideIntroOverlay() {
        if (!introOverlay) {
            document.body.classList.remove("is-loading");
            return;
        }

        introOverlay.classList.add("is-hidden");
        introOverlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-loading");

        window.setTimeout(() => {
            introOverlay.remove();
        }, 650);
    }

    document.body.classList.add("is-loading");

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
    // 5. VIRTUAL MENU (LƯỚI 3x3, VÒNG CUNG)
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
        const scripts = [
            "js/sections/stats.js",
            "js/sections/threats.js",
            "js/sections/solutions.js",
            "js/sections/hero.js",
            "js/sections/partners.js",
        ];
        return Promise.all(scripts.map((src) => loadScript(src).catch(() => {})));
    }

    // =========================================================
    // 9. KHỞI TẠO SOC DASHBOARD
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
            let current = parseFloat(totalBlocked.innerText.replace(/,/g, ""));
            if (isNaN(current) || current === 0) current = 2.14;
            const increment = Math.random() * 0.05 + 0.01;
            const newVal = (current + increment).toFixed(2);
            totalBlocked.innerText = newVal;

            if (kpiChange) {
                const change = (Math.random() * 20 + 300).toFixed(0);
                kpiChange.innerText = `▲ ${change}%`;
            }

            if (ngfwValue && wafValue) {
                const ng = Math.floor(Math.random() * 30 + 50);
                const wa = Math.floor(Math.random() * 20 + 20);
                ngfwValue.innerText = ng + "%";
                wafValue.innerText = wa + "%";
            }

            if (threatMalware && threatBypass) {
                const mal = Math.floor(Math.random() * 20 + 55);
                const bypass = Math.floor(Math.random() * 15 + 10);
                threatMalware.innerText = mal + "%";
                threatBypass.innerText = bypass + "%";
            }

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

        updateMetrics();
        setInterval(updateMetrics, 4000);
    }

    // =========================================================
    // 10. AUTO SCROLL MƯỢT MÀ THEO SECTION (TRÌNH CHIẾU TV)
    // =========================================================
    function initAutoScroll() {
        // Lấy tất cả các section ID (có thể mở rộng)
        const sectionIds = [
            "hero",
            "overview",
            "threats",
            "solutions",
            "models",
            "deployment",
            "speakers",
            "stats",
            "registration",
            "faq",
            "footer",
        ];

        // Lọc ra các section thực sự tồn tại trên trang
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (sections.length === 0) return;

        // Cấu hình
        const config = {
            delay: 10000, // Thời gian dừng giữa các section (ms)
            scrollDuration: 1200, // Thời gian cuộn mượt (ms)
            enabled: true, // Bật/tắt auto scroll
            currentIndex: 0,
            timerId: null,
            isPaused: false,
        };

        // Tạo UI điều khiển (thanh tiến trình, nút play/pause, indicator)
        const controls = document.createElement("div");
        controls.className = "auto-scroll-controls";
        controls.innerHTML = `
            <div class="auto-scroll-progress">
                <div class="auto-scroll-progress-bar" style="width: 0%;"></div>
            </div>
            <div class="auto-scroll-indicators">
                ${sections.map((_, i) => `
                    <button class="auto-scroll-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Chuyển đến section ${i+1}"></button>
                `).join('')}
            </div>
            <div class="auto-scroll-actions">
                <button class="auto-scroll-toggle" aria-label="Tạm dừng / Tiếp tục trình chiếu">
                    <i class="bi bi-pause-fill"></i>
                </button>
            </div>
        `;
        document.body.appendChild(controls);

        // Các elements
        const progressBar = controls.querySelector(".auto-scroll-progress-bar");
        const dots = controls.querySelectorAll(".auto-scroll-dot");
        const toggleBtn = controls.querySelector(".auto-scroll-toggle");
        const toggleIcon = toggleBtn.querySelector("i");

        // Hàm cuộn đến section
        function scrollToSection(index, smooth = true) {
            if (index < 0 || index >= sections.length) return;
            const target = sections[index];
            if (!target) return;

            // Cập nhật active dot
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });

            // Cập nhật progress
            const progress = ((index + 1) / sections.length) * 100;
            progressBar.style.width = progress + "%";

            // Cuộn mượt hoặc nhảy thẳng
            target.scrollIntoView({
                behavior: smooth ? "smooth" : "instant",
                block: "start",
            });

            config.currentIndex = index;
        }

        // Hàm chuyển đến section tiếp theo
        function goToNextSection() {
            if (config.isPaused) return;
            const nextIndex = (config.currentIndex + 1) % sections.length;
            scrollToSection(nextIndex, true);
        }

        // Bắt đầu timer
        function startTimer() {
            if (config.timerId) clearInterval(config.timerId);
            if (!config.enabled || config.isPaused) return;

            config.timerId = setInterval(() => {
                goToNextSection();
            }, config.delay);
        }

        // Dừng timer
        function stopTimer() {
            if (config.timerId) {
                clearInterval(config.timerId);
                config.timerId = null;
            }
        }

        // Bật/tắt auto scroll (pause/resume)
        function toggleAutoScroll() {
            config.isPaused = !config.isPaused;
            if (config.isPaused) {
                stopTimer();
                toggleIcon.className = "bi bi-play-fill";
                toggleBtn.setAttribute("aria-label", "Tiếp tục trình chiếu");
                controls.classList.add("paused");
            } else {
                startTimer();
                toggleIcon.className = "bi bi-pause-fill";
                toggleBtn.setAttribute("aria-label", "Tạm dừng trình chiếu");
                controls.classList.remove("paused");
            }
        }

        // Sự kiện click vào dot để chuyển section
        dots.forEach((dot) => {
            dot.addEventListener("click", function () {
                const index = parseInt(this.dataset.index, 10);
                if (!isNaN(index) && index !== config.currentIndex) {
                    // Nếu đang ở chế độ pause, vẫn cho phép chuyển
                    scrollToSection(index, true);
                    // Reset timer để tránh nhảy ngay sau khi click
                    if (!config.isPaused) {
                        stopTimer();
                        startTimer();
                    }
                }
            });
        });

        // Sự kiện toggle
        toggleBtn.addEventListener("click", toggleAutoScroll);

        // Phím Space để pause/resume
        document.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                toggleAutoScroll();
            }
        });

        // Nếu người dùng scroll bằng tay, tạm dừng auto scroll (tùy chọn)
        let userInteracted = false;
        let interactionTimeout;

        document.addEventListener("wheel", () => {
            if (!config.isPaused && config.enabled) {
                userInteracted = true;
                clearTimeout(interactionTimeout);
                // Tạm dừng auto scroll 10s sau khi người dùng scroll
                if (!config.isPaused) {
                    // Không tự động pause, nhưng reset timer để tránh xung đột
                    stopTimer();
                    startTimer();
                }
                interactionTimeout = setTimeout(() => {
                    userInteracted = false;
                }, 10000);
            }
        }, { passive: true });

        // Xử lý resize để cập nhật vị trí section (nếu cần)
        // Khi resize, nếu section hiện tại bị lệch, ta có thể điều chỉnh
        // Không cần thiết

        // Khởi tạo: cuộn đến section đầu tiên (nếu chưa ở đó)
        setTimeout(() => {
            // Kiểm tra nếu đang ở section nào, nếu không thì về 0
            const currentScroll = window.scrollY;
            let foundIndex = 0;
            sections.forEach((sec, idx) => {
                if (sec.offsetTop <= currentScroll + 100) {
                    foundIndex = idx;
                }
            });
            if (foundIndex > 0) {
                config.currentIndex = foundIndex;
                // Cập nhật dot và progress
                dots.forEach((dot, i) => {
                    dot.classList.toggle("active", i === foundIndex);
                });
                const progress = ((foundIndex + 1) / sections.length) * 100;
                progressBar.style.width = progress + "%";
            } else {
                scrollToSection(0, false); // nhảy thẳng về đầu
            }
            // Bắt đầu timer
            if (config.enabled && !config.isPaused) {
                startTimer();
            }
        }, 500); // đợi layout ổn định

        // Lưu config để có thể điều chỉnh từ ngoài (nếu cần)
        window.__autoScroll = {
            config,
            scrollToSection,
            toggleAutoScroll,
            goToNextSection,
        };

        // Thêm style cho controls (có thể đưa vào CSS riêng, nhưng tạm thời inject)
        const style = document.createElement("style");
        style.textContent = `
            .auto-scroll-controls {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(10, 18, 32, 0.8);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 40px;
                padding: 10px 24px;
                display: flex;
                align-items: center;
                gap: 18px;
                z-index: 10000;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                transition: opacity 0.3s ease, transform 0.3s ease;
                opacity: 0.7;
            }
            .auto-scroll-controls:hover {
                opacity: 1;
            }
            .auto-scroll-progress {
                width: 160px;
                height: 4px;
                background: rgba(255,255,255,0.12);
                border-radius: 4px;
                overflow: hidden;
                cursor: pointer;
            }
            .auto-scroll-progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #f9b83a, #ffd36e);
                border-radius: 4px;
                transition: width 0.5s ease;
            }
            .auto-scroll-indicators {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .auto-scroll-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: none;
                background: rgba(255,255,255,0.2);
                padding: 0;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .auto-scroll-dot.active {
                background: #f9b83a;
                transform: scale(1.3);
                box-shadow: 0 0 12px rgba(249, 184, 58, 0.4);
            }
            .auto-scroll-dot:hover {
                background: rgba(255,255,255,0.5);
            }
            .auto-scroll-actions {
                display: flex;
                align-items: center;
            }
            .auto-scroll-toggle {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.4rem;
                padding: 0 4px;
                cursor: pointer;
                transition: color 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .auto-scroll-toggle:hover {
                color: #f9b83a;
            }
            .auto-scroll-controls.paused .auto-scroll-progress-bar {
                background: #94a3b8;
            }
            @media (max-width: 768px) {
                .auto-scroll-controls {
                    bottom: 16px;
                    padding: 8px 16px;
                    gap: 12px;
                    border-radius: 30px;
                }
                .auto-scroll-progress {
                    width: 80px;
                }
                .auto-scroll-indicators {
                    gap: 6px;
                }
                .auto-scroll-dot {
                    width: 6px;
                    height: 6px;
                }
                .auto-scroll-toggle {
                    font-size: 1.2rem;
                }
            }
            @media (max-width: 480px) {
                .auto-scroll-controls {
                    bottom: 12px;
                    padding: 6px 12px;
                    gap: 8px;
                }
                .auto-scroll-progress {
                    width: 50px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // =========================================================
    // 11. BẮT ĐẦU TẢI CÁC SECTION
    // =========================================================
    Promise.all(sections.map((section) => loadSection(section.id, section.file)))
        .then(() => loadSectionScripts())
        .then(() => {
            initAos();
            initNavState();
            initVirtualMenu();
            initForm();
            initSectionSizing();
            initSocDashboard(); // Khởi tạo dashboard nếu có
            initAutoScroll(); // Khởi tạo auto scroll
            if (typeof AOS !== "undefined" && typeof AOS.refresh === "function") {
                AOS.refresh();
            }
        })
        .then(() => {
            window.setTimeout(() => {
                hideIntroOverlay();
            }, 5000);
        })
        .catch((error) => {
            console.error("❌ Lỗi khởi tạo trang:", error);
            hideIntroOverlay();
        });
});