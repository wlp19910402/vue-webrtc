import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import router from "@/router";
import { ElMessage } from "element-plus";

// 定义接口
interface PendingType {
  url?: string;
  method?: Method;
  params: any;
  data: any;
  cancel: Function;
}

// 取消重复请求
const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;

// 移除重复请求
// const removePending = (config: AxiosRequestConfig) => {
//   for (const key in pending) {
//     const item: number = +key;
//     const list: PendingType = pending[key];
//     // 当前请求在数组中存在时执行函数体
//     if (
//       list.url === config.url &&
//       list.method === config.method &&
//       JSON.stringify(list.params) === JSON.stringify(config.params) &&
//       JSON.stringify(list.data) === JSON.stringify(config.data)
//     ) {
//       // 执行取消操作
//       list.cancel("操作太频繁，请稍后再试");
//       // 从数组中移除记录
//       pending.splice(item, 1);
//     }
//   }
// };
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  // 超时
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});
// 返回数据进行分析处理
service.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    // removePending(config);
    config.cancelToken = new CancelToken((c) => {
      pending.push({
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
        cancel: c,
      });
    });
    let token = localStorage.getItem("token");
    if (token) {
      config.headers = { ...config.headers, Authorization: token }; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    // removePending(response.config);
    let token = localStorage.getItem("token");
    if (response.data.code == 401 || response.data.code == 4017) {
      if (token) {
        // 登录超时
        localStorage.removeItem("token");

        // router.replace({
        //   path: "/login",
        // });
      }
    } else if (response.data.code == 200 || response.data.code === 4027) {
      //获取工作空间数据，不是当前用户的工作空间会返回4027这个状态码
      return response;
    } else {
      // store.commit('common/setOverlayLoading', false)
      ElMessage({
        message: response.data.msg,
        type: "error",
        duration: 1000,
        customClass: "qm-el-message",
      });
      return Promise.reject(response);
      // return Promise.reject(response)
    }
  },
  (error) => {
    const response = error.response;
    switch (response?.status) {
      case 401:
        // token失效
        break;
      case 403:
        // 没有权限
        break;
      case 500:
        // 服务端错误
        break;
      case 503:
        // 服务端错误
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);
export default service;
