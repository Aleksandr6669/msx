// ==========================================================================
// MX STATION PLAYER — CLIENT ENGINE FOR SMART TV & MEDIA STATION X
// ==========================================================================

const SECTION_WALLPAPERS = {
    widgets: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85",
    apps: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=85",
    settings: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85",
    info: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=85"
};

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
    widgetsPos: localStorage.getItem('mx_pos') || "center",
    blur: localStorage.getItem('mx_blur') || "medium",
    idleTimeoutSec: parseInt(localStorage.getItem('mx_idle_sec') || "120", 10),
    screensaverBg: localStorage.getItem('mx_ss_bg') || "ss_all",
    widgets: JSON.parse(localStorage.getItem('mx_widgets') || JSON.stringify({
        clock_digital: true,
        clock_modern: false,
        clock_analog: true,
        calendar_grid: true,
        calendar_compact: false,
        calendar_events: true
    })),
    apps: JSON.parse(localStorage.getItem('mx_apps') || JSON.stringify(DEFAULT_APPS_LIST))
};

// ---------------------------------------------------------------------------
// 1. WALLPAPERS & TAB SWITCHING
// ---------------------------------------------------------------------------
const bgWallpaper = document.getElementById('bgWallpaper');
const menuTabs = document.querySelectorAll('.menu-tab');
const tabPanes = {
    widgets: document.getElementById('tabWidgets'),
    apps: document.getElementById('tabApps'),
    settings: document.getElementById('tabSettings'),
    info: document.getElementById('tabInfo')
};

function switchTab(tabId) {
    state.activeTab = tabId;

    // 1. Update menu buttons
    menuTabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });

    // 2. Switch tab panes
    Object.keys(tabPanes).forEach(k => {
        if (tabPanes[k]) {
            tabPanes[k].classList.toggle('active', k === tabId);
        }
    });

    // 3. Smooth background transition for this section
    const bgUrl = SECTION_WALLPAPERS[tabId] || SECTION_WALLPAPERS.widgets;
    if (bgWallpaper) {
        bgWallpaper.style.backgroundImage = `url('${bgUrl}')`;
    }
}

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        if (target) switchTab(target);
    });
});

// Check URL query parameters (e.g. ?tab=apps)
const urlParams = new URLSearchParams(window.location.search);
const initialTab = urlParams.get('tab') || 'widgets';
switchTab(initialTab);

// ---------------------------------------------------------------------------
// 2. REAL-TIME CLOCKS ENGINE
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
    if (elH && elM && elS) {
        elH.textContent = hStr;
        elM.textContent = mStr;
        elS.textContent = sStr;
    }

    // 2. Modern Clock
    const elModTime = document.getElementById('modTimeVal');
    const elModWeek = document.getElementById('modWeekdayVal');
    const elModMonth = document.getElementById('modMonthVal');
    if (elModTime) {
        elModTime.textContent = `${hStr}:${mStr}`;
    }

    // 3. Analog Clock (moving hands)
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
    const ssCityTime = document.getElementById('ssCityTime');
    if (ssTimeText) ssTimeText.textContent = `${hStr}:${mStr}`;
    if (ssDateText) ssDateText.textContent = fullDateStr;
    if (ssCityTime) ssCityTime.textContent = `Точное время: ${hStr}:${mStr}:${sStr}`;
}

function clockLoop() {
    updateClocks();
    requestAnimationFrame(clockLoop);
}
requestAnimationFrame(clockLoop);

// ---------------------------------------------------------------------------
// 3. DYNAMIC CALENDAR ENGINE
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
    const startOffset = (firstDay + 6) % 7; // Monday = 0
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
// 4. WIDGETS DISPLAY & POSITIONING
// ---------------------------------------------------------------------------
const widgetsWrapper = document.getElementById('widgetsWrapper');
const wClockDigital = document.getElementById('wClockDigital');
const wClockAnalog = document.getElementById('wClockAnalog');
const wClockModern = document.getElementById('wClockModern');
const wCalGrid = document.getElementById('wCalGrid');
const wCalCompact = document.getElementById('wCalCompact');
const wCalEvents = document.getElementById('wCalEvents');

