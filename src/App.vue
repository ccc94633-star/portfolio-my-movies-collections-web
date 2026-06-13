<script setup>
import { ref, computed } from 'vue'
import { initialMovies } from './data/initialMovies.js'

const categoryTypes = {
    action: '動作電影',
    drama: '劇情電影',
    animation: '動畫電影',
    sciFi: '科幻電影',
    comedy: '喜劇電影',
    other: '其他電影',
}

const collection = ref([...initialMovies])
const category = ref('')
const title = ref('')
const imageUrl = ref('')
const shortDesc = ref('')
const rating = ref(0)

const total = computed(() => collection.value.length)

const ratingAvg = computed(() => {
    if (collection.value.length === 0) return 0
    const sum = collection.value.reduce((acc, item) => acc + item.rating, 0)
    return (sum / collection.value.length).toFixed(1)
})

const activeFilter = ref('all')

const filterResults = computed(() => {
    if (activeFilter.value === 'all') return [...collection.value]
    return collection.value.filter(movie => movie.category === activeFilter.value)
})

const query = (categoryType) => {
    activeFilter.value = categoryType
}

const movieDetailLocation = (movie) => ({
    name: 'movie-detail',
    params: { id: collection.value.indexOf(movie) },
    query: {
        title: movie.title,
        imageUrl: movie.imageUrl,
        shortDesc: movie.shortDesc,
        category: movie.category,
        rating: movie.rating,
    },
})

const addCollection = () => {
    collection.value.unshift({
        category: category.value,
        title: title.value,
        imageUrl: imageUrl.value,
        shortDesc: shortDesc.value,
        rating: rating.value,
    })
    title.value = ''
    category.value = ''
    imageUrl.value = ''
    shortDesc.value = ''
    rating.value = 0
}
</script>

<template>
    <template v-if="$route.name !== 'movie-detail'">
    <!-- 頂部兩欄：輸入區 + 統計區 -->
    <div class="top-row">

        <!-- 輸入區 -->
        <section>
            <h2>新增收藏</h2>

            <label for="title" class="form-row">
                <span class="form-label">名稱</span>
                <input type="text" v-model="title" id="title" placeholder="請輸入名稱">
            </label>

            <label for="category" class="form-row">
                <span class="form-label">分類</span>
                <select id="category" v-model="category">
                    <option value="" hidden>請選擇</option>
                    <option v-for="(label, key) in categoryTypes" :key="key" :value="key">{{ label }}</option>
                </select>
            </label>

            <label for="imageUrl" class="form-row">
                <span class="form-label">圖片網址</span>
                <input type="url" v-model="imageUrl" id="imageUrl" placeholder="請輸入圖片網址">
            </label>

            <label for="shortDesc" class="form-row">
                <span class="form-label">簡短介紹</span>
                <textarea id="shortDesc" v-model="shortDesc" placeholder="請輸入簡短介紹..."></textarea>
            </label>

            <div class="form-row">
                <span class="form-label">推薦程度</span>
                <div class="star-row">
                    <button v-for="i in 5" :key="i" type="button" @click="rating = i">
                        <i :class="rating >= i ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                    </button>
                </div>
            </div>

            <button type="button" class="btn-add" @click="addCollection">新增收藏</button>
        </section>

        <!-- 統計資訊 -->
        <section>
            <h2>統計資訊</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">收藏總數</div>
                    <div class="stat-value">{{ total }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">平均推薦</div>
                    <div class="stat-value">{{ ratingAvg }}</div>
                </div>
            </div>
        </section>

    </div><!-- /top-row -->


    <!-- 收藏列表 -->
    <section>
        <h3>收藏列表</h3>

        <nav class="filter-nav">
            <span>分類篩選：</span>
            <ul>
                <li :class="{ active: activeFilter === 'all' }" @click="query('all')">全部</li>
                <li v-for="(value, key) in categoryTypes" :key="key"
                    :class="{ active: activeFilter === key }"
                    @click="query(key)">{{ value }}</li>
            </ul>
        </nav>

        <!-- 無資料提示 -->
        <div v-if="filterResults.length === 0" class="empty-state">
            <i class="fa-solid fa-film"></i>
            <p>目前還沒有任何收藏項目，快來新增你的第一筆收藏吧！</p>
        </div>

        <!-- 卡片列表 -->
        <div v-else class="cards-grid">
            <div v-for="(item, index) in filterResults" :key="index" class="movie-card">

                <div class="card-img-wrap">
                    <img :src="item.imageUrl || 'no-image.svg'" :alt="item.title + '的圖片'"
                        @error="$event.target.src='no-image.svg'">
                </div>

                <div class="card-body">
                    <span class="card-category">{{ categoryTypes[item.category] || '未分類' }}</span>
                    <div class="card-title">{{ item.title }}</div>
                    <div class="card-desc">{{ item.shortDesc }}</div>
                    <div class="card-stars">
                        <i v-for="i in 5" :key="i"
                            :class="item.rating >= i ? 'fa-solid fa-star' : 'fa-regular fa-star'">
                        </i>
                    </div>
                    <RouterLink class="btn-more" :to="movieDetailLocation(item)">
                        查看更多
                    </RouterLink>
                </div>

            </div>
        </div>

    </section>
    </template>

    <RouterView v-else />
</template>

<style>
/* ========================================
   電影收藏館 — Netflix 風格主題
   ======================================== */

:root {
    --bg:          #141414;
    --bg-card:     #2a2a2a;
    --bg-section:  #1c1c1c;
    --bg-input:    #333333;
    --red:         #E50914;
    --red-dark:    #B81D24;
    --red-hover:   #F40612;
    --red-glow:    rgba(229, 9, 20, 0.3);
    --text:        #FFFFFF;
    --text-sec:    #B3B3B3;
    --text-muted:  #737373;
    --star:        #F5C518;
    --border:      rgba(255, 255, 255, 0.12);
    --border-hi:   rgba(255, 255, 255, 0.28);
    --radius:      6px;
    --radius-sm:   4px;
    --radius-pill: 100px;
    --t:           0.2s ease;
    --t-slow:      0.35s ease;
}

*, *::before, *::after { box-sizing: border-box; }

/* ====== BODY ====== */
body {
    margin: 0;
    padding: 0 0 72px;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 15px;
    line-height: 1.6;
}

/* ====== MAIN TITLE ====== */
h1 {
    text-align: center;
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--text);
    margin: 0;
    padding: 38px 16px 34px;
    background: linear-gradient(180deg, #1c1c1c 0%, var(--bg) 100%);
    border-bottom: 3px solid var(--red);
    position: relative;
}

h1::before {
    content: 'N';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--red);
    color: #fff;
    font-size: 0.6em;
    font-weight: 900;
    width: 1.4em;
    height: 1.4em;
    border-radius: 4px;
    vertical-align: middle;
    margin-right: 14px;
    letter-spacing: 0;
    box-shadow: 2px 2px 0 #7a0008;
}

