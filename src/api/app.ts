//应用的请求数据
import API from "@/api/API";
import axios from "@/utils/axios";
//获取应用列表
// export const serverGetAppStoreList = async () => {
//   return await axios.get(API.APP_INFO_LIST)
// }
//获取已经安装的应用列表
export const serverGetMyAppList = async () => {
  return await axios.post(API.APP_MY_LIST, { id: 222 });
};
// // 安装app
// export const serverAPPInstall = async (options: TYPE_APP.AppInfoByOptions) => {
//   return await axios.post(API.APP_INSTALL, options)
// }
// 删除app
export const serverAppRemove = async (options: any) => {
  return await axios.post(API.APP_REMOVE, options);
};
//排序app
export const serverAppSort = async (data: any) => {
  return await axios.post(API.APP_SORT, data);
};

//获取云盘的使用情况
export const serverGetCloudDayAndTotal = async (params: any) => {
  return await axios.post(API.CLOUD_GET_FILE_DAY_AND_TOTAL, params);
};