function applyWidgetsLayout() {
    // 1. Toggles
    if (wClockDigital) wClockDigital.style.display = state.widgets.clock_digital ? 'block' : 'none';
    if (wClockAnalog) wClockAnalog.style.display = state.widgets.clock_analog ? 'flex' : 'none';
    if (wClockModern) wClockModern.style.display = state.widgets.clock_modern ? 'block' : 'none';

    if (wCalGrid) wCalGrid.style.display = state.widgets.calendar_grid ? 'block' : 'none';
    if (wCalCompact) wCalCompact.style.display = state.widgets.calendar_compact ? 'block' : 'none';
    if (wCalEvents) wCalEvents.style.display = state.widgets.calendar_events ? 'block' : 'none';

    // 2. Position
    if (widgetsWrapper) {
        widgetsWrapper.className = `widgets-wrapper pos-${state.widgetsPos}`;
    }

    // 3. Blur
    const root = document.documentElement;
    if (state.blur === 'light') root.style.setProperty('--glass-blur', '14px');
    else if (state.blur === 'heavy') root.style.setProperty('--glass-blur', '38px');
    else root.style.setProperty('--glass-blur', '25px');

    localStorage.setItem('mx_widgets', JSON.stringify(state.widgets));
    localStorage.setItem('mx_pos', state.widgetsPos);
    localStorage.setItem('mx_blur', state.blur);
}
applyWidgetsLayout();

// Subtabs inside Settings
const subtabBtns = document.querySelectorAll('.subtab-btn');
const subpanes = {
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

// Quick Buttons in Widgets Tab
const gotoWidgetSettingsBtn = document.getElementById('gotoWidgetSettingsBtn');
if (gotoWidgetSettingsBtn) {
    gotoWidgetSettingsBtn.addEventListener('click', () => {
        switchTab('settings');
        // Activate sub-widgets tab
        subtabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-subtab') === 'sub-widgets'));
        Object.keys(subpanes).forEach(k => {
            if (subpanes[k]) subpanes[k].classList.toggle('active', k === 'sub-widgets');
        });
    });
}

// Widget Toggles in Settings
const togglePills = document.querySelectorAll('.toggle-pill');
function updateTogglePillsUI() {
    togglePills.forEach(pill => {
        const key = pill.getAttribute('data-key');
        const isChecked = state.widgets[key];
        pill.classList.toggle('checked', !!isChecked);
        const checkEl = pill.querySelector('.toggle-check');
        if (checkEl) checkEl.textContent = isChecked ? '✓' : '—';
    });
}
updateTogglePillsUI();

togglePills.forEach(pill => {
    pill.addEventListener('click', () => {
        const key = pill.getAttribute('data-key');
        state.widgets[key] = !state.widgets[key];
        updateTogglePillsUI();
        applyWidgetsLayout();
    });
});

// Position buttons
const posBtns = document.querySelectorAll('.pos-option-btn');
posBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        posBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.widgetsPos = btn.getAttribute('data-pos');
        applyWidgetsLayout();
    });
});
posBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-pos') === state.widgetsPos));

// Blur buttons
const blurBtns = document.querySelectorAll('.blur-option-btn');
blurBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        blurBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.blur = btn.getAttribute('data-blur');
        applyWidgetsLayout();
    });
});
blurBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-blur') === state.blur));

// ---------------------------------------------------------------------------
// 5. IN-APP FULLSCREEN APP VIEWER & SEAMLESS RETURN ENGINE
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

    // Push state into browser history so that TV back button triggers popstate
    try {
        window.history.pushState({ appViewerOpen: true, appName: app.name }, '', '#app-' + (app.id || 'view'));
    } catch (err) {
        console.warn('History pushState error:', err);
    }

    // Focus the exit button so TV remote can immediately trigger Return / OK
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

    // Pop the history entry if needed
    if (triggerHistoryBack && window.location.hash.startsWith('#app-')) {
        try {
            window.history.back();
        } catch (err) {
            console.warn('History back error:', err);
        }
    }

    // Restore focus back to the originating element
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
}

if (btnExitAppViewer) {
    btnExitAppViewer.addEventListener('click', (e) => {
        e.preventDefault();
        closeAppViewer(true);
    });
}

