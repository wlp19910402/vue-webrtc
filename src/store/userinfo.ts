/**
 * 用户信息的数据
 */
import {
  serverGetUserInfo,
  serverSaveUserInfo,
  serverSaveUserAvatar,
  serverGetUserAllList,
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
    userAllList: [],
    currentCantUser: {},
    chatList: [
      {
        hhxsUserId: 5,
        dataList: [
          {
            nickName: "test_admin",
            hhxsUserId: 5,
            userAvatar:
              "https://vrar-obs-production.obs.cn-north-4.myhuaweicloud.com/ssc-develop/image/5/20210915020350586_王娟.png",
            msgType: "text",
            msgContent: "你好,我是测试de 管理员",
            msgTime: 1652168389579,
          },
          {
            hhxsUserId: 10,
            nickName: "王莉萍王莉萍王莉萍王",
            userAvatar:
              "https://vrar-obs-production.obs.cn-north-4.myhuaweicloud.com/ssc-develop/image/10/303395258359877截屏2022-04-06下午3.18.27.png",
            msgType: "text",
            msgContent:
              "你好,我是测试的wwlp,你好,我是测试的wwlp你好,我是测试的wwlp你好,我是测试的wwlp你好,我是测试的wwlp",
            msgTime: 1652168389579,
          },
          {
            nickName: "test_admin",
            hhxsUserId: 5,
            userAvatar:
              "https://vrar-obs-production.obs.cn-north-4.myhuaweicloud.com/ssc-develop/image/5/20210915020350586_王娟.png",
            msgType: "text",
            msgContent: "你好,我是测试de 管理员",
            msgTime: 1652168389579,
          },
        ],
      },
      {
        hhxsUserId: 10,
        dataList: [
          {
            nickName: "test_admin",
            hhxsUserId: 5,
            userAvatar:
              "https://vrar-obs-production.obs.cn-north-4.myhuaweicloud.com/ssc-develop/image/5/20210915020350586_王娟.png",
            msgType: "text",
            msgContent: "你好,我是测试de 管理员",
            msgTime: 1652168389579,
          },
          {
            hhxsUserId: 10,
            nickName: "王莉萍王莉萍王莉萍王",
            userAvatar:
              "https://vrar-obs-production.obs.cn-north-4.myhuaweicloud.com/ssc-develop/image/10/303395258359877截屏2022-04-06下午3.18.27.png",
            msgType: "text",
            msgContent:
              "你好,我是测试的wwlp,你好,我是测试的wwlp你好,我是测试的wwlp你好,我是测试的wwlp你好,我是测试的wwlp",
            msgTime: 1652168389579,
          },
          {
            nickName: "test_admin",
            hhxsUserId: 5,
            userAvatar:
              "https://vrar-obs-production.obs.cn-north-4.myhuaweicloud.com/ssc-develop/image/5/20210915020350586_王娟.png",
            msgType: "text",
            msgContent: "测试把，开始",
            msgTime: 1652168389579,
          },
        ],
      },
    ],
  }),
  getters: {
    isLogin(state: any) {
      return (
        state.userBasic.hhxsUserId !== undefined &&
        state.userBasic.hhxsUserId !== ""
      );
    },
    currentChat(state: any) {
      const current = state.chatList.find(
        (item: any) => item.hhxsUserId === state.currentCantUser.hhxsUserId
      );
      return current ? current.dataList : [];
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
      this.userAllList = [];
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
    // 获取用户列表
    getUserAllList(options) {
      serverGetUserAllList().then((res) => {
        if (res.data && res.data.code === 200) {
          this.userAllList = res.data.data;
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
