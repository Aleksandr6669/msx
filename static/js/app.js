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
    ss_space: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=90",
    ss_cyber: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=90",
    ss_mountains: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=90",
    ss_ocean: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90",
    ss_fireplace: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=90",
    ss_forest: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&auto=format&fit=crop&q=90",
    ss_lake: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=90",
    ss_nebula: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=90",
    ss_waterfall: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&auto=format&fit=crop&q=90",
    ss_city_night: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1920&auto=format&fit=crop&q=90"
};
const SS_SLIDESHOW_LIST = Object.values(SCREENSAVER_IMAGES);
let ssSlideshowInterval = null;
let ssSlideshowIndex = 0;

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
        id: "app_iptv",
        name: "IPTV HD",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        sub: "Телеканалы",
        icon: "live_tv",
        badge: "LIVE",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_music",
        name: "Lo-Fi Radio",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        sub: "Релакс музыка",
        icon: "music_note",
        badge: "CHILL",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
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
        sub: "Игровые трансляции",
        icon: "videogame_asset",
        badge: "GAMES",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80"
    }
];

const WIDGETS_METADATA = {
    clock_digital: {
        title: "Цифровые часы",
        desc: "Крупные часы с секундами и датой",
        icon: "schedule",
        defaultSize: 2
    },
    clock_analog: {
        title: "Аналоговые часы",
        desc: "Стрелочный хронограф с секундной стрелкой",
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

// App State
let state = {
    activeTab: "widgets",
    themeColor: localStorage.getItem('hp_theme_color') || "#00d2ff",
    themeRgb: localStorage.getItem('hp_theme_rgb') || "0, 210, 255",
    transparency: localStorage.getItem('hp_transparency') || "frosted",
    animations: localStorage.getItem('hp_animations') || "snappy",
    idleTimeoutSec: parseInt(localStorage.getItem('hp_idle_sec') || "120", 10),
    screensaverBg: localStorage.getItem('hp_ss_bg') || "ss_all",
    sidebarPos: localStorage.getItem('hp_sidebar_pos') || "left",
    ssMediaType: localStorage.getItem('hp_ss_mtype') || "photo",
    ssYoutubeId: localStorage.getItem('hp_ss_ytid') || "L_LUpnjgPso",
    ssVideoUrl: localStorage.getItem('hp_ss_vurl') || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    ssPhotoAnim: localStorage.getItem('hp_ss_photo_anim') !== 'false',
    ssWidgetOpacity: localStorage.getItem('hp_ss_wopacity') || "ultra",
    ssWidgetType: localStorage.getItem('hp_ss_wtype') || "both",
    ssPosition: localStorage.getItem('hp_ss_pos') || "center",
    widgets: JSON.parse(localStorage.getItem('hp_widgets') || JSON.stringify({
        clock_digital: true,
        clock_analog: true,
        clock_modern: false,
        calendar_grid: true,
        calendar_compact: false,
        calendar_events: true
    })),
    widgetSizes: JSON.parse(localStorage.getItem('hp_widget_sizes') || JSON.stringify({
        clock_digital: 2,
        clock_analog: 1,
        clock_modern: 1,
        calendar_grid: 4,
        calendar_compact: 1,
        calendar_events: 2
    })),
    apps: JSON.parse(localStorage.getItem('hp_apps') || JSON.stringify(DEFAULT_APPS_LIST)),
    currentEditingWidget: null
};

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
    let appsChanged = false;
    state.apps.forEach(app => {
        if (!app || !app.url) return;
        const normalized = normalizeUrl(app.url);
        if (normalized !== app.url) {
            app.url = normalized;
            appsChanged = true;
        }
    });
    if (appsChanged) {
        try {
            localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        } catch (e) {}
    }
}

window.addEventListener('pageshow', () => {
    const loader = document.getElementById('appNavLoader');
    if (loader) loader.classList.remove('active');
});

// ---------------------------------------------------------------------------
// 1. THEME, ACCENT COLOR & TRANSPARENCY CONTROLLER
// ---------------------------------------------------------------------------
function applyThemeSettings() {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', state.themeColor);
    root.style.setProperty('--accent-rgb', state.themeRgb);

    document.body.classList.remove('trans-frosted', 'trans-transparent', 'trans-dark');
    document.body.classList.add(`trans-${state.transparency}`);

    document.body.classList.toggle('anim-fast', state.animations === 'fast');

    localStorage.setItem('hp_theme_color', state.themeColor);
    localStorage.setItem('hp_theme_rgb', state.themeRgb);
    localStorage.setItem('hp_transparency', state.transparency);
    localStorage.setItem('hp_animations', state.animations);
}
applyThemeSettings();

function applySidebarPosition() {
    if (!tvShell) return;
    tvShell.classList.toggle('sidebar-right', state.sidebarPos === 'right');
    localStorage.setItem('hp_sidebar_pos', state.sidebarPos);
}
applySidebarPosition();

const sidebarPosBtns = document.querySelectorAll('.sidebar-pos-btn');
sidebarPosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sidebarPosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.sidebarPos = btn.getAttribute('data-pos') || 'left';
        applySidebarPosition();
    });
});
sidebarPosBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-pos') === state.sidebarPos));

// ---------------------------------------------------------------------------
// 2. COLLAPSIBLE SIDEBAR & TAB SWITCHING
// ---------------------------------------------------------------------------
const bgWallpaper = document.getElementById('bgWallpaper');
const tvSidebar = document.getElementById('tvSidebar');
const tvShell = document.getElementById('tvShell');
const tvStage = document.getElementById('tvStage');
const menuTabs = document.querySelectorAll('.menu-tab');
const tabPanes = {
    widgets: document.getElementById('tabWidgets'),
    apps: document.getElementById('tabApps'),
    settings: document.getElementById('tabSettings'),
    info: document.getElementById('tabInfo')
};

