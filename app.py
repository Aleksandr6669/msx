import os
import json
from flask import Flask, jsonify, request, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

def get_base_url():
    """
    Dynamically resolve the base URL.
    Works seamlessly on local development (http://localhost:5000),
    local Wi-Fi IP (http://192.168.x.x:5000), and Vercel cloud (https://*.vercel.app).
    """
    proto = request.headers.get('X-Forwarded-Proto', request.scheme)
    host = request.headers.get('X-Forwarded-Host', request.host)
    return f"{proto}://{host}"

# Persistent runtime settings (can be modified via API or UI)
current_settings = {
    "background_type": "image",
    "background_id": "bg_space",
    "background_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85",
    "clock_widget": "digital",
    "calendar_widget": "grid",
    "widgets_position": "center",
    "show_clock": True,
    "show_calendar": True,
    "glass_blur": "medium"
}

PRESET_BACKGROUNDS = [
    {
        "id": "bg_space",
        "name": "Космическая Аврора 4K",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "bg_cyber",
        "name": "Неоновый Мегаполис 4K",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "bg_mountains",
        "name": "Горный Закат 4K",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "bg_ocean",
        "name": "Океанский Прибой 4K",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "bg_fireplace",
        "name": "Уютный Огонь Камина 4K",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=85",
        "thumb": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80"
    },
    {
        "id": "grad_deep_space",
        "name": "Градиент Deep Space",
        "type": "gradient",
        "css": "radial-gradient(circle at 20% 30%, #171b38 0%, #070913 100%)"
    },
    {
        "id": "grad_neon_sunset",
        "name": "Градиент Neon Sunset",
        "type": "gradient",
        "css": "radial-gradient(circle at 80% 20%, #4a154b 0%, #0d0e1a 100%)"
    },
    {
        "id": "grad_emerald",
        "name": "Градиент Emerald Night",
        "type": "gradient",
        "css": "radial-gradient(circle at 15% 85%, #064e3b 0%, #02110c 100%)"
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
# MEDIA STATION X (MSX) API ENDPOINTS
# ---------------------------------------------------------------------------

@app.route('/start.json')
def msx_start():
    base_url = get_base_url()
    return jsonify({
        "name": "MX Station Glass Portal",
        "version": "1.2.0",
        "parameter": f"menu:{base_url}/menu.json",
        "background": current_settings["background_url"],
        "logo": f"{base_url}/static/images/logo.svg"
    })

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
                "label": "Виджеты & Портал",
                "badge": "NEW",
                "data": f"{base_url}/content/portal.json"
            },
            {
                "icon": "home",
                "label": "Главная",
                "data": f"{base_url}/content/home.json"
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
                "icon": "palette",
                "label": "Фоны и Виджеты",
                "badge": "SETUP",
                "data": f"{base_url}/content/customize.json"
            },
            {
                "icon": "brightness-3",
                "label": "Заставка MSX",
                "badge": "SCREENSAVER",
                "action": f"slideshow:{base_url}/slideshow.json"
            },
            {
                "icon": "settings",
                "label": "О приложении",
                "data": f"{base_url}/content/info.json"
            }
        ]
    })

@app.route('/content/portal.json')
def msx_content_portal():
    base_url = get_base_url()
    return jsonify({
        "type": "list",
        "headline": "Интерактивный Портал с Виджетами",
        "items": [
            {
                "id": "hub_app",
                "type": "teaser",
                "layout": "0,0,5.0,3.6",
                "title": "Открыть Виджеты Часов & Календаря",
                "titleHeader": "ПОЛНОЭКРАННЫЙ РЕЖИМ С БЛЮРОМ",
                "titleFooter": "Полупрозрачные стекла, часы, календарь и фон",
                "image": current_settings["background_url"],
                "imageFiller": "cover",
                "badge": "LAUNCH",
                "action": f"link:{base_url}/"
            },
            {
                "id": "hub_ss",
                "type": "teaser",
                "layout": "0,0,5.0,3.6",
                "title": "Запустить Стандартную Заставку MSX",
                "titleHeader": "МЕДИА СЛАЙД-ШОУ 4K",
                "titleFooter": "Автосмена пейзажей с музыкой (настройки в MSX)",
                "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
                "imageFiller": "cover",
                "badge": "4K SCREENSAVER",
                "action": f"slideshow:{base_url}/slideshow.json"
            }
        ]
    })

