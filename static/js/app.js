// ==========================================================================
// HOME PORTAL TV — CLIENT ENGINE FOR SMART TV & MEDIA STATION X
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
    ss_fireplace: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=90"
};
const SS_SLIDESHOW_LIST = Object.values(SCREENSAVER_IMAGES);
let ssSlideshowInterval = null;
let ssSlideshowIndex = 0;

const DEFAULT_APPS_LIST = [
    {
        id: "app_lampa",
        name: "Lampa",
        url: "http://lampa.mx",
        sub: "Онлайн-кинотеатр и сериалы",
        icon: "movie",
        badge: "CINEMA",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_youtube",
        name: "YouTube MSX",
        url: "http://msx.benzac.de/plugins/youtube.html",
        sub: "Видео, клипы и стримы",
        icon: "play_circle",
        badge: "VIDEO",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_forkplayer",
        name: "ForkPlayer",
        url: "http://operats.obovse.ru/2.5/",
        sub: "Портал онлайн-ТВ и плейлистов",
        icon: "language",
        badge: "PORTAL",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_iptv",
        name: "IPTV Плеер HD",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        sub: "Телеканалы прямой эфир",
        icon: "live_tv",
        badge: "LIVE",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: "app_music",
        name: "Lo-Fi Chill Radio",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        sub: "Круглосуточный релакс-поток",
        icon: "music_note",
        badge: "CHILL",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
    }
];

// App State
let state = {
    activeTab: "widgets",
    themeColor: localStorage.getItem('hp_theme_color') || "#00d2ff",
    themeRgb: localStorage.getItem('hp_theme_rgb') || "0, 210, 255",
    transparency: localStorage.getItem('hp_transparency') || "frosted",
    animations: localStorage.getItem('hp_animations') || "smooth",
    idleTimeoutSec: parseInt(localStorage.getItem('hp_idle_sec') || "120", 10),
    screensaverBg: localStorage.getItem('hp_ss_bg') || "ss_all",
    widgets: JSON.parse(localStorage.getItem('hp_widgets') || JSON.stringify({
        clock_digital: true,
        clock_modern: false,
        clock_analog: true,
        calendar_grid: true,
        calendar_compact: false,
        calendar_events: true
    })),
    widgetSizes: JSON.parse(localStorage.getItem('hp_widget_sizes') || JSON.stringify({
        clock_digital: 2,
        clock_analog: 1,
        clock_modern: 1,
        calendar_grid: 2,
        calendar_compact: 1,
        calendar_events: 2
    })),
    apps: JSON.parse(localStorage.getItem('hp_apps') || JSON.stringify(DEFAULT_APPS_LIST))
};

// ---------------------------------------------------------------------------
// 1. THEME, ACCENT COLOR & TRANSPARENCY CONTROLLER
// ---------------------------------------------------------------------------
function applyThemeSettings() {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', state.themeColor);
    root.style.setProperty('--accent-rgb', state.themeRgb);

    // Apply transparency class to body
    document.body.classList.remove('trans-frosted', 'trans-transparent', 'trans-dark');
    document.body.classList.add(`trans-${state.transparency}`);

    // Apply animation mode to body
    document.body.classList.toggle('anim-fast', state.animations === 'fast');

    localStorage.setItem('hp_theme_color', state.themeColor);
    localStorage.setItem('hp_theme_rgb', state.themeRgb);
    localStorage.setItem('hp_transparency', state.transparency);
    localStorage.setItem('hp_animations', state.animations);
}
applyThemeSettings();

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
const initialTab = urlParams.get('tab') || 'widgets';
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

    // Digital Clock
    const elH = document.getElementById('digH');
    const elM = document.getElementById('digM');
    const elS = document.getElementById('digS');
    if (elH && elM && elS) {
        elH.textContent = hStr;
        elM.textContent = mStr;
        elS.textContent = sStr;
    }

    // Modern Clock
    const elModTime = document.getElementById('modTimeVal');
    const elModWeek = document.getElementById('modWeekdayVal');
    const elModMonth = document.getElementById('modMonthVal');
    if (elModTime) {
        elModTime.textContent = `${hStr}:${mStr}`;
    }

    // Analog Clock
    const hHand = document.getElementById('handHour');
    const mHand = document.getElementById('handMin');
    const sHand = document.getElementById('handSec');
    if (hHand && mHand && sHand) {
        const secDeg = (s + ms / 1000) * 6;
        const minDeg = (m + s / 60) * 6;
        const hourDeg = ((h % 12) + m / 60) * 30;

        sHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        mHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        hHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }

    // Dates
    const ruMonths = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", 
                     "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    const ruWeekdays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
    const fullDateStr = `${ruWeekdays[(now.getDay() + 6) % 7]}, ${now.getDate()} ${ruMonths[now.getMonth()]} ${now.getFullYear()}`;

    const digFullDate = document.getElementById('digFullDate');
    if (digFullDate) digFullDate.textContent = fullDateStr;

    if (elModWeek) elModWeek.textContent = ruWeekdays[(now.getDay() + 6) % 7].toUpperCase();
    if (elModMonth) elModMonth.textContent = `${ruMonths[now.getMonth()].toUpperCase()} ${now.getFullYear()}`;

    // Compact Card
    const compDayNum = document.getElementById('compDayNum');
    const compMonth = document.getElementById('compMonth');
    const compWeek = document.getElementById('compWeek');
    if (compDayNum) compDayNum.textContent = String(now.getDate());
    if (compMonth) compMonth.textContent = `${ruMonths[now.getMonth()]} ${now.getFullYear()}`;
    if (compWeek) compWeek.textContent = ruWeekdays[(now.getDay() + 6) % 7];

    // Screensaver Clocks
    const ssTimeText = document.getElementById('ssTimeText');
    const ssDateText = document.getElementById('ssDateText');
    if (ssTimeText) ssTimeText.textContent = `${hStr}:${mStr}`;
    if (ssDateText) ssDateText.textContent = fullDateStr;
}

