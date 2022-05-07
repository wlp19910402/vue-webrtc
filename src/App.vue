<script setup lang="ts">
import {
  watch,
  provide,
  ref,
  onMounted,
  onUnmounted,
  computed,
  nextTick,
  onBeforeUnmount,
} from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
// import createStoreCommon from "@/store/common";
import { useRoute } from "vue-router";
// import BasicMainCmpTransparent from "@/components/common/BasicMainCmpTransparent.vue";

// import { Store } from "pinia";
// import GlobalMenu from "@/components/common/globalMenu.vue";
// import createStoreUserInfo from "@/store/userinfo";
// import { useWebSocket } from "@/utils/websocket";
// import { serverGetMessageByPage } from "@/api/common";
// import useCurrentInstance from '@/utils/useCurrentInstance'
// import { reactive } from "vue";
// import router from "./router";
// let useUserInfo = createStoreUserInfo();
// const useStoreCommon: Store<
//   "common",
//   TYPE_COMMON.StoreCommonState,
//   {},
//   TYPE_COMMON.StoreCommonActions
// > = createStoreCommon();
// provide("useStoreCommon", useStoreCommon);
// const path = ref(import.meta.env.VITE_APP_PATH_PLAZA_URL + "/#");

// 全局刷新
const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
// let isLoginMap = false;
provide("reload", reload);
// 通知
let ws: any = null;
// 回调的值 接收新的通知数据，并处理
// const handleMessage = (e: any) => {
//   // 新消息插入
//   let message = JSON.parse(e.data);
//   if (message.cmd === 1001) {
//     useNotification.messageList = [
//       message,
//       ...useNotification.messageList,
//     ].splice(0, useNotification.currentTotal);
//     useNotification.pageParams.total++;
//   }
// };
// 查看用户id是否有值
// watch(useUserInfo, () => {
//   let hhxsUserId = localStorage.getItem("hhxsUserId");
//   if (isLoginMap !== useUserInfo.isLogin && useUserInfo.isLogin && hhxsUserId) {
//     // 获取通知列表初始化
//     serverGetMessageByPage({
//       hhxsUserId: "10",
//       pageNum: 1,
//       pageSize: 10,
//     }).then((res: any) => {
//       if ((res.data.code = 200)) {
//         useNotification.pageParams = {
//           pageNum: parseInt(res.data.data.pageNum),
//           pageSize: parseInt(res.data.data.pageSize),
//           total: parseInt(res.data.data.total),
//         };
//         useNotification.messageList = res.data.data.list;
//       }
//     });
//     ws = useWebSocket(hhxsUserId, handleMessage);
//     isLoginMap = true;
//   } else if (useUserInfo.isLogin) {
//     isLoginMap = true;
//   } else {
//     ws.close();
//   }
// });
// 根据黑白模式切换样式
// watch(
//   useStoreCommon,
//   (val: any, oldValue: any) => {
//     if (val.themeStatus === "dark") {
//       window.document.documentElement.setAttribute("data-theme", "dark");
//     } else {
//       window.document.documentElement.setAttribute("data-theme", "light");
//     }
//   },
//   { immediate: true }
// );
// 获取屏幕的宽度和高度，全局注入 --start
const screenWidth = ref(document.body.clientWidth);
const screenHeight = ref(document.documentElement.clientHeight);

onMounted(() => {
  window.onresize = () => {
    screenWidth.value = document.body.clientWidth;
    screenHeight.value = document.documentElement.clientHeight;
  };
  // window.onbeforeunload = function (e) {
  //   e = e || window.event;
  //   // 兼容IE8和Firefox 4之前的版本
  //   if (e) {
  //     e.returnValue = "关闭提示";
  //   }
  //   // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
  //   return "关闭提示";
  // };
  // window.HTMLBodyElement
});
onUnmounted(() => {
  window.onresize = null;
});
onBeforeUnmount(() => {
  if (ws) ws.close();
});
provide("screenWidth", screenWidth);
provide("screenHeight", screenHeight);
// 获取屏幕的宽度和高度，全局注入 --end
// 根据计算 获取主内容区域的宽高，根据16:9的比例 全局注入  --start
const mainWidth = computed(() => {
  let screenByHeight = screenHeight.value;
  let screenByWidth = screenWidth.value;
  let withByHeight = (screenByWidth * 9) / 16;
  if (withByHeight > screenByHeight) {
    screenByWidth = (screenByHeight * 16) / 9;
  }
  return screenByWidth;
});
const mainHeight = computed(() => {
  let screenByHeight = screenHeight.value;
  let screenByWidth = screenWidth.value;
  let withByHeight = (screenByWidth * 9) / 16;
  if (withByHeight > screenByHeight) {
    screenByWidth = (screenByHeight * 16) / 9;
  } else {
    screenByHeight = (screenByWidth * 9) / 16;
  }
  return screenByHeight;
});
provide("mainWidth", mainWidth);
provide("mainHeight", mainHeight);
// 根据计算 获取主内容区域的宽高，根据16:9的比例 全局注入  --end

const locale = zhCn; // 定义element的语言

let route = useRoute();
let plazaListScrollShow = ref(false);

watch(
  route,
  () => {
    if (route.path == "/portal/plaza") {
      plazaListScrollShow.value = true;
    } else {
      plazaListScrollShow.value = false;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <el-config-provider :locale="locale">
      <div class="qm-app-bg"></div>
      <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <router-view v-if="isRouterAlive" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" />
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive" />
        </router-view>
      </transition>
    </el-config-provider>
  </div>
</template>

<style lang="scss">
// @import "@/components/common/tooltarIcon.scss";
.app-layer-content {
  transition: all 0.5s;
  height: 0;
  opacity: 0;
  overflow: hidden;
}
.app-layer-show {
  height: 100vh;
  opacity: 1;
}
.qm-app-bg {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
  // &::before {
  //   content: "";
  //   position: absolute;
  //   width: 140vh;
  //   height: 140vh;
  //   border-radius: 50%;
  //   right: -80vh;
  //   top: -30vh;
  //   opacity: 0.6;
  //   filter: blur(10vh);
  //   @include key_value("background-image", "linear_bg_2");
  //   // animation: darkBg 20s linear infinite alternate;
  // }
  // &::after {
  //   content: "";
  //   position: absolute;
  //   width: 80vh;
  //   height: 80vh;
  //   border-radius: 50%;
  //   right: -20vh;
  //   bottom: -14vh;

  //   @include key_value("background-color", "circle_bg");
  // }
  @include key_value("background-image", "linear_bg_1");
}

@keyframes darkBg {
  0% {
    right: -80vh;
    top: -30vh;
    width: 140vh;
    height: 140vh;
    transform: rotate(0deg);
    opacity: 0.6;
  }
  25% {
    right: 30vh;
    top: -40vh;
    width: 80vh;
    height: 80vh;
  }
  50% {
    right: -80vh;
    top: -30vh;
    width: 140vh;
    height: 140vh;
    opacity: 0.8;
  }
  75% {
    right: 30vh;
    top: 40vh;
    width: 80vh;
    height: 80vh;
  }
  100% {
    right: -80vh;
    top: -30vh;
    width: 140vh;
    height: 140vh;
    opacity: 0.6;
    transform: rotate(360deg);
  }
}
</style>
