<script setup lang="ts">
import { inject, onMounted, reactive, provide, ref } from "vue";
import { useWebSocket } from "@/utils/websocket";
import createStoreUserInfo from "@/store/userinfo";
import myAside from "./components/myAside.vue";
import myFooter from "./components/myFooter.vue";
import myMain from "./components/myMain.vue";
// var navigator: any;
let navigator_dev: any = navigator;
let useUserInfo: any = createStoreUserInfo();
let hhxsUserId = localStorage.getItem("hhxsUserId");
useUserInfo.getUserAllList();

// 回调的值 接收新的通知数据，并处理

let localVideoElm: any = ref(null);
const obj: any = reactive({
  pc: [],
  isOpenCamera: false,
  zoomCameraStatus: 1, //1是自己的视频放大，2是回答者的视频放大
  answerVideo: [],
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
      useUserInfo.chatList.push({
        hhxsUserId: message.userId,
        dataList: [message.message],
      });
    }
  }
  // 如果是ice candidates的协商信息

  if (message.cmd === 4 && message.sendType === 0) {
    if (message.message.candidate) {
      var candidate = new RTCIceCandidate(message.message.candidate);
      //讲对方发来的协商信息保存
      console.log(obj.pc, obj.pc[message.userId]);
      obj.pc[message.userId].addIceCandidate(candidate).catch(); //catch err function empty
    }
  }

  //监听发送的sdp事件
  if (message.cmd === 3 && message.sendType === 0) {
    //如果时offer类型的sdp
    if (message.message.description.type === "offer") {
      //那么被呼叫者需要开启RTC的一套流程，同时不需要createOffer，所以第二个参数为false
      StartCall();
      //把发送者(offer)的描述，存储在接收者的remoteDesc中。
      let desc = new RTCSessionDescription(message.message.description);
      //按1-13流程走的
      obj.pc[message.userId].setRemoteDescription(desc).then(() => {
        obj.pc[message.userId]
          .createAnswer()
          .then((answer: any) => {
            return obj.pc[message.userId].setLocalDescription(answer);
          })
          .then(() => {
            //  //把发起者的描述信息通过Signal Server发送到接收者
            //             socket.emit('sdp', {
            //                 type: 'video-offer',
            //                 description: pc[parterName].localDescription,
            //                 to: parterName,
            //                 sender: socket.id
            //             });

            // socket.emit("sdp", {
            //   type: "video-answer",
            //   description: pc[data.sender].localDescription,
            //   to: data.sender,
            //   sender: socket.id,
            // });
            ws.send(
              JSON.stringify({
                cmd: 3,
                sendType: 0,
                userId: message.chatId,
                // chatId: useUserInfo.currentCantUser.hhxsUserId,
                chatId: message.userId,
                message: {
                  description: obj.pc[message.userId].localDescription,
                },
              })
            );
          })
          .catch(); //catch error function empty
      });
    } else if (message.message.description.type === "answer") {
      //如果使应答类消息（那么接收到这个事件的是呼叫者）
      console.log(obj.pc, message.userId, message.chatId);
      console.log("222222222=============");
      let desc = new RTCSessionDescription(message.message.description);
      obj.pc[message.userId].setRemoteDescription(desc);
    }
    // if (message.message.candidate) {
    //   var candidate = new RTCIceCandidate(message.message.candidate);
    //   //讲对方发来的协商信息保存
    //   pc[message.message.sender].addIceCandidate(candidate).catch(); //catch err function empty
    // }
  }
  // socket.on("sdp", (data) => {
  //   //如果时offer类型的sdp
  //   if (data.description.type === "offer") {
  //     //那么被呼叫者需要开启RTC的一套流程，同时不需要createOffer，所以第二个参数为false
  //     StartCall(data.sender, false);
  //     //把发送者(offer)的描述，存储在接收者的remoteDesc中。
  //     let desc = new RTCSessionDescription(data.description);
  //     //按1-13流程走的
  //     pc[data.sender].setRemoteDescription(desc).then(() => {
  //       pc[data.sender]
  //         .createAnswer()
  //         .then((answer) => {
  //           return pc[data.sender].setLocalDescription(answer);
  //         })
  //         .then(() => {
  //           socket.emit("sdp", {
  //             type: "video-answer",
  //             description: pc[data.sender].localDescription,
  //             to: data.sender,
  //             sender: socket.id,
  //           });
  //         })
  //         .catch(); //catch error function empty
  //     });
  //   } else if (data.description.type === "answer") {
  //     //如果使应答类消息（那么接收到这个事件的是呼叫者）
  //     let desc = new RTCSessionDescription(data.description);
  //     pc[data.sender].setRemoteDescription(desc);
  //   }
  // });
  //
  //如果是ice candidates的协商信息
  // socket.on('ice candidates', (data) => {
  //               console.log('ice candidate: ' + data.candidate);
  //               //{ candidate: candidate, to: partnerName, sender: socketID }
  //               //如果ice candidate非空（当candidate为空时，那么本次协商流程到此结束了）
  //               if (data.candidate) {
  //                   var candidate = new RTCIceCandidate(data.candidate);
  //                   //讲对方发来的协商信息保存
  //                   pc[data.sender].addIceCandidate(candidate).catch();//catch err function empty
  //               }
  //           })
};
// 通知
let ws: any = null;
ws = useWebSocket(hhxsUserId, handleMessage);
provide("ws", ws);

