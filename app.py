import os
import json
import datetime
from flask import Flask, jsonify, request

app = Flask(__name__, static_folder='static')

def get_base_url():
    """
    Dynamically resolve the base URL.
    Works seamlessly on local development (http://localhost:5000),
    local Wi-Fi IP (http://192.168.x.x:5000), and Vercel cloud (https://*.vercel.app).
    """
    proto = request.headers.get('X-Forwarded-Proto', request.scheme)
    host = request.headers.get('X-Forwarded-Host', request.host)
    return f"{proto}://{host}"

# ---------------------------------------------------------------------------
# GLOBAL STATE & PRESETS
# ---------------------------------------------------------------------------

# Background wallpapers for distinct menu sections
MENU_BACKGROUNDS = {
    "widgets": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85", # Cosmic Aurora
    "apps": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=85",    # Neon Cyber City
    "settings": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85",# Mountain Horizon
    "info": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=85"     # Night Sky
}

# Screensaver Wallpapers Library
SCREENSAVER_IMAGES = [
    {
        "id": "ss_all",
        "name": "Все фото (Слайд-шоу 4K)",
        "thumb": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
        "url": None
    },
    {
        "id": "ss_space",
        "name": "Космическая Аврора 4K",
        "thumb": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_cyber",
        "name": "Ночной Неоновый Город 4K",
        "thumb": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_mountains",
        "name": "Горные Пики в Облаках 4K",
        "thumb": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_ocean",
        "name": "Океанский Закат & Волны 4K",
        "thumb": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_fire",
        "name": "Теплый Огонь Камина 4K",
        "thumb": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=90"
    }
]

# Configurable settings
current_settings = {
    "widgets_position": "center",       # "center", "left", "right", "top", "bottom"
    "active_screensaver": "ss_all",     # ID of selected screensaver wallpaper or "ss_all"
    "screensaver_duration": 8,
    "widgets_active": {
        "clock_digital": True,
        "clock_modern": False,
        "clock_analog": True,
        "calendar_grid": True,
        "calendar_compact": False,
        "calendar_events": True,
        "weather_status": True
    }
}

# Installed TV Programs / Applications
installed_apps = [
    {
        "id": "app_lampa",
        "name": "Lampa",
        "sub": "Онлайн-кинотеатр, торренты и сериалы",
        "url": "http://lampa.mx",
        "icon": "movie",
        "badge": "CINEMA",
        "color": "msx-glass",
        "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80"
    },
    {
        "id": "app_youtube",
        "name": "YouTube MSX",
        "sub": "Видео, клипы и трансляции без рекламы",
        "url": "http://msx.benzac.de/plugins/youtube.html",
        "icon": "play-circle",
        "badge": "VIDEO",
        "color": "msx-glass",
        "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=80"
    },
    {
        "id": "app_iptv",
        "name": "IPTV Плеер",
        "sub": "Прямой эфир телевизионных каналов",
        "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "icon": "live-tv",
        "badge": "LIVE HD",
        "color": "msx-glass",
        "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80"
    },
    {
        "id": "app_forkplayer",
        "name": "ForkPlayer",
        "sub": "Медиа-портал для Smart TV",
        "url": "http://operats.obovse.ru/2.5/",
        "icon": "language",
        "badge": "PORTAL",
        "color": "msx-glass",
        "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
    },
    {
        "id": "app_music",
        "name": "Lo-Fi Radio 24/7",
        "sub": "Атмосферный музыкальный поток",
        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "icon": "music-note",
        "badge": "CHILL",
        "color": "msx-glass",
        "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
    }
]

