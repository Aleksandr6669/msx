// ==========================================================================
// HOME PORTAL TV — CLIENT ENGINE FOR SMART TV & MEDIA STATION X
// Optimized for 60fps, TV Remote D-Pad Navigation, Bento Grid
// ==========================================================================

const SECTION_WALLPAPERS = {
    widgets: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85",
    apps: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=85",
    settings: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85",
    info: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85"
};

const SCREENSAVER_IMAGES = {
    ss_space: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=90",
    ss_cyber: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=90",
    ss_mountains: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=90",
    ss_ocean: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90",
    ss_fireplace: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=90"
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
        sub: "Онлайн-кинотеатр",
        icon: "movie_filter",
        badge: "CINEMA",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_lampa",
        name: "Lampa",
        url: "http://lampa.mx",
        sub: "Каталог фильмов и сериалов",
        icon: "movie",
        badge: "PORTAL",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_deeplex",
        name: "Deeplex 4K",
        url: "http://deeplex.cc",
        sub: "Фильмы и сериалы 4K",
        icon: "play_circle_filled",
        badge: "CINEMA",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_iptv",
        name: "IPTV HD",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        sub: "Телеканалы",
        icon: "live_tv",
        badge: "LIVE",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_twitch",
        name: "Twitch",
        url: "http://msx.benzac.de/plugins/twitch.html",
        sub: "Игровые трансляции",
        icon: "videogame_asset",
        badge: "GAMES",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_youtube",
        name: "YouTube",
        url: "http://msx.benzac.de/plugins/youtube.html",
        sub: "Видео и музыка 4K",
        icon: "smart_display",
        badge: "VIDEO",
        image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_music",
        name: "Lo-Fi Radio",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        sub: "Релакс музыка",
        icon: "music_note",
        badge: "CHILL",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
    }
];

const WIDGETS_METADATA = {
    clock_digital: {
        id: "clock_digital",
        name: "Цифровые часы",
        desc: "Неоновые часы с бегущими секундами и полной датой",
        icon: "schedule",
        defaultSize: 2
    },
    clock_analog: {
        id: "clock_analog",
        name: "Аналоговые часы",
        desc: "Круглый швейцарский циферблат с плавной секундной стрелкой",
        icon: "watch_later",
        defaultSize: 1
    },
    clock_modern: {
        id: "clock_modern",
        name: "Минимал часы",
        desc: "Крупные контрастные цифры, день недели и месяц",
        icon: "av_timer",
        defaultSize: 1
    },
    calendar_grid: {
        id: "calendar_grid",
        name: "Календарь месяца",
        desc: "Полная сетка дней текущего месяца с подсветкой сегодня",
        icon: "calendar_month",
        defaultSize: 2
    },
    calendar_compact: {
        id: "calendar_compact",
        name: "Карточка Сегодня",
        desc: "Компактная дата, крупный день и статус дня",
        icon: "today",
        defaultSize: 1
    },
    calendar_events: {
        id: "calendar_events",
        name: "Планировщик ТВ",
        desc: "Список вечерних киносеансов и напоминаний",
        icon: "event_note",
        defaultSize: 2
    }
};

// Safe localStorage helper
function safeGetStorage(key, defaultVal) {
    try {
        const val = localStorage.getItem(key);
        return val !== null ? val : defaultVal;
    } catch (e) {
        return defaultVal;
    }
}