@app.route('/content/home.json')
def msx_content_home():
    base_url = get_base_url()
    items = [
        {
            "id": "feat_banner",
            "type": "teaser",
            "layout": "0,0,5.0,3.6",
            "title": "Интерстеллар: Сквозь горизонт",
            "titleHeader": "4K DOLBY VISION • ПРЕМЬЕРА",
            "titleFooter": "Нажмите OK для запуска воспроизведения",
            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85",
            "imageFiller": "cover",
            "badge": "ВЫБОР ДНЯ",
            "action": "video:https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
    ]
    for m in MOVIES:
        items.append({
            "id": f"h_{m['id']}",
            "layout": "0,0,2.5,3.6",
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
        "headline": "Главная — Видеокаталог",
        "template": {"type": "default", "layout": "0,0,2.5,3.6", "color": "msx-glass"},
        "items": items
    })

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

@app.route('/content/customize.json')
def msx_content_customize():
    base_url = get_base_url()
    items = []
    for bg in PRESET_BACKGROUNDS:
        if bg["type"] == "image":
            items.append({
                "id": f"set_{bg['id']}",
                "layout": "0,0,3.5,2.4",
                "title": bg["name"],
                "titleHeader": "ФОНОВЫЕ ОБОИ",
                "titleFooter": "Нажмите OK для выбора",
                "image": bg["thumb"],
                "imageFiller": "cover",
                "action": f"[execute:{base_url}/api/set_background/{bg['id']}|reload:menu|info:Фон изменен на {bg['name']}]"
            })
    return jsonify({
        "type": "list",
        "headline": "Выбор заднего фона оформления",
        "template": {"type": "default", "layout": "0,0,3.5,2.4", "color": "msx-glass"},
        "items": items
    })

@app.route('/slideshow.json')
def msx_slideshow():
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
        "headline": "О приложении и настройка заставки",
        "items": [
            {
                "type": "button",
                "layout": "0,0,4.5,2.2",
                "icon": "wallpaper",
                "label": "Адрес заставки для MSX Settings",
                "title": f"{base_url}/slideshow.json",
                "action": f"info:Введите {base_url}/slideshow.json в Настройки -> Заставка"
            },
            {
                "type": "button",
                "layout": "0,0,4.5,2.2",
                "icon": "refresh",
                "label": "Перезагрузить портал",
                "action": f"menu:{base_url}/menu.json"
            }
        ]
    })

# ---------------------------------------------------------------------------
# SETTINGS & WIDGET CONFIGURATION API
# ---------------------------------------------------------------------------

@app.route('/api/settings', methods=['GET', 'POST'])
def api_settings():
    if request.method == 'POST':
        data = request.get_json(force=True, silent=True) or {}
        for k, v in data.items():
            if k in current_settings:
                current_settings[k] = v
        return jsonify({"status": "ok", "settings": current_settings})
    return jsonify(current_settings)

@app.route('/api/set_background/<bg_id>')
def api_set_background(bg_id):
    for bg in PRESET_BACKGROUNDS:
        if bg["id"] == bg_id:
            current_settings["background_id"] = bg["id"]
            current_settings["background_type"] = bg["type"]
            if bg["type"] == "image":
                current_settings["background_url"] = bg["url"]
            return jsonify({"status": "ok", "background": bg})
    return jsonify({"status": "error", "message": "Background not found"}), 404

# ---------------------------------------------------------------------------
# WEB INTERFACE (HTML5 Smart TV & PC Dashboard)
# ---------------------------------------------------------------------------

@app.route('/')
def web_index():
    base_url = get_base_url()
    return render_template(
        'index.html',
        base_url=base_url,
        settings=current_settings,
        backgrounds=PRESET_BACKGROUNDS,
        movies=MOVIES
    )

@app.route('/screensaver')
def web_screensaver():
    return render_template('screensaver.html')

if __name__ == '__main__':
    print("=" * 65)
    print("  MX Station Player — Portal & Widget Engine")
    print("  URL для Media Station X (Start Parameter):")
    print("  http://<IP_ЭТОГО_КОМПЬЮТЕРА>:5000/start.json")
    print("  URL для стандартной заставки MSX (Настройки -> Заставка):")
    print("  http://<IP_ЭТОГО_КОМПЬЮТЕРА>:5000/slideshow.json")
    print("=" * 65)
    app.run(host='0.0.0.0', port=5000, debug=True)
