import os
import json
from flask import Flask, jsonify, request, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

# Enable CORS for all routes (crucial for Smart TV browsers & Media Station X)
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    return response

# ---------------------------------------------------------------------------
# MEDIA DATA & CATALOG
# ---------------------------------------------------------------------------

SCREENSAVER_THEMES = [
    {
        "id": "ss_aurora",
        "title": "Космическая Аврора 4K",
        "titleHeader": "AMBIENT & RELAX",
        "titleFooter": "Медитативные космические волны",
        "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        "badge": "4K CHILL"
    },
    {
        "id": "ss_fireplace",
        "title": "Уютный Камин 4K",
        "titleHeader": "COZY FIREPLACE",
        "titleFooter": "Треск дров и теплое пламя",
        "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "badge": "RELAX"
    },
    {
        "id": "ss_cyberpunk",
        "title": "Ночной Неоновый Город",
        "titleHeader": "CYBERPUNK RAIN",
        "titleFooter": "Огни ночного мегаполиса под дождем",
        "image": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
        "badge": "NEON 4K"
    },
    {
        "id": "ss_ocean",
        "title": "Морской Закат & Прибой",
        "titleHeader": "OCEAN SUNSET",
        "titleFooter": "Успокаивающий шум океанских волн",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "badge": "NATURE"
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
    },
    {
        "id": "mov_5",
        "title": "Дюна: Хроники Песков",
        "titleHeader": "Dolby Vision • Эпопея, Фантастика",
        "titleFooter": "★ 8.8 | 2024 | 2 ч 46 мин",
        "image": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
        "badge": "IMAX"
    },
    {
        "id": "mov_6",
        "title": "Одиссея Глубин",
        "titleHeader": "4K HDR • Документальный, Океан",
        "titleFooter": "★ 9.1 | 2023 | 1 ч 32 мин",
        "image": "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "badge": "DOC"
    }
]

SERIES = [
    {
        "id": "ser_1",
        "title": "Нейросеть: Точка Сингулярности",
        "titleHeader": "Сезон 1 • 8 серий • Sci-Fi",
        "titleFooter": "★ 8.7 | 2024 | Новая серия",
        "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        "badge": "НОВЫЙ СЕЗОН"
    },
    {
        "id": "ser_2",
        "title": "Темный Архипелаг",
        "titleHeader": "Сезон 2 • 10 серий • Детектив",
        "titleFooter": "★ 8.4 | 2024 | Все серии",
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackDamage.mp4",
        "badge": "HD"
    },
    {
        "id": "ser_3",
        "title": "Космический Патруль",
        "titleHeader": "Сезон 3 • 12 серий • Экшн",
        "titleFooter": "★ 8.3 | 2023 | Завершен",
        "image": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "badge": "4K"
    }
]

TV_CHANNELS = [
    {
        "id": "tv_1",
        "title": "Кино Премьера HD",
        "titleHeader": "ПРЯМОЙ ЭФИР • Фильмы 24/7",
        "titleFooter": "Сейчас: 'Начало' (Кристофер Нолан)",
        "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "badge": "LIVE"
    },
    {
        "id": "tv_2",
        "title": "Discovery Nature 4K",
        "titleHeader": "ПРЯМОЙ ЭФИР • Дикая Природа",
        "titleFooter": "Сейчас: 'Жизнь тропических лесов'",
        "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "badge": "4K LIVE"
    },
    {
        "id": "tv_3",
        "title": "Space & Science TV",
        "titleHeader": "ПРЯМОЙ ЭФИР • Наука и Космос",
        "titleFooter": "Сейчас: 'Тайны квазаров и черных дыр'",
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "badge": "LIVE"
    },
    {
        "id": "tv_4",
        "title": "Спорт Арена Ultra HD",
        "titleHeader": "ПРЯМОЙ ЭФИР • Футбол & Хоккей",
        "titleFooter": "Сейчас: 'Лига Чемпионов. Обзор'",
        "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "badge": "SPORT"
    }
]