// App State
let state = {
    activeTab: "widgets",
    themeColor: safeGetStorage('hp_theme_color', "#00d2ff"),
    themeRgb: safeGetStorage('hp_theme_rgb', "0, 210, 255"),
    transparency: safeGetStorage('hp_transparency', "frosted"),
    animations: safeGetStorage('hp_animations', "snappy"),
    idleTimeoutSec: parseInt(safeGetStorage('hp_idle_sec', "120"), 10),
    screensaverBg: safeGetStorage('hp_ss_bg', "ss_all"),
    sidebarPos: safeGetStorage('hp_sidebar_pos', "right"), // DEFAULT: RIGHT SIDE
    ssMediaType: safeGetStorage('hp_ss_mtype', "photo"), // photo, youtube, video
    ssYoutubeId: safeGetStorage('hp_ss_ytid', "L_LUpnjgPso"),
    ssVideoUrl: safeGetStorage('hp_ss_vurl', "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
    ssPhotoAnim: safeGetStorage('hp_ss_photo_anim', 'true') !== 'false',
    ssWidgetOpacity: safeGetStorage('hp_ss_wopacity', "ultra"),
    ssWidgetType: safeGetStorage('hp_ss_wtype', "both"),
    ssPosition: safeGetStorage('hp_ss_pos', "center"),
    widgets: JSON.parse(safeGetStorage('hp_widgets', JSON.stringify({
        clock_digital: true,
        clock_analog: true,
        clock_modern: false,
        calendar_grid: true,
        calendar_compact: false,
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

// URL Normalizer (Keeps TV services on HTTP to prevent SSL failures on TV)
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

// Auto-heal stored apps from localStorage (Filmix must be first)
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

// Dismiss app transition loader on page show
window.addEventListener('pageshow', () => {
    const loader = document.getElementById('appNavLoader');
    if (loader) loader.classList.remove('active');
});

// ---------------------------------------------------------------------------
// 1. THEME, ACCENT COLOR, TRANSPARENCY & SIDEBAR POSITION
// ---------------------------------------------------------------------------
function applyThemeSettings() {
    const root = document.documentElement;
    if (root) {
        root.style.setProperty('--accent-color', state.themeColor);
        root.style.setProperty('--accent-rgb', state.themeRgb);
    }

    if (document.body) {
        document.body.classList.remove('trans-frosted', 'trans-transparent', 'trans-dark');
        document.body.classList.add(`trans-${state.transparency}`);
        document.body.classList.toggle('anim-fast', state.animations === 'fast');
    }

    try {
        localStorage.setItem('hp_theme_color', state.themeColor);
        localStorage.setItem('hp_theme_rgb', state.themeRgb);
        localStorage.setItem('hp_transparency', state.transparency);
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
// 2. SIDEBAR NAVIGATION & TAB SWITCHING
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

function focusCurrentTabContent() {
    setTimeout(() => {
        if (state.activeTab === 'widgets') {
            const firstWidget = document.querySelector('.glass-widget:not([style*="display: none"])');
            if (firstWidget) firstWidget.focus();
        } else if (state.activeTab === 'apps') {
            const firstApp = document.querySelector('.app-card');
            if (firstApp) firstApp.focus();
        } else if (state.activeTab === 'settings') {
            const firstSubtab = document.querySelector('.subtab-btn.active') || document.querySelector('.subtab-btn');
            if (firstSubtab) firstSubtab.focus();
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

    if (bgWallpaper && SECTION_WALLPAPERS[tabId]) {
        bgWallpaper.style.backgroundImage = `url('${SECTION_WALLPAPERS[tabId]}')`;
    }
}

// Wire menu tab clicks and Enter keys
menuTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.getAttribute('data-tab');
        switchTab(target);
    });
});

// ---------------------------------------------------------------------------
// 3. REAL-TIME CLOCKS & DATES ENGINE (60 FPS)
// ---------------------------------------------------------------------------
function updateClocks() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    // 1. Digital Clock
    const elH = document.getElementById('digH');
    const elM = document.getElementById('digM');
    const elS = document.getElementById('digS');
    if (elH) elH.textContent = hStr;
    if (elM) elM.textContent = mStr;
    if (elS) elS.textContent = sStr;

    // Digital Full Date string
    const elDigDate = document.getElementById('digFullDate');
    if (elDigDate) {
        const dateOpts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const ds = now.toLocaleDateString('ru-RU', dateOpts);
        elDigDate.textContent = ds.charAt(0).toUpperCase() + ds.slice(1);
    }

    // 2. Modern Clock
    const elModTime = document.getElementById('modTimeVal');
    const elModWeek = document.getElementById('modWeekdayVal');
    const elModMonth = document.getElementById('modMonthVal');
    if (elModTime) elModTime.textContent = `${hStr}:${mStr}`;
    if (elModWeek) {
        const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        elModWeek.textContent = days[now.getDay()].toUpperCase();
    }
    if (elModMonth) {
        const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        elModMonth.textContent = `${months[now.getMonth()].toUpperCase()} ${now.getFullYear()}`;
    }

    // 3. Analog Clock (Always perfect circle with smooth sweep hands)
    const hHand = document.getElementById('handHour');
    const mHand = document.getElementById('handMin');
    const sHand = document.getElementById('handSec');
    if (hHand && mHand && sHand) {
        const sDeg = (s + ms / 1000) * 6;
        const mDeg = m * 6 + (s / 60) * 6;
        const hDeg = (h % 12) * 30 + (m / 60) * 30;
        hHand.style.transform = `translateX(-50%) rotate(${hDeg}deg)`;
        mHand.style.transform = `translateX(-50%) rotate(${mDeg}deg)`;
        sHand.style.transform = `translateX(-50%) rotate(${sDeg}deg)`;
    }

    // 4. Compact Date Card
    const compDay = document.getElementById('compDayNum');
    const compMonth = document.getElementById('compMonth');
    const compWeek = document.getElementById('compWeek');
    if (compDay) compDay.textContent = String(now.getDate());
    if (compMonth) {
        const mNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
        compMonth.textContent = `${mNames[now.getMonth()]} ${now.getFullYear()}`;
    }
    if (compWeek) {
        const wDays = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        compWeek.textContent = wDays[now.getDay()];
    }

    // 5. Screensaver Clock & Date
    const ssTime = document.getElementById('ssClockTime');
    const ssDate = document.getElementById('ssClockDate');
    if (ssTime) ssTime.textContent = `${hStr}:${mStr}:${sStr}`;
    if (ssDate) {
        const dateOpts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const ds = now.toLocaleDateString('ru-RU', dateOpts);
        ssDate.textContent = ds.charAt(0).toUpperCase() + ds.slice(1);
    }
}

function clockLoop() {
    updateClocks();
    requestAnimationFrame(clockLoop);
}
requestAnimationFrame(clockLoop);

// ---------------------------------------------------------------------------
// 4. DYNAMIC CALENDAR ENGINE
// ---------------------------------------------------------------------------
function renderCalendars() {
    const calCells = document.getElementById('calCellsGrid');
    const ssCalGrid = document.getElementById('ssCalGrid');
    const calMonthHeader = document.getElementById('calMonthName');
    const ssCalHeader = document.getElementById('ssCalHeader');

    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const curDate = now.getDate();

    const monthNames = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ", "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"];
    const monthTitle = `${monthNames[curMonth]} ${curYear}`;
    if (calMonthHeader) calMonthHeader.textContent = monthTitle;
    if (ssCalHeader) ssCalHeader.textContent = monthTitle;

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7; // Monday is 0
    const totalDays = new Date(curYear, curMonth + 1, 0).getDate();

    function fillGrid(gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';

        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cell empty';
            gridElement.appendChild(emptyCell);
        }

        for (let d = 1; d <= totalDays; d++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = String(d);

            const dayOfWeek = (startOffset + d - 1) % 7;
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                cell.classList.add('we');
            }

            if (d === curDate) {
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
// 5. MODULAR BENTO GRID & WIDGET SIZING ENGINE
// ---------------------------------------------------------------------------
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

        const size = state.widgetSizes[key] || 2;
        el.classList.remove('span-1', 'span-2', 'span-4');
        el.classList.add(`span-${size}`);
    });

    try {
        localStorage.setItem('hp_widgets', JSON.stringify(state.widgets));
        localStorage.setItem('hp_widget_sizes', JSON.stringify(state.widgetSizes));
    } catch (e) {}
}
applyWidgetSizesAndToggles();

// Make widgets clickable to open their configuration in Settings
Object.keys(widgetElements).forEach(key => {
    const el = widgetElements[key];
    if (el) {
        el.addEventListener('click', () => {
            switchTab('settings');
            const subWidgetBtn = document.querySelector('.subtab-btn[data-subtab="widgets"]');
            if (subWidgetBtn) subWidgetBtn.click();
            openWidgetDetail(key);
        });
    }
});

// ---------------------------------------------------------------------------
// 6. SETTINGS SUBTABS & CUSTOMIZATION
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
            if (subpanes[k]) subpanes[k].classList.toggle('active', k === target);
        });
    });
});