/* ====== APP CONTAINER ====== */
#app {
    max-width: 1220px;
    margin: 0 auto;
    padding: 32px 24px;
}

/* ====== TOP ROW ====== */
.top-row {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 24px;
    align-items: start;
    margin-bottom: 28px;
}

@media (max-width: 768px) {
    .top-row { grid-template-columns: 1fr; }
    #app { padding: 20px 16px; }
}

/* ====== SECTION CARDS ====== */
section {
    background: var(--bg-section);
    border: 1px solid var(--border);
    border-top: 3px solid var(--red);
    border-radius: var(--radius);
    padding: 26px 28px;
}

/* ====== HEADINGS ====== */
h2, h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.06em;
    margin: 0 0 22px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
}

h2::before, h3::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1.1em;
    background: var(--red);
    border-radius: 2px;
    flex-shrink: 0;
}

/* ====== FORM ROWS ====== */
.form-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
}

.form-label {
    min-width: 76px;
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    padding-top: 10px;
    flex-shrink: 0;
    text-transform: uppercase;
    font-weight: 500;
}

/* ====== INPUTS ====== */
input[type="text"],
input[type="url"],
select,
textarea {
    flex: 1;
    min-width: 0;
    width: 100%;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-size: 0.88rem;
    padding: 10px 14px;
    outline: none;
    font-family: inherit;
    transition: border-color var(--t), box-shadow var(--t);
}

input:focus,
select:focus,
textarea:focus {
    border-color: var(--red);
    box-shadow: 0 0 0 2px var(--red-glow);
}

input::placeholder,
textarea::placeholder {
    color: var(--text-muted);
}

select {
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23E50914'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
}

select option { background: var(--bg-card); color: var(--text); }

textarea {
    resize: vertical;
    min-height: 80px;
    line-height: 1.55;
}

/* ====== STAR RATING BUTTONS ====== */
.star-row {
    display: flex;
    gap: 4px;
    padding-top: 4px;
}

.star-row button {
    background: none;
    border: none;
    padding: 4px 5px;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
    transition: transform var(--t);
}

.star-row button:hover { transform: scale(1.3); }
.star-row .fa-solid.fa-star  { color: var(--star); }
.star-row .fa-regular.fa-star { color: var(--text-muted); opacity: 0.4; }

/* ====== ADD BUTTON ====== */
.btn-add {
    width: 100%;
    padding: 12px;
    margin-top: 8px;
    background: var(--red);
    border: none;
    border-radius: var(--radius-sm);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
    font-family: inherit;
    text-transform: uppercase;
    transition: background var(--t), transform var(--t), box-shadow var(--t);
}

.btn-add:hover {
    background: var(--red-hover);
    box-shadow: 0 6px 24px var(--red-glow);
    transform: translateY(-1px);
}

.btn-add:active { transform: scale(0.99); box-shadow: none; }