function expandSidebar(expand) {
    if (!tvSidebar) return;
    if (expand) {
        tvSidebar.classList.remove('collapsed');
        if (tvShell) tvShell.classList.remove('sidebar-collapsed');
    } else {
        tvSidebar.classList.add('collapsed');
        if (tvShell) tvShell.classList.add('sidebar-collapsed');
    }
}

if (tvSidebar) {
    tvSidebar.addEventListener('focusin', () => expandSidebar(true));
    tvSidebar.addEventListener('mouseenter', () => expandSidebar(true));
}
if (tvStage) {
    tvStage.addEventListener('focusin', () => expandSidebar(false));
    tvStage.addEventListener('mouseenter', () => expandSidebar(false));
}

function focusCurrentTabContent() {
    const activePane = tabPanes[state.activeTab];
    if (!activePane) return;
    const focusable = activePane.querySelectorAll('button, [tabindex="0"], input, select');
    if (focusable.length > 0) {
        setFocusWithClass(focusable[0]);
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

    const bgUrl = SECTION_WALLPAPERS[tabId] || SECTION_WALLPAPERS.widgets;
    if (bgWallpaper) {
        bgWallpaper.style.backgroundImage = `url('${bgUrl}')`;
    }
}

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        if (target) {
            switchTab(target);
            expandSidebar(false);
            focusCurrentTabContent();
        }
    });
});

const urlParams = new URLSearchParams(window.location.search);
const initialTab = urlParams.get('tab') || sessionStorage.getItem('hp_active_tab') || 'widgets';
switchTab(initialTab);

// ---------------------------------------------------------------------------
// 3. REAL-TIME CLOCKS ENGINE
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

    const elH = document.getElementById('digH');
    const elM = document.getElementById('digM');
    const elS = document.getElementById('digS');
    if (elH && elM && elS) {
        elH.textContent = hStr;
        elM.textContent = mStr;
        elS.textContent = sStr;
    }

    const elModTime = document.getElementById('modTimeVal');
    const elModWeek = document.getElementById('modWeekdayVal');
    const elModMonth = document.getElementById('modMonthVal');
    if (elModTime) {
        elModTime.textContent = `${hStr}:${mStr}`;
    }

    const hHand = document.getElementById('analogHourHand');
    const mHand = document.getElementById('analogMinHand');
    const sHand = document.getElementById('analogSecHand');
    if (hHand && mHand && sHand) {
        const secDeg = (s + ms / 1000) * 6;
        const minDeg = (m + s / 60) * 6;
        const hourDeg = ((h % 12) + m / 60) * 30;

        sHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        mHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        hHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }

    const ruMonths = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", 
                     "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    const ruWeekdays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
    const fullDateStr = `${ruWeekdays[(now.getDay() + 6) % 7]}, ${now.getDate()} ${ruMonths[now.getMonth()]} ${now.getFullYear()}`;

    const digFullDate = document.getElementById('digFullDate');
    if (digFullDate) digFullDate.textContent = fullDateStr;

    const analogDigTime = document.getElementById('analogDigTime');
    const analogDateLabel = document.getElementById('analogDateLabel');
    if (analogDigTime) analogDigTime.textContent = `${hStr}:${mStr}`;
    if (analogDateLabel) analogDateLabel.textContent = `${now.getDate()} ${ruMonths[now.getMonth()]} ${now.getFullYear()}`.toUpperCase();

    if (elModWeek) elModWeek.textContent = ruWeekdays[(now.getDay() + 6) % 7].toUpperCase();
    if (elModMonth) elModMonth.textContent = `${ruMonths[now.getMonth()].toUpperCase()} ${now.getFullYear()}`;

    const compDayNum = document.getElementById('compactDayNum');
    const compMonth = document.getElementById('compactMonthName');
    const compWeek = document.getElementById('compactWeekdayName');
    if (compDayNum) compDayNum.textContent = String(now.getDate());
    if (compMonth) compMonth.textContent = `${ruMonths[now.getMonth()]} ${now.getFullYear()}`;
    if (compWeek) compWeek.textContent = ruWeekdays[(now.getDay() + 6) % 7];

    const ssTimeText = document.getElementById('ssTimeText') || document.getElementById('ssClockTime');
    const ssDateText = document.getElementById('ssDateText') || document.getElementById('ssClockDate');
    if (ssTimeText) ssTimeText.textContent = `${hStr}:${mStr}`;
    if (ssDateText) ssDateText.textContent = fullDateStr;
}

function clockLoop() {
    updateClocks();
    requestAnimationFrame(clockLoop);
}
requestAnimationFrame(clockLoop);

// ---------------------------------------------------------------------------
// 4. DYNAMIC CALENDAR ENGINE (MAIN GRID & SCREENSAVER MINI-GRID)
// ---------------------------------------------------------------------------
function renderCalendars() {
    const calCells = document.getElementById('calGridCells');
    const calMonthTitle = document.getElementById('calMonthTitle');
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

    if (calMonthTitle) calMonthTitle.textContent = monthTitle;
    if (ssCalHeader) ssCalHeader.textContent = monthTitle;

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7;
    const totalDays = new Date(curYear, curMonth + 1, 0).getDate();

    function fillGrid(gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';

        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement('div');
            empty.className = 'cal-cell empty other-month';
            gridElement.appendChild(empty);
        }

        for (let d = 1; d <= totalDays; d++) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell';
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

    localStorage.setItem('hp_widgets', JSON.stringify(state.widgets));
    localStorage.setItem('hp_widget_sizes', JSON.stringify(state.widgetSizes));
}
applyWidgetSizesAndToggles();

// ---------------------------------------------------------------------------
// 6. SETTINGS SUBTABS & CONTROLLERS
// ---------------------------------------------------------------------------
const subtabBtns = document.querySelectorAll('.subtab-btn');
const subpanes = {
    'appearance': document.getElementById('sub-appearance'),
    'widgets': document.getElementById('sub-widgets'),
    'apps': document.getElementById('sub-apps'),
    'screensaver': document.getElementById('sub-screensaver')
};

subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        subtabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.getAttribute('data-subtab');
        Object.keys(subpanes).forEach(k => {
            if (subpanes[k]) subpanes[k].classList.toggle('active', k === target);
        });

        if (target === 'widgets') {
            showWidgetsListView();
        }
    });
});

const colorSwatchBtns = document.querySelectorAll('.color-swatch-btn');
colorSwatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        colorSwatchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.themeColor = btn.getAttribute('data-color');
        state.themeRgb = btn.getAttribute('data-rgb');
        applyThemeSettings();
    });
});
colorSwatchBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-color') === state.themeColor));

const transBtns = document.querySelectorAll('.trans-option-btn');
transBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        transBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.transparency = btn.getAttribute('data-blur') || 'frosted';
        applyThemeSettings();
    });
});

// ---------------------------------------------------------------------------
// 7. DEDICATED WIDGETS MANAGER IN SETTINGS
// ---------------------------------------------------------------------------
const widgetsListView = document.getElementById('widgetsListView');
const widgetDetailView = document.getElementById('widgetDetailView');
const widgetsManageGrid = document.getElementById('widgetsManageGrid');
const btnBackToWidgetsList = document.getElementById('btnBackToWidgetsList');

const detailWidgetTitle = document.getElementById('detailWidgetTitle');
const detailWidgetDesc = document.getElementById('detailWidgetDesc');
const detailWidgetBadge = document.getElementById('detailWidgetBadge');
const detailWidgetIcon = document.getElementById('detailWidgetIcon');
const detailWidgetToggle = document.getElementById('detailWidgetToggle');
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
            <div class="wcm-left">
                <span class="material-icons wcm-icon">${meta.icon}</span>
                <div>
                    <span class="wcm-title">${meta.title}</span>
                    <span class="wcm-size-badge">${isEnabled ? 'Включен' : 'Выключен'} • ${formatSizeText(curSize)}</span>
                </div>
            </div>
            <button class="btn-manage-cfg" tabindex="0">
                <span class="material-icons" style="font-size: 16px;">tune</span>
                <span>Настроить</span>
            </button>
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
        setFocusWithClass(btnBackToWidgetsList);
    }
}

function updateDetailToggleUI() {
    const key = state.currentEditingWidget;
    if (!key) return;
    const isChecked = !!state.widgets[key];
    if (detailWidgetToggle) {
        detailWidgetToggle.classList.toggle('active', isChecked);
        const lbl = detailWidgetToggle.querySelector('.pill-label');
        if (lbl) lbl.textContent = isChecked ? 'Включен' : 'Выключен';
    }
}

function updateDetailSizeUI() {
    const key = state.currentEditingWidget;
    if (!key) return;
    const curSize = state.widgetSizes[key] || 2;
    bentoSizeCards.forEach(card => {
        const sizeVal = parseInt(card.getAttribute('data-size'), 10);
        card.classList.toggle('active', sizeVal === curSize);
    });
}

