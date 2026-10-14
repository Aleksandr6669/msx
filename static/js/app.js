// ==========================================================================
// HOME PORTAL TV — CLIENT ENGINE FOR SMART TV & MEDIA STATION X
// Universal Remote D-Pad Navigation (Samsung Tizen, Android TV, webOS)
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

let state = {
    activeTab: "widgets",
    themeColor: localStorage.getItem('hp_theme_color') || "#00d2ff",
    themeRgb: localStorage.getItem('hp_theme_rgb') || "0, 210, 255",
    transparency: localStorage.getItem('hp_transparency') || "frosted",
    animations: localStorage.getItem('hp_animations') || "snappy",
    idleTimeoutSec: parseInt(localStorage.getItem('hp_idle_sec') || "120", 10),
    screensaverBg: localStorage.getItem('hp_ss_bg') || "ss_all",
    apps: JSON.parse(localStorage.getItem('hp_apps') || JSON.stringify(DEFAULT_APPS_LIST))
};

function normalizeUrl(url) {
    if (!url) return '';
    url = url.trim();
    if (/filmix/i.test(url)) return 'http://filmix.tv';
    if (/lampa\.mx/i.test(url)) return 'http://lampa.mx';
    if (/msx\.benzac\.de\/plugins\/youtube/i.test(url)) return 'http://msx.benzac.de/plugins/youtube.html';
    if (/msx\.benzac\.de\/plugins\/twitch/i.test(url)) return 'http://msx.benzac.de/plugins/twitch.html';
    if (/deeplex\.cc/i.test(url)) return 'http://deeplex.cc';
    if (/obovse\.ru/i.test(url)) return 'http://operats.obovse.ru/2.5/';
    if (!/^https?:\\/\\//i.test(url)) return 'http://' + url;
    return url;
}

if (Array.isArray(state.apps)) {
    let changed = false;
    state.apps.forEach(app => {
        if (!app || !app.url) return;
        const norm = normalizeUrl(app.url);
        if (norm !== app.url) {
            app.url = norm;
            changed = true;
        }
    });
    if (changed) {
        try { localStorage.setItem('hp_apps', JSON.stringify(state.apps)); } catch (e) {}
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
    try {
        localStorage.setItem('hp_theme_color', state.themeColor);
        localStorage.setItem('hp_theme_rgb', state.themeRgb);
    } catch (e) {}
}
try { applyThemeSettings(); } catch (e) { console.error(e); }

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

// ---------------------------------------------------------------------------
// REAL-TIME CLOCKS ENGINE
// ---------------------------------------------------------------------------
function updateClocks() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

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
        const secDeg = s * 6;
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
    if (loaderText) loaderText.textContent = `Запуск: ${app.name || 'Веб-сайт'}...`;
    if (loader) loader.classList.add('active');

    setTimeout(() => {
        window.location.href = targetUrl;
    }, 120);
}

// ---------------------------------------------------------------------------
// UNIVERSAL SMART TV REMOTE CONTROL ENGINE (D-PAD & BACK KEY)
// Compatible with Android TV, Samsung Tizen, LG webOS, Media Station X
// ---------------------------------------------------------------------------
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

    const candidates = Array.from(pane.querySelectorAll('button:not([disabled]), [tabindex="0"], input, select, .app-card, .glass-widget, .ss-thumb-card, .ss-wtype-btn, .ss-pos-btn, .color-swatch-btn, .subtab-btn'))
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

    // 1. Screensaver dismiss
    if (screensaverLayer && screensaverLayer.classList.contains('active')) {
        e.preventDefault();
        hideScreensaver();
        switchTab('widgets');
        return;
    }

    // 2. Universal Remote Back Key
    const isBackKey = (
        keyCode === 10009 || // Samsung Tizen Return
        keyCode === 461 ||   // LG webOS Back
        keyCode === 4 ||     // Android D-pad Back
        keyCode === 27 ||    // PC Escape
        keyCode === 8 ||     // Backspace
        key === 'Escape' ||
        key === 'Back' ||
        key === 'GoBack'
    ) && (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA');

    if (isBackKey) {
        handleTvBackButton(e);
        return;
    }

    // 3. Directional Keys (Standard & Samsung & Android D-Pad)
    const isUp = key === 'ArrowUp' || keyCode === 38 || keyCode === 29460 || keyCode === 19;
    const isDown = key === 'ArrowDown' || keyCode === 40 || keyCode === 29461 || keyCode === 20;
    const isLeft = key === 'ArrowLeft' || keyCode === 37 || keyCode === 4 || keyCode === 21;
    const isRight = key === 'ArrowRight' || keyCode === 39 || keyCode === 5 || keyCode === 22;
    const isEnter = key === 'Enter' || keyCode === 13 || keyCode === 29443 || keyCode === 23 || keyCode === 66;

    if (!isUp && !isDown && !isLeft && !isRight && !isEnter) {
        return;
    }

    let active = document.activeElement;
    if (!active || active === document.body || active === document.documentElement) {
        ensureInitialFocus();
        active = document.activeElement;
        if (!active || active === document.body) return;
    }

    // Enter / OK Action
    if (isEnter) {
        if (active.tagName !== 'INPUT' && active.tagName !== 'SELECT') {
            e.preventDefault();
            active.click();
        }
        return;
    }

    const inSidebar = tvSidebar && tvSidebar.contains(active);

    // -----------------------------------------------------------------------
    // A. SIDEBAR D-PAD NAVIGATION
    // -----------------------------------------------------------------------
    if (inSidebar) {
        const sidebarItems = Array.from(tvSidebar.querySelectorAll('.menu-tab, #startScreensaverBtn, #restartPortalBtn'))
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

    // -----------------------------------------------------------------------
    // B. BALANCED 2x2 WIDGETS GRID NAVIGATION
    // -----------------------------------------------------------------------
    if (state.activeTab === 'widgets') {
        const wClockDigital = document.getElementById('wClockDigital');
        const wClockAnalog = document.getElementById('wClockAnalog');
        const wCalGrid = document.getElementById('wCalGrid');
        const wCalEvents = document.getElementById('wCalEvents');

        // From wClockDigital (Top-Left)
        if (active === wClockDigital) {
            if (isRight) {
                e.preventDefault();
                if (wClockAnalog) setFocusWithClass(wClockAnalog);
                return;
            }
            if (isDown) {
                e.preventDefault();
                if (wCalGrid) setFocusWithClass(wCalGrid);
                return;
            }
            if (isLeft) {
                e.preventDefault();
                focusSidebarActiveTab();
                return;
            }
        }

        // From wClockAnalog (Top-Right)
        if (active === wClockAnalog) {
            if (isLeft) {
                e.preventDefault();
                if (wClockDigital) setFocusWithClass(wClockDigital);
                return;
            }
            if (isDown) {
                e.preventDefault();
                if (wCalEvents) setFocusWithClass(wCalEvents);
                return;
            }
        }

        // From wCalGrid (Bottom-Left)
        if (active === wCalGrid) {
            if (isUp) {
                e.preventDefault();
                if (wClockDigital) setFocusWithClass(wClockDigital);
                return;
            }
            if (isRight) {
                e.preventDefault();
                if (wCalEvents) setFocusWithClass(wCalEvents);
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
                if (wClockAnalog) setFocusWithClass(wClockAnalog);
                return;
            }
            if (isLeft) {
                e.preventDefault();
                if (wCalGrid) setFocusWithClass(wCalGrid);
                return;
            }
        }
    }

    // -----------------------------------------------------------------------
    // C. APPS TAB NAVIGATION
    // -----------------------------------------------------------------------
    if (state.activeTab === 'apps') {
        const appsGridEl = document.getElementById('appsGrid');
        const cards = Array.from((appsGridEl ? appsGridEl.querySelectorAll('.app-card') : []));
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
                }
                return;
            }
        }
    }

    // -----------------------------------------------------------------------
    // D. GENERAL 2D SPATIAL FALLBACK (SETTINGS, SUBTABS, INFO)
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

