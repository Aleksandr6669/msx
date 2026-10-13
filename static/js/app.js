// ==========================================================================
// HOME PORTAL TV — CLIENT ENGINE FOR SMART TV & MEDIA STATION X
// Optimized for 60fps, TV Remote D-Pad Navigation, Bento 2x2 Grid
// ==========================================================================

const SECTION_WALLPAPERS = {
    widgets: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85",
    apps: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=85",
    settings: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85",
    info: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=85"
};

const SCREENSAVER_IMAGES = {
    ss_nature: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=90",
    ss_space: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=90",
    ss_aurora: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=90",
    ss_cyber: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=90",
    ss_minimal: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90"
};

const SS_SLIDESHOW_LIST = Object.values(SCREENSAVER_IMAGES);
let ssSlideshowInterval = null;
let ssSlideshowIndex = 0;
let ssOpenedTimestamp = 0;

const DEFAULT_APPS_LIST = [
    {
        id: "app_filmix",
        name: "Filmix",
        url: "http://filmix.tv",
        sub: "Онлайн-кинотеатр и сериалы",
        icon: "movie_filter",
        badge: "CINEMA",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_lampa",
        name: "Lampa",
        url: "http://lampa.mx",
        sub: "Онлайн-кинотеатр",
        icon: "movie",
        badge: "FILMS",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_youtube",
        name: "YouTube",
        url: "http://msx.benzac.de/plugins/youtube.html",
        sub: "Видео и стримы",
        icon: "play_circle",
        badge: "VIDEO",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_forkplayer",
        name: "ForkPlayer",
        url: "http://operats.obovse.ru/2.5/",
        sub: "Медиа-портал",
        icon: "language",
        badge: "PORTAL",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_deeplex",
        name: "Deeplex 4K",
        url: "http://deeplex.cc",
        sub: "Фильмы и сериалы",
        icon: "theaters",
        badge: "CINEMA",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_twitch",
        name: "Twitch",
        url: "http://msx.benzac.de/plugins/twitch.html",
        sub: "Игровые стримы",
        icon: "live_tv",
        badge: "LIVE",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80"
    }
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
    clock_modern: {
        title: "Минимал часы",
        desc: "Лаконичный циферблат и день недели",
        icon: "av_timer",
        defaultSize: 1
    },
    calendar_grid: {
        title: "Календарь (Сетка месяца)",
        desc: "Полная сетка дней текущего месяца",
        icon: "calendar_month",
        defaultSize: 2
    },
    calendar_compact: {
        title: "Компактная дата",
        desc: "Карточка сегодняшнего дня",
        icon: "today",
        defaultSize: 1
    },
    calendar_events: {
        title: "Планировщик ТВ",
        desc: "Список предстоящих передач и фильмов",
        icon: "event_note",
        defaultSize: 2
    }
};

function safeGetStorage(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val !== null ? val : fallback;
    } catch (e) {
        return fallback;
    }
}

