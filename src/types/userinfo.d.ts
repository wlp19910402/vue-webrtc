declare namespace TYPE_USER {
  type HhxsUserDetail = {};
  /**
   * UserBasicType:定义用户的基本信息类型
   *
   * userName: 用户名
   *
   * nickName: 别名
   *
   * userAvatar: 头像
   *
   * userPhone: 用户手机号
   *
   * userEmail:用户邮箱
   *
   * userSignature:用户签名
   *
   * hhxsUserDetail:更多信息
   */
  type UserBasicType = {
    hhxsUserId?: string | number;
    userName?: string;
    nickName?: string;
    userAvatar?: string;
    userPhone?: string;
    userEmail?: string;
    userSignature?: string;
    userQq?: string;
    userSinablog?: string;
    userWechat?: string;
    hhxsUserDetail?: HhxsUserDetail;
  };
  /**
   *  StoreUserinfoState:定义user的state类型
   */
  interface StoreUserinfoState {
    userBasic: UserBasicType;
    userAllList: UserBasicType[];
    currentCantUser: UserBasicType;
    chatList: any[];
  }
  /**
   * StoreUserinfoGetters:定义getters类型
   *
   * isLogin: 是否登录
   *
   */
  interface StoreUserinfoGetters {
    isLogin(params: any): boolean;
  }
  /**
   * StoreUserinfoActions:定义userinfo的action类型
   *
   * clear: 清除用户信息
   *
   * getUserBasicInfo: 获取用户的基本信息
   *
   * updateUserBasicInfo: 修改用户信息
   *
   * updateUserAvatar： 修改用户头像
   */
  interface StoreUserinfoActions {
    clear(): void;
    getUserBasicInfo(options: { callback?: TYPE_COMMON.Callback }): void;
    getUserAllList(options: { callback?: TYPE_COMMON.Callback }): void;
    updateUserBasicInfo(options: {
      data: UserBasicType;
      callback?: TYPE_COMMON.Callback;
    }): void;
    updateUserAvatar(options: {
      data: UserBasicType;
      callback?: TYPE_COMMON.Callback;
    }): void;
  }
  /**
   * UnbindOrBindEmailOptions:邮箱解绑的参数或邮箱绑定的参数
   *
   * userEmail: 邮箱账号
   *
   * kaptchaCode: 邮箱验证码
   *
   */
  interface UnbindOrBindEmailOptions {
    userEmail: string;
    kaptchaCode: string;
  }
  /**
   * UnbindOrBindPhoneOptions:邮箱解绑的参数或邮箱绑定的参数
   *
   * userPhone: 手机号
   *
   * kaptchaCode: 邮箱验证码
   *
   */
  interface UnbindOrBindPhoneOptions {
    userPhone: string;
    kaptchaCode: string;
  }
  /**
   * 登录
   */
  interface LoginOptions {
    userPhone: any;
    userPassword: any;
  }
}