# Quick presets for 1-click addition of popular TV apps
PRESET_POPULAR_APPS = [
    {"name": "Deeplex", "url": "http://deeplex.cc", "icon": "theaters", "badge": "4K CINEMA"},
    {"name": "Vplay", "url": "http://vplay.one", "icon": "video-library", "badge": "MOVIES"},
    {"name": "HDRezka", "url": "http://rezka.ag", "icon": "movie-filter", "badge": "SERIALS"},
    {"name": "Kinopub", "url": "http://kino.pub", "icon": "star", "badge": "PRO"},
    {"name": "Twitch MSX", "url": "http://msx.benzac.de/plugins/twitch.html", "icon": "videogame-asset", "badge": "STREAM"}
]

# Enable CORS for Smart TV browsers
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    return response

# ---------------------------------------------------------------------------
# 1. START PARAMETER ENTRYPOINT
# When entering just <domain> in MSX, MSX automatically fetches /msx/start.json.
# This Start Object redirects directly to root menu: menu:{SERVER}/menu.json
# ---------------------------------------------------------------------------

@app.route('/msx/start.json')
@app.route('/start.json')
@app.route('/')
def msx_start():
    base_url = get_base_url()
    return jsonify({
        "name": "MX Station Portal",
        "version": "2.0.0",
        "parameter": f"menu:{base_url}/menu.json",
        "background": MENU_BACKGROUNDS["widgets"],
        "logo": f"{base_url}/static/images/logo.svg"
    })

# ---------------------------------------------------------------------------
# 2. ROOT MENU (EXACT 4 ITEMS: ВИДЖЕТЫ, ПРОГРАММЫ, НАСТРОЙКИ, О ПРИЛОЖЕНИИ)
# Each menu section has its own dedicated 4K background!
# ---------------------------------------------------------------------------

@app.route('/menu.json')
def msx_menu():
    base_url = get_base_url()
    return jsonify({
        "headline": "MX STATION PLAYER",
        "logo": f"{base_url}/static/images/logo.svg",
        "logoSize": "small",
        "background": MENU_BACKGROUNDS["widgets"],
        "color": "msx-glass",
        "menu": [
            {
                "icon": "dashboard",
                "label": "Виджеты",
                "badge": "1",
                "data": f"{base_url}/content/widgets.json"
            },
            {
                "icon": "apps",
                "label": "Программы",
                "badge": f"{len(installed_apps)}",
                "data": f"{base_url}/content/apps.json"
            },
            {
                "icon": "settings",
                "label": "Настройки",
                "badge": "SETUP",
                "data": f"{base_url}/content/settings.json"
            },
            {
                "icon": "info",
                "label": "О приложении",
                "data": f"{base_url}/content/info.json"
            }
        ]
    })

# ---------------------------------------------------------------------------
# 3. SECTION 1: ВИДЖЕТЫ (/content/widgets.json)
# Background: Deep Cosmic Aurora 4K
# ---------------------------------------------------------------------------