let state = {
    activeTab: "widgets",
    themeColor: safeGetStorage('hp_theme_color', "#00d2ff"),
    themeRgb: safeGetStorage('hp_theme_rgb', "0, 210, 255"),
    transparency: "frosted",
    animations: safeGetStorage('hp_animations', "snappy"),
    idleTimeoutSec: parseInt(safeGetStorage('hp_idle_sec', "120"), 10),
    screensaverBg: safeGetStorage('hp_ss_bg', "ss_all"),
    sidebarPos: "left", // DEFAULT: LEFT SIDE
    ssMediaType: safeGetStorage('hp_ss_mtype', "photo"),
    ssYoutubeId: safeGetStorage('hp_ss_ytid', "L_LUpnjgPso"),
    ssVideoUrl: safeGetStorage('hp_ss_vurl', "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
    ssPhotoAnim: safeGetStorage('hp_ss_photo_anim', 'true') !== 'false',
    ssWidgetOpacity: "ultra",
    ssWidgetType: safeGetStorage('hp_ss_wtype', "both"),
    ssPosition: safeGetStorage('hp_ss_pos', "center"),
    widgets: JSON.parse(safeGetStorage('hp_widgets', JSON.stringify({
        clock_digital: true,
        clock_analog: true,
        clock_modern: false,
        calendar_grid: true,
        calendar_compact: true,
        calendar_events: true
    }))),
    widgetSizes: JSON.parse(safeGetStorage('hp_widget_sizes', JSON.stringify({
        clock_digital: 2,
        clock_analog: 1,
        clock_modern: 1,
        calendar_grid: 2,
        calendar_compact: 1,
        calendar_events: 2
    }))),
    apps: JSON.parse(safeGetStorage('hp_apps', JSON.stringify(DEFAULT_APPS_LIST))),
    currentEditingWidget: null
};

// Force sidebar to LEFT
state.sidebarPos = 'left';
try { localStorage.setItem('hp_sidebar_pos', 'left'); } catch (e) {}

// Auto-heal widgets: Ensure Digital & Analog clocks are enabled
if (!state.widgets || (!state.widgets.clock_digital && !state.widgets.clock_analog)) {
    state.widgets = {
        clock_digital: true,
        clock_analog: true,
        clock_modern: false,
        calendar_grid: true,
        calendar_compact: true,
        calendar_events: true
    };
    try { localStorage.setItem('hp_widgets', JSON.stringify(state.widgets)); } catch (e) {}
}

function normalizeUrl(url) {
    if (!url) return '';
    url = url.trim();

    if (/filmix/i.test(url)) return 'http://filmix.tv';
    if (/lampa\.mx/i.test(url)) return 'http://lampa.mx';
    if (/msx\.benzac\.de\/plugins\/youtube/i.test(url)) return 'http://msx.benzac.de/plugins/youtube.html';
    if (/msx\.benzac\.de\/plugins\/twitch/i.test(url)) return 'http://msx.benzac.de/plugins/twitch.html';
    if (/deeplex\.cc/i.test(url)) return 'http://deeplex.cc';
    if (/obovse\.ru/i.test(url)) return 'http://operats.obovse.ru/2.5/';

    if (!/^https?:\/\//i.test(url)) {
        return 'http://' + url;
    }
    return url;
}

// Auto-heal stored apps from localStorage
if (Array.isArray(state.apps)) {
    if (!state.apps.some(a => a && (a.id === 'app_filmix' || (a.name && a.name.toLowerCase() === 'filmix')))) {
        state.apps.unshift({
            id: "app_filmix",
            name: "Filmix",
            url: "http://filmix.tv",
            sub: "Онлайн-кинотеатр и сериалы",
            icon: "movie_filter",
            badge: "CINEMA",
            image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80"
        });
    }
    state.apps.forEach(app => {
        if (!app || !app.url) return;
        app.url = normalizeUrl(app.url);
    });
}

window.addEventListener('pageshow', () => {
    const loader = document.getElementById('appNavLoader');
    if (loader) loader.classList.remove('active');
});

// ---------------------------------------------------------------------------
// 1. THEME & COLOR CONTROLLER
// ---------------------------------------------------------------------------
function applyThemeSettings() {
    const root = document.documentElement;
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

function applySidebarPosition() {
    const shell = document.getElementById('tvShell');
    if (!shell) return;
    shell.classList.toggle('sidebar-right', state.sidebarPos === 'right');
    shell.classList.toggle('sidebar-left', state.sidebarPos === 'left');
    try {
        localStorage.setItem('hp_sidebar_pos', state.sidebarPos);
    } catch (e) {}
}

// ---------------------------------------------------------------------------
// 2. SIDEBAR NAVIGATION & TAB SWITCHING (PERMANENT OPEN SIDEBAR)
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
    setTimeout(() => {
        if (state.activeTab === 'widgets') {
            const firstWidget = document.querySelector('.glass-widget:not([style*="display: none"])');
            if (firstWidget) firstWidget.focus();
        } else if (state.activeTab === 'apps') {
            const firstApp = document.querySelector('.app-card');
            if (firstApp) firstApp.focus();
        } else if (state.activeTab === 'settings') {
            const firstSetting = document.querySelector('.subtab-btn.active') || document.querySelector('.subtab-btn');
            if (firstSetting) firstSetting.focus();
        } else if (state.activeTab === 'info') {
            const firstInfo = document.querySelector('.info-card');
            if (firstInfo) firstInfo.focus();
        }
    }, 60);
}

function switchTab(tabId) {
    if (!tabPanes[tabId]) tabId = 'widgets';
    state.activeTab = tabId;

    menuTabs.forEach(tab => {
        const isActive = tab.getAttribute('data-tab') === tabId;
        tab.classList.toggle('active', isActive);
    });

    Object.keys(tabPanes).forEach(k => {
        if (tabPanes[k]) tabPanes[k].classList.toggle('active', k === tabId);
    });

    const bgUrl = SECTION_WALLPAPERS[tabId] || SECTION_WALLPAPERS.widgets;
    if (bgWallpaper) {
        bgWallpaper.style.backgroundImage = `url('${bgUrl}')`;
    }
}

menuTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.getAttribute('data-tab');
        switchTab(target);
        // sidebar permanently open
        focusCurrentTabContent();
    });
});

// Restart Button
const restartPortalBtn = document.getElementById('restartPortalBtn');
if (restartPortalBtn) {
    restartPortalBtn.addEventListener('click', () => {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage('msx:exit', '*');
        }
        window.location.reload();
    });
}

// ---------------------------------------------------------------------------
// 3. CLOCKS ENGINE (SMOOTH 60FPS TIME & ANALOG HANDS)
// ---------------------------------------------------------------------------
const digH = document.getElementById('digH');
const digM = document.getElementById('digM');
const digS = document.getElementById('digS');
const digFullDate = document.getElementById('digFullDate');

