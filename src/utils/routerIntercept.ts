import { Store } from "pinia";
import router from "@/router";
import NProgress from "nprogress";
//路由拦截
import createStoreUserInfo from "@/store/userinfo";
import createStoreCommon from "@/store/common";
export default () => {
  const useStoreCommon: Store<"userinfo", any> = createStoreCommon();
  let useUserInfo: Store<"userinfo", any> = createStoreUserInfo();
  NProgress.configure({
    showSpinner: false,
  });
  router.beforeEach(async (to, from, next) => {
    // 获取url的token
    const token = localStorage.getItem("token");
    // 进度条
    NProgress.start();
    if (!token) {
      //未登录
      // if (to.path !== '/login' && !to.path.startsWith('/manage/finalpage/')) {
      //   //跳转到登录页
      //   return next({
      //     path: '/login',
      //   })
      // } else {
      next();
      // }
    } else {
      //已登录
      if (!useUserInfo.userName) {
        // store.commit('common/setOverlayLoading', true) //loading 开启
        await useUserInfo.getUserBasicInfo(); //获取用户的基本信息
        await useStoreCommon.getTheme(); //获取主题色
        // store.commit('common/setOverlayLoading', false) //loading 关闭
      }
      if (to.path === "/login") {
        //跳转到首页
        return next({
          path: "/",
        });
      }
      next();
    }
    NProgress.done();
  });

  router.afterEach(() => {
    NProgress.done();
  });
};
