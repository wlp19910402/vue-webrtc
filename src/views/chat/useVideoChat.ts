import createStoreUserInfo from "@/store/userinfo";
let useUserInfo: any = createStoreUserInfo();
let navigator_dev: any = navigator;
const iceServer = {
  iceServers: [
    { urls: ["stun:114.116.230.100:8879"] },
    {
      username: "sl",
      credential: "sl@hhxs.com",
      urls: ["turn:114.116.230.100:8879"],
    },
  ],
};
/**
 *
 * @param localVideoElm 用户的视频
 * @param obj 参数
 * @param ws websocket
 */
export default function useVideo(localVideoElm: any, obj: any, ws: any) {
  let localStream: any = null;
  // 通过信令服务器将ICE候选地址传递给对方
  const trunCandidate = (userId: any, chatId: any) => {
    //当需要你通过信令服务器将一个ICE候选发送给另一个对等端时，本地ICE层将会调用你的 icecandidate 事件处理程序。有关更多信息，请参阅Sending ICE candidates 以查看此示例的代码。
    obj.pc[chatId].onicecandidate = ({ candidate }: any) => {
      ws.send(
        JSON.stringify({
          cmd: 4,
          sendType: 0,
          userId: userId,
          chatId: chatId,
          message: {
            candidate: candidate,
          },
        })
      );
    };
  };

  //封装一部分函数
  function getUserMedia(constrains: any, success: any, error: any) {
    if (navigator_dev.mediaDevices.getUserMedia) {
      //最新标准API
      navigator_dev.mediaDevices
        .getUserMedia(constrains)
        .then(success)
        .catch(error);
    } else if (navigator_dev.webkitGetUserMedia) {
      //webkit内核浏览器
      navigator_dev.webkitGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator_dev.mozGetUserMedia) {
      //Firefox浏览器
      navigator_dev.mozGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator_dev.getUserMedia) {
      //旧版API
      navigator_dev.getUserMedia(constrains).then(success).catch(error);
    }
  }

  function canGetUserMediaUse() {
    return !!(
      navigator_dev.mediaDevices.getUserMedia ||
      navigator_dev.webkitGetUserMedia ||
      navigator_dev.mozGetUserMedia ||
      navigator_dev.msGetUserMedia
    );
  }
  // 打开摄像头通话
  function openInitCamera({ parterName, isCreateOffer }: any) {
    if (canGetUserMediaUse()) {
      getUserMedia(
        {
          video: true,
          audio: true,
        },
        (stream: any) => {
          localStream = stream;
          localVideoElm.value.srcObject = stream;
          StartCall({
            parterName,
            isCreateOffer,
          });
          obj.isOpenCamera = true;
          obj.zoomCameraStatus = isCreateOffer ? 1 : 2;
          if (!isCreateOffer) {
            //把发送者(offer)的描述，存储在接收者的remoteDesc中。
            let desc = new RTCSessionDescription(
              obj.offerMessage.message.description
            );
            //按1-13流程走的
            obj.pc[obj.offerMessage.userId]
              .setRemoteDescription(desc)
              .then(() => {
                obj.pc[obj.offerMessage.userId]
                  .createAnswer()
                  .then((answer: any) => {
                    return obj.pc[obj.offerMessage.userId].setLocalDescription(
                      answer
                    );
                  })
                  .then(() => {
                    trunCandidate(
                      obj.offerMessage.chatId,
                      obj.offerMessage.userId
                    );
                    // 把发起者的描述信息通过Signal Server发送到接收者
                    ws.send(
                      JSON.stringify({
                        cmd: 3,
                        sendType: 0,
                        userId: obj.offerMessage.chatId,
                        chatId: obj.offerMessage.userId,
                        message: {
                          description:
                            obj.pc[obj.offerMessage.userId].localDescription,
                        },
                      })
                    );
                  })
                  .catch();
              });
          }
        },
        (err: any) => {
          console.log("访问用户媒体失败: ", err.name, err.message);
        }
      );
    } else {
      alert("您的浏览器不兼容");
    }
  }

  // 申请连接
  function StartCall({ parterName, isCreateOffer }: any) {
    obj.pc[parterName] = new RTCPeerConnection(iceServer);
    //如果已经有本地流，那么直接获取Tracks并调用addTrack添加到RTC对象中。
    if (localStream) {
      localStream.getTracks().forEach((track: any) => {
        obj.pc[parterName].addTrack(track, localStream); //should trigger negotiationneeded event
      });
    } else {
      //否则需要重新启动摄像头并获取
      openInitCamera({ parterName, isCreateOffer });
    }
    //如果是呼叫方,那么需要createOffer请求
    if (isCreateOffer) {
      obj.offerMessage = {
        userId: useUserInfo.currentCantUser.hhxsUserId.toString(),
        chatId: useUserInfo.userBasic.hhxsUserId,
      };
      let msg = {
        userAvatar: useUserInfo.userBasic.userAvatar,
        hhxsUserId: useUserInfo.userBasic.hhxsUserId,
        nickName: useUserInfo.userBasic.nickName,
        msgTime: new Date().getTime(),
        msgType: "video",
        msgContent: "",
      };
      //每当WebRTC基础结构需要你重新启动会话协商过程时，都会调用此函数。它的工作是创建和发送一个请求，给被叫方，要求它与我们联系。
      obj.pc[parterName].onnegotiationneeded = () => {
        //https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection/createOffer
        obj.pc[parterName]
          .createOffer()
          .then((offer: any) => {
            return obj.pc[parterName].setLocalDescription(offer);
          })
          .then(() => {
            //把发起者的描述信息通过Signal Server发送到接收者
            ws.send(
              JSON.stringify({
                cmd: 3,
                sendType: 0,
                userId: useUserInfo.userBasic.hhxsUserId,
                chatId: useUserInfo.currentCantUser.hhxsUserId.toString(),
                message: {
                  description: obj.pc[parterName].localDescription,
                  ...msg,
                },
              })
            );
          });
      };
    }
    //当向连接中添加磁道时，track 事件的此处理程序由本地WebRTC层调用。例如，可以将传入媒体连接到元素以显示它。详见 Receiving new streams 。
    obj.pc[parterName].ontrack = (ev: any) => {
      let str: any = ev.streams[0];
      const curNameParter: any = obj.answerVideo.find(
        (item: any) => item.userId === parterName
      );
      if (curNameParter) {
        curNameParter.video = str;
      } else {
        obj.zoomCameraStatus = 2;
        obj.answerVideo.push({ userId: parterName, video: str });
      }
    };
  }
  // 视频或语音同意连接
  const connectOffer = () => {
    openInitCamera({ parterName: obj.sendId, isCreateOffer: false });
  };
  // 视频被拒绝
  const connectOfferColse = () => {
    obj.isOpenCamera = false;
    obj.zoomCameraStatus = 0;
    ws.send(
      JSON.stringify({
        cmd: 5,
        sendType: 0,
        userId: obj.offerMessage.chatId,
        chatId: obj.offerMessage.userId,
        message: "",
      })
    );
  };
  // 视频挂断或请求视频挂断
  const connectHangUp = () => {
    obj.answerVideo = [];
    localVideoElm.value.srcObject = null;
    // 告诉对方已经挂断了
    connectOfferColse();
    localStream.getTracks().forEach((track: any) => {
      track.stop();
    });
  };
  // 对方申请挂断或拒绝接听
  const cameraHangUp = (hangUpId: any) => {
    obj.answerVideo = obj.answerVideo.filter(
      (item: any) => item.userId != hangUpId
    );
    if (obj.answerVideo.length == 0) {
      if (localStream) {
        localStream.getTracks().forEach((track: any) => {
          track.stop();
        });
      }
      localVideoElm.value.srcObject = null;
      obj.isOpenCamera = false;
      obj.zoomCameraStatus = 0;
    }
  };
  return {
    openInitCamera,
    connectOfferColse,
    connectOffer,
    connectHangUp,
    trunCandidate,
    cameraHangUp,
  };
}