const modTimeVal = document.getElementById('modTimeVal');
const modWeekdayVal = document.getElementById('modWeekdayVal');
const modMonthVal = document.getElementById('modMonthVal');

const handHour = document.getElementById('handHour');
const handMin = document.getElementById('handMin');
const handSec = document.getElementById('handSec');

const compDayNum = document.getElementById('compDayNum');
const compMonth = document.getElementById('compMonth');
const compWeek = document.getElementById('compWeek');

const ssClockTime = document.getElementById('ssClockTime');
const ssClockDate = document.getElementById('ssClockDate');

const WEEKDAYS_RU = ["ВОСКРЕСЕНЬЕ", "ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА"];
const MONTHS_RU = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
const MONTHS_FULL_RU = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ", "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"];

let lastSec = -1;

function updateClocks() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    const hStr = h < 10 ? '0' + h : String(h);
    const mStr = m < 10 ? '0' + m : String(m);
    const sStr = s < 10 ? '0' + s : String(s);

    if (s !== lastSec) {
        lastSec = s;

        if (digH) digH.textContent = hStr;
        if (digM) digM.textContent = mStr;
        if (digS) digS.textContent = sStr;

        if (modTimeVal) modTimeVal.textContent = `${hStr}:${mStr}`;
        if (modWeekdayVal) modWeekdayVal.textContent = WEEKDAYS_RU[now.getDay()];
        if (modMonthVal) modMonthVal.textContent = `${MONTHS_FULL_RU[now.getMonth()]} ${now.getFullYear()}`;

        const fullDateStr = `${WEEKDAYS_RU[now.getDay()]}, ${now.getDate()} ${MONTHS_RU[now.getMonth()]} ${now.getFullYear()}`;
        if (digFullDate) digFullDate.textContent = fullDateStr;
        const analogDigTime = document.getElementById('analogDigTime');
        const analogDateLabel = document.getElementById('analogDateLabel');
        if (analogDigTime) analogDigTime.textContent = `${hStr}:${mStr}`;
        if (analogDateLabel) analogDateLabel.textContent = `${now.getDate()} ${MONTHS_RU[now.getMonth()]} ${now.getFullYear()}`.toUpperCase();

        if (compDayNum) compDayNum.textContent = String(now.getDate());
        if (compMonth) compMonth.textContent = `${MONTHS_RU[now.getMonth()]} ${now.getFullYear()}`;
        if (compWeek) compWeek.textContent = WEEKDAYS_RU[now.getDay()];

        if (ssClockTime) ssClockTime.textContent = `${hStr}:${mStr}`;
        if (ssClockDate) ssClockDate.textContent = `${WEEKDAYS_RU[now.getDay()]}, ${now.getDate()} ${MONTHS_FULL_RU[now.getMonth()]} ${now.getFullYear()}`;
    }

    if (handHour && handMin && handSec) {
        const totalSec = s + ms / 1000;
        const totalMin = m + totalSec / 60;
        const totalHour = (h % 12) + totalMin / 60;

        const secDeg = totalSec * 6;
        const minDeg = totalMin * 6;
        const hourDeg = totalHour * 30;

        handSec.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        handMin.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        handHour.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }
}

function clockLoop() {
    updateClocks();
    requestAnimationFrame(clockLoop);
}
requestAnimationFrame(clockLoop);

// ---------------------------------------------------------------------------
// 4. CALENDARS ENGINE
// ---------------------------------------------------------------------------
function renderCalendars() {
    const calCells = document.getElementById('calCellsGrid');
    const calMonthName = document.getElementById('calMonthName');
    const ssCalGrid = document.getElementById('ssCalGrid');
    const ssCalHeader = document.getElementById('ssCalHeader');

    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const today = now.getDate();

    const monthNames = [
        "ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ",
        "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"
    ];
    const monthTitle = `${monthNames[curMonth]} ${curYear}`;

    if (calMonthName) calMonthName.textContent = monthTitle;
    if (ssCalHeader) ssCalHeader.textContent = monthTitle;

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const startOffset = (firstDay === 0 ? 7 : firstDay) - 1;
    const totalDays = new Date(curYear, curMonth + 1, 0).getDate();

    function fillGrid(gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';

        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement('div');
            empty.className = 'cell empty';
            gridElement.appendChild(empty);
        }

        for (let d = 1; d <= totalDays; d++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = d;

            const dayOfWeek = (startOffset + d - 1) % 7;
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                cell.classList.add('we');
            }
            if (d === today) {
                cell.classList.add('today');
            }
            gridElement.appendChild(cell);
        }
    }

    fillGrid(calCells);
    fillGrid(ssCalGrid);
}
renderCalendars();