@app.route('/content/widgets.json')
def msx_content_widgets():
    base_url = get_base_url()
    now = datetime.datetime.now()
    time_str = now.strftime("%H:%M")
    
    ru_months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", 
                 "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
    ru_weekdays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
    
    date_str = f"{now.day} {ru_months[now.month - 1]} {now.year}"
    weekday_str = ru_weekdays[now.weekday()]
    
    pos = current_settings["widgets_position"]
    w_active = current_settings["widgets_active"]

    # Positioning layouts
    if pos == "left":
        w1_layout = "0,0,4.2,2.8"
        w2_layout = "0,2.9,4.2,2.8"
        act_layout = "4.5,0,7.5,5.8"
    elif pos == "right":
        act_layout = "0,0,7.5,5.8"
        w1_layout = "7.8,0,4.2,2.8"
        w2_layout = "7.8,2.9,4.2,2.8"
    elif pos == "top":
        w1_layout = "0,0,5.8,2.5"
        w2_layout = "6.2,0,5.8,2.5"
        act_layout = "0,2.8,12.0,3.2"
    elif pos == "bottom":
        act_layout = "0,0,12.0,3.2"
        w1_layout = "0,3.5,5.8,2.5"
        w2_layout = "6.2,3.5,5.8,2.5"
    else:  # "center"
        w1_layout = "1.5,0,4.3,2.8"
        w2_layout = "6.2,0,4.3,2.8"
        act_layout = "0,3.1,12.0,3.0"

    items = []

    # CLOCK WIDGETS
    if w_active.get("clock_digital"):
        items.append({
            "id": "w_clock_dig",
            "type": "teaser",
            "layout": w1_layout,
            "headline": f"{weekday_str}, {date_str}",
            "title": f"⏱ {time_str}",
            "titleHeader": "ЦИФРОВЫЕ НЕОН ЧАСЫ",
            "titleFooter": "Точное системное время • 24H",
            "color": "msx-glass",
            "icon": "schedule",
            "action": f"content:{base_url}/content/settings_widgets.json"
        })
    elif w_active.get("clock_analog"):
        items.append({
            "id": "w_clock_ana",
            "type": "teaser",
            "layout": w1_layout,
            "headline": "MX LUXURY CHRONO",
            "title": f"🕒 {time_str}",
            "titleHeader": "АНАЛОГОВЫЕ ЧАСЫ",
            "titleFooter": f"{weekday_str} • {date_str}",
            "color": "msx-glass",
            "icon": "watch-later",
            "action": f"content:{base_url}/content/settings_widgets.json"
        })
    elif w_active.get("clock_modern"):
        items.append({
            "id": "w_clock_mod",
            "type": "teaser",
            "layout": w1_layout,
            "headline": f"{ru_months[now.month-1].upper()} {now.year}",
            "title": f"{time_str}",
            "titleHeader": f"MODERN MINIMAL • {weekday_str.upper()}",
            "titleFooter": "Время и дата",
            "color": "msx-glass",
            "icon": "av-timer",
            "action": f"content:{base_url}/content/settings_widgets.json"
        })

    # CALENDAR WIDGETS
    if w_active.get("calendar_grid"):
        items.append({
            "id": "w_cal_grid",
            "type": "teaser",
            "layout": w2_layout,
            "headline": f"{ru_months[now.month-1]} {now.year}",
            "title": f"📅 {now.day} число",
            "titleHeader": "КАЛЕНДАРЬ МЕСЯЦА",
            "titleFooter": f"ПН ВТ СР ЧТ ПТ [СБ] [ВС] • {weekday_str}",
            "color": "msx-glass",
            "icon": "calendar-month",
            "action": f"content:{base_url}/content/settings_widgets.json"
        })
    elif w_active.get("calendar_compact"):
        items.append({
            "id": "w_cal_comp",
            "type": "teaser",
            "layout": w2_layout,
            "headline": "СЕГОДНЯ",
            "title": f"{now.day} {ru_months[now.month-1]}",
            "titleHeader": weekday_str.upper(),
            "titleFooter": f"{now.year} год",
            "color": "msx-glass",
            "icon": "today",
            "action": f"content:{base_url}/content/settings_widgets.json"
        })
    elif w_active.get("calendar_events"):
        items.append({
            "id": "w_cal_ev",
            "type": "teaser",
            "layout": w2_layout,
            "headline": "ПЛАНИРОВЩИК ТВ",
            "title": "19:00 Кино • 21:30 Discovery",
            "titleHeader": "РАСПИСАНИЕ НА ВЕЧЕР",
            "titleFooter": "23:00 Ночной релакс & Chill",
            "color": "msx-glass",
            "icon": "event-note",
            "action": f"content:{base_url}/content/settings_widgets.json"
        })

    # ACTION BUTTONS & BANNER
    items.append({
        "id": "btn_screensaver_now",
        "type": "button",
        "layout": "0,4.6,5.8,1.4" if pos in ("center", "top") else "0,4.8,4.0,1.2",
        "icon": "brightness-3",
        "label": "🌙 Запустить заставку сейчас",
        "color": "msx-glass",
        "action": f"slideshow:{base_url}/screensaver.json"
    })
    
    items.append({
        "id": "btn_settings_quick",
        "type": "button",
        "layout": "6.2,4.6,5.8,1.4" if pos in ("center", "top") else "4.2,4.8,4.0,1.2",
        "icon": "tune",
        "label": "⚙ Настройки виджетов и фона",
        "color": "msx-glass",
        "action": f"content:{base_url}/content/settings.json"
    })

    return jsonify({
        "type": "list",
        "headline": "Виджеты — Часы, Календарь и Статус",
        "background": MENU_BACKGROUNDS["widgets"],
        "items": items
    })