// Accent Color Swatches
const colorSwatches = document.querySelectorAll('.color-swatch-btn');
colorSwatches.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        colorSwatches.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.themeColor = btn.getAttribute('data-color');
        state.themeRgb = btn.getAttribute('data-rgb');
        applyThemeSettings();
    });
});
colorSwatches.forEach(b => b.classList.toggle('active', b.getAttribute('data-color') === state.themeColor));

// Transparency Modes
const transBtns = document.querySelectorAll('.trans-option-btn');
transBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        transBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.transparency = btn.getAttribute('data-trans');
        applyThemeSettings();
    });
});
transBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-trans') === state.transparency));

// Sidebar Position Selector
const sidebarPosBtns = document.querySelectorAll('.sidebar-pos-btn');
sidebarPosBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarPosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.sidebarPos = btn.getAttribute('data-pos') || 'right';
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
// 7. WIDGETS MANAGER IN SETTINGS (Cards -> Detail Configurator)
// ---------------------------------------------------------------------------
const widgetsListView = document.getElementById('widgetsListView');
const widgetDetailView = document.getElementById('widgetDetailView');
const widgetsManageGrid = document.getElementById('widgetsManageGrid');
const btnBackToWidgetsList = document.getElementById('btnBackToWidgetsList');

const detailWidgetIcon = document.getElementById('detailWidgetIcon');
const detailWidgetBadge = document.getElementById('detailWidgetBadge');
const detailWidgetTitle = document.getElementById('detailWidgetTitle');
const detailWidgetDesc = document.getElementById('detailWidgetDesc');
const detailTogglePill = document.getElementById('detailTogglePill');
const detailToggleCheck = document.getElementById('detailToggleCheck');
const detailSizeCards = document.querySelectorAll('.bento-size-card');
const btnSaveWidgetDetail = document.getElementById('btnSaveWidgetDetail');

