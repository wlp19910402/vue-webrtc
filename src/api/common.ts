//公共元素的请求数据
import API from "@/api/API";
import axios from "@/utils/axios";

//获取主题色
export const serverGetTheme = async () => {
  return await axios.get(API.GET_DAY_NIGHT_MODE);
};
//设置主题色
export const serverSetTheme = async (params: TYPE_COMMON.ThemeNameOptions) => {
  return await axios.post(API.UPDATE_DAY_NIGHT_MODE, params);
};

//通知消息
export const serverGetMessageByPage = async (params: any) => {
  return await axios.post(API.MESSAGE_LIST_BY_PAGE, params);
};

//通知已读未读
export const serverUpdateMessageUnreadFlag = async (params: any) => {
  return await axios.post(API.MESSAGE_LIST_UPDATE_UNREAD_FLAG, params);
};
