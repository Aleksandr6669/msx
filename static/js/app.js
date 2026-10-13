/**
 * HOME PORTAL TV — CLIENT LOGIC & REMOTE CONTROL NAVIGATION
 * Optimized for Smart TV, TV Box, WebOS, Tizen & Media Station X (MSX)
 */

// ---------------------------------------------------------------------------
// 1. STATE & STORAGE MANAGEMENT
// ---------------------------------------------------------------------------
function safeGetStorage(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? item : fallback;
    } catch (e) {
        return fallback;
    }
}

const DEFAULT_WALLPAPERS = [
    { id: "ss_mountains", title: "Альпийские вершины 4K", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80" },
    { id: "ss_aurora", title: "Северное сияние Норвегии", url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&auto=format&fit=crop&q=80" },
    { id: "ss_castle", title: "Замок в тумане Рейна", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80" },
    { id: "ss_tokyo", title: "Ночной Токио Неон", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1920&auto=format&fit=crop&q=80" },
    { id: "ss_lake", title: "Озеро Морейн на закате", url: "https://images.unsplash.com/photo-1439853941329-a99ce04b5a8a?w=1920&auto=format&fit=crop&q=80" },
    { id: "ss_ocean", title: "Тихий океан и скалы", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=80" },
    { id: "ss_forest", title: "Осенний лес в горах", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&auto=format&fit=crop&q=80" },
    { id: "ss_desert", title: "Красные дюны Сахары", url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&auto=format&fit=crop&q=80" }
];

const DEFAULT_APPS_LIST = [
    { id: "app_filmix", name: "Filmix", url: "http://filmix.tv", icon: "movie_filter", badge: "CINEMA", img: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80" },
    { id: "app_lampa", name: "Lampa", url: "http://lampa.mx", icon: "movie", badge: "PORTAL", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80" },
    { id: "app_deeplex", name: "Deeplex 4K", url: "http://deeplex.cc", icon: "play_circle_filled", badge: "CINEMA", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80" },
    { id: "app_youtube", name: "YouTube", url: "http://msx.benzac.de/plugins/youtube.html", icon: "smart_display", badge: "VIDEO", img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80" },
    { id: "app_twitch", name: "Twitch", url: "http://msx.benzac.de/plugins/twitch.html", icon: "live_tv", badge: "LIVE", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80" },
    { id: "app_forkplayer", name: "ForkPlayer", url: "http://operats.obovse.ru/2.5/", icon: "language", badge: "PORTAL", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80" },
    { id: "app_hdrezka", name: "HDRezka TV", url: "http://rezka.ag", icon: "theaters", badge: "HD", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80" },
    { id: "app_rutube", name: "RuTube", url: "http://rutube.ru", icon: "video_library", badge: "MEDIA", img: "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=500&auto=format&fit=crop&q=80" }
];

const WIDGETS_METADATA = {
    clock_digital: {
        title: "Цифровые часы",
        desc: "Крупные неоновые часы с секундами и датой",
        icon: "schedule",
        defaultSize: 2
    },
    clock_analog: {
        title: "Аналоговые часы",
        desc: "Прозрачный швейцарский циферблат",
        icon: "watch_later",
        defaultSize: 1
    },
    calendar_grid: {
        title: "Календарь (Сетка месяца)",
        desc: "Полная сетка дней текущего месяца",
        icon: "calendar_month",
        defaultSize: 2
    },
    calendar_events: {
        title: "Планировщик ТВ",
        desc: "Список предстоящих передач и фильмов",
        icon: "event_note",
        defaultSize: 2
    }
};

let state = {
    activeTab: "widgets",
    themeColor: safeGetStorage('hp_theme_color', "#00d2ff"),
    themeRgb: safeGetStorage('hp_theme_rgb', "0, 210, 255"),
    transparency: "frosted",
    animations: safeGetStorage('hp_animations', "snappy"),
    idleTimeoutSec: parseInt(safeGetStorage('hp_idle_sec', "120"), 10),
    screensaverBg: safeGetStorage('hp_ss_bg', "ss_all"),
    ssMediaType: safeGetStorage('hp_ss_mtype', "photo"),
    ssYoutubeId: safeGetStorage('hp_ss_ytid', "L_LUpnjgPso"),
    ssVideoUrl: safeGetStorage('hp_ss_vurl', "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
    ssPhotoAnim: safeGetStorage('hp_ss_photo_anim', 'true') !== 'false',
    ssWidgetOpacity: "ultra",
    ssWidgetType: safeGetStorage('hp_ss_wtype', "both"),
    ssPosition: safeGetStorage('hp_ss_pos', "center"),
    widgets: {
        clock_digital: true,
        clock_analog: true,
        calendar_grid: true,
        calendar_events: true
    },
    sidebarPos: "left",
    appsList: JSON.parse(safeGetStorage('hp_apps_list', JSON.stringify(DEFAULT_APPS_LIST)))
};

// ---------------------------------------------------------------------------
// 2. THEME & DISPLAY LOGIC
// ---------------------------------------------------------------------------
const root = document.documentElement;

function applyThemeSettings() {
    root.style.setProperty('--accent-color', state.themeColor);
    root.style.setProperty('--accent-rgb', state.themeRgb);

    document.body.classList.remove('trans-frosted', 'trans-transparent', 'trans-dark');
    document.body.classList.add(`trans-frosted`);

    document.body.classList.remove('anim-fast', 'anim-snappy');
    document.body.classList.add(`anim-${state.animations}`);

    try {
        localStorage.setItem('hp_theme_color', state.themeColor);
        localStorage.setItem('hp_theme_rgb', state.themeRgb);
        localStorage.setItem('hp_animations', state.animations);
    } catch (e) {}
}
applyThemeSettings();

function applySidebarPosition() {
    const tvShell = document.getElementById('tvShell');
    if (!tvShell) return;
    tvShell.classList.remove('sidebar-left', 'sidebar-right');
    tvShell.classList.add('sidebar-left');
}
applySidebarPosition();

// ---------------------------------------------------------------------------
// 3. SIDEBAR NAVIGATION & TAB SWITCHING (PERMANENT OPEN SIDEBAR)
// ---------------------------------------------------------------------------
const bgWallpaper = document.getElementById('bgWallpaper');
const tvSidebar = document.getElementById('tvSidebar');
const menuTabs = document.querySelectorAll('.menu-tab');
const tabPanes = {
    widgets: document.getElementById('tabWidgets'),
    apps: document.getElementById('tabApps'),
    settings: document.getElementById('tabSettings'),
    info: document.getElementById('tabInfo')
};

function expandSidebar(expand) {
    if (tvSidebar) {
        tvSidebar.classList.remove('collapsed');
    }
}

function focusCurrentTabContent() {
    const activePane = tabPanes[state.activeTab];
    if (!activePane) return;
    const focusable = activePane.querySelectorAll('button, [tabindex="0"], input, select');
    if (focusable.length > 0) {
        focusable[0].focus();
    }
}

function switchTab(tabId) {
    state.activeTab = tabId;

    menuTabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });

    Object.keys(tabPanes).forEach(k => {
        if (tabPanes[k]) {
            tabPanes[k].classList.toggle('active', k === tabId);
        }
    });

    if (tabId === 'apps') {
        renderAppsGrid();
    } else if (tabId === 'settings') {
        renderWidgetsManageGrid();
    }
}

menuTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.getAttribute('data-tab');
        switchTab(target);
        focusCurrentTabContent();
    });
});

// Restart Button
const btnRestartPortal = document.getElementById('btnRestartPortal');
if (btnRestartPortal) {
    btnRestartPortal.addEventListener('click', () => {
        window.location.reload();
    });
}

// Launch Screensaver Button
const btnLaunchScreensaver = document.getElementById('btnLaunchScreensaver');
if (btnLaunchScreensaver) {
    btnLaunchScreensaver.addEventListener('click', () => {
        showScreensaver();
    });
}

// ---------------------------------------------------------------------------
// 4. REAL-TIME CLOCKS (DIGITAL NEON & CIRCULAR ANALOG)
// ---------------------------------------------------------------------------
const MONTHS_RU = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
const WEEKDAYS_RU = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

function updateClocks() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    // 1. Digital Clock (Quadrant 1)
    const elH = document.getElementById('digH');
    const elM = document.getElementById('digM');
    const elS = document.getElementById('digS');
    if (elH && elM && elS) {
        elH.textContent = hStr;
        elM.textContent = mStr;
        elS.textContent = sStr;
    }

    const digFullDate = document.getElementById('digFullDate');
    if (digFullDate) {
        digFullDate.textContent = `${WEEKDAYS_RU[now.getDay()]}, ${now.getDate()} ${MONTHS_RU[now.getMonth()]} ${now.getFullYear()}`;
    }

    // 2. Analog Clock (Quadrant 2)
    const handSec = document.getElementById('handSec');
    const handMin = document.getElementById('handMin');
    const handHour = document.getElementById('handHour');

    if (handSec && handMin && handHour) {
        const secDeg = ((s + ms / 1000) / 60) * 360;
        const minDeg = ((m + s / 60) / 60) * 360;
        const hourDeg = (((h % 12) + m / 60) / 12) * 360;

        handSec.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        handMin.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        handHour.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }

    const analogDigTime = document.getElementById('analogDigTime');
    const analogDateLabel = document.getElementById('analogDateLabel');
    if (analogDigTime) analogDigTime.textContent = `${hStr}:${mStr}`;
    if (analogDateLabel) analogDateLabel.textContent = `${now.getDate()} ${MONTHS_RU[now.getMonth()]} ${now.getFullYear()}`.toUpperCase();

    // 3. Screensaver Clock
    const ssClockTime = document.getElementById('ssClockTime');
    const ssClockDate = document.getElementById('ssClockDate');
    if (ssClockTime) ssClockTime.textContent = `${hStr}:${mStr}`;
    if (ssClockDate) ssClockDate.textContent = `${WEEKDAYS_RU[now.getDay()].toUpperCase()}, ${now.getDate()} ${MONTHS_RU[now.getMonth()].toUpperCase()} ${now.getFullYear()}`;
}

updateClocks();
setInterval(updateClocks, 1000);

// ---------------------------------------------------------------------------
// 5. CALENDAR GENERATION (QUADRANT 3 & SCREENSAVER)
// ---------------------------------------------------------------------------
function renderCalendars() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const calMonthName = document.getElementById('calMonthName');
    if (calMonthName) {
        calMonthName.textContent = `${MONTHS_RU[month].toUpperCase()} ${year}`;
    }

    const ssCalHeader = document.getElementById('ssCalHeader');
    if (ssCalHeader) {
        ssCalHeader.textContent = `${MONTHS_RU[month].toUpperCase()} ${year}`;
    }

    const calCellsGrid = document.getElementById('calCellsGrid');
    const ssCalGrid = document.getElementById('ssCalGrid');

    function populateCells(container) {
        if (!container) return;
        container.innerHTML = '';

        const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        // Prev month padding
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'cell other-month';
            cell.textContent = String(prevMonthDays - i);
            container.appendChild(cell);
        }

        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('div');
            cell.className = 'cell' + (d === today ? ' today' : '');
            cell.textContent = String(d);
            container.appendChild(cell);
        }

        // Next month padding to fill grid
        const totalRendered = firstDayOfWeek + daysInMonth;
        const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
        for (let j = 1; j <= remaining; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell other-month';
            cell.textContent = String(j);
            container.appendChild(cell);
        }
    }

    populateCells(calCellsGrid);
    populateCells(ssCalGrid);
}
renderCalendars();

// ---------------------------------------------------------------------------
// 6. 2x2 QUADRANTS MANAGEMENT (LOCKED OPTIMAL SIZES)
// ---------------------------------------------------------------------------
const widgetElements = {
    clock_digital: document.getElementById('wClockDigital'),
    clock_analog: document.getElementById('wClockAnalog'),
    calendar_grid: document.getElementById('wCalGrid'),
    calendar_events: document.getElementById('wCalEvents')
};

function applyWidgetSizesAndToggles() {
    const quadrantWidgets = ['clock_digital', 'clock_analog', 'calendar_grid', 'calendar_events'];
    quadrantWidgets.forEach(key => {
        const el = widgetElements[key];
        if (el) {
            el.style.display = 'flex';
        }
    });

    ['clock_modern', 'calendar_compact'].forEach(key => {
        const el = document.getElementById(key === 'clock_modern' ? 'wClockModern' : 'wCalCompact');
        if (el) el.style.display = 'none';
    });

    localStorage.setItem('hp_widgets', JSON.stringify(state.widgets));
}
applyWidgetSizesAndToggles();

// ---------------------------------------------------------------------------
// 7. SETTINGS SUBTABS & CONTROLLERS
// ---------------------------------------------------------------------------
const subtabBtns = document.querySelectorAll('.subtab-btn');
const subpanes = {
    'appearance': document.getElementById('sub-appearance'),
    'widgets': document.getElementById('sub-widgets'),
    'apps': document.getElementById('sub-apps'),
    'screensaver': document.getElementById('sub-screensaver')
};

subtabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const sub = btn.getAttribute('data-subtab');
        subtabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        Object.keys(subpanes).forEach(k => {
            if (subpanes[k]) subpanes[k].classList.toggle('active', k === sub);
        });
    });
});

// Color Swatches
const colorSwatchBtns = document.querySelectorAll('.color-swatch-btn');
colorSwatchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        colorSwatchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.themeColor = btn.getAttribute('data-color');
        state.themeRgb = btn.getAttribute('data-rgb');
        applyThemeSettings();
    });
});