function renderWidgetsManageGrid() {
    if (!widgetsManageGrid) return;
    widgetsManageGrid.innerHTML = '';

    Object.keys(WIDGETS_METADATA).forEach(key => {
        const meta = WIDGETS_METADATA[key];
        const isEnabled = !!state.widgets[key];
        const curSize = state.widgetSizes[key] || meta.defaultSize;

        const card = document.createElement('div');
        card.className = `widget-card-manage ${isEnabled ? 'is-enabled' : 'is-disabled'}`;
        card.setAttribute('tabindex', '0');

        card.innerHTML = `
            <div class="wcm-header">
                <span class="material-icons wcm-icon">${meta.icon}</span>
                <span class="wcm-status-pill ${isEnabled ? 'pill-active' : 'pill-inactive'}">
                    ${isEnabled ? 'Активен' : 'Скрыт'}
                </span>
            </div>
            <div class="wcm-body">
                <h4 class="wcm-title">${meta.name}</h4>
                <p class="wcm-desc">${meta.desc}</p>
            </div>
            <div class="wcm-footer">
                <span class="wcm-size-badge">${curSize === 1 ? '1 ячейка (1x1)' : (curSize === 2 ? '2 ячейки (2x1)' : '4 ячейки (2x2)')}</span>
                <button class="btn-manage-cfg" tabindex="0">⚙ Настроить</button>
            </div>
        `;

        const openHandler = (e) => {
            e.preventDefault();
            openWidgetDetail(key);
        };

        card.addEventListener('click', openHandler);
        const cfgBtn = card.querySelector('.btn-manage-cfg');
        if (cfgBtn) cfgBtn.addEventListener('click', openHandler);

        widgetsManageGrid.appendChild(card);
    });
}

function openWidgetDetail(widgetKey) {
    state.currentEditingWidget = widgetKey;
    const meta = WIDGETS_METADATA[widgetKey];
    if (!meta) return;

    if (detailWidgetIcon) detailWidgetIcon.textContent = meta.icon;
    if (detailWidgetBadge) detailWidgetBadge.textContent = widgetKey.toUpperCase();
    if (detailWidgetTitle) detailWidgetTitle.textContent = meta.name;
    if (detailWidgetDesc) detailWidgetDesc.textContent = meta.desc;

    const isEnabled = !!state.widgets[widgetKey];
    if (detailTogglePill) {
        detailTogglePill.classList.toggle('checked', isEnabled);
        if (detailToggleCheck) detailToggleCheck.textContent = isEnabled ? '✓' : '✕';
    }

    const currentSize = state.widgetSizes[widgetKey] || meta.defaultSize;
    detailSizeCards.forEach(c => {
        const sz = parseInt(c.getAttribute('data-size'), 10);
        c.classList.toggle('selected', sz === currentSize);
    });

    if (widgetsListView) widgetsListView.style.display = 'none';
    if (widgetDetailView) widgetDetailView.style.display = 'block';

    if (detailTogglePill) detailTogglePill.focus();
}

function showWidgetsListView() {
    if (widgetDetailView) widgetDetailView.style.display = 'none';
    if (widgetsListView) widgetsListView.style.display = 'block';
    renderWidgetsManageGrid();
}

if (btnBackToWidgetsList) {
    btnBackToWidgetsList.addEventListener('click', (e) => {
        e.preventDefault();
        showWidgetsListView();
    });
}

if (detailTogglePill) {
    detailTogglePill.addEventListener('click', (e) => {
        e.preventDefault();
        detailTogglePill.classList.toggle('checked');
        const isChecked = detailTogglePill.classList.contains('checked');
        if (detailToggleCheck) detailToggleCheck.textContent = isChecked ? '✓' : '✕';
    });
}

detailSizeCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        detailSizeCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

