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

function applyThemeSettings() {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', state.themeColor);
    root.style.setProperty('--accent-rgb', state.themeRgb);

    document.body.classList.remove('trans-frosted', 'trans-transparent', 'trans-dark');
    document.body.classList.add(`trans-${state.transparency}`);

    document.body.classList.toggle('anim-fast', state.animations === 'fast');

    try {
        localStorage.setItem('hp_theme_color', state.themeColor);
        localStorage.setItem('hp_theme_rgb', state.themeRgb);
        localStorage.setItem('hp_transparency', state.transparency);
        localStorage.setItem('hp_animations', state.animations);
    } catch (e) {}
}
try { applyThemeSettings(); } catch (e) { console.error(e); }

function applySidebarPosition() {
    var shell = document.getElementById('tvShell');
    if (!shell) return;
    shell.classList.toggle('sidebar-right', state.sidebarPos === 'right');
    try { localStorage.setItem('hp_sidebar_pos', state.sidebarPos); } catch (e) {}
}

const bgWallpaper = document.getElementById('bgWallpaper');
const tvSidebar = document.getElementById('tvSidebar');
const tvShell = document.getElementById('tvShell');
applySidebarPosition();
const tvStage = document.getElementById('tvStage');
const menuTabs = document.querySelectorAll('.menu-tab');
const tabPanes = {
    widgets: document.getElementById('tabWidgets'),
    apps: document.getElementById('tabApps'),
    settings: document.getElementById('tabSettings'),
    info: document.getElementById('tabInfo')
};

// Permanent Sidebar: NEVER collapses!
function expandSidebar(expand) {
    if (!tvSidebar) return;
    tvSidebar.classList.remove('collapsed');
    if (tvShell) tvShell.classList.remove('sidebar-collapsed');
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
            focusCurrentTabContent();
        }
    });
});

const urlParams = new URLSearchParams(window.location.search);
const initialTab = urlParams.get('tab') || sessionStorage.getItem('hp_active_tab') || 'widgets';
switchTab(initialTab);

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
                cell.classList.add('weekend');
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
try { renderCalendars(); } catch (e) { console.error(e); }

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
try { applyWidgetSizesAndToggles(); } catch (e) { console.error(e); }

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

function handleTvBackButton(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        hideScreensaver();
        switchTab('widgets');
        return true;
    }

    if (state.activeTab !== 'widgets') {
        switchTab('widgets');
        focusCurrentTabContent();
        return true;
    }

    return true;
}

function setFocusWithClass(el) {
    if (!el) return;
    document.querySelectorAll('.focused').forEach(node => node.classList.remove('focused'));
    el.focus();
    el.classList.add('focused');
    if (el.scrollIntoView) {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
}

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

function focusSidebarActiveTab() {
    const activeTabBtn = document.querySelector(`.menu-tab[data-tab="${state.activeTab}"]`) || document.querySelector('.menu-tab');
    if (activeTabBtn) {
        setFocusWithClass(activeTabBtn);
    }
}

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

window.addEventListener('keydown', (e) => {
    const key = e.key;
    const keyCode = e.keyCode;

    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        e.preventDefault();
        hideScreensaver();
        switchTab('widgets');
        return;
    }

    if (keyCode === 406 || keyCode === 10188 || key === 'ColorF3Blue' || key === 'Blue' || keyCode === 122 || key === 'F11' || (key === 'f' && e.target.tagName !== 'INPUT')) {
        e.preventDefault();
        toggleFullscreen();
        return;
    }

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

    const isUp = key === 'ArrowUp' || keyCode === 38 || keyCode === 29460;
    const isDown = key === 'ArrowDown' || keyCode === 40 || keyCode === 29461;
    const isLeft = key === 'ArrowLeft' || keyCode === 37 || keyCode === 4;
    const isRight = key === 'ArrowRight' || keyCode === 39 || keyCode === 5;
    const isEnter = key === 'Enter' || keyCode === 13 || keyCode === 29443;

    if (!isUp && !isDown && !isLeft && !isRight && !isEnter) {
        return;
    }

    let active = document.activeElement;
    if (!active || active === document.body || active === document.documentElement) {
        ensureInitialFocus();
        active = document.activeElement;
        if (!active || active === document.body) return;
    }

    if (isEnter) {
        if (active.tagName !== 'INPUT' && active.tagName !== 'SELECT') {
            e.preventDefault();
            active.click();
        }
        return;
    }

    const inSidebar = tvSidebar && tvSidebar.contains(active);

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
            focusCurrentTabContent();
            return;
        }
    }

    if (state.activeTab === 'widgets') {
        const headerBtn = document.getElementById('btnToggleFullscreen');
        const wClockDigital = document.getElementById('wClockDigital');
        const wClockAnalog = document.getElementById('wClockAnalog');
        const wCalGrid = document.getElementById('wCalGrid');
        const wCalEvents = document.getElementById('wCalEvents');

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

document.addEventListener('tizenhwkey', (e) => {
    if (e.keyName === 'back') {
        handleTvBackButton(e);
    }
});

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

// Fullscreen API Engine
function isFullscreenActive() {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
}

let hasAttemptedAutoFullscreen = false;
function triggerAutoFullscreenOnce() {
    if (hasAttemptedAutoFullscreen) return;
    hasAttemptedAutoFullscreen = true;
    if (!isFullscreenActive()) {
        try {
            enterFullscreen();
        } catch (e) {}
    }
}

['keydown', 'click', 'touchstart'].forEach(function(evt) {
    window.addEventListener(evt, triggerAutoFullscreenOnce, { once: true, passive: true });
});

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

document.querySelectorAll('.btn-fullscreen-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFullscreen();
    });
});

['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
    document.addEventListener(evt, updateFullscreenUI);
});

window.addEventListener('DOMContentLoaded', () => {
    ensureInitialFocus();
    setTimeout(ensureInitialFocus, 100);
    setTimeout(ensureInitialFocus, 400);
    setTimeout(ensureInitialFocus, 1000);
});

window.addEventListener('load', () => {
    ensureInitialFocus();
    try { enterFullscreen(); } catch (e) {}
});