# ---------------------------------------------------------------------------
# 4. SECTION 2: ПРОГРАММЫ / ПРИЛОЖЕНИЯ (/content/apps.json)
# Background: Neon Cyber City 4K
# ---------------------------------------------------------------------------

@app.route('/content/apps.json')
def msx_content_apps():
    base_url = get_base_url()
    items = []

    # Button: Add application shortcut
    items.append({
        "id": "btn_add_app_tile",
        "type": "button",
        "layout": "0,0,3.6,2.6",
        "icon": "add-circle",
        "label": "+ Добавить программу",
        "title": "Управление и добавление ярлыков",
        "color": "msx-glass",
        "action": f"content:{base_url}/content/settings_apps.json"
    })

    # List of installed apps
    for app_item in installed_apps:
        app_url = app_item["url"]
        
        # Determine launch action: if starts with video: or start: or slideshow:, keep it, otherwise open link/start
        if app_url.startswith("http://") or app_url.startswith("https://"):
            if app_url.endswith(".mp4") or app_url.endswith(".m3u8"):
                act = f"video:{app_url}"
            elif "msx" in app_url:
                act = f"start:{app_url}"
            else:
                act = f"link:{app_url}"
        else:
            act = app_url

        items.append({
            "id": app_item["id"],
            "layout": "0,0,3.6,2.6",
            "title": app_item["name"],
            "titleHeader": app_item["sub"],
            "titleFooter": app_item["url"],
            "icon": app_item["icon"],
            "badge": app_item.get("badge", "APP"),
            "image": app_item.get("image"),
            "imageFiller": "cover",
            "color": "msx-glass",
            "action": act
        })

    return jsonify({
        "type": "list",
        "headline": "Программы и Онлайн-Кинотеатры",
        "background": MENU_BACKGROUNDS["apps"],
        "template": {"type": "default", "layout": "0,0,3.6,2.6", "color": "msx-glass"},
        "items": items
    })

# ---------------------------------------------------------------------------
# 5. SECTION 3: НАСТРОЙКИ (/content/settings.json)
# Background: Minimalist Mountain Horizon 4K
# Contains: Настройки виджетов, Настройки программ, Настройки заставки
# ---------------------------------------------------------------------------