if (btnSaveWidgetDetail) {
    btnSaveWidgetDetail.addEventListener('click', (e) => {
        e.preventDefault();
        const key = state.currentEditingWidget;
        if (!key) return;

        const isChecked = detailTogglePill ? detailTogglePill.classList.contains('checked') : true;
        state.widgets[key] = isChecked;

        let selectedSize = 2;
        detailSizeCards.forEach(c => {
            if (c.classList.contains('selected')) {
                selectedSize = parseInt(c.getAttribute('data-size'), 10);
            }
        });
        state.widgetSizes[key] = selectedSize;

        applyWidgetSizesAndToggles();
        showWidgetsListView();
    });
}
renderWidgetsManageGrid();

// ---------------------------------------------------------------------------
// 8. DIRECT WEBSITE LAUNCHER & APPS MANAGEMENT
// ---------------------------------------------------------------------------
function openApp(app) {
    if (!app || !app.url) return;
    const targetUrl = normalizeUrl(app.url);

    const loader = document.getElementById('appNavLoader');
    const loaderText = document.getElementById('loaderText');
    if (loader) {
        if (loaderText) loaderText.textContent = `Запуск ${app.name}...`;
        loader.classList.add('active');
    }

    try {
        window.history.pushState({ appOpen: true, appName: app.name, url: targetUrl }, '', window.location.pathname + window.location.search);
    } catch (err) {}

    setTimeout(() => {
        window.location.href = targetUrl;
    }, 120);
}

const appsGrid = document.getElementById('appsGrid');
const appsCountBadge = document.getElementById('appsCountBadge');
const installedAppsManageList = document.getElementById('installedAppsManageList');

function renderApps() {
    if (appsCountBadge) appsCountBadge.textContent = state.apps.length;

    if (appsGrid) {
        appsGrid.innerHTML = '';
        state.apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.tabIndex = 0;

            const imgUrl = app.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500';
            card.innerHTML = `
                <div class="app-icon-squircle">
                    <img src="${imgUrl}" alt="${app.name}" class="app-icon-img" loading="lazy">
                    <span class="app-card-badge">${app.badge || 'APP'}</span>
                </div>
                <div class="app-card-name">${app.name}</div>
            `;

            card.addEventListener('click', (e) => {
                e.preventDefault();
                openApp(app);
            });

            appsGrid.appendChild(card);
        });
    }

    if (installedAppsManageList) {
        installedAppsManageList.innerHTML = '';
        state.apps.forEach((app, index) => {
            const item = document.createElement('div');
            item.className = 'installed-item';
            item.innerHTML = `
                <span><strong>${app.name}</strong> (${app.url})</span>
                <button class="btn-del-app" data-index="${index}" tabindex="0">Удалить</button>
            `;
            const delBtn = item.querySelector('.btn-del-app');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.apps.splice(index, 1);
                    try {
                        localStorage.setItem('hp_apps', JSON.stringify(state.apps));
                    } catch (err) {}
                    renderApps();
                });
            }
            installedAppsManageList.appendChild(item);
        });
    }
}
renderApps();

// Add Custom App in Settings
const btnSaveApp = document.getElementById('btnSaveApp');
const inputAppName = document.getElementById('inputAppName');
const inputAppUrl = document.getElementById('inputAppUrl');
const selectAppIcon = document.getElementById('selectAppIcon');

if (btnSaveApp && inputAppName && inputAppUrl) {
    btnSaveApp.addEventListener('click', (e) => {
        e.preventDefault();
        const name = inputAppName.value.trim();
        const url = normalizeUrl(inputAppUrl.value.trim());
        const icon = selectAppIcon ? selectAppIcon.value : 'launch';

        if (!name || !url) {
            alert('Пожалуйста, заполните название и URL программы.');
            return;
        }

        state.apps.push({
            id: `app_custom_${Date.now()}`,
            name: name,
            url: url,
            sub: 'Пользовательский ярлык',
            icon: icon,
            badge: 'CUSTOM',
            image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500'
        });

        try {
            localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        } catch (err) {}
        inputAppName.value = '';
        inputAppUrl.value = '';
        renderApps();
        alert('Программа добавлена в каталог!');
    });
}

// Preset Quick Add Buttons
const presetBtns = document.querySelectorAll('.preset-btn');
presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = btn.getAttribute('data-name');
        const url = normalizeUrl(btn.getAttribute('data-url'));
        const icon = btn.getAttribute('data-icon') || 'launch';

        if (!state.apps.some(a => a.name.toLowerCase() === name.toLowerCase())) {
            state.apps.push({
                id: `app_${name.toLowerCase()}`,
                name: name,
                url: url,
                sub: 'Популярное ТВ-приложение',
                icon: icon,
                badge: 'APP',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500'
            });
            try {
                localStorage.setItem('hp_apps', JSON.stringify(state.apps));
            } catch (err) {}
            renderApps();
            alert(`Программа «${name}» добавлена!`);
        } else {
            alert(`Программа «${name}» уже установлена.`);
        }
    });
});