if (detailWidgetToggle) {
    detailWidgetToggle.addEventListener('click', () => {
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

renderWidgetsManageGrid();

// ---------------------------------------------------------------------------
// 8. DIRECT FULLSCREEN WEBSITE LAUNCHER & HISTORY PRESERVATION
// ---------------------------------------------------------------------------
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

function openApp(app) {
    if (!app || !app.url) return;
    const targetUrl = normalizeUrl(app.url);

    try {
        sessionStorage.setItem('hp_active_tab', 'apps');
        sessionStorage.setItem('hp_last_app_id', app.id || '');
        window.history.replaceState(null, '', '/?tab=apps');
    } catch (e) {}

    const loader = document.getElementById('appNavLoader');
    const loaderText = document.getElementById('loaderText');
    if (loaderText) {
        loaderText.textContent = `Запуск: ${app.name || 'Веб-сайт'}...`;
    }
    if (loader) {
        loader.classList.add('active');
    }

    setTimeout(() => {
        window.location.href = targetUrl;
    }, 120);
}

// ---------------------------------------------------------------------------
// 9. UNIVERSAL SMART TV REMOTE ENGINE (D-PAD SPATIAL NAV & BACK BUTTON)
// ---------------------------------------------------------------------------
function handleTvBackButton(e) {
    if (e && e.preventDefault) e.preventDefault();

    // 1. If screensaver active -> dismiss
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        hideScreensaver();
        switchTab('widgets');
        return true;
    }

    // 2. If sidebar is expanded -> collapse it
    if (tvSidebar && tvSidebar.classList.contains('expanded')) {
        expandSidebar(false);
        focusCurrentTabContent();
        return true;
    }

    // 3. If in widget detail view -> go back to widgets list
    if (state.activeTab === 'settings' && widgetDetailView && widgetDetailView.style.display !== 'none') {
        showWidgetsListView();
        return true;
    }

    // 4. If in Apps or Settings or Info -> return to Widgets
    if (state.activeTab !== 'widgets') {
        switchTab('widgets');
        expandSidebar(false);
        focusCurrentTabContent();
        return true;
    }

    // 5. If ALREADY on widgets -> STAY on widgets! NEVER exit to TV desktop!
    expandSidebar(false);
    return true;
}

// Focus Management Helper
function setFocusWithClass(el) {
    if (!el) return;
    document.querySelectorAll('.focused').forEach(node => node.classList.remove('focused'));
    el.focus();
    el.classList.add('focused');
    if (el.scrollIntoView) {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
}

// Initial Auto-Focus Helper
function ensureInitialFocus() {
    if (screensaverLayer && screensaverLayer.classList.contains('active')) return;

    if (state.activeTab === 'widgets') {
        const digi = document.getElementById('wClockDigital');
        if (digi && digi.offsetParent !== null) {
            setFocusWithClass(digi);
            return;
        }
    }

    const activePane = tabPanes[state.activeTab];
    if (activePane) {
        const firstFocus = activePane.querySelector('.glass-widget, .app-card, button, [tabindex="0"]');
        if (firstFocus && firstFocus.offsetParent !== null) {
            setFocusWithClass(firstFocus);
            return;
        }
    }

    const activeTabBtn = document.querySelector(`.menu-tab[data-tab="${state.activeTab}"]`);
    if (activeTabBtn) {
        setFocusWithClass(activeTabBtn);
    }
}

// Focus Sidebar Active Tab
function focusSidebarActiveTab() {
    expandSidebar(true);
    const activeTabBtn = document.querySelector(`.menu-tab[data-tab="${state.activeTab}"]`) || document.querySelector('.menu-tab');
    if (activeTabBtn) {
        setFocusWithClass(activeTabBtn);
    }
}

// 2D Spatial Fallback Algorithm
function findSpatialCandidate(currentEl, direction) {
    const pane = tabPanes[state.activeTab];
    if (!pane) return null;

    const candidates = Array.from(pane.querySelectorAll('button:not([disabled]), [tabindex="0"], input, select, .app-card, .glass-widget, .ss-thumb-card, .ss-wtype-btn, .ss-pos-btn, .color-swatch-btn, .subtab-btn, .bento-size-card, .widget-card-manage, .btn-fullscreen-toggle'))
        .filter(el => el !== currentEl && el.offsetParent !== null);

    if (candidates.length === 0) return null;

    const cRect = currentEl.getBoundingClientRect();
    const cMidX = cRect.left + cRect.width / 2;
    const cMidY = cRect.top + cRect.height / 2;

    let bestCandidate = null;
    let minScore = Infinity;

    for (const cand of candidates) {
        const tRect = cand.getBoundingClientRect();
        const tMidX = tRect.left + tRect.width / 2;
        const tMidY = tRect.top + tRect.height / 2;

        const dx = tMidX - cMidX;
        const dy = tMidY - cMidY;

        let primaryDist = 0;
        let secondaryDist = 0;

        if (direction === 'right') {
            if (dx <= 8) continue;
            primaryDist = dx;
            secondaryDist = Math.abs(dy);
        } else if (direction === 'left') {
            if (dx >= -8) continue;
            primaryDist = -dx;
            secondaryDist = Math.abs(dy);
        } else if (direction === 'down') {
            if (dy <= 8) continue;
            primaryDist = dy;
            secondaryDist = Math.abs(dx);
        } else if (direction === 'up') {
            if (dy >= -8) continue;
            primaryDist = -dy;
            secondaryDist = Math.abs(dx);
        }

        const score = primaryDist + secondaryDist * 2.2;
        if (score < minScore) {
            minScore = score;
            bestCandidate = cand;
        }
    }

    return bestCandidate;
}

// Master Keyboard & Remote D-pad Listener
window.addEventListener('keydown', (e) => {
    const key = e.key;
    const keyCode = e.keyCode;

    // 1. Screensaver dismiss on ANY key
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        e.preventDefault();
        hideScreensaver();
        switchTab('widgets');
        return;
    }

    // 2. Fullscreen hotkeys (Blue TV remote button 406 / F11 / 'f')
    if (keyCode === 406 || keyCode === 10188 || key === 'ColorF3Blue' || key === 'Blue' || keyCode === 122 || key === 'F11' || (key === 'f' && e.target.tagName !== 'INPUT')) {
        e.preventDefault();
        toggleFullscreen();
        return;
    }

    // 3. Back key
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

    // 4. Directional D-pad & Enter Keys
    const isUp = key === 'ArrowUp' || keyCode === 38 || keyCode === 29460;
    const isDown = key === 'ArrowDown' || keyCode === 40 || keyCode === 29461;
    const isLeft = key === 'ArrowLeft' || keyCode === 37 || keyCode === 4;
    const isRight = key === 'ArrowRight' || keyCode === 39 || keyCode === 5;
    const isEnter = key === 'Enter' || keyCode === 13 || keyCode === 29443;

    if (!isUp && !isDown && !isLeft && !isRight && !isEnter) {
        return;
    }

    // 5. Ensure valid active element
    let active = document.activeElement;
    if (!active || active === document.body || active === document.documentElement) {
        ensureInitialFocus();
        active = document.activeElement;
        if (!active || active === document.body) return;
    }

    // Enter Key
    if (isEnter) {
        if (active.tagName !== 'INPUT' && active.tagName !== 'SELECT') {
            e.preventDefault();
            active.click();
        }
        return;
    }

    const inSidebar = tvSidebar && tvSidebar.contains(active);

    // -----------------------------------------------------------------------
    // A. NAVIGATION INSIDE SIDEBAR
    // -----------------------------------------------------------------------
    if (inSidebar) {
        const sidebarItems = Array.from(tvSidebar.querySelectorAll('.menu-tab, #btnSidebarFullscreen, #startScreensaverBtn, #restartPortalBtn'))
            .filter(el => el.offsetParent !== null);
        const idx = sidebarItems.indexOf(active);

        if (isDown) {
            e.preventDefault();
            if (idx >= 0 && idx < sidebarItems.length - 1) {
                setFocusWithClass(sidebarItems[idx + 1]);
            }
            return;
        }
        if (isUp) {
            e.preventDefault();
            if (idx > 0) {
                setFocusWithClass(sidebarItems[idx - 1]);
            }
            return;
        }
        if (isRight) {
            e.preventDefault();
            expandSidebar(false);
            focusCurrentTabContent();
            return;
        }
        if (isLeft) {
            e.preventDefault();
            expandSidebar(true);
            return;
        }
    }

    // -----------------------------------------------------------------------
    // B. NAVIGATION INSIDE WIDGETS TAB (2x2 GRID + FULLSCREEN HEADER)
    // -----------------------------------------------------------------------
    if (state.activeTab === 'widgets') {
        const headerBtn = document.getElementById('btnToggleFullscreen');
        const wClockDigital = document.getElementById('wClockDigital');
        const wClockAnalog = document.getElementById('wClockAnalog');
        const wCalGrid = document.getElementById('wCalGrid');
        const wCalEvents = document.getElementById('wCalEvents');

        // From Header Fullscreen Button
        if (active === headerBtn) {
            if (isDown) {
                e.preventDefault();
                setFocusWithClass(wClockDigital || wClockAnalog);
                return;
            }
            if (isLeft) {
                e.preventDefault();
                focusSidebarActiveTab();
                return;
            }
        }

        // From wClockDigital (Top-Left)
        if (active === wClockDigital) {
            if (isRight) {
                e.preventDefault();
                if (wClockAnalog && wClockAnalog.offsetParent !== null) setFocusWithClass(wClockAnalog);
                return;
            }
            if (isDown) {
                e.preventDefault();
                if (wCalGrid && wCalGrid.offsetParent !== null) setFocusWithClass(wCalGrid);
                else if (wCalEvents) setFocusWithClass(wCalEvents);
                return;
            }
            if (isLeft) {
                e.preventDefault();
                focusSidebarActiveTab();
                return;
            }
            if (isUp) {
                e.preventDefault();
                if (headerBtn && headerBtn.offsetParent !== null) setFocusWithClass(headerBtn);
                return;
            }
        }

        // From wClockAnalog (Top-Right)
        if (active === wClockAnalog) {
            if (isLeft) {
                e.preventDefault();
                if (wClockDigital && wClockDigital.offsetParent !== null) setFocusWithClass(wClockDigital);
                return;
            }
            if (isDown) {
                e.preventDefault();
                if (wCalEvents && wCalEvents.offsetParent !== null) setFocusWithClass(wCalEvents);
                else if (wCalGrid) setFocusWithClass(wCalGrid);
                return;
            }
            if (isUp) {
                e.preventDefault();
                if (headerBtn && headerBtn.offsetParent !== null) setFocusWithClass(headerBtn);
                return;
            }
        }

        // From wCalGrid (Bottom-Left)
        if (active === wCalGrid) {
            if (isUp) {
                e.preventDefault();
                if (wClockDigital && wClockDigital.offsetParent !== null) setFocusWithClass(wClockDigital);
                return;
            }
            if (isRight) {
                e.preventDefault();
                if (wCalEvents && wCalEvents.offsetParent !== null) setFocusWithClass(wCalEvents);
                return;
            }
            if (isLeft) {
                e.preventDefault();
                focusSidebarActiveTab();
                return;
            }
        }

        // From wCalEvents (Bottom-Right)
        if (active === wCalEvents) {
            if (isUp) {
                e.preventDefault();
                if (wClockAnalog && wClockAnalog.offsetParent !== null) setFocusWithClass(wClockAnalog);
                else if (wClockDigital) setFocusWithClass(wClockDigital);
                return;
            }
            if (isLeft) {
                e.preventDefault();
                if (wCalGrid && wCalGrid.offsetParent !== null) setFocusWithClass(wCalGrid);
                return;
            }
        }
    }

    // -----------------------------------------------------------------------
    // C. NAVIGATION INSIDE APPS TAB (CARD GRID)
    // -----------------------------------------------------------------------
    if (state.activeTab === 'apps') {
        const headerBtn = document.getElementById('btnToggleFullscreen');
        const cards = Array.from(appsGrid?.querySelectorAll('.app-card') || []);

        if (active === headerBtn) {
            if (isDown && cards.length > 0) {
                e.preventDefault();
                setFocusWithClass(cards[0]);
                return;
            }
            if (isLeft) {
                e.preventDefault();
                focusSidebarActiveTab();
                return;
            }
        }

        const idx = cards.indexOf(active);
        if (idx !== -1) {
            let cols = 1;
            const firstTop = cards[0].offsetTop;
            for (let i = 1; i < cards.length; i++) {
                if (cards[i].offsetTop === firstTop) cols++;
                else break;
            }
            cols = Math.max(1, cols);

            if (isRight) {
                e.preventDefault();
                if (idx < cards.length - 1) setFocusWithClass(cards[idx + 1]);
                return;
            }
            if (isLeft) {
                e.preventDefault();
                if (idx > 0 && cards[idx].offsetTop === cards[idx - 1].offsetTop) {
                    setFocusWithClass(cards[idx - 1]);
                } else {
                    focusSidebarActiveTab();
                }
                return;
            }
            if (isDown) {
                e.preventDefault();
                if (idx + cols < cards.length) {
                    setFocusWithClass(cards[idx + cols]);
                }
                return;
            }
            if (isUp) {
                e.preventDefault();
                if (idx - cols >= 0) {
                    setFocusWithClass(cards[idx - cols]);
                } else if (headerBtn && headerBtn.offsetParent !== null) {
                    setFocusWithClass(headerBtn);
                }
                return;
            }
        }
    }

    // -----------------------------------------------------------------------
    // D. GENERAL 2D SPATIAL FALLBACK (SETTINGS, INFO, SUBTABS)
    // -----------------------------------------------------------------------
    const dirStr = isRight ? 'right' : isLeft ? 'left' : isDown ? 'down' : 'up';
    const candidate = findSpatialCandidate(active, dirStr);

    if (candidate) {
        e.preventDefault();
        setFocusWithClass(candidate);
        return;
    } else if (isLeft) {
        e.preventDefault();
        focusSidebarActiveTab();
        return;
    }
});

// Sync .focused CSS class on all focusin / focusout events
document.addEventListener('focusin', (e) => {
    document.querySelectorAll('.focused').forEach(node => node.classList.remove('focused'));
    if (e.target && e.target.classList) {
        e.target.classList.add('focused');
    }
});

document.addEventListener('focusout', (e) => {
    if (e.target && e.target.classList) {
        e.target.classList.remove('focused');
    }
});

// Tizen hardware key listener
document.addEventListener('tizenhwkey', (e) => {
    if (e.keyName === 'back') {
        handleTvBackButton(e);
    }
});

// History trap to prevent TV browser from exiting
function pushTrapHistory() {
    try {
        window.history.pushState({ trap: true }, '', window.location.pathname + window.location.search);
    } catch (err) {}
}
pushTrapHistory();

window.addEventListener('popstate', (e) => {
    pushTrapHistory();
    handleTvBackButton(e);
});

// ---------------------------------------------------------------------------
// 10. COMPACT PHONE-LIKE APPS RENDERING ENGINE (6-7 ICONS PER ROW)
// ---------------------------------------------------------------------------
const appsGrid = document.getElementById('appsGrid');
const appsCountBadge = document.getElementById('appsCountBadge');
const installedAppsManageList = document.getElementById('installedAppsManageList') || document.getElementById('installedAppsList');

function renderApps() {
    if (appsCountBadge) {
        appsCountBadge.textContent = state.apps.length;
    }

    if (appsGrid) {
        appsGrid.innerHTML = '';
        state.apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', app.name);

            const badgeHtml = app.badge ? `<span class="app-card-badge">${app.badge}</span>` : '';
            const iconHtml = app.image 
                ? `<img src="${app.image}" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                   <span class="material-icons" style="display:none;">${app.icon || 'tv'}</span>`
                : `<span class="material-icons">${app.icon || 'tv'}</span>`;

            card.innerHTML = `
                <div class="app-card-icon-wrap">
                    ${iconHtml}
                    ${badgeHtml}
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
            delBtn.addEventListener('click', () => {
                state.apps.splice(index, 1);
                localStorage.setItem('hp_apps', JSON.stringify(state.apps));
                renderApps();
            });
            installedAppsManageList.appendChild(item);
        });
    }
}
renderApps();

// Add Custom App Form
const inputAppName = document.getElementById('inputAppName');
const inputAppUrl = document.getElementById('inputAppUrl');
const selectAppIcon = document.getElementById('selectAppIcon');
const btnSaveApp = document.getElementById('btnSaveApp');

if (btnSaveApp) {
    btnSaveApp.addEventListener('click', () => {
        const name = inputAppName?.value.trim();
        const url = inputAppUrl?.value.trim();
        const icon = selectAppIcon?.value || 'tv';

        if (!name || !url) {
            alert('Пожалуйста, введите название и URL приложения.');
            return;
        }

        const newApp = {
            id: `app_custom_${Date.now()}`,
            name: name,
            url: url,
            sub: "Пользовательское приложение",
            icon: icon,
            badge: "CUSTOM",
            image: ""
        };

        state.apps.push(newApp);
        localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        renderApps();

        if (inputAppName) inputAppName.value = '';
        if (inputAppUrl) inputAppUrl.value = '';
        alert(`Приложение "${name}" успешно добавлено!`);
    });
}

// Preset App Adders
const presetBtns = document.querySelectorAll('.preset-btn');
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const url = btn.getAttribute('data-url');
        const icon = btn.getAttribute('data-icon');
        const badge = btn.getAttribute('data-badge');
        const img = btn.getAttribute('data-img');

        if (state.apps.some(a => a.url === url || a.name === name)) {
            alert(`Приложение "${name}" уже добавлено в список.`);
            return;
        }

        state.apps.push({
            id: id || `app_${Date.now()}`,
            name: name,
            url: url,
            sub: "Быстрый запуск",
            icon: icon || "tv",
            badge: badge || "TV",
            image: img || ""
        });

        localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        renderApps();
        alert(`Приложение "${name}" добавлено!`);
    });
});

// Reset Apps to Defaults
const btnResetDefaultApps = document.getElementById('btnResetDefaultApps');
if (btnResetDefaultApps) {
    btnResetDefaultApps.addEventListener('click', () => {
        if (confirm('Сбросить список программ к стандартному набору?')) {
            state.apps = JSON.parse(JSON.stringify(DEFAULT_APPS_LIST));
            localStorage.setItem('hp_apps', JSON.stringify(state.apps));
            renderApps();
        }
    });
}

// Quick Restart / Exit Action
const restartPortalBtn = document.getElementById('restartPortalBtn');
if (restartPortalBtn) {
    const doExit = () => {
        window.location.href = "http://msx.benzac.de/exit.html";
    };
    restartPortalBtn.addEventListener('click', doExit);
    restartPortalBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            doExit();
        }
    });
}

// ---------------------------------------------------------------------------
// 11. ENHANCED 4K SCREENSAVER ENGINE (WALLPAPERS, WIDGET TYPES & POSITIONS)
// ---------------------------------------------------------------------------
const screensaverLayer = document.getElementById('screensaverLayer');
const ssBgImage = document.getElementById('ssBgImage');
const ssWidgetsContainer = document.getElementById('ssWidgetsContainer');
const ssClockBlock = document.getElementById('ssClockBlock') || document.getElementById('ssWidgetBlock');
const ssCalendarBlock = document.getElementById('ssCalendarBlock');
let idleTimer = null;

function applyScreensaverWidgetsAndPosition() {
    if (!ssWidgetsContainer) return;

    ssWidgetsContainer.className = `ss-widgets-container pos-${state.ssPosition || 'center'}`;

    const type = state.ssWidgetType || 'both';
    if (ssClockBlock) {
        ssClockBlock.style.display = (type === 'both' || type === 'clock') ? 'inline-flex' : 'none';
    }
    if (ssCalendarBlock) {
        ssCalendarBlock.style.display = (type === 'both' || type === 'calendar') ? 'inline-flex' : 'none';
    }
}
const applyScreensaverLayout = applyScreensaverWidgetsAndPosition;

function updateScreensaverWallpaper() {
    const bgLayer = document.getElementById('ssBgImage');
    if (!bgLayer) return;

    if (ssSlideshowInterval) {
        clearInterval(ssSlideshowInterval);
        ssSlideshowInterval = null;
    }

    if (state.screensaverBg === 'ss_all' || state.screensaverBg === 'slideshow') {
        ssSlideshowIndex = 0;
        bgLayer.style.backgroundImage = `url('${SS_SLIDESHOW_LIST[0]}')`;

        ssSlideshowInterval = setInterval(() => {
            ssSlideshowIndex = (ssSlideshowIndex + 1) % SS_SLIDESHOW_LIST.length;
            bgLayer.style.backgroundImage = `url('${SS_SLIDESHOW_LIST[ssSlideshowIndex]}')`;
        }, 8000);
    } else {
        const singleUrl = SCREENSAVER_IMAGES[state.screensaverBg] || SCREENSAVER_IMAGES.ss_space;
        bgLayer.style.backgroundImage = `url('${singleUrl}')`;
    }
}

function applyScreensaverWidgetOpacity() {
    if (!ssClockBlock) return;
    ssClockBlock.classList.remove('opacity-none', 'opacity-ultra', 'opacity-semi', 'opacity-solid');
    ssClockBlock.classList.add(`opacity-${state.ssWidgetOpacity || 'ultra'}`);
    localStorage.setItem('hp_ss_wopacity', state.ssWidgetOpacity);
}

function applyScreensaverMedia() {
    const bgPhoto = document.getElementById('ssBgImage');
    const bgVideo = document.getElementById('ssBgVideo');
    const bgYtWrap = document.getElementById('ssBgYoutubeWrap');
    const bgYtIframe = document.getElementById('ssBgYoutubeIframe');

    if (!screensaverLayer) return;

    if (bgPhoto) bgPhoto.style.display = 'none';
    if (bgVideo) {
        bgVideo.style.display = 'none';
        bgVideo.pause();
    }
    if (bgYtWrap) {
        bgYtWrap.style.display = 'none';
        if (bgYtIframe) bgYtIframe.src = '';
    }

    if (state.ssMediaType === 'video') {
        if (bgVideo) {
            bgVideo.style.display = 'block';
            if (bgVideo.src !== state.ssVideoUrl) {
                bgVideo.src = state.ssVideoUrl;
            }
            bgVideo.play().catch(() => {});
        }
    } else if (state.ssMediaType === 'youtube') {
        if (bgYtWrap && bgYtIframe) {
            bgYtWrap.style.display = 'block';
            const ytEmbedUrl = `https://www.youtube-nocookie.com/embed/${state.ssYoutubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${state.ssYoutubeId}&modestbranding=1&rel=0`;
            if (bgYtIframe.src !== ytEmbedUrl) {
                bgYtIframe.src = ytEmbedUrl;
            }
        }
    } else {
        if (bgPhoto) {
            bgPhoto.style.display = 'block';
            updateScreensaverWallpaper();
            bgPhoto.classList.toggle('animated', state.ssPhotoAnim);
        }
    }
}

let ssOpenedTimestamp = 0;

function showScreensaver() {
    if (!screensaverLayer) return;
    ssOpenedTimestamp = Date.now();
    applyScreensaverMedia();
    applyScreensaverWidgetsAndPosition();
    applyScreensaverWidgetOpacity();
    screensaverLayer.classList.add('active');
}

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

function hideScreensaver() {
    if (!screensaverLayer) return;
    screensaverLayer.classList.remove('active');

    const bgVideo = document.getElementById('ssBgVideo');
    if (bgVideo) bgVideo.pause();

    const bgYtIframe = document.getElementById('ssBgYoutubeIframe');
    if (bgYtIframe) bgYtIframe.src = '';

    if (ssSlideshowInterval) {
        clearInterval(ssSlideshowInterval);
        ssSlideshowInterval = null;
    }
}

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (state.idleTimeoutSec > 0) {
        idleTimer = setTimeout(() => {
            showScreensaver();
        }, state.idleTimeoutSec * 1000);
    }
}