// ---------------------------------------------------------------------------
// 5. BENTO GRID MODULAR WIDGET SYSTEM (UNIFORM 220PX HEIGHT)
// ---------------------------------------------------------------------------
const widgetsWrapper = document.getElementById('widgetsWrapper');
const widgetElements = {
    clock_digital: document.getElementById('wClockDigital'),
    clock_analog: document.getElementById('wClockAnalog'),
    clock_modern: document.getElementById('wClockModern'),
    calendar_grid: document.getElementById('wCalGrid'),
    calendar_compact: document.getElementById('wCalCompact'),
    calendar_events: document.getElementById('wCalEvents')
};

function applyWidgetSizesAndToggles() {
    Object.keys(widgetElements).forEach(key => {
        const el = widgetElements[key];
        if (!el) return;

        const isVisible = !!state.widgets[key];
        el.style.display = isVisible ? 'flex' : 'none';

        const size = state.widgetSizes[key] || WIDGETS_METADATA[key].defaultSize;
        el.classList.remove('span-1', 'span-2', 'span-3', 'span-4');
        el.classList.add(`span-${size}`);
    });

    try {
        localStorage.setItem('hp_widgets', JSON.stringify(state.widgets));
        localStorage.setItem('hp_widget_sizes', JSON.stringify(state.widgetSizes));
    } catch (e) {}
}
applyWidgetSizesAndToggles();

// ---------------------------------------------------------------------------
// 6. SETTINGS SUBTABS & CONTROLLERS
// ---------------------------------------------------------------------------
const subtabBtns = document.querySelectorAll('.subtab-btn');
const subpanes = {
    appearance: document.getElementById('sub-appearance'),
    widgets: document.getElementById('sub-widgets'),
    apps: document.getElementById('sub-apps'),
    screensaver: document.getElementById('sub-screensaver')
};

subtabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        subtabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-subtab');
        Object.keys(subpanes).forEach(k => {
            if (subpanes[k]) subpanes[k].classList.toggle('active', k === target || k === 'sub-' + target);
        });

        if (target === 'widgets' || target === 'sub-widgets') {
            showWidgetsListView();
        }
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
colorSwatchBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-color') === state.themeColor));

// Sidebar Position Selector
const sidebarPosBtns = document.querySelectorAll('.sidebar-pos-btn');
sidebarPosBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarPosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.sidebarPos = btn.getAttribute('data-pos') || 'left';
        applySidebarPosition();
    });
});
sidebarPosBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-pos') === state.sidebarPos));

// Animation Modes
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
animBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-anim') === state.animations));

// ---------------------------------------------------------------------------
// 7. WIDGET MANAGER & DETAIL EDIT VIEW IN SETTINGS
// ---------------------------------------------------------------------------
const widgetsListView = document.getElementById('widgetsListView');
const widgetDetailView = document.getElementById('widgetDetailView');
const widgetsManageGrid = document.getElementById('widgetsManageGrid');
const btnBackToWidgetsList = document.getElementById('btnBackToWidgetsList');

const detailWidgetTitle = document.getElementById('detailWidgetTitle');
const detailWidgetDesc = document.getElementById('detailWidgetDesc');
const detailWidgetBadge = document.getElementById('detailWidgetBadge');
const detailWidgetIcon = document.getElementById('detailWidgetIcon');
const detailTogglePill = document.getElementById('detailTogglePill');
const detailToggleLabel = document.getElementById('detailToggleLabel');
const detailToggleCheck = document.getElementById('detailToggleCheck');
const bentoSizeCards = document.querySelectorAll('.bento-size-card');

function formatSizeText(size) {
    if (size === 1) return '1 ячейка (~25% ширины)';
    if (size === 2) return '2 ячейки (50% ширины)';
    if (size === 3) return '3 ячейки (75% ширины)';
    if (size === 4) return '4 ячейки (100% ширины)';
    return `${size} ячейки`;
}

function renderWidgetsManageGrid() {
    if (!widgetsManageGrid) return;
    widgetsManageGrid.innerHTML = '';

    Object.keys(WIDGETS_METADATA).forEach(key => {
        const meta = WIDGETS_METADATA[key];
        const isEnabled = !!state.widgets[key];
        const curSize = state.widgetSizes[key] || meta.defaultSize;

        const card = document.createElement('div');
        card.className = 'widget-card-manage';
        card.tabIndex = 0;
        card.innerHTML = `
            <div class="wcm-header">
                <span class="material-icons wcm-icon">${meta.icon}</span>
                <span class="wcm-status-pill ${isEnabled ? 'pill-active' : 'pill-inactive'}">
                    ${isEnabled ? 'Включен' : 'Скрыт'}
                </span>
            </div>
            <div class="wcm-body">
                <div class="wcm-title">${meta.title}</div>
                <div class="wcm-desc">${meta.desc}</div>
            </div>
            <div class="wcm-footer">
                <span class="wcm-size-badge">${formatSizeText(curSize)}</span>
                <button class="btn-manage-cfg" tabindex="0">
                    <span class="material-icons" style="font-size: 16px;">tune</span>
                    <span>Настроить</span>
                </button>
            </div>
        `;

        card.addEventListener('click', () => openWidgetDetail(key));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                openWidgetDetail(key);
            }
        });

        widgetsManageGrid.appendChild(card);
    });
}

