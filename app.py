import os
import json
import datetime
from flask import Flask, jsonify, request, redirect

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

# Persistent runtime state
current_settings = {
    "background_id": "bg_space",
    "background_name": "Космическая Аврора 4K",
    "background_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85",
    "clock_widget": "digital",     # "digital", "modern", "analog", "both"
    "calendar_widget": "grid",     # "grid", "compact", "events"
    "widgets_position": "center",  # "center", "left", "right", "top", "bottom"
}

PRESET_BACKGROUNDS = [
    {
        "id": "bg_space",
        "name": "Космическая Аврора 4K",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "bg_cyber",
        "name": "Неоновый Мегаполис 4K",
        "url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "bg_mountains",
        "name": "Горный Закат 4K",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "bg_ocean",
        "name": "Океанский Прибой 4K",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "bg_fireplace",
        "name": "Уютный Огонь Камина 4K",
        "url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80"
    }
]

MOVIES = [
    {
        "id": "mov_1",
        "title": "Интерстеллар: Сквозь горизонт",
        "titleHeader": "4K HDR • Фантастика, Драма",
        "titleFooter": "★ 8.9 | 2024 | 2 ч 49 мин",
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "badge": "TOP 1"
    },
    {
        "id": "mov_2",
        "title": "Кибер-Горизонт 2099",
        "titleHeader": "4K ULTRA • Киберпанк, Боевик",
        "titleFooter": "★ 8.5 | 2024 | 2 ч 15 мин",
        "image": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "badge": "ПРЕМЬЕРА"
    },
    {
        "id": "mov_3",
        "title": "Хроники Ледяного Безмолвия",
        "titleHeader": "Full HD • Приключения, Выживание",
        "titleFooter": "★ 8.2 | 2023 | 1 ч 58 мин",
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "badge": "4K"
    },
    {
        "id": "mov_4",
        "title": "Тайна Неонового Детектива",
        "titleHeader": "4K HDR • Нео-нуар, Триллер",
        "titleFooter": "★ 8.1 | 2024 | 2 ч 04 мин",
        "image": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "badge": "ХИТ"
    }
]

TV_CHANNELS = [
    {
        "id": "tv_1",
        "title": "Кино Премьера HD",
        "titleHeader": "ПРЯМОЙ ЭФИР • Фильмы 24/7",
        "titleFooter": "Сейчас: 'Начало'",
        "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "badge": "LIVE"
    },
    {
        "id": "tv_2",
        "title": "Discovery Nature 4K",
        "titleHeader": "ПРЯМОЙ ЭФИР • Природа",
        "titleFooter": "Сейчас: 'Тайны планеты'",
        "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "badge": "4K LIVE"
    }
]

# Enable CORS for Smart TV requests
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    return response

# ---------------------------------------------------------------------------
# 1. START PARAMETER ENTRYPOINT (ONLY THIS USES /msx/)
# When entering just <domain> in MSX, MSX automatically fetches /msx/start.json.
# This Start Object immediately redirects to the root menu: menu:{SERVER}/menu.json
# ---------------------------------------------------------------------------

@app.route('/msx/start.json')
@app.route('/start.json')
@app.route('/')
def msx_start():
    base_url = get_base_url()
    return jsonify({
        "name": "MX Station Portal",
        "version": "1.3.0",
        "parameter": f"menu:{base_url}/menu.json",
        "background": current_settings["background_url"],
        "logo": f"{base_url}/static/images/logo.svg"
    })

# ---------------------------------------------------------------------------
# 2. ROOT MENU (SIDEBAR NAVIGATION IN MSX)
# All core endpoints reside at the root level (/menu.json, /screensaver.json, etc.)
# ---------------------------------------------------------------------------