MUSIC_RADIO = [
    {
        "id": "mus_1",
        "title": "Lo-Fi Chill Beats Radio",
        "titleHeader": "AUDIO STREAM • Relax & Study",
        "titleFooter": "24/7 Безмятежный инструментальный поток",
        "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        "video": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "badge": "RADIO"
    },
    {
        "id": "mus_2",
        "title": "Synthwave & Retrowave 80s",
        "titleHeader": "AUDIO STREAM • Neon Drive",
        "titleFooter": "Ретро-электроника и ночные ритмы",
        "image": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
        "video": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "badge": "80s"
    },
    {
        "id": "mus_3",
        "title": "Deep Space Ambient",
        "titleHeader": "AUDIO STREAM • Deep Atmosphere",
        "titleFooter": "Космический эмбиент для глубокого сна",
        "image": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
        "video": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        "badge": "AMBIENT"
    }
]

# ---------------------------------------------------------------------------
# MEDIA STATION X (MSX) API ENDPOINTS
# ---------------------------------------------------------------------------

@app.route('/start.json')
def msx_start():
    """
    Entry point for Media Station X.
    Set in TV: MSX -> Settings -> Start Parameter -> Setup -> http://<IP>:5000/start.json
    """
    base_url = request.host_url.rstrip('/')
    return jsonify({
        "name": "MX Station Cinema & TV",
        "version": "1.0.0",
        "parameter": f"menu:{base_url}/menu.json",
        "background": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85",
        "logo": f"{base_url}/static/images/logo.svg"
    })

@app.route('/menu.json')
def msx_menu():
    """
    Sidebar Navigation Menu (Menu Root Object in MSX).
    Displayed on the left side of the TV screen with smooth navigation.
    """
    base_url = request.host_url.rstrip('/')
    wallpaper_url = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=85"
    
    return jsonify({
        "headline": "MX STATION PLAYER",
        "logo": f"{base_url}/static/images/logo.svg",
        "logoSize": "small",
        "background": wallpaper_url,
        "color": "msx-glass",
        "menu": [
            {
                "icon": "home",
                "label": "Главная",
                "data": f"{base_url}/content/home.json"
            },
            {
                "icon": "movie",
                "label": "Фильмы",
                "badge": "4K",
                "data": f"{base_url}/content/movies.json"
            },
            {
                "icon": "video-library",
                "label": "Сериалы",
                "data": f"{base_url}/content/series.json"
            },
            {
                "icon": "tv",
                "label": "ТВ Каналы",
                "badge": "LIVE",
                "data": f"{base_url}/content/tv.json"
            },
            {
                "icon": "music-note",
                "label": "Музыка & Радио",
                "data": f"{base_url}/content/music.json"
            },
            {
                "icon": "brightness-3",
                "label": "Заставка & Релакс",
                "badge": "AMBIENT",
                "data": f"{base_url}/content/screensaver.json"
            },
            {
                "icon": "settings",
                "label": "О приложении",
                "data": f"{base_url}/content/info.json"
            }
        ]
    })

def build_msx_content_response(headline, items, layout="0,0,2.4,3.6", is_audio=False):
    content_items = []
    for item in items:
        media_url = item["video"]
        action = f"audio:{media_url}" if is_audio else f"video:{media_url}"
        
        entry = {
            "id": item["id"],
            "title": item["title"],
            "titleHeader": item.get("titleHeader", ""),
            "titleFooter": item.get("titleFooter", ""),
            "image": item["image"],
            "imageFiller": "cover",
            "badge": item.get("badge", ""),
            "action": action
        }
        content_items.append(entry)

    return jsonify({
        "type": "list",
        "headline": headline,
        "template": {
            "type": "default",
            "layout": layout,
            "color": "msx-glass",
            "imageFiller": "cover"
        },
        "items": content_items
    })