function showWidgetsListView() {
    if (widgetsListView) widgetsListView.style.display = 'block';
    if (widgetDetailView) widgetDetailView.style.display = 'none';
    renderWidgetsManageGrid();
}

function openWidgetDetail(key) {
    state.currentEditingWidget = key;
    const meta = WIDGETS_METADATA[key];
    if (!meta) return;

    if (widgetsListView) widgetsListView.style.display = 'none';
    if (widgetDetailView) widgetDetailView.style.display = 'block';

    if (detailWidgetTitle) detailWidgetTitle.textContent = `Настройка: ${meta.title}`;
    if (detailWidgetDesc) detailWidgetDesc.textContent = meta.desc;
    if (detailWidgetBadge) detailWidgetBadge.textContent = key.toUpperCase();
    if (detailWidgetIcon) detailWidgetIcon.textContent = meta.icon;

    updateDetailToggleUI();
    updateDetailSizeUI();

    if (btnBackToWidgetsList) {
        btnBackToWidgetsList.focus();
    }
}

function updateDetailToggleUI() {
    const key = state.currentEditingWidget;
    if (!key) return;
    const isChecked = !!state.widgets[key];
    if (detailTogglePill) detailTogglePill.classList.toggle('checked', isChecked);
    if (detailToggleCheck) detailToggleCheck.textContent = isChecked ? '✓' : '—';
    if (detailToggleLabel) detailToggleLabel.textContent = isChecked ? 'Виджет включен в сетке' : 'Виджет выключен (скрыт)';
}

function updateDetailSizeUI() {
    const key = state.currentEditingWidget;
    if (!key) return;
    const curSize = state.widgetSizes[key] || 2;
    bentoSizeCards.forEach(card => {
        const sizeVal = parseInt(card.getAttribute('data-size'), 10);
        card.classList.toggle('active', sizeVal === curSize);
        card.classList.toggle('selected', sizeVal === curSize);
    });
}

if (detailTogglePill) {
    detailTogglePill.addEventListener('click', () => {
        const key = state.currentEditingWidget;
        if (!key) return;
        state.widgets[key] = !state.widgets[key];
        updateDetailToggleUI();
        applyWidgetSizesAndToggles();
    });
}

bentoSizeCards.forEach(card => {
    card.addEventListener('click', () => {
        const key = state.currentEditingWidget;
        if (!key) return;
        const sizeVal = parseInt(card.getAttribute('data-size'), 10);
        state.widgetSizes[key] = sizeVal;
        updateDetailSizeUI();
        applyWidgetSizesAndToggles();
    });
});

if (btnBackToWidgetsList) {
    btnBackToWidgetsList.addEventListener('click', () => {
        showWidgetsListView();
    });
}

const btnSaveWidgetDetail = document.getElementById('btnSaveWidgetDetail');
if (btnSaveWidgetDetail) {
    btnSaveWidgetDetail.addEventListener('click', () => {
        showWidgetsListView();
    });
}

renderWidgetsManageGrid();

// ---------------------------------------------------------------------------
// 8. APPS LAUNCHER ENGINE & PHONE-STYLE COMPACT CARDS
// ---------------------------------------------------------------------------
const appsGrid = document.getElementById('appsGrid');
const appsCountBadge = document.getElementById('appsCountBadge');
const installedAppsList = document.getElementById('installedAppsList');

function openApp(app) {
    const loader = document.getElementById('appNavLoader');
    const loaderAppName = document.getElementById('loaderAppName');
    if (loader) {
        if (loaderAppName) loaderAppName.textContent = `Запуск: ${app.name}...`;
        loader.classList.add('active');
    }

    setTimeout(() => {
        try {
            window.location.href = app.url;
        } catch (e) {
            window.open(app.url, '_self');
        }
    }, 280);
}

function renderApps() {
    if (appsGrid) {
        appsGrid.innerHTML = '';
        state.apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.innerHTML = `
                <div class="app-icon-squircle">
                    <img src="${app.image}" alt="${app.name}" class="app-icon-img" loading="lazy">
                    <span class="app-card-badge">${app.badge || 'APP'}</span>
                </div>
                <div class="app-card-name">${app.name}</div>
            `;

            card.addEventListener('click', () => openApp(app));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    e.preventDefault();
                    openApp(app);
                }
            });

            appsGrid.appendChild(card);
        });
    }

    if (appsCountBadge) {
        appsCountBadge.textContent = state.apps.length;
    }

    if (installedAppsList) {
        installedAppsList.innerHTML = '';
        state.apps.forEach((app, index) => {
            const item = document.createElement('div');
            item.className = 'installed-item';
            item.innerHTML = `
                <div>
                    <strong>${app.name}</strong>
                    <div style="font-size:0.75rem; color:var(--text-dim);">${app.url}</div>
                </div>
                <button class="btn-del-app" data-index="${index}" tabindex="0">Удалить</button>
            `;
            const delBtn = item.querySelector('.btn-del-app');
            if (delBtn) {
                delBtn.addEventListener('click', () => {
                    state.apps.splice(index, 1);
                    try {
                        localStorage.setItem('hp_apps', JSON.stringify(state.apps));
                    } catch (e) {}
                    renderApps();
                });
            }
            installedAppsList.appendChild(item);
        });
    }
}
renderApps();