@app.route('/menu.json')
def msx_menu():
    base_url = get_base_url()
    return jsonify({
        "headline": "MX STATION PLAYER",
        "logo": f"{base_url}/static/images/logo.svg",
        "logoSize": "small",
        "background": current_settings["background_url"],
        "color": "msx-glass",
        "menu": [
            {
                "icon": "dashboard",
                "label": "Виджеты & Время",
                "badge": "ГЛАВНАЯ",
                "data": f"{base_url}/content/widgets.json"
            },
            {
                "icon": "movie",
                "label": "Фильмы 4K",
                "badge": "4K",
                "data": f"{base_url}/content/movies.json"
            },
            {
                "icon": "tv",
                "label": "ТВ Каналы",
                "badge": "LIVE",
                "data": f"{base_url}/content/tv.json"
            },
            {
                "icon": "schedule",
                "label": "Стиль часов",
                "badge": current_settings["clock_widget"].upper(),
                "data": f"{base_url}/content/settings_clock.json"
            },
            {
                "icon": "calendar-month",
                "label": "Стиль календаря",
                "badge": current_settings["calendar_widget"].upper(),
                "data": f"{base_url}/content/settings_cal.json"
            },
            {
                "icon": "open-with",
                "label": "Позиция виджетов",
                "badge": current_settings["widgets_position"].upper(),
                "data": f"{base_url}/content/settings_pos.json"
            },
            {
                "icon": "palette",
                "label": "Выбор фона 4K",
                "data": f"{base_url}/content/settings_bg.json"
            },
            {
                "icon": "brightness-3",
                "label": "Заставка MSX",
                "badge": "4K",
                "action": f"slideshow:{base_url}/screensaver.json"
            },
            {
                "icon": "info",
                "label": "Инфо о сервере",
                "data": f"{base_url}/content/info.json"
            }
        ]
    })