/* ====== STATS ====== */
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.stat-item {
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 22px 14px;
    text-align: center;
}

.stat-label {
    font-size: 0.65rem;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    margin-bottom: 8px;
    text-transform: uppercase;
    font-weight: 500;
}

.stat-value {
    font-size: 2.6rem;
    font-weight: 900;
    background: linear-gradient(155deg, #D94F4F 0%, #8C1A1A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
}

/* ====== FILTER NAV ====== */
.filter-nav {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 24px;
}

.filter-nav > span {
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 500;
    flex-shrink: 0;
}

.filter-nav ul {
    display: flex;
    list-style: none;
    gap: 8px;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
}

.filter-nav li {
    padding: 6px 18px;
    border-radius: var(--radius-pill);
    cursor: pointer;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-sec);
    font-size: 0.78rem;
    font-weight: 500;
    transition: all var(--t);
    user-select: none;
    letter-spacing: 0.04em;
}

.filter-nav li:hover {
    border-color: var(--border-hi);
    color: var(--text);
    background: rgba(255, 255, 255, 0.05);
}

.filter-nav li.active {
    background: var(--red);
    border-color: var(--red);
    color: #fff;
    font-weight: 700;
}

/* ====== CARDS GRID ====== */
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
    gap: 14px;
}

/* ====== MOVIE CARD — Netflix overlay style ====== */
.movie-card {
    position: relative;
    border-radius: var(--radius);
    overflow: hidden;
    height: 282px;
    background: var(--bg-card);
    cursor: pointer;
    transition: transform var(--t-slow), box-shadow var(--t-slow);
}

.movie-card:hover {
    transform: scale(1.06);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
    z-index: 10;
}

.card-img-wrap {
    position: absolute;
    inset: 0;
}

.card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.85);
    transition: filter var(--t-slow), transform var(--t-slow);
}

.movie-card:hover .card-img-wrap img {
    filter: brightness(0.55);
    transform: scale(1.04);
}

.card-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.55) 38%,
        rgba(0, 0, 0, 0.05) 72%,
        transparent 100%
    );
    transition: opacity var(--t-slow);
}

.movie-card:hover .card-img-wrap::after {
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 1)   0%,
        rgba(0, 0, 0, 0.82) 50%,
        rgba(0, 0, 0, 0.35) 100%
    );
}

.card-body {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 14px 12px 12px;
    z-index: 2;
}

.card-category {
    display: inline-block;
    font-size: 0.6rem;
    padding: 2px 9px;
    border-radius: var(--radius-pill);
    background: var(--red);
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
    text-transform: uppercase;
}

.card-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    letter-spacing: 0.02em;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
}

.card-desc {
    font-size: 0.73rem;
    color: var(--text-sec);
    line-height: 1.5;
    margin: 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.25s ease 0.05s, transform 0.25s ease 0.05s;
}

.card-stars {
    font-size: 0.8rem;
    margin-bottom: 8px;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.25s ease 0.1s, transform 0.25s ease 0.1s;
}

.btn-more {
    display: block;
    width: 100%;
    padding: 7px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.38);
    border-radius: var(--radius-sm);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.25s ease 0.15s;
    backdrop-filter: blur(4px);
}

.movie-card:hover .card-desc,
.movie-card:hover .card-stars,
.movie-card:hover .btn-more {
    opacity: 1;
    transform: translateY(0);
}

.btn-more:hover {
    background: rgba(255, 255, 255, 0.26);
    border-color: rgba(255, 255, 255, 0.65);
}

.card-stars .fa-solid  { color: var(--star); }
.card-stars .fa-regular { color: var(--text-muted); opacity: 0.35; }

@media (max-width: 768px) {
    .movie-card {
        display: flex;
        flex-direction: column;
        height: auto;
        min-height: 0;
        cursor: default;
    }

    .movie-card:hover {
        transform: none;
        box-shadow: none;
        z-index: auto;
    }

    .card-img-wrap {
        position: relative;
        inset: auto;
        aspect-ratio: 2 / 3;
        flex: none;
    }

    .card-img-wrap img,
    .movie-card:hover .card-img-wrap img {
        filter: none;
        transform: none;
    }

    .card-img-wrap::after,
    .movie-card:hover .card-img-wrap::after {
        content: none;
    }

    .card-body {
        position: static;
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 14px 12px 12px;
        background: var(--bg-card);
    }

    .card-title {
        text-shadow: none;
    }

    .card-desc,
    .card-stars,
    .btn-more {
        opacity: 1;
        transform: translateY(0);
        text-shadow: none;
    }

    .btn-more {
        margin-top: auto;
        backdrop-filter: none;
    }
}

/* ====== EMPTY STATE ====== */
.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-state i {
    font-size: 3rem;
    color: var(--text-muted);
    display: block;
    margin-bottom: 16px;
}

.empty-state p {
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    color: var(--text-sec);
}
</style>