// Add Custom App
const btnSaveApp = document.getElementById('btnSaveApp');
const inputAppName = document.getElementById('inputAppName');
const inputAppUrl = document.getElementById('inputAppUrl');
const selectAppIcon = document.getElementById('selectAppIcon');

if (btnSaveApp && inputAppName && inputAppUrl) {
    btnSaveApp.addEventListener('click', () => {
        const name = inputAppName.value.trim();
        const url = normalizeUrl(inputAppUrl.value.trim());
        const icon = selectAppIcon ? selectAppIcon.value : 'launch';

        if (!name || !url) {
            alert('Пожалуйста, введите название и корректный URL программы.');
            return;
        }

        state.apps.push({
            id: `app_${Date.now()}`,
            name: name,
            url: url,
            sub: "Пользовательское приложение",
            icon: icon,
            badge: "WEB",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
        });

        try {
            localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        } catch (e) {}
        inputAppName.value = '';
        inputAppUrl.value = '';
        renderApps();
        alert(`Программа «${name}» успешно добавлена!`);
    });
}

// Preset Quick Add Buttons
const presetBtns = document.querySelectorAll('.preset-btn');
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const url = normalizeUrl(btn.getAttribute('data-url'));
        const icon = btn.getAttribute('data-icon');
        const badge = btn.getAttribute('data-badge');
        const img = btn.getAttribute('data-img');

        if (state.apps.some(a => a.id === id || a.name.toLowerCase() === name.toLowerCase())) {
            alert(`«${name}» уже есть в вашем списке программ!`);
            return;
        }

        state.apps.push({
            id: id,
            name: name,
            url: url,
            sub: "Онлайн-сервис",
            icon: icon,
            badge: badge,
            image: img
        });

        try {
            localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        } catch (e) {}
        renderApps();
        alert(`«${name}» добавлена в Программы!`);
    });
});

// Reset Default Apps
const btnResetDefaultApps = document.getElementById('btnResetDefaultApps');
if (btnResetDefaultApps) {
    btnResetDefaultApps.addEventListener('click', () => {
        state.apps = JSON.parse(JSON.stringify(DEFAULT_APPS_LIST));
        try {
            localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        } catch (e) {}
        renderApps();
        alert('Список программ сброшен к стандартному заводскому набору!');
    });
}

// ---------------------------------------------------------------------------
// 9. REMOTE CONTROL BACK BUTTON & FULLSCREEN APPS VIEWER
// ---------------------------------------------------------------------------
function handleTvBackButton(e) {
    const screensaver = document.getElementById('screensaverLayer');
    if (screensaver && screensaver.classList.contains('active')) {
        e.preventDefault();
        hideScreensaver();
        return;
    }

    if (widgetDetailView && widgetDetailView.style.display === 'block') {
        e.preventDefault();
        showWidgetsListView();
        return;
    }

    if (state.activeTab !== 'widgets') {
        e.preventDefault();
        switchTab('widgets');
        return;
    }
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

    // Screensaver dismiss on any keypress (with debounce guard)
    const screensaver = document.getElementById('screensaverLayer');
    if (screensaver && screensaver.classList.contains('active')) {
        if (Date.now() - ssOpenedTimestamp > 400) {
            e.preventDefault();
            hideScreensaver();
            switchTab('widgets');
        }
        return;
    }

    // Global Enter / OK key execution for any focused interactive element
    if (e.key === 'Enter' || keyCode === 13) {
        const active = document.activeElement;
        if (active && active !== document.body) {
            e.preventDefault();
            active.click();
            return;
        }
    }

    // Spatial D-Pad Navigation for LEFT-Side Sidebar
    const inSidebar = tvSidebar && tvSidebar.contains(document.activeElement);

    if (inSidebar) {
        const sidebarItems = Array.from(tvSidebar.querySelectorAll('.menu-tab, .quick-screensaver-btn, .quick-restart-btn'));
        const currentIndex = sidebarItems.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
            if (currentIndex !== -1 && currentIndex < sidebarItems.length - 1) {
                e.preventDefault();
                sidebarItems[currentIndex + 1].focus();
            }
        } else if (e.key === 'ArrowUp') {
            if (currentIndex > 0) {
                e.preventDefault();
                sidebarItems[currentIndex - 1].focus();
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusCurrentTabContent();
        }
    } else {
        // In content stage: ArrowLeft moves INTO the left sidebar
        if (e.key === 'ArrowLeft') {
            const activeTabBtn = document.querySelector(`.menu-tab[data-tab="${state.activeTab}"]`) || document.querySelector('.menu-tab');
            if (activeTabBtn) {
                e.preventDefault();
                activeTabBtn.focus();
            }
        }
    }
});

