// declare global {
//   interface PxhRouter {
//     path: string;
//     class: any;
//   }

//   namespace React {
//     interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
//       // 扩展HTML标签的属性类型
//       // 如果需要使用自定义属性的化需要
//       path?: string | undefined | { [key: string]: any };
//       class: any;
//     }
//   }
// }
declare namespace TYPE_COMMON {
  type Callback = Function;
  type ThemeStatus = "dark" | "light";
  type MsgTipSite = {
    left: string;
    top: string;
    show: boolean;
    text: string;
    type: "success" | "error" | "warning";
  };
  /**
   * StoreCommonState:定义common的state类型
   *
   * overlayLoading: 全局的loading
   *
   * themeStatus: 全局的loading
   *
   * msgTipSite: 提示的位置
   *
   * isShowPreviewCloud: 是否开启了媒体库的预览模式
   *
   * lockScreen: 锁屏
   *
   * keyNotLockScreen:是否有关键内容不能锁屏的
   */
  interface StoreCommonState {
    overlayLoading: boolean;
    themeStatus: ThemeStatus;
    msgTipSite: MsgTipSite;
    isShowPreviewCloud: boolean;
    lockScreen: boolean;
    keyNotLockScreen: any[];
  }

  /**
   * StoreCommonActions:定义common的action类型
   *
   * clear: 清空数据
   *
   * getTheme: 获取主题色
   *
   * setTheme: 设置主题色
   */
  interface StoreCommonActions {
    clear(): void;
    getTheme(options: { callback?: Callback }): void;
    setTheme(options: { data: ThemeStatus; callback?: Callback }): void;
    setMsgTipSite(options: { data: MsgTipSite; event: MouseEvent }): void;
  }
  /**
   * ThemeNameOptions:设置主题色
   *
   * hhxsThemeName: 主题色的颜色切换黑白 'dark'|'light'
   *
   */
  interface ThemeNameOptions {
    hhxsThemeName: ThemeStatus;
  }
}
