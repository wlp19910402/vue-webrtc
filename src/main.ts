import { createApp } from "vue";
import App from "@/App.vue";
import { createPinia } from "pinia";
import router from "@/router";
import ElementPlus from "element-plus";
import "@/utils/axios";
import "element-plus/dist/index.css";
import "animate.css/animate.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import routerIntercept from "@/utils/routerIntercept";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount("#app");
// 路由拦截
routerIntercept();