# ---------------------------------------------------------------------------
# 3. NATIVE MSX WIDGETS HUB (/content/widgets.json)
# Renders semi-transparent glass cards with blur and dynamic placement
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
    clock_mode = current_settings["clock_widget"]
    cal_mode = current_settings["calendar_widget"]
    
    # Grid coordinates according to chosen position
    if pos == "left":
        clk_layout = "0,0,4.0,3.0"
        cal_layout = "0,3,4.0,3.0"
        ban_layout = "4.5,0,7.0,6.0"
    elif pos == "right":
        ban_layout = "0,0,7.0,6.0"
        clk_layout = "7.5,0,4.0,3.0"
        cal_layout = "7.5,3,4.0,3.0"
    elif pos == "top":
        clk_layout = "0,0,5.5,2.5"
        cal_layout = "6.0,0,5.5,2.5"
        ban_layout = "0,3.0,11.5,3.5"
    elif pos == "bottom":
        ban_layout = "0,0,11.5,3.5"
        clk_layout = "0,4.0,5.5,2.5"
        cal_layout = "6.0,4.0,5.5,2.5"
    else:  # "center"
        clk_layout = "2.0,0,3.8,3.0"
        cal_layout = "6.2,0,3.8,3.0"
        ban_layout = "0,3.4,12.0,3.2"

    items = []

    # CLOCK WIDGET
    if clock_mode == "digital":
        items.append({
            "id": "w_clock_dig",
            "type": "teaser",
            "layout": clk_layout,
            "headline": f"{weekday_str}, {date_str}",
            "title": f"⏱ {time_str}",
            "titleHeader": "ЦИФРОВЫЕ НЕОНОВЫЕ ЧАСЫ",
            "titleFooter": "Нажмите OK для переключения стиля часов",
            "color": "msx-glass",
            "icon": "schedule",
            "action": f"[execute:{base_url}/api/toggle_clock|reload:content|info:Стиль часов переключен]"
        })
    elif clock_mode == "modern":
        items.append({
            "id": "w_clock_mod",
            "type": "teaser",
            "layout": clk_layout,
            "headline": f"{ru_months[now.month-1].upper()} {now.year}",
            "title": f"{time_str}",
            "titleHeader": f"MODERN MINIMAL • {weekday_str.upper()}",
            "titleFooter": "Нажмите OK для смены стиля часов",
            "color": "msx-glass",
            "icon": "av-timer",
            "action": f"[execute:{base_url}/api/toggle_clock|reload:content|info:Стиль часов переключен]"
        })
    elif clock_mode == "analog":
        items.append({
            "id": "w_clock_ana",
            "type": "teaser",
            "layout": clk_layout,
            "headline": "MX LUXURY CHRONO",
            "title": f"🕒 {time_str}",
            "titleHeader": "АНАЛОГОВЫЙ ЦИФЕРБЛАТ",
            "titleFooter": f"{weekday_str} • {date_str}",
            "color": "msx-glass",
            "icon": "watch-later",
            "action": f"[execute:{base_url}/api/toggle_clock|reload:content|info:Стиль часов переключен]"
        })
    elif clock_mode == "both":
        items.append({
            "id": "w_clock_dig",
            "type": "teaser",
            "layout": clk_layout,
            "headline": f"{weekday_str}, {date_str}",
            "title": f"⏱ {time_str}",
            "titleHeader": "DIGITAL NEON",
            "titleFooter": "Цифровые часы",
            "color": "msx-glass",
            "icon": "schedule",
            "action": f"[execute:{base_url}/api/toggle_clock|reload:content]"
        })

    # CALENDAR WIDGET
    if cal_mode == "grid":
        items.append({
            "id": "w_cal_grid",
            "type": "teaser",
            "layout": cal_layout,
            "headline": f"{ru_months[now.month-1]} {now.year}",
            "title": f"📅 {now.day} число",
            "titleHeader": "КАЛЕНДАРЬ МЕСЯЦА",
            "titleFooter": f"ПН ВТ СР ЧТ ПТ [СБ] [ВС] • {weekday_str}",
            "color": "msx-glass",
            "icon": "calendar-month",
            "action": f"[execute:{base_url}/api/toggle_cal|reload:content|info:Стиль календаря переключен]"
        })
    elif cal_mode == "compact":
        items.append({
            "id": "w_cal_comp",
            "type": "teaser",
            "layout": cal_layout,
            "headline": "СЕГОДНЯ НА ТВ",
            "title": f"{now.day} {ru_months[now.month-1]}",
            "titleHeader": weekday_str.upper(),
            "titleFooter": "Нажмите OK для смены вида календаря",
            "color": "msx-glass",
            "icon": "today",
            "action": f"[execute:{base_url}/api/toggle_cal|reload:content|info:Стиль календаря переключен]"
        })
    elif cal_mode == "events":
        items.append({
            "id": "w_cal_ev",
            "type": "teaser",
            "layout": cal_layout,
            "headline": "ПЛАНИРОВЩИК ТВ",
            "title": "19:00 Кино • 21:30 Discovery",
            "titleHeader": "РАСПИСАНИЕ НА ВЕЧЕР",
            "titleFooter": "23:00 Ночная заставка & Chill",
            "color": "msx-glass",
            "icon": "event-note",
            "action": f"[execute:{base_url}/api/toggle_cal|reload:content|info:Стиль календаря переключен]"
        })

    # PROMO BANNER / QUICK ACCESS
    items.append({
        "id": "w_banner",
        "type": "teaser",
        "layout": ban_layout,
        "title": "Хит дня: Интерстеллар: Сквозь горизонт",
        "titleHeader": "★ 4K DOLBY VISION ★",
        "titleFooter": "Нажмите OK для запуска фильма в MX Player",
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85",
        "imageFiller": "cover",
        "badge": "ВЫБОР РЕДАКЦИИ",
        "action": "video:https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    })

    return jsonify({
        "type": "list",
        "headline": "Интерактивные виджеты и главное меню",
        "items": items
    })

# ---------------------------------------------------------------------------
# 4. SETTINGS SCREENS (CLOCK, CALENDAR, POSITION, BACKGROUNDS)
# All configurable right on the Smart TV via TV Remote!
# ---------------------------------------------------------------------------

@app.route('/content/settings_clock.json')
def msx_settings_clock():
    base_url = get_base_url()
    clocks = [
        {"id": "digital", "name": "Цифровые Неон", "sub": "Крупные цифры, секунды, дата", "icon": "schedule"},
        {"id": "modern", "name": "Минимал Модерн", "sub": "Изящный шрифт, крупный день недели", "icon": "av-timer"},
        {"id": "analog", "name": "Аналоговые со стрелками", "sub": "Круглый циферблат Chrono", "icon": "watch-later"},
        {"id": "both", "name": "Оба стиля часов", "sub": "Цифровые + Аналоговые вместе", "icon": "view-carousel"}
    ]
    items = []
    for c in clocks:
        is_cur = (current_settings["clock_widget"] == c["id"])
        items.append({
            "id": f"clk_{c['id']}",
            "type": "button",
            "layout": "0,0,5.5,2.2",
            "icon": c["icon"],
            "label": f"{'✓ ' if is_cur else ''}{c['name']}",
            "title": c["sub"],
            "badge": "АКТИВЕН" if is_cur else "ВЫБРАТЬ",
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/set_clock/{c['id']}|reload:menu|info:Выбран стиль: {c['name']}]"
        })
    return jsonify({
        "type": "list",
        "headline": "Настройка вида часов на главном экране",
        "template": {"type": "button", "layout": "0,0,5.5,2.2", "color": "msx-glass"},
        "items": items
    })

@app.route('/content/settings_cal.json')
def msx_settings_cal():
    base_url = get_base_url()
    cals = [
        {"id": "grid", "name": "Сетка месяца", "sub": "Полный календарь с подсветкой сегодня", "icon": "calendar-month"},
        {"id": "compact", "name": "Компактная дата", "sub": "Крупный день, месяц и день недели", "icon": "today"},
        {"id": "events", "name": "Расписание и Планы", "sub": "Список ближайших фильмов и передач", "icon": "event-note"}
    ]
    items = []
    for c in cals:
        is_cur = (current_settings["calendar_widget"] == c["id"])
        items.append({
            "id": f"cal_{c['id']}",
            "type": "button",
            "layout": "0,0,5.5,2.2",
            "icon": c["icon"],
            "label": f"{'✓ ' if is_cur else ''}{c['name']}",
            "title": c["sub"],
            "badge": "АКТИВЕН" if is_cur else "ВЫБРАТЬ",
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/set_cal/{c['id']}|reload:menu|info:Выбран стиль: {c['name']}]"
        })
    return jsonify({
        "type": "list",
        "headline": "Настройка вида календаря",
        "template": {"type": "button", "layout": "0,0,5.5,2.2", "color": "msx-glass"},
        "items": items
    })