window.addEventListener('keydown', (e) => {
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        hideScreensaver();
        switchTab('widgets');
        e.preventDefault();
        return;
    }
    resetIdleTimer();
});

window.addEventListener('mousemove', () => {
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        hideScreensaver();
        switchTab('widgets');
        return;
    }
    resetIdleTimer();
});

resetIdleTimer();

// Manual screensaver triggers
const startScreensaverBtn = document.getElementById('startScreensaverBtn');
if (startScreensaverBtn) startScreensaverBtn.addEventListener('click', showScreensaver);

const btnTestScreensaver = document.getElementById('btnTestScreensaver');
if (btnTestScreensaver) btnTestScreensaver.addEventListener('click', showScreensaver);

// Screensaver Wallpaper Picker
const ssThumbCards = document.querySelectorAll('.ss-thumb-card');
ssThumbCards.forEach(card => {
    card.addEventListener('click', () => {
        ssThumbCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.screensaverBg = card.getAttribute('data-bg') || 'ss_all';
        localStorage.setItem('hp_ss_bg', state.screensaverBg);
        updateScreensaverWallpaper();
    });
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            card.click();
        }
    });
});
ssThumbCards.forEach(c => c.classList.toggle('active', c.getAttribute('data-bg') === state.screensaverBg));

// Screensaver Widget Type Selector
const ssWTypeBtns = document.querySelectorAll('.ss-wtype-btn');
ssWTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssWTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssWidgetType = btn.getAttribute('data-type') || 'both';
        localStorage.setItem('hp_ss_wtype', state.ssWidgetType);
        applyScreensaverWidgetsAndPosition();
    });
});
ssWTypeBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-type') === state.ssWidgetType));