// Reset Apps Button
const btnResetDefaultApps = document.getElementById('btnResetDefaultApps');
if (btnResetDefaultApps) {
    btnResetDefaultApps.addEventListener('click', (e) => {
        e.preventDefault();
        state.apps = JSON.parse(JSON.stringify(DEFAULT_APPS_LIST));
        try {
            localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        } catch (err) {}
        renderApps();
        alert('Список программ сброшен к стандартному.');
    });
}

// Restart Portal Button
const restartPortalBtn = document.getElementById('restartPortalBtn');
if (restartPortalBtn) {
    restartPortalBtn.addEventListener('click', (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        window.location.reload();
    });
}

// ---------------------------------------------------------------------------
// 9. UNIVERSAL SMART TV REMOTE NAVIGATION & ENTER/OK HANDLERS
// ---------------------------------------------------------------------------
function handleTvBackButton(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const appLoader = document.getElementById('appNavLoader');
    if (appLoader && appLoader.classList.contains('active')) {
        appLoader.classList.remove('active');
        return true;
    }

    const screensaver = document.getElementById('screensaverLayer');
    if (screensaver && screensaver.classList.contains('active')) {
        hideScreensaver();
        switchTab('widgets');
        return true;
    }

    if (state.activeTab === 'settings' && widgetDetailView && widgetDetailView.style.display !== 'none') {
        showWidgetsListView();
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
    const keyCode = e.keyCode;
    const isBackKey = (
        keyCode === 10009 || // Samsung Tizen Return
        keyCode === 461 ||   // LG webOS Back
        keyCode === 4 ||     // Android TV Back
        keyCode === 27 ||    // ESC
        keyCode === 8        // Backspace
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

    // Spatial D-Pad Navigation for Right-Hand Sidebar
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
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusCurrentTabContent();
        }
    } else {
        // In main content stage (on the left): ArrowRight moves INTO the right sidebar
        if (e.key === 'ArrowRight') {
            const activeTabBtn = document.querySelector(`.menu-tab[data-tab="${state.activeTab}"]`) || document.querySelector('.menu-tab');
            if (activeTabBtn) {
                e.preventDefault();
                activeTabBtn.focus();
            }
        }
    }
});

document.addEventListener('tizenhwkey', (e) => {
    if (e.keyName === 'back') {
        handleTvBackButton(e);
    }
});

window.addEventListener('popstate', (e) => {
    const loader = document.getElementById('appNavLoader');
    if (loader) loader.classList.remove('active');
    handleTvBackButton(null);
});

// ---------------------------------------------------------------------------
// 10. 4K SCREENSAVER ENGINE (WALLPAPERS, VIDEO, YOUTUBE & KEN BURNS)
// ---------------------------------------------------------------------------
const screensaverLayer = document.getElementById('screensaverLayer');
const ssWidgetsContainer = document.getElementById('ssWidgetsContainer');
const ssClockBlock = document.getElementById('ssClockBlock');
const ssCalendarBlock = document.getElementById('ssCalendarBlock');
let idleTimer = null;

function applyScreensaverLayout() {
    if (!ssWidgetsContainer) return;

    const validPositions = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
    validPositions.forEach(p => ssWidgetsContainer.classList.remove(`pos-${p}`));
    ssWidgetsContainer.classList.add(`pos-${state.ssPosition || 'center'}`);

    const type = state.ssWidgetType || 'both';
    if (ssClockBlock) {
        ssClockBlock.style.display = (type === 'both' || type === 'clock') ? 'inline-flex' : 'none';
    }
    if (ssCalendarBlock) {
        ssCalendarBlock.style.display = (type === 'both' || type === 'calendar') ? 'inline-flex' : 'none';
    }
}

function extractYouTubeId(urlOrId) {
    if (!urlOrId) return '';
    const trimmed = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
    return match ? match[1] : trimmed;
}

function applyScreensaverWidgetOpacity() {
    const blocks = document.querySelectorAll('.ss-widget-block');
    blocks.forEach(b => {
        b.classList.remove('trans-none', 'trans-ultra', 'trans-glass');
        b.classList.add(`trans-${state.ssWidgetOpacity || 'ultra'}`);
    });
    try {
        localStorage.setItem('hp_ss_wopacity', state.ssWidgetOpacity);
    } catch (e) {}
}

