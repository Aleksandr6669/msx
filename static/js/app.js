// State & Preferences
let appState = {
    clock: localStorage.getItem('mx_clock') || 'digital',
    calendar: localStorage.getItem('mx_calendar') || 'grid',
    position: localStorage.getItem('mx_pos') || 'center',
    bgType: localStorage.getItem('mx_bg_type') || 'image',
    bgVal: localStorage.getItem('mx_bg_val') || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85',
    blur: localStorage.getItem('mx_blur') || 'medium'
};

// ---------------------------------------------------------------------------
// CLOCKS & TIME ENGINE
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
    const digH = document.getElementById('digHours');
    const digM = document.getElementById('digMinutes');
    const digS = document.getElementById('digSeconds');
    if (digH && digM && digS) {
        digH.textContent = hStr;
        digM.textContent = mStr;
        digS.textContent = sStr;
    }

    // 2. Modern Clock
    const modTime = document.getElementById('modTime');
    if (modTime) {
        modTime.textContent = `${hStr}:${mStr}`;
    }

    // 3. Analog Clock (Smooth continuous second hand)
    const hourHand = document.getElementById('analogHour');
    const minHand = document.getElementById('analogMin');
    const secHand = document.getElementById('analogSec');

    if (hourHand && minHand && secHand) {
        const secDeg = (s + ms / 1000) * 6; // 360 / 60 = 6 deg per sec
        const minDeg = (m + s / 60) * 6;
        const hourDeg = ((h % 12) + m / 60) * 30;

        secHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        minHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }

    // Date Strings
    const optionsDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('ru-RU', optionsDate);
    const dateFooter = document.getElementById('digDateFooter');
    if (dateFooter) {
        dateFooter.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }

    // Compact date
    const compactDay = document.getElementById('compactDayNum');
    const compactMY = document.getElementById('compactMonthYear');
    const compactW = document.getElementById('compactWeekday');
    if (compactDay && compactMY && compactW) {
        compactDay.textContent = String(now.getDate());
        compactMY.textContent = now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
        compactW.textContent = now.toLocaleDateString('ru-RU', { weekday: 'long' });
    }
}

// RequestAnimationFrame for ultra-smooth analog clock
function runClockLoop() {
    updateClocks();
    requestAnimationFrame(runClockLoop);
}
requestAnimationFrame(runClockLoop);

// ---------------------------------------------------------------------------
// CALENDAR ENGINE (DYNAMIC MONTH GENERATOR)
// ---------------------------------------------------------------------------
function renderMonthCalendar() {
    const calGrid = document.getElementById('calGridCells');
    const calTitle = document.getElementById('calMonthTitle');
    if (!calGrid || !calTitle) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const todayDate = now.getDate();

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    calTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // First day of month (0 is Sunday, 1 is Monday... convert to Monday=0)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7; // Monday = 0

    // Number of days in current month
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    calGrid.innerHTML = '';

    // Empty offset cells
    for (let i = 0; i < startOffset; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'cal-cell empty';
        calGrid.appendChild(emptyCell);
    }

    // Day cells
    for (let d = 1; d <= totalDays; d++) {
        const cell = document.createElement('div');
        cell.className = 'cal-cell';
        cell.textContent = d;

        const dayOfWeek = (startOffset + d - 1) % 7;
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            cell.classList.add('weekend');
        }

        if (d === todayDate) {
            cell.classList.add('today');
        }

        calGrid.appendChild(cell);
    }
}
renderMonthCalendar();

// ---------------------------------------------------------------------------
// VIEW SWITCHING (Tabs: Dashboard / Catalog / Settings)
// ---------------------------------------------------------------------------
const navButtons = document.querySelectorAll('.nav-btn[data-view]');
const viewSections = {
    dashboard: document.getElementById('viewDashboard'),
    catalog: document.getElementById('viewCatalog'),
    settings: document.getElementById('viewSettings')
};

function switchView(viewName) {
    navButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-view') === viewName);
    });

    Object.keys(viewSections).forEach(k => {
        if (viewSections[k]) {
            viewSections[k].classList.toggle('active', k === viewName);
        }
    });
}

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-view');
        if (target) switchView(target);
    });
});

const openSettingsBtn = document.getElementById('openSettingsBtn');
if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => switchView('settings'));
}

const saveAndBackBtn = document.getElementById('saveAndBackBtn');
if (saveAndBackBtn) {
    saveAndBackBtn.addEventListener('click', () => switchView('dashboard'));
}

const toggleScreensaverBtn = document.getElementById('toggleScreensaverBtn');
if (toggleScreensaverBtn) {
    toggleScreensaverBtn.addEventListener('click', () => {
        window.open('/screensaver', '_blank');
    });
}

// ---------------------------------------------------------------------------
// WIDGET CUSTOMIZATION (Clocks, Calendars, Positioning, Backgrounds)
// ---------------------------------------------------------------------------
const widgetsContainer = document.getElementById('widgetsContainer');
const widgetDigital = document.getElementById('widgetClockDigital');
const widgetAnalog = document.getElementById('widgetClockAnalog');
const widgetModern = document.getElementById('widgetClockModern');
const widgetCalGrid = document.getElementById('widgetCalendarGrid');
const widgetCalCompact = document.getElementById('widgetCalendarCompact');
const widgetCalEvents = document.getElementById('widgetCalendarEvents');
const bgLayer = document.getElementById('bgLayer');

