/**
 * 公共的数据
 */
import { serverGetTheme, serverSetTheme } from "@/api/common";
import { defineStore } from "pinia";

export default defineStore<
  "common",
  TYPE_COMMON.StoreCommonState,
  {},
  TYPE_COMMON.StoreCommonActions
>({
  id: "common",
  state: () => ({
    overlayLoading: false,
    themeStatus: "light",
    lockScreen: false,
    keyNotLockScreen: [],
    msgTipSite: {
      left: "0px",
      top: "0px",
      text: "",
      show: false,
      type: "warning",
    },
    isShowPreviewCloud: false,
  }),
  actions: {
    // 清空信息
    clear() {
      this.overlayLoading = false;
      this.themeStatus = "light";
      this.msgTipSite = {
        left: "0px",
        top: "0px",
        text: "",
        show: false,
        type: "warning",
      };
    },
    //设置消息提醒的值
    setMsgTipSite(options) {
      this.msgTipSite = {
        ...options.data,
        ...(options.event
          ? { left: options.event.x + "px", top: options.event.y + "px" }
          : {}),
      };
      if (options.data.show) {
        let _this = this;
        setTimeout(() => {
          _this.msgTipSite = {
            left: "0px",
            top: "0px",
            text: "",
            show: false,
            type: "warning",
          };
        }, 500);
      }
    },
    //获取主题色
    getTheme(options) {
      serverGetTheme().then((res) => {
        if (
          res.data.code === 200 &&
          res.data.data &&
          res.data.data.hhxsThemeName
        ) {
          this.themeStatus = res.data.data.hhxsThemeName;
          localStorage.setItem("themeStatus", res.data.data.hhxsThemeName);
          if (options && options.callback) options.callback(res.data);
        }
      });
    },
    //设置主题色
    setTheme(options) {
      serverSetTheme({ hhxsThemeName: options.data }).then((res) => {
        if (res.data.code === 200) {
          this.themeStatus = res.data.data.hhxsThemeName;
          localStorage.setItem("themeStatus", res.data.data.hhxsThemeName);
          if (options && options.callback) options.callback(res.data);
        }
      });
    },
  },
});