// ---------------------------------------------------------------------------
// 10. SCREENSAVER 4K ENGINE WITH REALISTIC AMBIENT VIDEO & SLIDESHOW
// ---------------------------------------------------------------------------
const screensaverLayer = document.getElementById('screensaverLayer');
const ssWidgetsContainer = document.getElementById('ssWidgetsContainer');
const startScreensaverBtn = document.getElementById('startScreensaverBtn');
const btnTestScreensaver = document.getElementById('btnTestScreensaver');

function applyScreensaverWidgetsAndPosition() {
    if (!ssWidgetsContainer) return;

    ssWidgetsContainer.className = 'ss-widgets-container';
    ssWidgetsContainer.classList.add(`pos-${state.ssPosition || 'center'}`);

    const clockBlock = document.getElementById('ssWidgetBlock');
    const calBlock = document.getElementById('ssCalendarBlock');

    if (clockBlock) clockBlock.style.display = 'none';
    if (calBlock) calBlock.style.display = 'none';

    if (state.ssWidgetType === 'both') {
        if (clockBlock) clockBlock.style.display = 'inline-flex';
        if (calBlock) calBlock.style.display = 'block';
    } else if (state.ssWidgetType === 'clock') {
        if (clockBlock) clockBlock.style.display = 'inline-flex';
    } else if (state.ssWidgetType === 'calendar') {
        if (calBlock) calBlock.style.display = 'block';
    }

    try {
        localStorage.setItem('hp_ss_wtype', state.ssWidgetType);
        localStorage.setItem('hp_ss_pos', state.ssPosition);
    } catch (e) {}
}

function updateScreensaverWallpaper(url) {
    const ssBgImage = document.getElementById('ssBgImage');
    if (ssBgImage) {
        ssBgImage.style.backgroundImage = `url('${url}')`;
    }
}

function extractYouTubeId(urlOrId) {
    if (!urlOrId) return '';
    urlOrId = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
        return urlOrId;
    }
    const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : '';
}

function applyScreensaverWidgetOpacity() {
    // Uniform frosted glass
}

// Screensaver tap/click dismiss for touch and mouse
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

