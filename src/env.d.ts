/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 申明进度条依赖模块
declare module "nprogress";

/**
 * 环境变量智能提示配置
 *
 * @param VITE_APP_PORT 端口
 *
 * @param VITE_APP_BASE_URL 请求接口url Base
 *
 * @param VITE_APP_WS_NOTIFICATION_URL 通知信息的接口路径
 *
 * @param  VITE_APP_PATH 页面地址
 *
 * @param  VITE_APP_PORTAL_EDITOR_URL 编辑器的iframe的地址
 *
 */
interface ImportMetaEnv {
  VITE_APP_PORT: string;
  VITE_APP_BASE_URL: string;
  VITE_APP_ROUTER_BASE_URL: string;
  VITE_APP_WS_NOTIFICATION_URL: string;
  VITE_APP_PORTAL_EDITOR_URL: string;
  VITE_APP_PATH: string;
  VITE_APP_PATH_PLAZA_URL: string;
}