// Render Apps Grid
const appsGrid = document.getElementById('appsGrid');
const appsCountBadge = document.getElementById('appsCountBadge');
const installedAppsManageList = document.getElementById('installedAppsManageList') || document.getElementById('installedAppsList');

function renderApps() {
    if (appsCountBadge) appsCountBadge.textContent = state.apps.length;

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
                try { localStorage.setItem('hp_apps', JSON.stringify(state.apps)); } catch (e) {}
                renderApps();
            });
            installedAppsManageList.appendChild(item);
        });
    }
}
try { renderApps(); } catch (e) { console.error(e); }

// Settings Subtabs
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
    });
});

// Quick Restart Button
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

// Screensaver engine
const screensaverLayer = document.getElementById('screensaverLayer');
const ssBgImage = document.getElementById('ssBgImage');
const ssClockBlock = document.getElementById('ssClockBlock');

function showScreensaver() {
    if (!screensaverLayer) return;
    if (ssBgImage) {
        ssBgImage.style.backgroundImage = `url('${SCREENSAVER_IMAGES.ss_mountains}')`;
    }
    screensaverLayer.classList.add('active');
}

function hideScreensaver() {
    if (!screensaverLayer) return;
    screensaverLayer.classList.remove('active');
}

const startScreensaverBtn = document.getElementById('startScreensaverBtn');
if (startScreensaverBtn) startScreensaverBtn.addEventListener('click', showScreensaver);

if (screensaverLayer) {
    screensaverLayer.addEventListener('click', () => {
        hideScreensaver();
        switchTab('widgets');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    ensureInitialFocus();
    setTimeout(ensureInitialFocus, 100);
    setTimeout(ensureInitialFocus, 400);
});

window.addEventListener('load', () => {
    ensureInitialFocus();
});