function showScreensaver() {
    if (!screensaverLayer) return;

    ssOpenedTimestamp = Date.now();
    applyScreensaverLayout();
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
        const ytId = extractYouTubeId(state.ssYoutubeId || 'L_LUpnjgPso');
        if (ssBgYoutubeWrap && ssBgYoutubeIframe) {
            ssBgYoutubeWrap.style.display = 'block';
            ssBgYoutubeIframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&modestbranding=1&rel=0&disablekb=1&enablejsapi=1`;
        }
    } else if (state.ssMediaType === 'video') {
        if (ssBgVideo) {
            ssBgVideo.style.display = 'block';
            ssBgVideo.src = state.ssVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
            ssBgVideo.play().catch(() => {});
        }
    } else {
        if (ssBgImage) {
            ssBgImage.style.display = 'block';
            ssBgImage.classList.toggle('animated', !!state.ssPhotoAnim);

            if (state.screensaverBg === 'ss_all') {
                ssSlideshowIndex = 0;
                ssBgImage.style.backgroundImage = `url('${SS_SLIDESHOW_LIST[0]}')`;

                if (ssSlideshowInterval) clearInterval(ssSlideshowInterval);
                ssSlideshowInterval = setInterval(() => {
                    ssSlideshowIndex = (ssSlideshowIndex + 1) % SS_SLIDESHOW_LIST.length;
                    if (ssBgImage) ssBgImage.style.backgroundImage = `url('${SS_SLIDESHOW_LIST[ssSlideshowIndex]}')`;
                }, 7000);
            } else {
                if (ssSlideshowInterval) clearInterval(ssSlideshowInterval);
                const bgUrl = SCREENSAVER_IMAGES[state.screensaverBg] || SCREENSAVER_IMAGES.ss_space;
                ssBgImage.style.backgroundImage = `url('${bgUrl}')`;
            }
        }
    }

    screensaverLayer.classList.add('active');
}

function hideScreensaver() {
    if (!screensaverLayer) return;
    screensaverLayer.classList.remove('active');

    const ssBgVideo = document.getElementById('ssBgVideo');
    const ssBgYoutubeWrap = document.getElementById('ssBgYoutubeWrap');
    const ssBgYoutubeIframe = document.getElementById('ssBgYoutubeIframe');

    if (ssBgVideo) {
        try { ssBgVideo.pause(); } catch (e) {}
        ssBgVideo.src = '';
        ssBgVideo.style.display = 'none';
    }
    if (ssBgYoutubeWrap && ssBgYoutubeIframe) {
        ssBgYoutubeIframe.src = 'about:blank';
        ssBgYoutubeWrap.style.display = 'none';
    }

    if (ssSlideshowInterval) {
        clearInterval(ssSlideshowInterval);
        ssSlideshowInterval = null;
    }

    resetIdleTimer();
}

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (state.idleTimeoutSec > 0) {
        idleTimer = setTimeout(() => {
            showScreensaver();
        }, state.idleTimeoutSec * 1000);
    }
}

// User activity listener for idle timer & screensaver dismissal
['mousemove', 'click', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, (e) => {
        if (screensaverLayer && screensaverLayer.classList.contains('active')) {
            if (Date.now() - ssOpenedTimestamp > 400) {
                hideScreensaver();
                switchTab('widgets');
            }
        } else {
            resetIdleTimer();
        }
    }, { passive: true });
});
resetIdleTimer();

// Manual screensaver triggers (with stopPropagation to prevent instant self-closing)
const startScreensaverBtn = document.getElementById('startScreensaverBtn');
if (startScreensaverBtn) {
    startScreensaverBtn.addEventListener('click', (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        showScreensaver();
    });
}

const btnTestScreensaver = document.getElementById('btnTestScreensaver');
if (btnTestScreensaver) {
    btnTestScreensaver.addEventListener('click', (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        showScreensaver();
    });
}

// Screensaver Wallpaper Picker
const ssThumbCards = document.querySelectorAll('.ss-thumb-card');
ssThumbCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        ssThumbCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.screensaverBg = card.getAttribute('data-id');
        try {
            localStorage.setItem('hp_ss_bg', state.screensaverBg);
        } catch (err) {}
    });
});
ssThumbCards.forEach(card => {
    card.classList.toggle('selected', card.getAttribute('data-id') === state.screensaverBg);
});

// Timeout selector buttons
const timeoutBtns = document.querySelectorAll('.timeout-btn');
timeoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        timeoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.idleTimeoutSec = parseInt(btn.getAttribute('data-time'), 10);
        try {
            localStorage.setItem('hp_idle_sec', String(state.idleTimeoutSec));
        } catch (err) {}
        resetIdleTimer();
    });
});
timeoutBtns.forEach(b => b.classList.toggle('active', parseInt(b.getAttribute('data-time'), 10) === state.idleTimeoutSec));

// Screensaver Widget Type Selector
const ssWTypeBtns = document.querySelectorAll('.ss-wtype-btn');
ssWTypeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        ssWTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssWidgetType = btn.getAttribute('data-wtype');
        try {
            localStorage.setItem('hp_ss_wtype', state.ssWidgetType);
        } catch (err) {}
        applyScreensaverLayout();
    });
});
ssWTypeBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-wtype') === state.ssWidgetType));

// Screensaver Position Selector
const ssPosBtns = document.querySelectorAll('.ss-pos-btn');
ssPosBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        ssPosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssPosition = btn.getAttribute('data-pos');
        try {
            localStorage.setItem('hp_ss_pos', state.ssPosition);
        } catch (err) {}
        applyScreensaverLayout();
    });
});
ssPosBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-pos') === state.ssPosition));

// Screensaver Media Type Selector (Photo / YouTube / Video)
const ssMediaBtns = document.querySelectorAll('.ss-media-btn');
ssMediaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        ssMediaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssMediaType = btn.getAttribute('data-media') || 'photo';
        try {
            localStorage.setItem('hp_ss_mtype', state.ssMediaType);
        } catch (err) {}
    });
});
ssMediaBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-media') === state.ssMediaType));

// Screensaver Photo Animation Toggle (Ken Burns on/off)
const ssAnimBtns = document.querySelectorAll('.ss-anim-btn');
ssAnimBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        ssAnimBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssPhotoAnim = btn.getAttribute('data-anim') === 'on';
        try {
            localStorage.setItem('hp_ss_photo_anim', String(state.ssPhotoAnim));
        } catch (err) {}
    });
});
ssAnimBtns.forEach(b => b.classList.toggle('active', (b.getAttribute('data-anim') === 'on') === !!state.ssPhotoAnim));

// Screensaver Video Presets (Fireplace, Aquarium, Ocean)
const ssVpresetBtns = document.querySelectorAll('.ss-vpreset-btn');
ssVpresetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        ssVpresetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const vtype = btn.getAttribute('data-type');
        const vval = btn.getAttribute('data-val');

        if (vtype === 'youtube') {
            state.ssMediaType = 'youtube';
            state.ssYoutubeId = vval;
            try {
                localStorage.setItem('hp_ss_mtype', 'youtube');
                localStorage.setItem('hp_ss_ytid', state.ssYoutubeId);
            } catch (err) {}
        } else if (vtype === 'video') {
            state.ssMediaType = 'video';
            state.ssVideoUrl = vval;
            try {
                localStorage.setItem('hp_ss_mtype', 'video');
                localStorage.setItem('hp_ss_vurl', state.ssVideoUrl);
            } catch (err) {}
        }

        ssMediaBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-media') === state.ssMediaType));
        alert('Заставка переключена на видео!');
    });
});

// Custom Video Input
const btnApplyCustomVideo = document.getElementById('btnApplyCustomVideo');
const inputCustomVideo = document.getElementById('inputCustomVideo');
if (btnApplyCustomVideo && inputCustomVideo) {
    btnApplyCustomVideo.addEventListener('click', (e) => {
        e.preventDefault();
        const val = inputCustomVideo.value.trim();
        if (!val) {
            alert('Введите ссылку на видео (MP4) или YouTube');
            return;
        }

        if (/\.(mp4|webm|m3u8)(\?.*)?$/i.test(val)) {
            state.ssMediaType = 'video';
            state.ssVideoUrl = val;
            try {
                localStorage.setItem('hp_ss_mtype', 'video');
                localStorage.setItem('hp_ss_vurl', val);
            } catch (err) {}
        } else {
            const ytId = extractYouTubeId(val);
            if (!ytId) {
                alert('Не удалось распознать ссылку на YouTube или MP4.');
                return;
            }
            state.ssMediaType = 'youtube';
            state.ssYoutubeId = ytId;
            try {
                localStorage.setItem('hp_ss_mtype', 'youtube');
                localStorage.setItem('hp_ss_ytid', ytId);
            } catch (err) {}
        }

        ssMediaBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-media') === state.ssMediaType));
        alert('Видео сохранено для заставки!');
    });
}

// Screensaver Opacity Selector
const ssOpacityBtns = document.querySelectorAll('.ss-opacity-btn');
ssOpacityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        ssOpacityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssWidgetOpacity = btn.getAttribute('data-opacity');
        applyScreensaverWidgetOpacity();
    });
});
ssOpacityBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-opacity') === state.ssWidgetOpacity));

// Canvas Stars Particles for Screensaver
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