function clockLoop() {
    updateClocks();
    requestAnimationFrame(clockLoop);
}
requestAnimationFrame(clockLoop);

// ---------------------------------------------------------------------------
// 4. DYNAMIC CALENDAR ENGINE
// ---------------------------------------------------------------------------
function renderCalendarGrid() {
    const calCells = document.getElementById('calCellsGrid');
    const calMonthName = document.getElementById('calMonthName');
    if (!calCells || !calMonthName) return;

    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const today = now.getDate();

    const monthNames = [
        "ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ",
        "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"
    ];
    calMonthName.textContent = `${monthNames[curMonth]} ${curYear}`;

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7;
    const totalDays = new Date(curYear, curMonth + 1, 0).getDate();

    calCells.innerHTML = '';

    for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement('div');
        empty.className = 'cell empty';
        calCells.appendChild(empty);
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
        calCells.appendChild(cell);
    }
}
renderCalendarGrid();

// ---------------------------------------------------------------------------
// 5. MODULAR BENTO GRID & WIDGET SIZING ENGINE
// ---------------------------------------------------------------------------
const wClockDigital = document.getElementById('wClockDigital');
const wClockAnalog = document.getElementById('wClockAnalog');
const wClockModern = document.getElementById('wClockModern');
const wCalGrid = document.getElementById('wCalGrid');
const wCalCompact = document.getElementById('wCalCompact');
const wCalEvents = document.getElementById('wCalEvents');

const widgetElements = {
    clock_digital: wClockDigital,
    clock_analog: wClockAnalog,
    clock_modern: wClockModern,
    calendar_grid: wCalGrid,
    calendar_compact: wCalCompact,
    calendar_events: wCalEvents
};

function applyWidgetSizesAndToggles() {
    Object.keys(widgetElements).forEach(key => {
        const el = widgetElements[key];
        if (!el) return;

        // Toggle visibility
        const isVisible = !!state.widgets[key];
        el.style.display = isVisible ? 'flex' : 'none';

        // Apply grid column span (1, 2, or 4 cells)
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
    'sub-appearance': document.getElementById('sub-appearance'),
    'sub-widgets': document.getElementById('sub-widgets'),
    'sub-apps': document.getElementById('sub-apps'),
    'sub-screensaver': document.getElementById('sub-screensaver')
};

subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        subtabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.getAttribute('data-subtab');
        Object.keys(subpanes).forEach(k => {
            if (subpanes[k]) subpanes[k].classList.toggle('active', k === target);
        });
    });
});

// Color Swatches
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

// Transparency Modes
const transBtns = document.querySelectorAll('.trans-option-btn');
transBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        transBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.transparency = btn.getAttribute('data-trans');
        applyThemeSettings();
    });
});
transBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-trans') === state.transparency));