// Screensaver Widget Position Selector
const ssPosBtns = document.querySelectorAll('.ss-pos-btn');
ssPosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssPosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssPosition = btn.getAttribute('data-pos') || 'center';
        localStorage.setItem('hp_ss_pos', state.ssPosition);
        applyScreensaverWidgetsAndPosition();
    });
});
ssPosBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-pos') === state.ssPosition));

// Screensaver Stars Canvas Animation
const starsCanvas = document.getElementById('ssStarsCanvas');
if (starsCanvas) {
    const ctx = starsCanvas.getContext('2d');
    let stars = [];
    const numStars = 90;

    function resizeCanvas() {
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }

    function animateStars() {
        if (screensaverLayer && screensaverLayer.classList.contains('active')) {
            ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
            stars.forEach(star => {
                star.alpha += star.speed;
                if (star.alpha > 1 || star.alpha < 0) {
                    star.speed = -star.speed;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha) * 0.7})`;
                ctx.fill();
            });
        }
        requestAnimationFrame(animateStars);
    }
    animateStars();
}

// Media type buttons
const ssMediaBtns = document.querySelectorAll('.ss-media-btn');
const ssPhotoSettingsCard = document.getElementById('ssPhotoSettingsCard');
const ssVideoSettingsCard = document.getElementById('ssVideoSettingsCard');

function updateMediaSettingsVisibility() {
    if (ssPhotoSettingsCard) {
        ssPhotoSettingsCard.style.display = (state.ssMediaType === 'photo') ? 'block' : 'none';
    }
    if (ssVideoSettingsCard) {
        ssVideoSettingsCard.style.display = (state.ssMediaType === 'video' || state.ssMediaType === 'youtube') ? 'block' : 'none';
    }
}
updateMediaSettingsVisibility();

ssMediaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssMediaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssMediaType = btn.getAttribute('data-media') || 'photo';
        localStorage.setItem('hp_ss_mtype', state.ssMediaType);
        updateMediaSettingsVisibility();
    });
});
ssMediaBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-media') === state.ssMediaType));

// Photo Animation Mode
const ssAnimBtns = document.querySelectorAll('.ss-anim-btn');
ssAnimBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssAnimBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssPhotoAnim = btn.getAttribute('data-anim') === 'kenburns';
        localStorage.setItem('hp_ss_photo_anim', state.ssPhotoAnim);
    });
});
ssAnimBtns.forEach(b => b.classList.toggle('active', (b.getAttribute('data-anim') === 'kenburns') === state.ssPhotoAnim));

// Video Presets
const ssVpresetBtns = document.querySelectorAll('.ss-vpreset-btn');
ssVpresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssVpresetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-type');
        const val = btn.getAttribute('data-val');

        if (type === 'youtube') {
            state.ssMediaType = 'youtube';
            state.ssYoutubeId = val;
            localStorage.setItem('hp_ss_ytid', val);
        } else {
            state.ssMediaType = 'video';
            state.ssVideoUrl = val;
            localStorage.setItem('hp_ss_vurl', val);
        }
        localStorage.setItem('hp_ss_mtype', state.ssMediaType);
        ssMediaBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-media') === state.ssMediaType));
        updateMediaSettingsVisibility();
    });
});

// Custom video/youtube URL input
const inputCustomVideoUrl = document.getElementById('inputCustomVideoUrl');
const btnApplyCustomVideo = document.getElementById('btnApplyCustomVideo');

function extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

if (btnApplyCustomVideo && inputCustomVideoUrl) {
    btnApplyCustomVideo.addEventListener('click', () => {
        const val = inputCustomVideoUrl.value.trim();
        if (!val) {
            alert('Пожалуйста, введите URL видео или ссылку на YouTube.');
            return;
        }

        if (/\.(mp4|m3u8|webm)(\?.*)?$/i.test(val)) {
            state.ssMediaType = 'video';
            state.ssVideoUrl = val;
            localStorage.setItem('hp_ss_mtype', 'video');
            localStorage.setItem('hp_ss_vurl', val);
        } else {
            const ytId = extractYouTubeId(val);
            if (!ytId) {
                alert('Не удалось распознать ссылку на YouTube.');
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

// Screensaver Widget Transparency Selector
const ssOpacityBtns = document.querySelectorAll('.ss-opacity-btn');
ssOpacityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ssOpacityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ssWidgetOpacity = btn.getAttribute('data-opacity') || 'ultra';
        applyScreensaverWidgetOpacity();
    });
});
ssOpacityBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-opacity') === state.ssWidgetOpacity));

// ---------------------------------------------------------------------------
// 12. FULLSCREEN MODE ENGINE (SMART TV TOGGLE & RESIZE SYNCHRONIZER)
// ---------------------------------------------------------------------------
function isFullscreenActive() {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
}

function enterFullscreen() {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function toggleFullscreen() {
    if (isFullscreenActive()) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function updateFullscreenUI() {
    const isFS = isFullscreenActive();
    document.body.classList.toggle('is-fullscreen-mode', isFS);

    document.querySelectorAll('.btn-fullscreen-toggle').forEach(btn => {
        btn.classList.toggle('active', isFS);
        const icon = btn.querySelector('.material-icons');
        if (icon) icon.textContent = isFS ? 'fullscreen_exit' : 'fullscreen';
        
        const label = btn.querySelector('.fs-label, .fs-text, #textSettingsFullscreen, span:not(.material-icons)');
        if (label) {
            if (btn.classList.contains('quick-fullscreen-btn')) {
                label.textContent = isFS ? 'Свернуть' : 'Во весь экран';
            } else if (btn.id === 'btnSettingsFullscreen') {
                label.textContent = isFS ? 'Выйти из полноэкранного' : 'На весь экран';
            } else {
                label.textContent = isFS ? 'Свернуть' : 'На весь экран';
            }
        }
        btn.setAttribute('title', isFS ? 'Выйти из полноэкранного режима' : 'На весь экран (Синяя кнопка пульта)');
    });
}

// Bind Fullscreen buttons
document.querySelectorAll('.btn-fullscreen-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFullscreen();
    });
});

['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
    document.addEventListener(evt, updateFullscreenUI);
});

// Periodic initial focus triggers on portal boot
window.addEventListener('DOMContentLoaded', () => {
    ensureInitialFocus();
    setTimeout(ensureInitialFocus, 100);
    setTimeout(ensureInitialFocus, 400);
    setTimeout(ensureInitialFocus, 1000);
});

window.addEventListener('load', () => {
    ensureInitialFocus();
});
