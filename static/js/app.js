// Dynamic TV Clock
function updateClock() {
    const clockEl = document.getElementById('clockDisplay');
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Copy URL on click
const tvUrl = document.getElementById('tvUrl');
if (tvUrl) {
    tvUrl.addEventListener('click', () => {
        navigator.clipboard.writeText(tvUrl.textContent.trim()).then(() => {
            const original = tvUrl.textContent;
            tvUrl.textContent = "Скопировано!";
            setTimeout(() => {
                tvUrl.textContent = original;
            }, 1800);
        });
    });
}

// Category Navigation in TV Simulator
const menuButtons = document.querySelectorAll('.menu-item');
const categoryTitle = document.getElementById('currentCategoryTitle');
const contentGrid = document.getElementById('contentGrid');

const CATEGORIES_DATA = {
    home: {
        title: "Главная — Рекомендации и Новинки",
        endpoint: "/content/home.json"
    },
    movies: {
        title: "Каталог Фильмов 4K HDR",
        endpoint: "/content/movies.json"
    },
    series: {
        title: "Популярные Сериалы",
        endpoint: "/content/series.json"
    },
    tv: {
        title: "Прямой Эфир — ТВ Каналы HD",
        endpoint: "/content/tv.json"
    },
    music: {
        title: "Музыка и Онлайн Радио 24/7",
        endpoint: "/content/music.json"
    },
    screensaver: {
        title: "Заставки, Релакс и Живые Обои",
        endpoint: "/content/screensaver.json"
    },
    info: {
        title: "Информация о Сервере",
        endpoint: "/content/info.json"
    }
};

menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        menuButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const catKey = btn.getAttribute('data-category');
        const catInfo = CATEGORIES_DATA[catKey];
        if (!catInfo) return;

        categoryTitle.textContent = catInfo.title;

        // Fetch corresponding MSX json from API and update TV stage
        fetch(catInfo.endpoint)
            .then(res => res.json())
            .then(data => {
                renderCards(data.items || []);
            })
            .catch(err => {
                console.error("Error loading category:", err);
            });
    });
});

function renderCards(items) {
    contentGrid.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'tv-card';
        card.tabIndex = 0;

        const imgUrl = item.image || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600";
        const badgeHtml = item.badge ? `<span class="card-badge">${item.badge}</span>` : '';

        card.innerHTML = `
            <div class="card-image-wrap">
                <img src="${imgUrl}" alt="${item.title || ''}" class="card-img" loading="lazy">
                ${badgeHtml}
                <div class="play-overlay">
                    <span class="material-icons play-btn">play_arrow</span>
                </div>
            </div>
            <div class="card-info">
                <div class="card-sub">${item.titleHeader || ''}</div>
                <div class="card-title">${item.title || ''}</div>
                <div class="card-meta">${item.titleFooter || ''}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            if (item.action) {
                if (item.action.startsWith('slideshow:')) {
                    window.open('/screensaver', '_blank');
                } else if (item.action.startsWith('video:')) {
                    const videoUrl = item.action.replace('video:', '');
                    window.open(videoUrl, '_blank');
                } else if (item.action.startsWith('audio:')) {
                    const audioUrl = item.action.replace('audio:', '');
                    window.open(audioUrl, '_blank');
                } else if (item.action.startsWith('info:')) {
                    alert(item.action.replace('info:', ''));
                }
            }
        });

        contentGrid.appendChild(card);
    });
}