@app.route('/content/home.json')
def msx_content_home():
    base_url = request.host_url.rstrip('/')
    items = [
        {
            "id": "feat_banner",
            "type": "teaser",
            "layout": "0,0,5.0,3.6",
            "title": "Хит сезона: Интерстеллар: Сквозь горизонт",
            "titleHeader": "★ ЭКСКЛЮЗИВ В 4K DOLBY VISION ★",
            "titleFooter": "Нажмите OK для запуска фильма в плеере",
            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85",
            "imageFiller": "cover",
            "badge": "ВЫБОР РЕДАКЦИИ",
            "action": "video:https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        },
        {
            "id": "feat_screensaver",
            "type": "teaser",
            "layout": "0,0,5.0,3.6",
            "title": "Заставка: Космическая Аврора & Камин 4K",
            "titleHeader": "РЕЖИМ ОТДЫХА • AMBIENT CHILL",
            "titleFooter": "Медитативная музыка и видеоряд для экрана ТВ",
            "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85",
            "imageFiller": "cover",
            "badge": "РЕЛАКС",
            "action": "video:https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
        }
    ]
    
    for m in MOVIES[:4]:
        items.append({
            "id": f"home_{m['id']}",
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
        "headline": "Главная — Рекомендации и Новинки",
        "template": {
            "type": "default",
            "layout": "0,0,2.5,3.6",
            "color": "msx-glass"
        },
        "items": items
    })

@app.route('/content/movies.json')
def msx_content_movies():
    return build_msx_content_response("Каталог Фильмов 4K HDR", MOVIES, layout="0,0,2.4,3.6")

@app.route('/content/series.json')
def msx_content_series():
    return build_msx_content_response("Популярные Сериалы", SERIES, layout="0,0,2.4,3.6")

@app.route('/content/tv.json')
def msx_content_tv():
    return build_msx_content_response("Прямой Эфир — ТВ Каналы HD", TV_CHANNELS, layout="0,0,3.6,2.4")

@app.route('/content/music.json')
def msx_content_music():
    return build_msx_content_response("Музыка и Онлайн Радио 24/7", MUSIC_RADIO, layout="0,0,3.0,3.0", is_audio=True)

@app.route('/content/screensaver.json')
def msx_content_screensaver():
    base_url = request.host_url.rstrip('/')
    items = [
        {
            "id": "ss_slideshow",
            "type": "teaser",
            "layout": "0,0,4.0,3.0",
            "title": "Слайд-шоу 'Галерея Природы 4K'",
            "titleHeader": "ФОТО ЗАСТАВКА",
            "titleFooter": "Автоматическая смена обоев с музыкой",
            "image": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80",
            "imageFiller": "cover",
            "badge": "SLIDESHOW",
            "action": f"slideshow:{base_url}/slideshow.json"
        }
    ]
    
    for s in SCREENSAVER_THEMES:
        items.append({
            "id": s["id"],
            "layout": "0,0,3.5,2.6",
            "title": s["title"],
            "titleHeader": s["titleHeader"],
            "titleFooter": s["titleFooter"],
            "image": s["image"],
            "imageFiller": "cover",
            "badge": s["badge"],
            "action": f"video:{s['video']}"
        })
        
    return jsonify({
        "type": "list",
        "headline": "Заставки, Релакс и Живые Обои",
        "template": {
            "type": "default",
            "layout": "0,0,3.5,2.6",
            "color": "msx-glass"
        },
        "items": items
    })

@app.route('/slideshow.json')
def msx_slideshow():
    return jsonify({
        "headline": "Галерея 4K Заставок",
        "items": [
            {
                "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=90",
                "title": "Северное Сияние и Звезды",
                "duration": 7
            },
            {
                "image": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=90",
                "title": "Ночные Огни Мегаполиса",
                "duration": 7
            },
            {
                "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90",
                "title": "Закат на Океане",
                "duration": 7
            },
            {
                "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=90",
                "title": "Теплое Пламя Камина",
                "duration": 7
            }
        ]
    })

@app.route('/content/info.json')
def msx_content_info():
    base_url = request.host_url.rstrip('/')
    return jsonify({
        "type": "list",
        "headline": "Информация и Настройки",
        "items": [
            {
                "type": "button",
                "layout": "0,0,4.0,2.0",
                "icon": "info",
                "label": "Сервер: Flask MX Player Engine v1.0",
                "title": f"Адрес: {base_url}",
                "action": "info:Сервер работает штатно. Приятного просмотра!"
            },
            {
                "type": "button",
                "layout": "0,0,4.0,2.0",
                "icon": "refresh",
                "label": "Обновить Меню",
                "action": f"menu:{base_url}/menu.json"
            }
        ]
    })

# ---------------------------------------------------------------------------
# WEB ROUTES
# ---------------------------------------------------------------------------

@app.route('/')
def web_index():
    base_url = request.host_url.rstrip('/')
    return render_template('index.html', base_url=base_url, movies=MOVIES)

@app.route('/screensaver')
def web_screensaver():
    return render_template('screensaver.html')

if __name__ == '__main__':
    print("=" * 60)
    print("  MX Station Player / Media Station X Server")
    print("  Запустите на ТВ в Media Station X -> Settings -> Start Parameter:")
    print("  http://<IP_ЭТОГО_КОМПЬЮТЕРА>:5000/start.json")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