// ---------------------------------------------------------------------------
// 6. UNIVERSAL SMART TV REMOTE "BACK / RETURN" BUTTON ENGINE
// Handles: Samsung Tizen (10009 / tizenhwkey), LG webOS (461), Android TV (4),
// Escape (27), Backspace (8), and browser popstate.
// ---------------------------------------------------------------------------
function handleTvBackButton(e) {
    // 1. If App Viewer is open -> close it and return to the portal
    if (appViewerModal && appViewerModal.classList.contains('active')) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        closeAppViewer(true);
        return true;
    }

    // 2. If Screensaver is active -> hide it and return
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        hideScreensaver();
        return true;
    }

    // 3. If in another tab (Apps, Settings, Info) -> return to Widgets tab
    if (state.activeTab !== 'widgets') {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        switchTab('widgets');
        const widgetsTabBtn = document.querySelector('.menu-tab[data-tab="widgets"]');
        if (widgetsTabBtn) widgetsTabBtn.focus();
        return true;
    }

    // 4. If already on Widgets tab and user presses Back -> exit cleanly to MSX root
    // Only if explicitly triggered
    return false;
}

window.addEventListener('keydown', (e) => {
    const key = e.key;
    const keyCode = e.keyCode;

    // Samsung Tizen (10009), LG webOS (461), Android TV (4), Escape (27), Backspace (8)
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
        const handled = handleTvBackButton(e);
        if (handled && e) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
});

// Tizen hardware key listener (Samsung Smart TVs)
document.addEventListener('tizenhwkey', (e) => {
    if (e.keyName === 'back') {
        handleTvBackButton(e);
    }
});

// Browser PopState Listener (triggers when TV browser navigates back)
window.addEventListener('popstate', () => {
    if (appViewerModal && appViewerModal.classList.contains('active')) {
        closeAppViewer(false);
    }
});

// ---------------------------------------------------------------------------
// 7. APPS MANAGEMENT ENGINE
// ---------------------------------------------------------------------------
const appsGrid = document.getElementById('appsGrid');
const appsCountBadge = document.getElementById('appsCountBadge');
const installedAppsManageList = document.getElementById('installedAppsManageList');

function renderApps() {
    if (appsCountBadge) appsCountBadge.textContent = state.apps.length;

    // Render Main Grid (Tab 2)
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

            // Open in In-App Viewer with top return button & Back key capture
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

    // Render Management List in Settings
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
                localStorage.setItem('mx_apps', JSON.stringify(state.apps));
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

        localStorage.setItem('mx_apps', JSON.stringify(state.apps));
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
            localStorage.setItem('mx_apps', JSON.stringify(state.apps));
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
        localStorage.setItem('mx_apps', JSON.stringify(state.apps));
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
// 8. 4K SCREENSAVER ENGINE (IDLE TIMER & MANUAL START)
// ---------------------------------------------------------------------------
const screensaverLayer = document.getElementById('screensaverLayer');
let idleTimer = null;

function showScreensaver() {
    if (screensaverLayer) {
        screensaverLayer.classList.add('active');
    }
}

function hideScreensaver() {
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        screensaverLayer.classList.remove('active');
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

// Reset idle timer on any user activity (mouse / remote)
window.addEventListener('keydown', (e) => {
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        hideScreensaver();
        e.preventDefault();
        return;
    }
    resetIdleTimer();
});

window.addEventListener('mousemove', () => {
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        hideScreensaver();
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
        localStorage.setItem('mx_ss_bg', state.screensaverBg);
    });
});

// Timeout selector buttons
const timeoutBtns = document.querySelectorAll('.timeout-btn');
timeoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        timeoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.idleTimeoutSec = parseInt(btn.getAttribute('data-time'), 10);
        localStorage.setItem('mx_idle_sec', String(state.idleTimeoutSec));
        resetIdleTimer();
    });
});
timeoutBtns.forEach(b => b.classList.toggle('active', parseInt(b.getAttribute('data-time'), 10) === state.idleTimeoutSec));

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
    for (let i = 0; i < 90; i++) {
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
            ctx.shadowColor = '#00d2ff';
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
