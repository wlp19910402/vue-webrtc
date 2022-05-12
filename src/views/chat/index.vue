<script setup lang="ts">
import { inject, onMounted, reactive, provide, ref } from "vue";
import { useWebSocket } from "@/utils/websocket";
import createStoreUserInfo from "@/store/userinfo";
import myAside from "./components/myAside.vue";
import myFooter from "./components/myFooter.vue";
import myMain from "./components/myMain.vue";

let navigator_dev: any = navigator;
let useUserInfo: any = createStoreUserInfo();
let hhxsUserId = localStorage.getItem("hhxsUserId")
  ? localStorage.getItem("hhxsUserId")?.toString()
  : "";
useUserInfo.getUserAllList();

// 回调的值 接收新的通知数据，并处理
let localVideoElm: any = ref(null);
const obj: any = reactive({
  pc: [],
  isOpenCamera: false,
  zoomCameraStatus: 0, //0是呼出按钮 1是自己的视频放大，2是回答者的视频放大
  answerVideo: [],
  sendId: "",
  offerMessage: {},
});
const handleMessage = (e: any) => {
  // 新消息插入
  let message = JSON.parse(e.data);
  if (message.cmd === 2 && message.sendType === 0) {
    const currchat = useUserInfo.chatList.find(
      (item: any) => item.hhxsUserId == message.userId
    );
    if (currchat) {
      currchat.dataList.push(message.message);
    } else {
      useUserInfo.chatList = [
        ...useUserInfo.chatList,
        {
          hhxsUserId: message.userId,
          dataList: [message.message],
        },
      ];
    }
  }
  // 如果是ice candidates的协商信息
  if (message.cmd === 4 && message.sendType === 0) {
    if (message.message.candidate) {
      var candidate = new RTCIceCandidate(message.message.candidate);
      //讲对方发来的协商信息保存
      obj.pc[message.userId].addIceCandidate(candidate).catch(); //catch err function empty
    }
  }

  //监听发送的sdp事件
  if (message.cmd === 3 && message.sendType === 0) {
    //如果时offer类型的sdp
    if (message.message.description.type === "offer") {
      //那么被呼叫者需要开启RTC的一套流程，同时不需要createOffer，所以第二个参数为false
      obj.isOpenCamera = true;
      obj.sendId = message.userId;
      obj.offerMessage = message;
    } else if (message.message.description.type === "answer") {
      //如果使应答类消息（那么接收到这个事件的是呼叫者）
      let desc = new RTCSessionDescription(message.message.description);
      obj.pc[message.userId].setRemoteDescription(desc);
      trunCandidate(hhxsUserId, message.userId);
    }
  }
  //监听视频被拒绝
  if (message.cmd === 5 && message.sendType === 0) {
    localStream = null;
    localVideoElm.value.srcObject = null;
    obj.isOpenCamera = false;
    obj.zoomCameraStatus = 0;
  }
};
// 通知
let ws: any = null;
ws = useWebSocket(hhxsUserId, handleMessage);
provide("ws", ws);

// 通话
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
let localStream: any = null;
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
function StartCall({ parterName, isCreateOffer }: any) {
  obj.pc[parterName] = new RTCPeerConnection(iceServer);
  //如果已经有本地流，那么直接获取Tracks并调用addTrack添加到RTC对象中。
  if (localStream) {
    localStream.getTracks().forEach((track: any) => {
      obj.pc[parterName].addTrack(track, localStream); //should trigger negotiationneeded event
    });
  } else {
    //否则需要重新启动摄像头并获取
    InitCamera({ parterName, isCreateOffer });
  }
  //如果是呼叫方,那么需要createOffer请求
  if (isCreateOffer) {
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
              userId: hhxsUserId,
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
function InitCamera({ parterName, isCreateOffer }: any) {
  if (canGetUserMediaUse()) {
    getUserMedia(
      {
        video: true,
        audio: false,
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
const connectOffer = () => {
  InitCamera({ parterName: obj.sendId, isCreateOffer: false });
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
</script>

<template>
  <el-container>
    <el-aside width="350px">
      <my-aside />
    </el-aside>
    <el-container>
      <el-header>
        <span v-if="useUserInfo.currentCantUser.nickName"
          >{{ useUserInfo.currentCantUser.nickName }}(1)
        </span>
      </el-header>
      <el-main>
        <my-main />
      </el-main>
      <el-footer>
        <my-footer :StartCall="InitCamera" />
      </el-footer>
    </el-container>
  </el-container>
  <div
    :class="[
      'qm-video-box',
      obj.isOpenCamera ? 'qm-video-box-active' : '',
      obj.zoomCameraStatus === 1 ? 'qm-video-user-zoom' : '',
    ]"
  >
    <div
      v-if="obj.zoomCameraStatus === 0 && obj.offerMessage.message"
      class="qm-invite-btn-box"
    >
      <el-avatar
        :size="88"
        :src="
          obj.offerMessage.message.userAvatar +
          '?x-image-process=image/resize,w_126,limit_0'
        "
        fit="cover"
      ></el-avatar>
      <div class="mt-9">
        {{ obj.offerMessage.message.nickName }}
      </div>
      <div class="mb-9">来电</div>
      <div
        style="width: 180px"
        class="d-flex align-center justify-space-between pt-12"
      >
        <el-button class="qm-invite-close-btn" @click="connectOfferColse"
          >拒绝</el-button
        >
        <el-button class="qm-invite-btn" @click="connectOffer">接通</el-button>
      </div>
    </div>
    <div
      :class="[
        'qm-video-box',
        obj.zoomCameraStatus === 1 || obj.zoomCameraStatus === 2
          ? 'qm-video-box-active'
          : '',
        obj.zoomCameraStatus === 1 ? 'qm-video-user-zoom' : '',
      ]"
    >
      <video
        @click="obj.zoomCameraStatus = 1"
        class="qm-cur-user-video"
        ref="localVideoElm"
        autoplay
      ></video>
      <div class="qm-answerer-videos-box" id="videos">
        <video
          @click="obj.zoomCameraStatus = 2"
          v-for="item in obj.answerVideo"
          :key="item.userId"
          :srcObject="item.video"
          autoplay
        ></video>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.qm-video-box {
  position: fixed;
  left: 0;
  top: 0;
  background: #222;
  z-index: 3;
  width: 0;
  height: 0;
  overflow: hidden;
  .qm-invite-btn-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 14px;
    color: #bbb;
    .qm-invite-close-btn {
      padding: 10px 20px;
      background: red;
      color: #fff;
      border-radius: 20px;
      border: none;
    }
    .qm-invite-btn {
      padding: 10px 20px;
      background: green;
      color: #fff;
      border-radius: 20px;
      border: none;
    }
  }
  &.qm-video-box-active {
    width: 100%;
    height: 100%;
  }
  &.qm-video-user-zoom {
    .qm-cur-user-video {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
      border: none;
    }
    .qm-answerer-videos-box {
      video {
        width: 200px;
        height: 200px;
        position: absolute;
        left: 30px;
        top: 30px;
        z-index: 1;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: #222;
      }
    }
  }
  .qm-cur-user-video {
    width: 200px;
    height: 200px;
    position: absolute;
    left: 30px;
    top: 30px;
    z-index: 1;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: #222;
  }
  .qm-answerer-videos-box {
    video {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 0;
      position: absolute;
      border: none;
    }
  }
  video {
    // object-fit: contain;
    object-fit: contain;
    margin: 0 auto;
  }
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-footer {
  line-height: 48px;
  height: 48px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  height: 500px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 280px;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