@app.route('/content/settings.json')
def msx_content_settings():
    base_url = get_base_url()
    return jsonify({
        "type": "list",
        "headline": "Панель управления и Настройки",
        "background": MENU_BACKGROUNDS["settings"],
        "items": [
            {
                "id": "set_cat_widgets",
                "type": "teaser",
                "layout": "0,0,5.8,3.2",
                "icon": "dashboard-customize",
                "title": "Настройки виджетов",
                "titleHeader": "ЧАСЫ, КАЛЕНДАРЬ И РАСПОЛОЖЕНИЕ",
                "titleFooter": f"Текущая позиция: {current_settings['widgets_position'].upper()}",
                "color": "msx-glass",
                "badge": "ВИДЖЕТЫ",
                "action": f"content:{base_url}/content/settings_widgets.json"
            },
            {
                "id": "set_cat_apps",
                "type": "teaser",
                "layout": "6.2,0,5.8,3.2",
                "icon": "apps",
                "title": "Настройки программ",
                "titleHeader": "ДОБАВЛЕНИЕ И УДАЛЕНИЕ ЯРЛЫКОВ",
                "titleFooter": f"Установлено программ: {len(installed_apps)}",
                "color": "msx-glass",
                "badge": "ЯРЛЫКИ",
                "action": f"content:{base_url}/content/settings_apps.json"
            },
            {
                "id": "set_cat_screensaver",
                "type": "teaser",
                "layout": "0,3.4,5.8,3.0",
                "icon": "brightness-3",
                "title": "Настройка заставки (Скринсейвер)",
                "titleHeader": "ФОНЫ, СЛАЙД-ШОУ И ТАЙМАУТЫ",
                "titleFooter": "Выбор картинки и мгновенный запуск",
                "color": "msx-glass",
                "badge": "4K SCREENSAVER",
                "action": f"content:{base_url}/content/settings_screensaver.json"
            },
            {
                "id": "set_cat_bg",
                "type": "teaser",
                "layout": "6.2,3.4,5.8,3.0",
                "icon": "palette",
                "title": "Фоны разделов меню",
                "titleHeader": "АТМОСФЕРНЫЕ ОБОИ 4K",
                "titleFooter": "Настроить фон для меню виджетов и программ",
                "color": "msx-glass",
                "badge": "ОБОИ",
                "action": f"content:{base_url}/content/settings_bg.json"
            }
        ]
    })

# --- 5.1 НАСТРОЙКИ ВИДЖЕТОВ ---
@app.route('/content/settings_widgets.json')
def msx_settings_widgets():
    base_url = get_base_url()
    w_active = current_settings["widgets_active"]
    pos = current_settings["widgets_position"]

    items = []
    
    # Toggle individual widgets
    widgets_list = [
        {"key": "clock_digital", "name": "Цифровые Неон часы", "icon": "schedule"},
        {"key": "clock_modern", "name": "Минимал Модерн часы", "icon": "av-timer"},
        {"key": "clock_analog", "name": "Аналоговые часы со стрелками", "icon": "watch-later"},
        {"key": "calendar_grid", "name": "Календарь: Сетка месяца", "icon": "calendar-month"},
        {"key": "calendar_compact", "name": "Календарь: Компактный день", "icon": "today"},
        {"key": "calendar_events", "name": "Планировщик ТВ программ", "icon": "event-note"}
    ]

    for w in widgets_list:
        is_on = w_active.get(w["key"], False)
        items.append({
            "id": f"toggle_{w['key']}",
            "type": "button",
            "layout": "0,0,5.8,1.6",
            "icon": w["icon"],
            "label": f"{'ВКЛ [✓]' if is_on else 'ВЫКЛ [  ]'}  {w['name']}",
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/toggle_widget/{w['key']}|reload:content|info:{w['name']} {'включен' if not is_on else 'выключен'}]"
        })

    # Position Selection Buttons
    positions = [
        {"id": "center", "name": "Посередине"},
        {"id": "left", "name": "Слева"},
        {"id": "right", "name": "Справа"},
        {"id": "top", "name": "Сверху"},
        {"id": "bottom", "name": "Снизу"}
    ]
    for p in positions:
        is_sel = (pos == p["id"])
        items.append({
            "id": f"pos_{p['id']}",
            "type": "button",
            "layout": "0,0,3.8,1.6",
            "icon": "filter-center-focus",
            "label": f"{'✓ ' if is_sel else ''}Позиция: {p['name']}",
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/set_pos/{p['id']}|reload:content|info:Позиция изменена на {p['name']}]"
        })

    return jsonify({
        "type": "list",
        "headline": "Настройки виджетов (Включение и расположение)",
        "background": MENU_BACKGROUNDS["settings"],
        "items": items
    })