// 通话

//STUN,TURN服务器配置参数
// const iceServer = {
//   iceServers: [
//     { urls: ["stun:ss-turn1.xirsys.com"] },
//     {
//       username:
//         "CEqIDkX5f51sbm7-pXxJVXePoMk_WB7w2J5eu0Bd00YpiONHlLHrwSb7hRMDDrqGAAAAAF_OT9V0dWR1d2Vi",
//       credential: "446118be-38a4-11eb-9ece-0242ac140004",
//       urls: [
//         "turn:ss-turn1.xirsys.com:80?transport=udp",
//         "turn:ss-turn1.xirsys.com:3478?transport=udp",
//       ],
//     },
//   ],
// };

// websocket测试地址："wss://testxr.piesat.cn/wss?userId={userId}"
// webRTC 打洞服务器测试地址：
// turn地址："turn:114.116.230.100:8879"
// username："sl"
// password："sl@hhxs.com"
// stun地址："stun:114.116.230.100:8879"

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

// function StartCall(userId: string, isOffer: boolean) {
//   InitCamera();

// }
function StartCall() {
  const parterName: any = useUserInfo.currentCantUser.hhxsUserId;
  const createOffer = true;
  obj.pc[parterName] = new RTCPeerConnection(iceServer);
  //如果已经有本地流，那么直接获取Tracks并调用addTrack添加到RTC对象中。
  if (localStream) {
    localStream.getTracks().forEach((track: any) => {
      obj.pc[parterName].addTrack(track, localStream); //should trigger negotiationneeded event
    });
  } else {
    //否则需要重新启动摄像头并获取
    if (canGetUserMediaUse()) {
      getUserMedia(
        {
          video: true,
          audio: true,
        },
        function (stream: any) {
          localStream = stream;

          localVideoElm.value.srcObject = stream;
          localVideoElm.value.width = 800;
        },
        function (error: any) {
          console.log("访问用户媒体设备失败：", error.name, error.message);
        }
      );
    } else {
      alert("您的浏览器不兼容");
    }
  }
  //如果是呼叫方,那么需要createOffer请求
  if (createOffer) {
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
          // socket.emit("sdp", {
          //   type: "video-offer",
          //   description: obj.pc[parterName].localDescription,
          //   to: parterName,
          //   sender: useUserInfo.userBasic.hhxsUserId,
          // });
          ws.send(
            JSON.stringify({
              cmd: 3,
              sendType: 0,
              userId: hhxsUserId,
              chatId: useUserInfo.currentCantUser.hhxsUserId,
              message: {
                description: obj.pc[parterName].localDescription,
              },
            })
          );
        });
    };
  }

  //当需要你通过信令服务器将一个ICE候选发送给另一个对等端时，本地ICE层将会调用你的 icecandidate 事件处理程序。有关更多信息，请参阅Sending ICE candidates 以查看此示例的代码。
  obj.pc[parterName].onicecandidate = ({ candidate }: any) => {
    console.log("candidate", candidate);
    // socket.emit("ice candidates", {
    //   candidate: candidate,
    //   to: parterName,
    //   sender: useUserInfo.userBasic.hhxsUserId,
    // });
    ws.send(
      JSON.stringify({
        cmd: 4,
        sendType: 0,
        userId: hhxsUserId,
        chatId: useUserInfo.currentCantUser.hhxsUserId,
        message: {
          candidate: candidate,
        },
      })
    );
  };
  console.log("2222");
  //当向连接中添加磁道时，track 事件的此处理程序由本地WebRTC层调用。例如，可以将传入媒体连接到元素以显示它。详见 Receiving new streams 。
  obj.pc[parterName].ontrack = (ev: any) => {
    console.log(ev);
    let str: any = ev.streams[0];
    const curNameParter: any = obj.answerVideo.find(
      (item: any) => item.userId === parterName
    );
    if (curNameParter) {
      // let parterName_video: any = document.getElementById(
      //   `${parterName}-video`
      // );
      // parterName_video.srcObject = str;
      curNameParter.video = str;

      console.log(obj.answerVideo);
      console.log("============");
    } else {
      obj.zoomCameraStatus = 2;
      obj.answerVideo.push({ userId: parterName, video: str });
      // console.log(obj.answerVideo);
      // newVideo.autoplay = true;
      // newVideo.controls = true;
      // //newVideo.className = 'remote-video';
      // newVideo.srcObject = str;
      // obj.zoomCameraStatus = 2;
      // let videosId: any = document.getElementById("videos");
      // videosId.appendChild(newVideo);
    }
  };

  // obj.pc[parterName].ontrack = (ev: any) => {
  //   console.log(ev);
  //   let str: any = ev.streams[0];

  //   if (document.getElementById(`${parterName}-video`)) {
  //     let parterName_video: any = document.getElementById(
  //       `${parterName}-video`
  //     );
  //     parterName_video.srcObject = str;
  //   } else {
  //     obj.zoomCameraStatus = 2;
  //     obj.answerVideo.push({ userId: parterName, video: str });

  //     let newVideo: any = document.createElement("video");
  //     newVideo.id = `${parterName}-video`;
  //     newVideo.autoplay = true;
  //     newVideo.controls = true;
  //     //newVideo.className = 'remote-video';
  //     newVideo.srcObject = str;
  //     obj.zoomCameraStatus = 2;
  //     obj.answerVideo.push(str);
  //     let videosId: any = document.getElementById("videos");
  //     videosId.appendChild(newVideo);
  //   }
  // };
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
let localStream: any = null;

// 打开摄像头通话
function InitCamera() {
  if (canGetUserMediaUse()) {
    getUserMedia(
      {
        video: true,
        audio: true,
      },
      (stream: any) => {
        localStream = stream;
        localVideoElm.value.srcObject = stream;
        // $(localVideoElm).width(800);
        localVideoElm.value.width = 800;
        StartCall();
      },
      (err: any) => {
        console.log("访问用户媒体失败: ", err.name, err.message);
      }
    );
    obj.isOpenCamera = true;
  } else {
    alert("您的浏览器不兼容");
  }
}

// onMounted(() => {
//   InitCamera();
// });
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
    <video
      @click="obj.zoomCameraStatus = 1"
      class="qm-cur-user-video"
      ref="localVideoElm"
      autoplay
    ></video>
    <div class="qm-answerer-videos-box" id="videos">
      <!-- obj.answerVideo.push({ userId: parterName, video: str }); -->
      <video
        @click="obj.zoomCameraStatus = 2"
        v-for="item in obj.answerVideo"
        :key="item.userId"
        :srcObject="item.video"
        autoplay
      ></video>
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
        border: 2px solid rgba(255, 255, 255, 0.5);
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
    border: 2px solid rgba(255, 255, 255, 0.5);
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
