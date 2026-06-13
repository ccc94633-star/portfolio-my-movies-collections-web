<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { initialMovies } from '../data/initialMovies.js'

const route = useRoute()

const categoryTypes = {
    action: '動作片',
    drama: '劇情片',
    animation: '動畫片',
    sciFi: '科幻片',
    comedy: '喜劇片',
    other: '其他',
}

const movie = computed(() => {
    const fallbackMovie = initialMovies[Number(route.params.id)] || {}

    return {
        title: route.query.title || fallbackMovie.title || '電影詳情',
        imageUrl: route.query.imageUrl || fallbackMovie.imageUrl || 'no-image.svg',
        shortDesc: route.query.shortDesc || fallbackMovie.shortDesc || '目前尚無劇情介紹。',
        category: route.query.category || fallbackMovie.category || 'other',
        rating: Number(route.query.rating ?? fallbackMovie.rating ?? 0),
    }
})

const recommendations = computed(() => {
    const otherMovies = initialMovies.filter(item => item.title !== movie.value.title)
    const sameCategory = otherMovies.filter(item => item.category === movie.value.category)
    const remainingMovies = otherMovies.filter(item => item.category !== movie.value.category)

    return [...sameCategory, ...remainingMovies].slice(0, 5)
})

const movieLocation = (item) => ({
    name: 'movie-detail',
    params: { id: initialMovies.indexOf(item) },
    query: {
        title: item.title,
        imageUrl: item.imageUrl,
        shortDesc: item.shortDesc,
        category: item.category,
        rating: item.rating,
    },
})
</script>

<template>
    <main class="movie-detail-page">
        <section class="detail-hero">
            <div class="detail-poster">
                <img
                    :src="movie.imageUrl"
                    :alt="`${movie.title} 電影海報`"
                    @error="$event.target.src = 'no-image.svg'"
                >
            </div>

            <div class="detail-content">
                <span class="detail-category">
                    {{ categoryTypes[movie.category] || categoryTypes.other }}
                </span>
                <h1>{{ movie.title }}</h1>

                <div class="detail-stars" :aria-label="`${movie.rating} 顆星`">
                    <i
                        v-for="i in 5"
                        :key="i"
                        :class="movie.rating >= i ? 'fa-solid fa-star' : 'fa-regular fa-star'"
                    ></i>
                </div>

                <h2>劇情介紹</h2>
                <p>{{ movie.shortDesc }}</p>
            </div>
        </section>

        <section class="recommendations">
            <h2>你可能感興趣的電影</h2>

            <div class="recommendation-row">
                <RouterLink
                    v-for="item in recommendations"
                    :key="item.title"
                    class="recommendation-card"
                    :to="movieLocation(item)"
                >
                    <img
                        :src="item.imageUrl || 'no-image.svg'"
                        :alt="`${item.title} 電影海報`"
                        @error="$event.target.src = 'no-image.svg'"
                    >
                    <div class="recommendation-info">
                        <strong>{{ item.title }}</strong>
                        <span>{{ categoryTypes[item.category] || categoryTypes.other }}</span>
                    </div>
                </RouterLink>
            </div>

            <div class="back-link-wrap">
                <RouterLink class="back-link" to="/">
                    <i class="fa-solid fa-arrow-left"></i>
                    返回電影收藏
                </RouterLink>
            </div>
        </section>
    </main>
</template>

<style scoped>
.movie-detail-page {
    display: grid;
    gap: 28px;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    width: fit-content;
    color: #fff;
    font-size: 0.82rem;
    font-weight: 700;
    text-decoration: none;
}

.back-link-wrap {
    display: flex;
    justify-content: center;
    margin-top: 28px;
}

.back-link:hover {
    color: var(--red);
}

.detail-hero {
    display: grid;
    grid-template-columns: minmax(220px, 340px) 1fr;
    gap: 42px;
    align-items: center;
    padding: 34px;
}

.detail-poster {
    overflow: hidden;
    aspect-ratio: 2 / 3;
    border-radius: var(--radius);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
}

.detail-poster img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.detail-content {
    min-width: 0;
}

.detail-category {
    display: inline-block;
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    background: var(--red);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
}

.detail-content h1 {
    margin: 14px 0 10px;
    padding: 0;
    border: 0;
    background: none;
    color: #fff;
    font-size: clamp(2rem, 5vw, 4.5rem);
    line-height: 1.05;
    text-align: left;
}

.detail-content h1::before {
    content: none;
}

.detail-stars {
    display: flex;
    gap: 5px;
    margin-bottom: 34px;
    color: var(--star);
}

.detail-stars .fa-regular {
    color: var(--text-muted);
}

.detail-content h2,
.recommendations h2 {
    margin-bottom: 14px;
}

.detail-content p {
    margin: 0;
    color: var(--text-sec);
    font-size: 1rem;
    line-height: 1.9;
    white-space: pre-line;
}

.recommendations {
    padding: 26px 28px 30px;
}

.recommendation-row {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 14px;
}

.recommendation-card {
    position: relative;
    overflow: hidden;
    min-height: 230px;
    border-radius: var(--radius);
    background: var(--bg-card);
    color: #fff;
    text-decoration: none;
    transition: transform var(--t-slow), box-shadow var(--t-slow);
}

.recommendation-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
}

.recommendation-card img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 230px;
    object-fit: cover;
}

.recommendation-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent 60%);
}

.recommendation-info {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: grid;
    gap: 4px;
    padding: 14px 12px;
}

.recommendation-info strong {
    overflow: hidden;
    font-size: 0.82rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.recommendation-info span {
    color: var(--text-sec);
    font-size: 0.68rem;
}

@media (max-width: 768px) {
    .detail-hero {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 20px;
    }

    .detail-poster {
        width: min(100%, 360px);
        margin: 0 auto;
    }

    .detail-content h1 {
        font-size: 2rem;
    }

    .detail-stars {
        margin-bottom: 24px;
    }

    .recommendations {
        padding: 22px 20px;
    }

    .recommendation-row {
        display: flex;
        overflow-x: auto;
        padding-bottom: 8px;
        scroll-snap-type: x mandatory;
    }

    .recommendation-card {
        flex: 0 0 155px;
        scroll-snap-align: start;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .recommendation-card img {
        height: auto;
        min-height: 0;
        aspect-ratio: 2 / 3;
    }

    .recommendation-card::after {
        content: none;
    }

    .recommendation-info {
        position: static;
        padding: 12px;
        background: var(--bg-card);
    }
}
</style>