function applyWidgetSettings() {
    // 1. Clocks Visibility
    if (widgetDigital) widgetDigital.style.display = 'none';
    if (widgetAnalog) widgetAnalog.style.display = 'none';
    if (widgetModern) widgetModern.style.display = 'none';

    if (appState.clock === 'digital') {
        if (widgetDigital) widgetDigital.style.display = 'block';
    } else if (appState.clock === 'analog') {
        if (widgetAnalog) widgetAnalog.style.display = 'flex';
    } else if (appState.clock === 'modern') {
        if (widgetModern) widgetModern.style.display = 'block';
    } else if (appState.clock === 'both') {
        if (widgetDigital) widgetDigital.style.display = 'block';
        if (widgetAnalog) widgetAnalog.style.display = 'flex';
    }

    // 2. Calendar Visibility
    if (widgetCalGrid) widgetCalGrid.style.display = 'none';
    if (widgetCalCompact) widgetCalCompact.style.display = 'none';
    if (widgetCalEvents) widgetCalEvents.style.display = 'none';

    if (appState.calendar === 'grid') {
        if (widgetCalGrid) widgetCalGrid.style.display = 'block';
    } else if (appState.calendar === 'compact') {
        if (widgetCalCompact) widgetCalCompact.style.display = 'block';
    } else if (appState.calendar === 'events') {
        if (widgetCalEvents) widgetCalEvents.style.display = 'block';
    } else if (appState.calendar === 'both') {
        if (widgetCalGrid) widgetCalGrid.style.display = 'block';
        if (widgetCalEvents) widgetCalEvents.style.display = 'block';
    }

    // 3. Position
    if (widgetsContainer) {
        widgetsContainer.className = `widgets-container pos-${appState.position}`;
    }

    // 4. Background
    if (bgLayer) {
        if (appState.bgType === 'image') {
            bgLayer.style.backgroundImage = `url('${appState.bgVal}')`;
            bgLayer.style.background = '';
            bgLayer.style.backgroundImage = `url('${appState.bgVal}')`;
        } else {
            bgLayer.style.backgroundImage = 'none';
            bgLayer.style.background = appState.bgVal;
        }
    }

    // 5. Blur Strength
    const root = document.documentElement;
    if (appState.blur === 'light') {
        root.style.setProperty('--glass-blur', '14px');
    } else if (appState.blur === 'heavy') {
        root.style.setProperty('--glass-blur', '38px');
    } else {
        root.style.setProperty('--glass-blur', '24px');
    }

    // Persist to localStorage
    localStorage.setItem('mx_clock', appState.clock);
    localStorage.setItem('mx_calendar', appState.calendar);
    localStorage.setItem('mx_pos', appState.position);
    localStorage.setItem('mx_bg_type', appState.bgType);
    localStorage.setItem('mx_bg_val', appState.bgVal);
    localStorage.setItem('mx_blur', appState.blur);

    // Sync with Flask backend
    fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            clock_widget: appState.clock,
            calendar_widget: appState.calendar,
            widgets_position: appState.position,
            background_type: appState.bgType,
            background_url: appState.bgType === 'image' ? appState.bgVal : ''
        })
    }).catch(e => console.log('Settings synced locally'));
}

// Clock Option Buttons
const clockButtons = document.querySelectorAll('#clockOptionGroup .opt-btn');
clockButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        clockButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.clock = btn.getAttribute('data-clock');
        applyWidgetSettings();
    });
});

// Calendar Option Buttons
const calButtons = document.querySelectorAll('#calendarOptionGroup .opt-btn');
calButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        calButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.calendar = btn.getAttribute('data-calendar');
        applyWidgetSettings();
    });
});

// Position Option Buttons
const posButtons = document.querySelectorAll('.pos-btn');
posButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        posButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.position = btn.getAttribute('data-pos');
        applyWidgetSettings();
    });
});

// Blur Option Buttons
const blurButtons = document.querySelectorAll('.blur-btn');
blurButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        blurButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.blur = btn.getAttribute('data-blur');
        applyWidgetSettings();
    });
});

// Background Thumbnails
const bgCards = document.querySelectorAll('.bg-thumb-card');
bgCards.forEach(card => {
    card.addEventListener('click', () => {
        bgCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        const type = card.getAttribute('data-bg-type');
        appState.bgType = type;
        if (type === 'image') {
            appState.bgVal = card.getAttribute('data-bg-url');
        } else {
            appState.bgVal = card.getAttribute('data-bg-css');
        }
        applyWidgetSettings();
    });
});

// Copy Start URL Pill
const msxUrlCard = document.getElementById('msxUrlCard');
if (msxUrlCard) {
    msxUrlCard.addEventListener('click', () => {
        const code = msxUrlCard.querySelector('code');
        if (code) {
            navigator.clipboard.writeText(code.textContent.trim()).then(() => {
                const prev = code.textContent;
                code.textContent = 'Скопировано в буфер!';
                setTimeout(() => code.textContent = prev, 1800);
            });
        }
    });
}

// Initial Setup
applyWidgetSettings();

// Sync active buttons with stored state
clockButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-clock') === appState.clock));
calButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-calendar') === appState.calendar));
posButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-pos') === appState.position));
blurButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-blur') === appState.blur));

// ---------------------------------------------------------------------------
// SMART TV REMOTE CONTROL KEYS (D-Pad Keyboard Navigation)
// ---------------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Backspace') {
        switchView('dashboard');
    }
});