# --- 5.2 НАСТРОЙКИ ПРОГРАММ (ДОБАВЛЕНИЕ ПО ПУТИ / URL) ---
@app.route('/content/settings_apps.json')
def msx_settings_apps():
    base_url = get_base_url()
    items = []

    # 1. Custom URL Input via MSX On-Screen Code Panel
    items.append({
        "id": "btn_code_add",
        "type": "button",
        "layout": "0,0,5.8,2.4",
        "icon": "keyboard",
        "label": "⌨ Ввести URL нового приложения",
        "title": "Нажмите OK для ввода адреса приложения",
        "badge": "ВВОД URL",
        "color": "msx-glass",
        "action": f"execute:code:{base_url}/api/add_app_by_code",
        "data": {
            "headline": "Введите адрес приложения",
            "placeholder": "http:// или https://...",
            "value": "http://"
        }
    })

    # 2. Reset / Clear custom apps
    items.append({
        "id": "btn_reset_apps",
        "type": "button",
        "layout": "6.2,0,5.8,2.4",
        "icon": "restore",
        "label": "Сбросить список программ",
        "title": "Вернуть стандартный набор приложений",
        "color": "msx-glass",
        "action": f"[execute:{base_url}/api/reset_apps|reload:content|info:Список программ сброшен к стандартному]"
    })

    # 3. Quick-Add Catalog of popular services
    for pop in PRESET_POPULAR_APPS:
        already_has = any(a["url"] == pop["url"] for a in installed_apps)
        items.append({
            "id": f"quick_{pop['name']}",
            "type": "button",
            "layout": "0,0,3.8,2.0",
            "icon": pop["icon"],
            "label": f"{'✓ Добавлено: ' if already_has else '+ Добавить: '}{pop['name']}",
            "title": pop["url"],
            "badge": pop["badge"],
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/add_preset_app/{pop['name']}|reload:content|info:Приложение {pop['name']} добавлено!]"
        })

    # 4. Currently Installed Apps List with Delete Option
    for app_item in installed_apps:
        items.append({
            "id": f"del_{app_item['id']}",
            "type": "button",
            "layout": "0,0,5.8,1.6",
            "icon": "delete",
            "label": f"Удалить: {app_item['name']}",
            "title": app_item["url"],
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/remove_app/{app_item['id']}|reload:content|info:{app_item['name']} удалено]"
        })

    return jsonify({
        "type": "list",
        "headline": "Настройки программ — Добавление и удаление ярлыков",
        "background": MENU_BACKGROUNDS["settings"],
        "items": items
    })

# --- 5.3 НАСТРОЙКИ ЗАСТАВКИ (СКРИНСЕЙВЕРА) ---
@app.route('/content/settings_screensaver.json')
def msx_settings_screensaver():
    base_url = get_base_url()
    cur_ss = current_settings["active_screensaver"]
    
    items = []

    # Big Button: Launch Screensaver right now!
    items.append({
        "id": "btn_launch_ss_now",
        "type": "teaser",
        "layout": "0,0,6.0,3.2",
        "icon": "play-circle-outline",
        "title": "▶ Запустить заставку прямо сейчас",
        "titleHeader": "ПРОВЕРКА И ЗАПУСК",
        "titleFooter": "Нажмите OK для немедленного старта 4K скринсейвера",
        "color": "msx-glass",
        "badge": "СТАРТ",
        "action": f"slideshow:{base_url}/screensaver.json"
    })

    # Info card: How to set in TV system settings
    items.append({
        "id": "card_ss_sys_info",
        "type": "teaser",
        "layout": "6.2,0,5.8,3.2",
        "icon": "info",
        "title": "Штатная заставка в MSX",
        "titleHeader": "НАСТРОЙКИ ТВ",
        "titleFooter": f"Укажите: {base_url}/screensaver.json в Настройки -> Заставка",
        "color": "msx-glass",
        "action": f"info:Введите адрес {base_url}/screensaver.json в Настройки -> Заставка Media Station X"
    })

    # Wallpapers Gallery for Screensaver
    for img in SCREENSAVER_IMAGES:
        is_cur = (cur_ss == img["id"])
        items.append({
            "id": f"choose_ss_{img['id']}",
            "layout": "0,0,3.8,2.6",
            "title": img["name"],
            "titleHeader": "ФОН ЗАСТАВКИ",
            "titleFooter": "Нажмите OK для выбора",
            "image": img["thumb"],
            "imageFiller": "cover",
            "badge": "АКТИВНА" if is_cur else "ВЫБРАТЬ",
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/set_screensaver/{img['id']}|reload:content|info:Выбрана заставка: {img['name']}]"
        })

    return jsonify({
        "type": "list",
        "headline": "Настройка заставки (Скринсейвер) — Выбор фото и старт",
        "background": MENU_BACKGROUNDS["settings"],
        "items": items
    })

