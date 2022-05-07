//封装webSocket
// const WS_ADDRESS = import.meta.env.VITE_APP_WS_NOTIFICATION_URL 'ws://10.1.40.24:8808/ws?userId=1'

// const WS_ADDRESS = 'ws://localhost:8000'

// 发送消息记录 userId
function useWebSocket(userId: string, handleMessage: (e: any) => void) {
  let token: any = localStorage.getItem("token");
  const ws = new WebSocket(
    import.meta.env.VITE_APP_WS_NOTIFICATION_URL + "?userId=" + userId
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
        sendType: 0,
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