// Animation Speed
const animBtns = document.querySelectorAll('.anim-option-btn');
animBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        animBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.animations = btn.getAttribute('data-anim');
        applyThemeSettings();
    });
});

// Widgets Manage View (Subtab 2)
const widgetsManageGrid = document.getElementById('widgetsManageGrid');

function renderWidgetsManageGrid() {
    if (!widgetsManageGrid) return;
    widgetsManageGrid.innerHTML = '';

    const quadrantTitles = {
        clock_digital: "Квадрант 1: Цифровые часы (Верхний левый)",
        clock_analog: "Квадрант 2: Аналоговые часы (Верхний правый)",
        calendar_grid: "Квадрант 3: Сетка месяца (Нижний левый)",
        calendar_events: "Квадрант 4: Планировщик ТВ (Нижний правый)"
    };

    Object.keys(WIDGETS_METADATA).forEach(key => {
        const meta = WIDGETS_METADATA[key];
        const card = document.createElement('div');
        card.className = 'info-card';
        card.tabIndex = 0;
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="material-icons" style="font-size: 24px; color: var(--accent-color);">${meta.icon}</span>
                <div>
                    <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">${quadrantTitles[key] || meta.title}</div>
                    <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 2px;">${meta.desc}</div>
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 0.72rem; color: var(--accent-color); font-weight: 600;">
                ✓ Оптимальный фиксированный размер (Квадрант 2×2)
            </div>
        `;
        widgetsManageGrid.appendChild(card);
    });
}

// ---------------------------------------------------------------------------
// 8. APPS CATALOG & FULLSCREEN VIEWER
// ---------------------------------------------------------------------------
const appsGrid = document.getElementById('appsGrid');
const appsCountBadge = document.getElementById('appsCountBadge');
const appViewerModal = document.getElementById('appViewerModal');
const appViewerFrame = document.getElementById('appViewerFrame');
const appNavLoader = document.getElementById('appNavLoader');
const loaderAppName = document.getElementById('loaderAppName');

function renderAppsGrid() {
    if (!appsGrid) return;
    appsGrid.innerHTML = '';

    state.appsList.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.tabIndex = 0;
        card.innerHTML = `
            <div class="app-icon-container" style="background-image: url('${app.img}');">
                <span class="app-badge-tag">${app.badge || 'APP'}</span>
            </div>
            <span class="app-title">${app.name}</span>
        `;

        card.addEventListener('click', () => launchApp(app));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                launchApp(app);
            }
        });

        appsGrid.appendChild(card);
    });

    if (appsCountBadge) appsCountBadge.textContent = String(state.appsList.length);
}

function launchApp(app) {
    if (!app || !app.url) return;
    if (appNavLoader) {
        if (loaderAppName) loaderAppName.textContent = `Запуск ${app.name}...`;
        appNavLoader.classList.add('active');
    }

    setTimeout(() => {
        if (appViewerModal && appViewerFrame) {
            appViewerFrame.src = app.url;
            appViewerModal.classList.add('active');
            appViewerFrame.focus();
        }
        if (appNavLoader) appNavLoader.classList.remove('active');
    }, 400);
}

function closeAppViewer() {
    if (appViewerModal && appViewerModal.classList.contains('active')) {
        appViewerModal.classList.remove('active');
        if (appViewerFrame) appViewerFrame.src = 'about:blank';
        focusCurrentTabContent();
        return true;
    }
    return false;
}

// Preset Apps
const presetBtns = document.querySelectorAll('.preset-btn');
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const newApp = {
            id: btn.getAttribute('data-id'),
            name: btn.getAttribute('data-name'),
            url: btn.getAttribute('data-url'),
            icon: btn.getAttribute('data-icon'),
            badge: btn.getAttribute('data-badge'),
            img: btn.getAttribute('data-img')
        };
        if (!state.appsList.some(a => a.id === newApp.id)) {
            state.appsList.push(newApp);
            localStorage.setItem('hp_apps_list', JSON.stringify(state.appsList));
            renderAppsGrid();
            alert(`«${newApp.name}» успешно добавлен в каталог программ!`);
        } else {
            alert(`«${newApp.name}» уже добавлен.`);
        }
    });
});

// ---------------------------------------------------------------------------
// 9. 4K SCREENSAVER ENGINE (AUTO-IDLE & TAP DISMISS)
// ---------------------------------------------------------------------------
const screensaverLayer = document.getElementById('screensaverLayer');
const ssBgImage = document.getElementById('ssBgImage');
const btnTestScreensaver = document.getElementById('btnTestScreensaver');

let ssOpenedTimestamp = 0;
let idleTimer = null;

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (state.idleTimeoutSec <= 0) return;

    idleTimer = setTimeout(() => {
        if (!screensaverLayer?.classList.contains('active') && !appViewerModal?.classList.contains('active')) {
            showScreensaver();
        }
    }, state.idleTimeoutSec * 1000);
}

['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetIdleTimer, { passive: true });
});

function showScreensaver() {
    if (!screensaverLayer) return;
    ssOpenedTimestamp = Date.now();
    screensaverLayer.classList.add('active');
}

function hideScreensaver() {
    if (!screensaverLayer) return;
    screensaverLayer.classList.remove('active');
    resetIdleTimer();
}

// Tap/touch/click dismiss for screensaver
if (screensaverLayer) {
    ['click', 'touchend'].forEach(evtType => {
        screensaverLayer.addEventListener(evtType, (e) => {
            if (screensaverLayer.classList.contains('active')) {
                if (Date.now() - ssOpenedTimestamp > 300) {
                    e.preventDefault();
                    hideScreensaver();
                    switchTab('widgets');
                }
            }
        });
    });
}

if (btnTestScreensaver) {
    btnTestScreensaver.addEventListener('click', showScreensaver);
}

// Screensaver Stars Canvas
const canvas = document.getElementById('ssStarsCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 75; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.7 + 0.3,
            dx: (Math.random() - 0.5) * 0.35,
            dy: (Math.random() - 0.5) * 0.35
        });
    }

    function renderParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 220, 255, ${p.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = state.themeColor;
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        });
        requestAnimationFrame(renderParticles);
    }
    renderParticles();
}

// ---------------------------------------------------------------------------
// 10. TV REMOTE CONTROL NAVIGATION & D-PAD SPATIAL LOGIC
// ---------------------------------------------------------------------------
function handleTvBackButton(e) {
    e.preventDefault();

    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        hideScreensaver();
        return true;
    }

    if (closeAppViewer()) {
        return true;
    }

    if (state.activeTab !== 'widgets') {
        switchTab('widgets');
        focusCurrentTabContent();
        return true;
    }

    return true;
}

window.addEventListener('keydown', (e) => {
    const key = e.key;
    const keyCode = e.keyCode;

    const isBackKey = (
        keyCode === 10009 ||
        keyCode === 461 ||
        keyCode === 4 ||
        keyCode === 27 ||
        key === 'Escape' ||
        key === 'Back' ||
        key === 'GoBack' ||
        (keyCode === 8 && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')
    );

    if (isBackKey) {
        handleTvBackButton(e);
        return;
    }

    // 2x2 Quadrant Grid Spatial Navigation for TV Remote
    if (state.activeTab === 'widgets' && !screensaverLayer?.classList.contains('active')) {
        const el = document.activeElement;
        const w1 = document.getElementById('wClockDigital');
        const w2 = document.getElementById('wClockAnalog');
        const w3 = document.getElementById('wCalGrid');
        const w4 = document.getElementById('wCalEvents');

        if (el === w1) {
            if (e.key === 'ArrowRight') { e.preventDefault(); w2?.focus(); return; }
            if (e.key === 'ArrowDown')  { e.preventDefault(); w3?.focus(); return; }
            if (e.key === 'ArrowLeft')  {
                e.preventDefault();
                const activeTab = document.querySelector('.menu-tab.active');
                if (activeTab) activeTab.focus();
                return;
            }
        } else if (el === w2) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); w1?.focus(); return; }
            if (e.key === 'ArrowDown') { e.preventDefault(); w4?.focus(); return; }
        } else if (el === w3) {
            if (e.key === 'ArrowUp')    { e.preventDefault(); w1?.focus(); return; }
            if (e.key === 'ArrowRight') { e.preventDefault(); w4?.focus(); return; }
            if (e.key === 'ArrowLeft')  {
                e.preventDefault();
                const activeTab = document.querySelector('.menu-tab.active');
                if (activeTab) activeTab.focus();
                return;
            }
        } else if (el === w4) {
            if (e.key === 'ArrowUp')   { e.preventDefault(); w2?.focus(); return; }
            if (e.key === 'ArrowLeft') { e.preventDefault(); w3?.focus(); return; }
        }
    }

    const inSidebar = tvSidebar && tvSidebar.contains(document.activeElement);

    if (e.key === 'ArrowRight' && inSidebar) {
        e.preventDefault();
        focusCurrentTabContent();
    } else if (e.key === 'ArrowLeft' && !inSidebar && !screensaverLayer?.classList.contains('active')) {
        const activeEl = document.activeElement;
        const isFirstAppCard = activeEl && activeEl.classList.contains('app-card') && activeEl === appsGrid?.firstElementChild;
        const isFirstWidget = activeEl && activeEl.classList.contains('glass-widget') && activeEl === document.getElementById('wClockDigital');

        if (isFirstAppCard || isFirstWidget || activeEl === document.body || !activeEl) {
            e.preventDefault();
            const activeTabBtn = document.querySelector(`.menu-tab[data-tab="${state.activeTab}"]`);
            if (activeTabBtn) activeTabBtn.focus();
        }
    }
});

// ---------------------------------------------------------------------------
// 11. INITIALIZATION & INITIAL FOCUS ON LOAD
// ---------------------------------------------------------------------------
function initApp() {
    applyThemeSettings();
    applySidebarPosition();
    switchTab('widgets');

    setTimeout(() => {
        const w1 = document.getElementById('wClockDigital');
        if (w1) w1.focus();
    }, 150);

    resetIdleTimer();
}

window.addEventListener('DOMContentLoaded', initApp);
