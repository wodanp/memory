import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    { path: '/menu', component: () => import('@/views/memory/Menu.vue') },
    { path: '/', component: () => import('@/views/memory/Classic.vue') },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