function showScreensaver() {
    ssOpenedTimestamp = Date.now();
    if (!screensaverLayer) return;

    applyScreensaverWidgetsAndPosition();
    applyScreensaverWidgetOpacity();

    const ssBgImage = document.getElementById('ssBgImage');
    const ssBgVideo = document.getElementById('ssBgVideo');
    const ssBgYoutubeWrap = document.getElementById('ssBgYoutubeWrap');
    const ssBgYoutubeIframe = document.getElementById('ssBgYoutubeIframe');

    if (ssBgImage) ssBgImage.style.display = 'none';
    if (ssBgVideo) {
        ssBgVideo.style.display = 'none';
        try { ssBgVideo.pause(); } catch (e) {}
    }
    if (ssBgYoutubeWrap) {
        ssBgYoutubeWrap.style.display = 'none';
        if (ssBgYoutubeIframe) ssBgYoutubeIframe.src = 'about:blank';
    }

    if (state.ssMediaType === 'youtube') {
        const ytid = state.ssYoutubeId || 'L_LUpnjgPso';
        if (ssBgYoutubeWrap && ssBgYoutubeIframe) {
            ssBgYoutubeWrap.style.display = 'block';
            ssBgYoutubeIframe.src = `https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytid}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;
        }
    } else if (state.ssMediaType === 'video') {
        if (ssBgVideo) {
            ssBgVideo.style.display = 'block';
            ssBgVideo.src = state.ssVideoUrl;
            ssBgVideo.play().catch(() => {});
        }
    } else {
        if (ssBgImage) {
            ssBgImage.style.display = 'block';
            ssBgImage.classList.toggle('animated', !!state.ssPhotoAnim);
            if (state.screensaverBg === 'ss_all') {
                ssSlideshowIndex = 0;
                updateScreensaverWallpaper(SS_SLIDESHOW_LIST[0]);
                if (ssSlideshowInterval) clearInterval(ssSlideshowInterval);
                ssSlideshowInterval = setInterval(() => {
                    ssSlideshowIndex = (ssSlideshowIndex + 1) % SS_SLIDESHOW_LIST.length;
                    updateScreensaverWallpaper(SS_SLIDESHOW_LIST[ssSlideshowIndex]);
                }, 10000);
            } else {
                if (ssSlideshowInterval) clearInterval(ssSlideshowInterval);
                const bgUrl = SCREENSAVER_IMAGES[state.screensaverBg] || SCREENSAVER_IMAGES.ss_nature;
                updateScreensaverWallpaper(bgUrl);
            }
        }
    }

    screensaverLayer.style.display = 'flex';
    void screensaverLayer.offsetWidth;
    screensaverLayer.classList.add('active');
}

function hideScreensaver() {
    if (!screensaverLayer) return;
    screensaverLayer.classList.remove('active');
    setTimeout(() => {
        screensaverLayer.style.display = 'none';
        const ssBgVideo = document.getElementById('ssBgVideo');
        if (ssBgVideo) {
            try { ssBgVideo.pause(); } catch (e) {}
        }
        const ssBgYoutubeIframe = document.getElementById('ssBgYoutubeIframe');
        if (ssBgYoutubeIframe) {
            ssBgYoutubeIframe.src = 'about:blank';
        }
        if (ssSlideshowInterval) clearInterval(ssSlideshowInterval);
    }, 450);
    resetIdleTimer();
}

let idleTimer = null;
function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (!state.idleTimeoutSec || state.idleTimeoutSec <= 0) return;

    idleTimer = setTimeout(() => {
        showScreensaver();
    }, state.idleTimeoutSec * 1000);
}

['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, () => {
        resetIdleTimer();
    }, { passive: true });
});
resetIdleTimer();

if (startScreensaverBtn) startScreensaverBtn.addEventListener('click', () => showScreensaver());
if (btnTestScreensaver) btnTestScreensaver.addEventListener('click', () => showScreensaver());

const ssThumbCards = document.querySelectorAll('.ss-thumb-card');
ssThumbCards.forEach(card => {
    card.addEventListener('click', () => {
        ssThumbCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.screensaverBg = card.getAttribute('data-key');
        try {
            localStorage.setItem('hp_ss_bg', state.screensaverBg);
        } catch (e) {}
    });
});

const timeoutBtns = document.querySelectorAll('.timeout-btn');
timeoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        timeoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.idleTimeoutSec = parseInt(btn.getAttribute('data-time'), 10);
        try {
            localStorage.setItem('hp_idle_sec', String(state.idleTimeoutSec));
        } catch (e) {}
        resetIdleTimer();
    });
});

const ssWTypeBtns = document.querySelectorAll('.ss-wtype-btn');
ssWTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssWTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssWidgetType = btn.getAttribute('data-wtype');
        applyScreensaverWidgetsAndPosition();
    });
});

const ssPosBtns = document.querySelectorAll('.ss-pos-btn');
ssPosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssPosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssPosition = btn.getAttribute('data-pos');
        applyScreensaverWidgetsAndPosition();
    });
});

const ssMediaBtns = document.querySelectorAll('.ss-media-btn');
ssMediaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssMediaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssMediaType = btn.getAttribute('data-media') || 'photo';
        try {
            localStorage.setItem('hp_ss_mtype', state.ssMediaType);
        } catch (e) {}
    });
});

const ssAnimBtns = document.querySelectorAll('.ss-anim-btn');
ssAnimBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssAnimBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssPhotoAnim = btn.getAttribute('data-anim') === 'on';
        try {
            localStorage.setItem('hp_ss_photo_anim', String(state.ssPhotoAnim));
        } catch (e) {}
    });
});

// User Custom Video (YouTube / MP4)
const btnApplyCustomVideo = document.getElementById('btnApplyCustomVideo');
const inputCustomVideo = document.getElementById('inputCustomVideo');
if (btnApplyCustomVideo && inputCustomVideo) {
    btnApplyCustomVideo.addEventListener('click', () => {
        const val = inputCustomVideo.value.trim();
        if (!val) {
            alert('Пожалуйста, введите URL YouTube видео или прямой MP4 поток.');
            return;
        }

        if (/\.mp4($|\?)/i.test(val)) {
            state.ssMediaType = 'video';
            state.ssVideoUrl = val;
            localStorage.setItem('hp_ss_mtype', 'video');
            localStorage.setItem('hp_ss_vurl', val);
        } else {
            const ytId = extractYouTubeId(val);
            if (!ytId) {
                alert('Не удалось распознать ID видео. Проверьте ссылку на YouTube.');
                return;
            }
            state.ssMediaType = 'youtube';
            state.ssYoutubeId = ytId;
            localStorage.setItem('hp_ss_mtype', 'youtube');
            localStorage.setItem('hp_ss_ytid', ytId);
        }

        ssMediaBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-media') === state.ssMediaType));
        alert('Пользовательское видео успешно сохранено для заставки!');
    });
}

// ---------------------------------------------------------------------------
// 11. INITIALIZATION & INITIAL FOCUS ON LOAD
// ---------------------------------------------------------------------------
function initApp() {
    applyThemeSettings();
    applySidebarPosition();
    switchTab(state.activeTab || 'widgets');

    // CRITICAL FOR SMART TV: Set initial focus to active tab so remote control has anchor!
    setTimeout(() => {
        const activeTabBtn = document.querySelector('.menu-tab.active') || document.querySelector('.menu-tab');
        if (activeTabBtn) {
            activeTabBtn.focus();
        }
    }, 150);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}