@app.route('/content/settings_pos.json')
def msx_settings_pos():
    base_url = get_base_url()
    positions = [
        {"id": "center", "name": "Посередине (Center)", "icon": "filter-center-focus"},
        {"id": "left", "name": "Слева (Left)", "icon": "format-align-left"},
        {"id": "right", "name": "Справа (Right)", "icon": "format-align-right"},
        {"id": "top", "name": "Сверху (Top)", "icon": "vertical-align-top"},
        {"id": "bottom", "name": "Снизу (Bottom)", "icon": "vertical-align-bottom"}
    ]
    items = []
    for p in positions:
        is_cur = (current_settings["widgets_position"] == p["id"])
        items.append({
            "id": f"pos_{p['id']}",
            "type": "button",
            "layout": "0,0,5.5,2.0",
            "icon": p["icon"],
            "label": f"{'✓ ' if is_cur else ''}{p['name']}",
            "badge": "АКТИВНО" if is_cur else "ВЫБРАТЬ",
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/set_pos/{p['id']}|reload:menu|info:Позиция изменена на {p['name']}]"
        })
    return jsonify({
        "type": "list",
        "headline": "Размещение виджетов на экране телевизора",
        "template": {"type": "button", "layout": "0,0,5.5,2.0", "color": "msx-glass"},
        "items": items
    })

@app.route('/content/settings_bg.json')
def msx_settings_bg():
    base_url = get_base_url()
    items = []
    for bg in PRESET_BACKGROUNDS:
        is_cur = (current_settings["background_id"] == bg["id"])
        items.append({
            "id": f"bg_{bg['id']}",
            "layout": "0,0,3.6,2.5",
            "title": bg["name"],
            "titleHeader": "ФОНОВЫЕ ОБОИ 4K",
            "titleFooter": "Нажмите OK для установки",
            "image": bg["thumb"],
            "imageFiller": "cover",
            "badge": "АКТИВЕН" if is_cur else "ВЫБРАТЬ",
            "color": "msx-glass",
            "action": f"[execute:{base_url}/api/set_background/{bg['id']}|reload:menu|info:Установлен фон: {bg['name']}]"
        })
    return jsonify({
        "type": "list",
        "headline": "Выбор фоновых 4K обоев с блюром",
        "template": {"type": "default", "layout": "0,0,3.6,2.5", "color": "msx-glass"},
        "items": items
    })

# ---------------------------------------------------------------------------
# 5. CONTENT SECTIONS (MOVIES & TV)
# ---------------------------------------------------------------------------

@app.route('/content/movies.json')
def msx_content_movies():
    items = []
    for m in MOVIES:
        items.append({
            "id": m["id"],
            "title": m["title"],
            "titleHeader": m["titleHeader"],
            "titleFooter": m["titleFooter"],
            "image": m["image"],
            "imageFiller": "cover",
            "badge": m["badge"],
            "action": f"video:{m['video']}"
        })
    return jsonify({
        "type": "list",
        "headline": "Каталог Фильмов 4K",
        "template": {"type": "default", "layout": "0,0,2.5,3.6", "color": "msx-glass"},
        "items": items
    })