// Animation Modes
const animBtns = document.querySelectorAll('.anim-option-btn');
animBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        animBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.animations = btn.getAttribute('data-anim');
        applyThemeSettings();
    });
});
animBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-anim') === state.animations));

// Widget Size Buttons in Settings
const widgetConfigRows = document.querySelectorAll('.widget-config-row');
widgetConfigRows.forEach(row => {
    const key = row.getAttribute('data-key');
    const togglePill = row.querySelector('.toggle-pill');
    const sizeBtns = row.querySelectorAll('.size-btn');

    // Update toggle state
    if (togglePill) {
        const isChecked = !!state.widgets[key];
        togglePill.classList.toggle('checked', isChecked);
        const checkEl = togglePill.querySelector('.toggle-check');
        if (checkEl) checkEl.textContent = isChecked ? '✓' : '—';

        togglePill.addEventListener('click', () => {
            state.widgets[key] = !state.widgets[key];
            togglePill.classList.toggle('checked', state.widgets[key]);
            if (checkEl) checkEl.textContent = state.widgets[key] ? '✓' : '—';
            applyWidgetSizesAndToggles();
        });
    }

    // Size selector buttons (1, 2, 4 cells)
    const currentSize = state.widgetSizes[key] || 2;
    sizeBtns.forEach(btn => {
        const sizeVal = parseInt(btn.getAttribute('data-size'), 10);
        btn.classList.toggle('active', sizeVal === currentSize);

        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.widgetSizes[key] = sizeVal;
            applyWidgetSizesAndToggles();
        });
    });
});

const gotoWidgetSettingsBtn = document.getElementById('gotoWidgetSettingsBtn');
if (gotoWidgetSettingsBtn) {
    gotoWidgetSettingsBtn.addEventListener('click', () => {
        switchTab('settings');
        subtabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-subtab') === 'sub-widgets'));
        Object.keys(subpanes).forEach(k => {
            if (subpanes[k]) subpanes[k].classList.toggle('active', k === 'sub-widgets');
        });
        expandSidebar(false);
    });
}

// ---------------------------------------------------------------------------
// 7. IN-APP FULLSCREEN APP VIEWER & SEAMLESS RETURN ENGINE
// ---------------------------------------------------------------------------
const appViewerModal = document.getElementById('appViewerModal');
const appViewerFrame = document.getElementById('appViewerFrame');
const appViewerTitle = document.getElementById('appViewerTitle');
const appViewerDirectLink = document.getElementById('appViewerDirectLink');
const btnExitAppViewer = document.getElementById('btnExitAppViewer');
let lastFocusedElement = null;

function openAppViewer(app) {
    if (!app || !app.url) return;
    lastFocusedElement = document.activeElement;

    if (appViewerTitle) {
        appViewerTitle.textContent = app.name || 'Приложение';
    }
    if (appViewerDirectLink) {
        appViewerDirectLink.href = app.url;
        appViewerDirectLink.title = `Открыть ${app.name} напрямую`;
    }
    if (appViewerFrame) {
        appViewerFrame.src = app.url;
    }
    if (appViewerModal) {
        appViewerModal.classList.add('active');
    }

    try {
        window.history.pushState({ appViewerOpen: true, appName: app.name }, '', '#app-' + (app.id || 'view'));
    } catch (err) {}

    setTimeout(() => {
        if (btnExitAppViewer) {
            btnExitAppViewer.focus();
        }
    }, 150);
}

