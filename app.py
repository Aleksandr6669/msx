import os
import json
import datetime
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

# 4K Wallpapers for each menu section
SECTION_WALLPAPERS = {
    "widgets": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85", # Deep Cosmic Aurora
    "apps": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=85",    # Neon Cyber City
    "settings": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85",# Mountain Sunset
    "info": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=85"     # Night Sky
}

SCREENSAVER_WALLPAPERS = [
    {
        "id": "ss_all",
        "name": "Слайд-шоу всех фото 4K",
        "thumb": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
        "url": None
    },
    {
        "id": "ss_space",
        "name": "Космическая Аврора & Звёзды",
        "thumb": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_cyber",
        "name": "Ночной Киберпанк Город",
        "thumb": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_mountains",
        "name": "Горные Вершины на Закате",
        "thumb": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_ocean",
        "name": "Океанский Прибой & Золотой Пляж",
        "thumb": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_fireplace",
        "name": "Тёплый Огонь Камина",
        "thumb": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_forest",
        "name": "Туманный Хвойный Лес",
        "thumb": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_lake",
        "name": "Осеннее Горное Озеро",
        "thumb": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_nebula",
        "name": "Неоновые Космические Волны",
        "thumb": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_waterfall",
        "name": "Живописный Водопад в Джунглях",
        "thumb": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&auto=format&fit=crop&q=90"
    },
    {
        "id": "ss_city_night",
        "name": "Футуристический Мегаполис в Ночи",
        "thumb": "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=400&auto=format&fit=crop&q=80",
        "url": "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1920&auto=format&fit=crop&q=90"
    }
]

DEFAULT_APPS = [
    {
        "id": "app_lampa",
        "name": "Lampa",
        "url": "http://lampa.mx",
        "sub": "Онлайн-кинотеатр и сериалы",
        "icon": "movie",
        "badge": "CINEMA",
        "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80"
    },
    {
        "id": "app_youtube",
        "name": "YouTube MSX",
        "url": "http://msx.benzac.de/plugins/youtube.html",
        "sub": "Видео, клипы и стримы",
        "icon": "play-circle",
        "badge": "VIDEO",
        "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=80"
    },
    {
        "id": "app_forkplayer",
        "name": "ForkPlayer",
        "url": "http://operats.obovse.ru/2.5/",
        "sub": "Портал онлайн-ТВ и плейлистов",
        "icon": "language",
        "badge": "PORTAL",
        "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
    },
    {
        "id": "app_iptv",
        "name": "IPTV Плеер HD",
        "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "sub": "Телеканалы прямой эфир",
        "icon": "live-tv",
        "badge": "LIVE",
        "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80"
    },
    {
        "id": "app_music",
        "name": "Lo-Fi Chill Radio",
        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "sub": "Круглосуточный релакс-поток",
        "icon": "music-note",
        "badge": "CHILL",
        "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
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
# MEDIA STATION X ENTRYPOINT
# When user enters <domain> into MSX, MSX automatically fetches /msx/start.json.
# This Start Object launches the full HTML5 TV application in fullscreen via link: action!
# ---------------------------------------------------------------------------

@app.route('/msx/start.json')
@app.route('/start.json')
def msx_start():
    base_url = get_base_url()
    return jsonify({
        "name": "Home Portal TV",
        "version": "2.4.0",
        "parameter": f"content:{base_url}/content.json>index:0>execute",
        "background": SECTION_WALLPAPERS["widgets"],
        "logo": f"{base_url}/static/images/logo.svg"
    })

# Content endpoint with auto-execution to immediately launch main screen
@app.route('/content.json')
@app.route('/msx/content.json')
def msx_content():
    base_url = get_base_url()
    return jsonify({
        "type": "pages",
        "headline": "HOME PORTAL TV",
        "background": SECTION_WALLPAPERS["widgets"],
        "color": "msx-glass",
        "start": f"link:{base_url}/",
        "ready": {
            "action": f"link:{base_url}/"
        },
        "pages": [
            {
                "items": [
                    {
                        "id": "portal",
                        "type": "default",
                        "layout": "0,0,12,6",
                        "color": "msx-glass",
                        "icon": "dashboard",
                        "title": "Главный экран Home Portal",
                        "action": f"link:{base_url}/"
                    }
                ]
            }
        ]
    })

# If opened via MSX menu mode
@app.route('/menu.json')
@app.route('/msx/menu.json')
def msx_menu():
    base_url = get_base_url()
    return jsonify({
        "headline": "HOME PORTAL TV",
        "logo": f"{base_url}/static/images/logo.svg",
        "logoSize": "small",
        "background": SECTION_WALLPAPERS["widgets"],
        "color": "msx-glass",
        "start": f"link:{base_url}/",
        "ready": {
            "action": f"link:{base_url}/"
        },
        "menu": [
            {
                "icon": "dashboard",
                "label": "Виджеты",
                "action": f"link:{base_url}/?tab=widgets"
            },
            {
                "icon": "apps",
                "label": "Программы",
                "action": f"link:{base_url}/?tab=apps"
            },
            {
                "icon": "settings",
                "label": "Настройки",
                "action": f"link:{base_url}/?tab=settings"
            },
            {
                "icon": "info",
                "label": "О приложении",
                "action": f"link:{base_url}/?tab=info"
            }
        ]
    })

# Native MSX Slideshow for Settings -> Screensaver
@app.route('/screensaver.json')
@app.route('/msx/screensaver.json')
def msx_screensaver():
    items = []
    for img in SCREENSAVER_WALLPAPERS[1:]:
        items.append({
            "image": img["url"],
            "title": img["name"],
            "duration": 8
        })
    return jsonify({
        "headline": "4K Заставка Home Portal",
        "items": items
    })

# ---------------------------------------------------------------------------
# WEB APPLICATION (SMART TV HTML5 PORTAL)
# ---------------------------------------------------------------------------

@app.route('/')
def web_index():
    base_url = get_base_url()
    return render_template(
        'index.html',
        base_url=base_url,
        wallpapers=SECTION_WALLPAPERS,
        ss_wallpapers=SCREENSAVER_WALLPAPERS,
        default_apps=DEFAULT_APPS
    )

if __name__ == '__main__':
    print("=" * 65)
    print("  Home Portal TV v2.4 — HTML5 Portal for Media Station X")
    print("  В MSX на ТВ введите адрес:")
    print("  <IP_ЭТОГО_КОМПЬЮТЕРА>:5000")
    print("=" * 65)
    app.run(host='0.0.0.0', port=5000, debug=True)
