//路由
import {
  createRouter,
  RouteRecordRaw,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import basicMainLayout from "@/layouts/basicMainLayout.vue";
const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: basicMainLayout,
    children: [
      {
        path: "/",
        name: "desktop",
        component: () => import("@/views/chat/index.vue"),
      },
    ],
  },
];
export default createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_ROUTER_BASE_URL),
  routes: asyncRoutes,
});