function closeAppViewer(triggerHistoryBack = true) {
    if (!appViewerModal || !appViewerModal.classList.contains('active')) return;

    appViewerModal.classList.remove('active');
    if (appViewerFrame) {
        appViewerFrame.src = 'about:blank';
    }

    if (triggerHistoryBack && window.location.hash.startsWith('#app-')) {
        try {
            window.history.back();
        } catch (err) {}
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
}

if (btnExitAppViewer) {
    btnExitAppViewer.addEventListener('click', (e) => {
        e.preventDefault();
        closeAppViewer(true);
        switchTab('widgets');
    });
}

// ---------------------------------------------------------------------------
// 8. UNIVERSAL SMART TV REMOTE "BACK / RETURN" BUTTON ENGINE
// Guarantees: ALWAYS returns to main screen (Widgets) and NEVER exits app!
// ---------------------------------------------------------------------------
function handleTvBackButton(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 1. If App Viewer (iframe) is active -> close it and return to widgets!
    if (appViewerModal && appViewerModal.classList.contains('active')) {
        closeAppViewer(true);
        switchTab('widgets');
        expandSidebar(false);
        focusCurrentTabContent();
        return true;
    }

    // 2. If Screensaver is active -> hide it and return directly to widgets!
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        hideScreensaver();
        switchTab('widgets');
        expandSidebar(false);
        focusCurrentTabContent();
        return true;
    }

    // 3. If in Apps, Settings, or Info -> return directly to widgets tab!
    if (state.activeTab !== 'widgets') {
        switchTab('widgets');
        expandSidebar(false);
        focusCurrentTabContent();
        return true;
    }

    // 4. If ALREADY on widgets -> STAY on widgets! NEVER exit to TV desktop!
    expandSidebar(false);
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

    // Sidebar D-pad navigation
    const inSidebar = tvSidebar && tvSidebar.contains(document.activeElement);

    if (e.key === 'ArrowRight' && inSidebar) {
        e.preventDefault();
        expandSidebar(false);
        focusCurrentTabContent();
    } else if (e.key === 'ArrowLeft' && !inSidebar && !appViewerModal?.classList.contains('active') && !screensaverLayer?.classList.contains('active')) {
        const activeEl = document.activeElement;
        const isFirstAppCard = activeEl && activeEl.classList.contains('app-card') && activeEl === appsGrid?.firstElementChild;
        const isHeaderBtn = activeEl && (activeEl.id === 'gotoWidgetSettingsBtn' || activeEl.id === 'openAddAppModalBtn' || activeEl.classList.contains('subtab-btn'));
        const isFirstWidget = activeEl && activeEl.classList.contains('glass-widget') && activeEl === widgetsWrapper?.firstElementChild;

        if (isFirstAppCard || isHeaderBtn || isFirstWidget || activeEl === document.body || !activeEl) {
            e.preventDefault();
            expandSidebar(true);
            const activeTabBtn = document.querySelector(`.menu-tab[data-tab="${state.activeTab}"]`);
            if (activeTabBtn) activeTabBtn.focus();
        }
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
// 9. APPS MANAGEMENT ENGINE
// ---------------------------------------------------------------------------
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
                <div class="app-card-img-wrap">
                    <img src="${imgUrl}" alt="${app.name}" class="app-card-img" loading="lazy">
                    <span class="app-card-badge">${app.badge || 'APP'}</span>
                </div>
                <div class="app-card-body">
                    <div class="app-card-name">
                        <span class="material-icons">${app.icon || 'launch'}</span>
                        <span>${app.name}</span>
                    </div>
                    <div class="app-card-sub">${app.sub || app.url}</div>
                </div>
            `;

            card.addEventListener('click', () => {
                openAppViewer(app);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    e.preventDefault();
                    openAppViewer(app);
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

// Add Custom App
const btnSaveApp = document.getElementById('btnSaveApp');
const inputAppName = document.getElementById('inputAppName');
const inputAppUrl = document.getElementById('inputAppUrl');
const selectAppIcon = document.getElementById('selectAppIcon');

if (btnSaveApp && inputAppName && inputAppUrl) {
    btnSaveApp.addEventListener('click', () => {
        const name = inputAppName.value.trim();
        const url = inputAppUrl.value.trim();
        const icon = selectAppIcon ? selectAppIcon.value : 'launch';

        if (!name || !url) {
            alert('Пожалуйста, заполните название и URL приложения.');
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

        localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        inputAppName.value = '';
        inputAppUrl.value = '';
        renderApps();
        alert(`Приложение «${name}» успешно добавлено!`);
    });
}

// Preset Quick Add Buttons
const presetBtns = document.querySelectorAll('.preset-btn');
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const url = btn.getAttribute('data-url');
        const icon = btn.getAttribute('data-icon');

        if (!state.apps.some(a => a.url === url)) {
            state.apps.push({
                id: `app_${name.toLowerCase()}`,
                name: name,
                url: url,
                sub: 'Популярное ТВ-приложение',
                icon: icon,
                badge: 'APP',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500'
            });
            localStorage.setItem('hp_apps', JSON.stringify(state.apps));
            renderApps();
            alert(`Приложение «${name}» добавлено в программы!`);
        } else {
            alert(`Приложение «${name}» уже есть в списке.`);
        }
    });
});

// Reset Apps Button
const btnResetDefaultApps = document.getElementById('btnResetDefaultApps');
if (btnResetDefaultApps) {
    btnResetDefaultApps.addEventListener('click', () => {
        state.apps = JSON.parse(JSON.stringify(DEFAULT_APPS_LIST));
        localStorage.setItem('hp_apps', JSON.stringify(state.apps));
        renderApps();
    });
}

const openAddAppModalBtn = document.getElementById('openAddAppModalBtn');
if (openAddAppModalBtn) {
    openAddAppModalBtn.addEventListener('click', () => {
        switchTab('settings');
        subtabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-subtab') === 'sub-apps'));
        Object.keys(subpanes).forEach(k => {
            if (subpanes[k]) subpanes[k].classList.toggle('active', k === 'sub-apps');
        });
        expandSidebar(false);
    });
}

// Exit to MSX Button
const exitToMsxBtn = document.getElementById('exitToMsxBtn');
if (exitToMsxBtn) {
    exitToMsxBtn.addEventListener('click', () => {
        window.location.href = "http://msx.benzac.de/exit.html";
    });
}

// ---------------------------------------------------------------------------
// 10. 4K SCREENSAVER ENGINE (WALLPAPER PICKER & AUTO-RUN)
// ---------------------------------------------------------------------------
const screensaverLayer = document.getElementById('screensaverLayer');
const ssBgImage = document.getElementById('ssBgImage');
let idleTimer = null;

function updateScreensaverWallpaper() {
    const bgLayer = document.getElementById('ssBgImage');
    if (!bgLayer) return;

    if (ssSlideshowInterval) {
        clearInterval(ssSlideshowInterval);
        ssSlideshowInterval = null;
    }

    const currentBg = state.screensaverBg || 'ss_all';

    if (currentBg === 'ss_all') {
        const nextImg = SS_SLIDESHOW_LIST[ssSlideshowIndex % SS_SLIDESHOW_LIST.length];
        bgLayer.style.backgroundImage = `url('${nextImg}')`;
        ssSlideshowInterval = setInterval(() => {
            ssSlideshowIndex = (ssSlideshowIndex + 1) % SS_SLIDESHOW_LIST.length;
            bgLayer.style.backgroundImage = `url('${SS_SLIDESHOW_LIST[ssSlideshowIndex]}')`;
        }, 8000);
    } else {
        const bgUrl = SCREENSAVER_IMAGES[currentBg] || currentBg;
        bgLayer.style.backgroundImage = `url('${bgUrl}')`;
    }
}

function showScreensaver() {
    if (screensaverLayer) {
        updateScreensaverWallpaper();
        screensaverLayer.classList.add('active');
    }
}

function hideScreensaver() {
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        screensaverLayer.classList.remove('active');
        if (ssSlideshowInterval) {
            clearInterval(ssSlideshowInterval);
            ssSlideshowInterval = null;
        }
        resetIdleTimer();
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

// Reset idle timer on any user activity
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

const launchScreensaverActionBtn = document.getElementById('launchScreensaverActionBtn');
if (launchScreensaverActionBtn) launchScreensaverActionBtn.addEventListener('click', showScreensaver);

const btnTestScreensaver = document.getElementById('btnTestScreensaver');
if (btnTestScreensaver) btnTestScreensaver.addEventListener('click', showScreensaver);

// Screensaver Wallpaper Picker
const ssThumbCards = document.querySelectorAll('.ss-thumb-card');
ssThumbCards.forEach(card => {
    card.addEventListener('click', () => {
        ssThumbCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.screensaverBg = card.getAttribute('data-id');
        const customUrl = card.getAttribute('data-url');
        if (customUrl && state.screensaverBg !== 'ss_all') {
            SCREENSAVER_IMAGES[state.screensaverBg] = customUrl;
        }
        localStorage.setItem('hp_ss_bg', state.screensaverBg);
        updateScreensaverWallpaper();
    });
});

ssThumbCards.forEach(card => {
    if (card.getAttribute('data-id') === state.screensaverBg) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
});

// Timeout selector buttons
const timeoutBtns = document.querySelectorAll('.timeout-btn');
timeoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        timeoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.idleTimeoutSec = parseInt(btn.getAttribute('data-time'), 10);
        localStorage.setItem('hp_idle_sec', String(state.idleTimeoutSec));
        resetIdleTimer();
    });
});
timeoutBtns.forEach(b => b.classList.toggle('active', parseInt(b.getAttribute('data-time'), 10) === state.idleTimeoutSec));

// Canvas Stars Particles
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
