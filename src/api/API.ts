/**
 * 接口地址
 */

export default {
  //////////////////////////////////////划分老接口  关键标识符 /hhxs-ssc///////////////////////////////////////////////
  //智慧屏的接口
  //频道菜单
  // SCEUE_MENU_CREATE: '/hhxs-ssc/sc/hhxs-ssc/sceue/create',//创建频道管理的菜单
  // SCEUE_MENU_LIST: '/hhxs-ssc/sc/hhxs-ssc/sceue/list',//获取频道管理的菜单列表
  // SCEUE_MENU_DELETE: '/hhxs-ssc/sc/hhxs-ssc/sceue/deleteScSceue',//hhxs-ssc/sc/hhxs-ssc/sceue/deleteScSceue/{id}删除频道管理的列表
  // SCEUE_MENU_EDIT: '/hhxs-ssc/sc/hhxs-ssc/sceue/editScSceue',//编辑频道管理
  // SCEUE_MENU_SORT: '/hhxs-ssc/sc/hhxs-ssc/sceue/sortSceue',//频道菜单排序
  // SCEUE_MENU_BIND_TEMPLATE: '/hhxs-ssc/sc/hhxs-ssc/sceue/setTemplate',//给频道页面绑定模板
  // SCEUE_MENU_UNBIND_TEMPLATE: '/hhxs-ssc/sc/hhxs-ssc/sceue/removeTemplate',//接触频道页面和模板的绑定

  //云盘监控数据
  CLOUD_GET_DISK_USED: "/hhxs-ssc/sc/newFolderInfo/getHhxsUserRecordBucket", //云盘监控数据
  //工作空间
  // WORK_SPACE_CREATE: '/hhxs-ssc/sc/work/create',//新增工作空间
  WORK_SPACE_LIST: "/hhxs-ssc/sc/work/list", //获取所有工作空间
  WORK_SPACE_EDIT: "/hhxs-ssc/sc/work/edit", //编辑工作空间
  WORK_SPACE_DELECT_BY_ID: "/hhxs-ssc/sc/work/delete", //删除工作空间
  // WORK_SPACE_GET_BY_ID: '/hhxs-ssc/sc/work/get',//{hhxsWorkspaceId}获取工作空间的详情
  // WORK_SPACE_SAVE: '/hhxs-ssc/sc/work/save',//存储工作空间
  // WORK_SPACE_COPY: '/hhxs-ssc/sc/work/copy',//{hhxsWorkspaceId}拷贝工作空间
  WORK_SPACE_SORT: "/hhxs-ssc/sc/work/sort", //排序
  WORK_SPACE_VIEW: "/hhxs-ssc/sc/work/viewWorkspace", //预览

  //门户广场
  SWITCH_OPEN_TO_SQUARE: "/hhxs-ssc/sc/work/openToSquare", //将某个作品公开到门户广场
  PORTAL_WORK_LIST: "/hhxs-ssc/sc/work/squareList", //门户广场的数据列表
  //页面模板
  WORK_HOME_PAGE_TEMELATE: "/hhxs-ssc/sc/work/homePage", //获取第一个工作空间的数据,展示在桌面端
  SMART_TEMPLATE_LIST: "/hhxs-ssc/sc/template/list", //获取模板列表的数据
  // SMART_TEMPLATE_CREATE: '/hhxs-ssc/sc/template/save',//创建页面模板
  // SMART_TEMPLATE_EDIT: '/hhxs-ssc/sc/template/edit',//编辑页面模板
  // SMART_TEMPLATE_DELETE: '/hhxs-ssc/sc/template/delete',//hhxs-ssc/sc/template/delete/{id}删除模板
  // SMART_TEMPLATE_COPY: '/hhxs-ssc/sc/template/copy',//{scTemplateId}复制复制模板
  // APP服务端
  APP_INFO_LIST: "/hhxs-ssc/sc/appInfo/list", //获取应用商店列表
  APP_MY_LIST: "/hhxs-ssc/sc/userApp/list", //获取已安装app
  APP_INSTALL: "/hhxs-ssc/sc/userApp/installApp", //安装APP
  APP_REMOVE: "/hhxs-ssc/sc/userApp/removeApp", //卸载APP
  APP_SORT: "/hhxs-ssc/sc/userApp/sortApp", //APP排序
  // 文件上传
  // FILE_UPLOAD: '/hhxs-ssc/sc/fileInfo/upload',//上传
  // FILE_DELETE: '/hhxs-ssc/sc/fileInfo/delete/',//删除
  // FILE_LIST: '/hhxs-ssc/sc/fileInfo/list',//媒体库文件列表
  // FILE_GET_INFO: '/hhxs-ssc/sc/fileInfo/get/appFileInfo',//{appFileInfoId}//根据文件ID获取文件对象
  // 客户端-下拉菜单
  // GET_THEME_LIST: '/hhxs-ssc/sc/theme/list', //获取所有主题列表
  // GET_THEME_UPDATE: '/hhxs-ssc/sc/theme/update', //更新主题列表
  // 用户相关
  GET_SMS_CODE: "/hhxs-ssc/getSmsCode", // 获取短信验证码
  GET_SMS_EMAIL_CODE: "/hhxs-ssc/getEmailCode", //获取邮箱验证码
  // loggin
  USER_LOGIN: "/hhxs-ssc/sc/login/loginByUserName", //用户登录
  USER_LOGIN_PHONE: "/hhxs-ssc/sc/login/loginBySmsCode", //短信登录
  USER_REGISTER: "/hhxs-ssc/sc/login/register", //用户注册
  USER_GETCODE: "/hhxs-ssc/defaultKaptcha", //获取验证码
  USER_RESET_PWD: "/hhxs-ssc/sc/login/reset/password", //重置密码
  USER_LOGIN_USERNAME_OR_EMAIL: "/hhxs-ssc/sc/login/loginByUserNameOrEmail",

  //用户信息修改
  USER_BASIC_INFO_GET: "/hhxs-ssc/sc/user/get/user/info", //获取用户信息
  USER_BASIC_INFO_UPDATE: "/hhxs-ssc/sc/user/update/info", //修改用户基本信息
  USER_UPDATE_AVATAR: "/hhxs-ssc/sc/user/update/avatar", //修改用户头像
  USER_UPDATE_PASSWORD: "/hhxs-ssc/sc/user/resetPassword", //修改密码
  USER_UNBIND_PHONE: "/hhxs-ssc/sc/user/unbindingPhone", //手机号解绑
  USER_BIND_PHONE: "/hhxs-ssc/sc/user/setPhone", //绑定手机号
  USER_UNBIND_EMAIL: "/hhxs-ssc/sc/user/unbindingEmail", //解绑邮箱
  USER_BIND_EMAIL: "/hhxs-ssc/sc/user/setEmail", //解绑邮箱
  USER_GET_EMAIL_CODE: "/hhxs-ssc/sc/user/getEmailCode", //获取邮箱验证码
  GET_USER_ALL_LIST: "/hhxs-ssc/sc/user/list", //获取用户列表
  // 媒体库相关
  // FOLDER_CREATE: '/hhxs-ssc/sc/folder/create', //创建文件夹
  FOLDER_DELETE: "/hhxs-ssc/sc/folder/delete", //删除文件夹
  FOLDER_EDIT: "/hhxs-ssc/sc/folder/edit", //编辑文件夹信息
  FOLDER_LIST: "/hhxs-ssc/sc/folder/list", //获取所有文件夹
  FOLDER_CREATE: "/hhxs-ssc/sc/folder/create", // 创建文件夹

  //白天黑夜模式接口
  GET_DAY_NIGHT_MODE: "/hhxs-ssc/sc/theme/get/active/theme", //获取白天模式
  UPDATE_DAY_NIGHT_MODE: "/hhxs-ssc/sc/theme/update", //修改白天黑夜
  SAVE_DAY_NIGHT_MODE: "/hhxs-ssc/sc/theme/save",

  //桌面的小部件
  DESKTOP_WIDGET_CREATE: "/hhxs-ssc/sc/widget/create", //创建小部件
  DESKTOP_WIDGET_EDIT: "/hhxs-ssc/sc/widget/edit", //编辑小部件
  DESKTOP_WIDGET_LIST: "/hhxs-ssc/sc/widget/list", //查询所有小部件
  CLOUD_GET_FILE_DAY_AND_TOTAL: "/hhxs-ssc/sc/newFileInfo/portalModule", //云盘监控数据

  // 门户广场-个人中心
  HISTORY_LIST: "/hhxs-ssc/sc/work/historyList", // 足迹列表
  DELETE_HISTORY: "/hhxs-ssc/sc/work/deleteHistory", // 清除足迹

  //////////////////////////////////////划分新老接口  关键标识符 /space///////////////////////////////////////////////

  // 第二个新的服务服务接口
  // 门户的新接口
  WORK_PRAISE_OR_COLLECT: "/space/square/praiseCollect/insertPraise", //点赞和收藏
  WORK_FOLLOW_ATTENTION: "/space/square/follow/addOrRelease", //关注 取消 关注
  WORK_WORK_FOLLOW_USER_CHECK: "/space/square/follow/checkFollow", //是否关注作者

  // 门户广场-个人中心
  GET_FOLLOW_LIST: "/space/square/follow/followList", //我的关注列表
  FOLLOW_USER_DETAIL: "/space/square/follow/followUserDetail", //门户用户个人列表
  PRAISE_COLLECT_LIST: "/space/square/praiseCollect/list", // 点赞-收藏--瀑布流
  //消息通知
  MESSAGE_LIST_BY_PAGE: "/space/message/hhxsMessage/pageList", //通知
  MESSAGE_LIST_UPDATE_UNREAD_FLAG:
    "/space/message/hhxsMessage/updateBySerialCode", // 通知已读
};
