/**
 * 用户信息的数据
 */
import {
  serverGetUserInfo,
  serverSaveUserInfo,
  serverSaveUserAvatar,
} from "@/api/user";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
export default defineStore<
  "userinfo",
  TYPE_USER.StoreUserinfoState,
  { isLogin(params: any): boolean },
  TYPE_USER.StoreUserinfoActions
>({
  id: "userinfo",
  state: () => ({
    userBasic: {
      hhxsUserId: "",
      userName: "",
      nickName: "",
      userAvatar: "",
      userPhone: "",
      userEmail: "",
      userSignature: "",
      userQq: "",
      userSinablog: "",
      userWechat: "",
      hhxsUserDetail: {},
    },
  }),
  getters: {
    isLogin(state: any) {
      return (
        state.userBasic.hhxsUserId !== undefined &&
        state.userBasic.hhxsUserId !== ""
      );
    },
  },
  actions: {
    // 清空信息
    clear() {
      localStorage.removeItem("hhxsUserId");
      this.userBasic = {
        hhxsUserId: "",
        userName: "",
        nickName: "",
        userAvatar: "",
        userPhone: "",
        userEmail: "",
        userSignature: "",
        userQq: "",
        userSinablog: "",
        userWechat: "",
        hhxsUserDetail: {},
      };
    },
    // 获取用户信息
    getUserBasicInfo(options) {
      serverGetUserInfo().then((res) => {
        if (res.data && res.data.code === 200) {
          let data = res.data.data;
          this.userBasic = {
            ...this.userBasic,
            ...data,
            hhxsUserDetail: {
              ...this.userBasic.hhxsUserDetail,
              ...data.hhxsUserDetail,
            },
          };
          // 将用户的 userId 存在local里面
          this.userBasic.hhxsUserId &&
            localStorage.setItem(
              "hhxsUserId",
              this.userBasic.hhxsUserId.toString()
            );
          if (options && options.callback) options.callback(res.data);
        }
      });
    },
    //修改用户基本信息
    updateUserBasicInfo(options) {
      serverSaveUserInfo(options.data).then((res) => {
        let data = res.data.data;
        this.userBasic = {
          ...this.userBasic,
          ...data,
          hhxsUserDetail: {
            ...this.userBasic.hhxsUserDetail,
            ...data.hhxsUserDetail,
          },
        };
        if (options && options.callback) options.callback(res.data);
        // ElMessage({
        //   message: "修改成功",
        //   type: "success",
        // });
      });
    },
    //修改用户头像
    updateUserAvatar(options) {
      serverSaveUserAvatar(options.data).then((res) => {
        let data = res.data.data;
        this.userBasic = {
          ...this.userBasic,
          ...data,
          hhxsUserDetail: {
            ...this.userBasic.hhxsUserDetail,
            ...data.hhxsUserDetail,
          },
          userAvatar: data.userAvatar,
        };
        ElMessage({
          message: "修改成功",
          type: "success",
          duration: 1000,
          customClass: "qm-el-message",
        });
      });
    },
  },
});
