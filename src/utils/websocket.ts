//封装webSocket
// const WS_ADDRESS = import.meta.env.VITE_APP_WS_NOTIFICATION_URL 'ws://10.1.40.24:8808/ws?userId=1'

// const WS_ADDRESS = 'ws://localhost:8000'

/**
 * 消息命令 (0:心跳  1:请求离线消息 其他随意)
 */
//  private Integer cmd;
//  /**
//   * 消息发送类型(0：发送个人  1：发送组  2：发送全部)
//   */
//  private Integer sendType;
//  /**
//   * 消息发送者id
//   */
//  private Long userId;
//  /**
//   * 消息接受者id或群聊id
//   */
//  private Long chatId;
//  /**
//   * 消息内容
//   */
//  private T message;
// 发送消息记录 userId
function useWebSocket(userId: string, handleMessage: (e: any) => void) {
  let token: any = localStorage.getItem("token");
  const ws = new WebSocket(
    import.meta.env.VITE_APP_WS_NOTIFICATION_URL + "/?userId=" + userId
  );
  // const ws = new WebSocket(
  //   import.meta.env.VITE_APP_WS_NOTIFICATION_URL + "?userId=" + userId,token
  // );
  const init = () => {
    bindEvent();
  };

  function bindEvent() {
    ws.addEventListener("open", handleOpen, false);
    ws.addEventListener("close", handleClose, false);
    ws.addEventListener("error", handleError, false);
    ws.addEventListener("message", handleMessage, false);
  }
  function wsHeartbeat() {
    ws.send(
      JSON.stringify({
        cmd: 1,
        sendType: 1,
        userId,
        chatId: userId,
        message: "",
      })
    );
  }

  function handleOpen(e: any) {
    // console.log("WebSocket open", e);
    setInterval(wsHeartbeat, 30000);
  }
  function handleClose() {
    // console.log('WebSocket close')
  }
  function handleError(e: any) {
    // console.log('WebSocket error')
  }
  init();

  return ws;
}

export { useWebSocket };