# --- 5.4 НАСТРОЙКИ ФОНОВ МЕНЮ ---
@app.route('/content/settings_bg.json')
def msx_settings_bg():
    base_url = get_base_url()
    items = []
    for img in SCREENSAVER_IMAGES[1:]:
        items.append({
            "id": f"bg_set_{img['id']}",
            "layout": "0,0,3.8,2.6",
            "title": img["name"],
            "titleHeader": "ОБОИ ДЛЯ ВИДЖЕТОВ",
            "titleFooter": "Нажмите OK для установки",
            "image": img["thumb"],
            "imageFiller": "cover",
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/set_menu_bg/{img['id']}|reload:menu|info:Установлен фон: {img['name']}]"
        })
    return jsonify({
        "type": "list",
        "headline": "Выбор фоновых обоев для разделов меню",
        "background": MENU_BACKGROUNDS["settings"],
        "items": items
    })

# ---------------------------------------------------------------------------
# 6. SECTION 4: О ПРИЛОЖЕНИИ (/content/info.json)
# Background: Night Sky 4K
# ---------------------------------------------------------------------------

@app.route('/content/info.json')
def msx_content_info():
    base_url = get_base_url()
    return jsonify({
        "type": "list",
        "headline": "Информация о портале и подключении",
        "background": MENU_BACKGROUNDS["info"],
        "items": [
            {
                "id": "info_tile_1",
                "type": "teaser",
                "layout": "0,0,5.8,3.2",
                "icon": "info",
                "title": "MX Station Player Portal v2.0",
                "titleHeader": "НА СЕРВЕРЕ FLASK",
                "titleFooter": f"Хост: {base_url}",
                "color": "msx-glass"
            },
            {
                "id": "info_tile_2",
                "type": "teaser",
                "layout": "6.2,0,5.8,3.2",
                "icon": "screen-share",
                "title": "Ввод в Media Station X",
                "titleHeader": "START PARAMETER",
                "titleFooter": "Введите просто имя домена в Settings -> Start Parameter",
                "color": "msx-glass"
            },
            {
                "id": "btn_refresh_all",
                "type": "button",
                "layout": "0,3.5,12.0,1.8",
                "icon": "refresh",
                "label": "Перезагрузить все меню портала",
                "color": "msx-glass",
                "action": f"menu:{base_url}/menu.json"
            }
        ]
    })

# ---------------------------------------------------------------------------
# 7. NATIVE SCREENSAVER PLAYLIST (/screensaver.json)
# Formatted for Media Station X: Settings -> Screensaver
# ---------------------------------------------------------------------------

@app.route('/screensaver.json')
@app.route('/msx/screensaver.json')
def msx_screensaver():
    cur_ss = current_settings["active_screensaver"]
    dur = current_settings["screensaver_duration"]

    items = []
    if cur_ss == "ss_all":
        # Slideshow of all 4K wallpapers
        for img in SCREENSAVER_IMAGES[1:]:
            items.append({
                "image": img["url"],
                "title": img["name"],
                "duration": dur
            })
    else:
        # Specific chosen wallpaper
        chosen = next((x for x in SCREENSAVER_IMAGES if x["id"] == cur_ss), SCREENSAVER_IMAGES[1])
        items.append({
            "image": chosen["url"] or SCREENSAVER_IMAGES[1]["url"],
            "title": chosen["name"],
            "duration": 3600 # Long display
        })

    return jsonify({
        "headline": "4K Заставка Media Station X",
        "items": items
    })

