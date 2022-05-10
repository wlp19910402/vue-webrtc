//用户的请求数据
import API from "@/api/API";
import axios from "@/utils/axios";
//获取用户信息
export const serverGetUserInfo = async () => {
  return await axios.get(API.USER_BASIC_INFO_GET);
};
//修改密码
export const modifyUserPassword = async (options: any) => {
  return await axios.post(API.USER_UPDATE_PASSWORD, options);
};
//获取短信验证码
export const serverGetPhoneCode = async (phone: string) => {
  return await axios.get(API.GET_SMS_CODE + "/" + phone);
};
//获取邮箱验证码
export const serverGetEmailCode = async (options: FormData) => {
  return await axios.post(API.USER_GET_EMAIL_CODE, options);
};
//解绑邮箱
export const serverUnbindEmail = async (
  options: TYPE_USER.UnbindOrBindEmailOptions
) => {
  return await axios.post(API.USER_UNBIND_EMAIL, options);
};
//绑定邮箱
export const serverBindNewEmail = async (
  options: TYPE_USER.UnbindOrBindEmailOptions
) => {
  return await axios.post(API.USER_BIND_EMAIL, options);
};
//解绑手机号
export const serverUnbindPhone = async (
  options: TYPE_USER.UnbindOrBindPhoneOptions
) => {
  return await axios.post(API.USER_UNBIND_PHONE, options);
};
//绑定手机号
export const serverBindNewPhone = async (
  options: TYPE_USER.UnbindOrBindPhoneOptions
) => {
  return await axios.post(API.USER_BIND_PHONE, options);
};
//修改用户信息
export const serverSaveUserInfo = async (options: TYPE_USER.UserBasicType) => {
  return await axios.post(API.USER_BASIC_INFO_UPDATE, options);
};
//修改用户头像
export const serverSaveUserAvatar = async (
  options: TYPE_USER.UserBasicType
) => {
  return await axios.post(API.USER_UPDATE_AVATAR, options);
};

//登录
export const serverLogin = async (options: TYPE_USER.LoginOptions) => {
  return await axios.post(API.USER_LOGIN, options);
};

//获取用户列表
export const serverGetUserAllList = async () => {
  return await axios.post(API.GET_USER_ALL_LIST, {});
};