@app.route('/content/tv.json')
def msx_content_tv():
    items = []
    for t in TV_CHANNELS:
        items.append({
            "id": t["id"],
            "title": t["title"],
            "titleHeader": t["titleHeader"],
            "titleFooter": t["titleFooter"],
            "image": t["image"],
            "imageFiller": "cover",
            "badge": t["badge"],
            "action": f"video:{t['video']}"
        })
    return jsonify({
        "type": "list",
        "headline": "Телеканалы Прямой Эфир",
        "template": {"type": "default", "layout": "0,0,3.6,2.4", "color": "msx-glass"},
        "items": items
    })

# ---------------------------------------------------------------------------
# 6. ROOT SCREENSAVER PLAYLIST (/screensaver.json)
# Used directly in MSX: Settings -> Screensaver -> Screensaver URL
# ---------------------------------------------------------------------------

@app.route('/screensaver.json')
@app.route('/msx/screensaver.json')
def msx_screensaver():
    return jsonify({
        "headline": "4K Заставка Media Station X",
        "items": [
            {
                "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=90",
                "title": "Космическая Аврора 4K",
                "duration": 8
            },
            {
                "image": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=90",
                "title": "Ночной Киберпанк Город",
                "duration": 8
            },
            {
                "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=90",
                "title": "Горные Пики в Облаках",
                "duration": 8
            },
            {
                "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90",
                "title": "Океанский Прибой & Золотой Закат",
                "duration": 8
            },
            {
                "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=90",
                "title": "Уютный Огонь Камина",
                "duration": 8
            }
        ]
    })

@app.route('/content/info.json')
def msx_content_info():
    base_url = get_base_url()
    return jsonify({
        "type": "list",
        "headline": "Информация о портале",
        "items": [
            {
                "type": "button",
                "layout": "0,0,5.0,2.2",
                "icon": "wallpaper",
                "label": "Адрес для Настройки -> Заставка",
                "title": f"{base_url}/screensaver.json",
                "action": f"info:Укажите {base_url}/screensaver.json в Настройки -> Заставка"
            },
            {
                "type": "button",
                "layout": "0,0,5.0,2.2",
                "icon": "refresh",
                "label": "Перезагрузить меню",
                "action": f"menu:{base_url}/menu.json"
            }
        ]
    })

# ---------------------------------------------------------------------------
# 7. SERVER ACTIONS FOR TV REMOTE SELECTIONS
# ---------------------------------------------------------------------------

@app.route('/api/set_background/<bg_id>')
def api_set_background(bg_id):
    for bg in PRESET_BACKGROUNDS:
        if bg["id"] == bg_id:
            current_settings["background_id"] = bg["id"]
            current_settings["background_name"] = bg["name"]
            current_settings["background_url"] = bg["url"]
            return jsonify({"status": "ok", "background": bg})
    return jsonify({"status": "error"}), 404

@app.route('/api/set_clock/<clock_type>')
def api_set_clock(clock_type):
    current_settings["clock_widget"] = clock_type
    return jsonify({"status": "ok", "clock": clock_type})

@app.route('/api/toggle_clock')
def api_toggle_clock():
    order = ["digital", "modern", "analog", "both"]
    idx = order.index(current_settings["clock_widget"]) if current_settings["clock_widget"] in order else 0
    current_settings["clock_widget"] = order[(idx + 1) % len(order)]
    return jsonify({"status": "ok", "clock": current_settings["clock_widget"]})

@app.route('/api/set_cal/<cal_type>')
def api_set_cal(cal_type):
    current_settings["calendar_widget"] = cal_type
    return jsonify({"status": "ok", "calendar": cal_type})

@app.route('/api/toggle_cal')
def api_toggle_cal():
    order = ["grid", "compact", "events"]
    idx = order.index(current_settings["calendar_widget"]) if current_settings["calendar_widget"] in order else 0
    current_settings["calendar_widget"] = order[(idx + 1) % len(order)]
    return jsonify({"status": "ok", "calendar": current_settings["calendar_widget"]})

@app.route('/api/set_pos/<pos_type>')
def api_set_pos(pos_type):
    current_settings["widgets_position"] = pos_type
    return jsonify({"status": "ok", "position": pos_type})

if __name__ == '__main__':
    print("=" * 65)
    print("  MX Station Player — Native Media Station X Portal")
    print("  В MSX на телевизоре достаточно ввести просто адрес:")
    print("  <IP_ЭТОГО_КОМПЬЮТЕРА>:5000")
    print("  (MSX автоматически подгрузит /msx/start.json)")
    print("=" * 65)
    app.run(host='0.0.0.0', port=5000, debug=True)
