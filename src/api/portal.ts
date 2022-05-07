//公共元素的请求数据
import API from "@/api/API";
import axios from "@/utils/axios";

//获取获取我的门户数据列表
export const serverGetPortalMyList = async () => {
  return await axios.post(API.WORK_SPACE_LIST, {});
};
//编辑门户的数据
export const serverPostPortalEditWorkSpace = async (options: any) => {
  return await axios.post(API.WORK_SPACE_EDIT, options);
};
//排序我的门户
export const serverPortalMyListSort = async (
  data: TYPE_PORTAL.PortalMyListSortOptions
) => {
  return await axios.post(API.WORK_SPACE_SORT, data);
};
//删除我的某个门户工作空间
export const serverGetPortalDeleteById = async (id: number | string) => {
  return await axios.get(API.WORK_SPACE_DELECT_BY_ID + "/" + id);
};

//获取预览的  template的数据
export const serverGetPortalTemplateInfo = async (data: {
  scTemplateId: string | string[];
}) => {
  return await axios.post(API.SMART_TEMPLATE_LIST, data);
};

// 获取第一个工作空间的数据,展示在桌面端
export const serverGetPortalForFirst = async () => {
  return await axios.get(API.WORK_HOME_PAGE_TEMELATE);
};

// 将某个作品公开或关闭到门户广场
export const serverSwitchPortalOpenToSquare = async (
  // data: TYPE_PORTAL.SwitchPortalOpenToSquareOptions
  data: any
) => {
  let formData = new FormData();
  formData.set("portalVisible", data.portalVisible);
  formData.set("hhxsWorkspaceId", data.hhxsWorkspaceId);

  return await axios.post(API.SWITCH_OPEN_TO_SQUARE, formData);
};

// 获取门户广场的数据
export const serverGetPortalWorkList = async (params: any) => {
  return await axios.post(API.PORTAL_WORK_LIST, params);
};

//点赞收藏
export const serverSavePraiseOrCollect = async (
  params: TYPE_PORTAL.SavePraiseOrCollectOptions
) => {
  return await axios.post(API.WORK_PRAISE_OR_COLLECT, params);
};
// 预览工作空间
export const serverPreviewWorkSpace = async (params: {
  hhxsWorkspaceId: string;
  scTemplateContentIcon: string;
  hhxsWorkspaceName: string;
  scTemplateId: string;
}) => {
  return await axios.post(API.WORK_SPACE_VIEW, params);
};

//关注 关注和取消
export const serverFollowAttention = async (
  params: TYPE_PORTAL.FollowAttentionOptions
) => {
  return await axios.post(API.WORK_FOLLOW_ATTENTION, params);
};
// 是否关注作者
export const serverFollowCheckByUserId = async (params: string) => {
  let formData = new FormData();
  formData.set("hhxsUserId", params);
  return await axios.post(API.WORK_WORK_FOLLOW_USER_CHECK, formData);
};

// 获取关注的用户列表
export const getFollowListServer = async () => {
  return await axios.get(API.GET_FOLLOW_LIST);
};

// 用户广场-个人首页
export const followUserDetailServer = async (data: { followUserId: any }) => {
  let formData = new FormData();
  formData.set("followUserId", data.followUserId);
  return await axios.post(API.FOLLOW_USER_DETAIL, formData);
};

// 获取赞过或收藏的列表
export const praiseCollectList = async (data: any) => {
  return await axios.post(API.PRAISE_COLLECT_LIST, data);
};

// 获取赞过或收藏的列表
export const historyList = async (data: any) => {
  return await axios.post(API.HISTORY_LIST, data);
};

// 清除足迹列表
export const deleteHistoryServer = async (data: any) => {
  let formData = new FormData();
  formData.set("type", data.type);
  return await axios.post(API.DELETE_HISTORY, formData);
};