# ---------------------------------------------------------------------------
# 8. API ACTIONS (HANDLES SELECTIONS & ADDING APPS FROM TV REMOTE)
# ---------------------------------------------------------------------------

@app.route('/api/toggle_widget/<widget_key>')
def api_toggle_widget(widget_key):
    w_map = current_settings["widgets_active"]
    if widget_key in w_map:
        w_map[widget_key] = not w_map[widget_key]
    return jsonify({"status": "ok"})

@app.route('/api/set_pos/<pos_key>')
def api_set_pos(pos_key):
    current_settings["widgets_position"] = pos_key
    return jsonify({"status": "ok"})

@app.route('/api/set_screensaver/<ss_id>')
def api_set_screensaver(ss_id):
    current_settings["active_screensaver"] = ss_id
    return jsonify({"status": "ok"})

@app.route('/api/set_menu_bg/<bg_id>')
def api_set_menu_bg(bg_id):
    chosen = next((x for x in SCREENSAVER_IMAGES if x["id"] == bg_id), None)
    if chosen and chosen["url"]:
        MENU_BACKGROUNDS["widgets"] = chosen["url"]
    return jsonify({"status": "ok"})

@app.route('/api/add_preset_app/<app_name>')
def api_add_preset_app(app_name):
    preset = next((p for p in PRESET_POPULAR_APPS if p["name"] == app_name), None)
    if preset:
        # Check if already added
        if not any(a["name"] == preset["name"] for a in installed_apps):
            installed_apps.append({
                "id": f"app_{len(installed_apps) + 1}",
                "name": preset["name"],
                "sub": "Пользовательское приложение",
                "url": preset["url"],
                "icon": preset["icon"],
                "badge": preset["badge"],
                "color": "msx-glass",
                "image": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80"
            })
    return jsonify({"status": "ok"})

@app.route('/api/add_app_by_code', methods=['GET', 'POST'])
def api_add_app_by_code():
    """Receives text entered via MSX on-screen keyboard"""
    code = request.args.get('code') or request.args.get('value')
    if not code and request.is_json:
        data = request.get_json(silent=True) or {}
        code = data.get('code') or data.get('value') or data.get('text')
    
    if code:
        code = code.strip()
        new_app = {
            "id": f"app_custom_{len(installed_apps) + 1}",
            "name": f"Приложение {len(installed_apps) + 1}",
            "sub": "Пользовательский ярлык",
            "url": code,
            "icon": "launch",
            "badge": "CUSTOM",
            "color": "msx-glass",
            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80"
        }
        installed_apps.append(new_app)
        return jsonify({"action": "[reload:content|info:Приложение успешно добавлено!]"})
    
    return jsonify({"action": "info:Адрес не был введен."})

@app.route('/api/remove_app/<app_id>')
def api_remove_app(app_id):
    global installed_apps
    installed_apps = [a for a in installed_apps if a["id"] != app_id]
    return jsonify({"status": "ok"})

@app.route('/api/reset_apps')
def api_reset_apps():
    global installed_apps
    installed_apps = installed_apps[:5]
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    print("=" * 65)
    print("  MX Station Player v2.0 — Native MSX Portal")
    print("  1. Виджеты  |  2. Программы  |  3. Настройки  |  4. О приложении")
    print("  В MSX на ТВ вводите: <IP_ЭТОГО_КОМПЬЮТЕРА>:5000")
    print("=" * 65)
    app.run(host='0.0.0.0', port=5000, debug=True)
