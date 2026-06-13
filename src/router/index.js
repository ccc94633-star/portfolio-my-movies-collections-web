import { createRouter, createWebHistory } from 'vue-router'
import MovieDetail from '../views/MovieDetail.vue'

const HomeRoute = {
  render: () => null,
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeRoute,
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: MovieDetail,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
