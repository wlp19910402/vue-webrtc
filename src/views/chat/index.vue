<script setup lang="ts">
import { reactive, provide, ref } from "vue";
import { useWebSocket } from "@/utils/websocket";
import createStoreUserInfo from "@/store/userinfo";
import myAside from "./components/myAside.vue";
import myFooter from "./components/myFooter.vue";
import myMain from "./components/myMain.vue";
import useVideoChat from "./useVideoChat";
let useUserInfo: any = createStoreUserInfo();
let hhxsUserId = localStorage.getItem("hhxsUserId")
  ? localStorage.getItem("hhxsUserId")?.toString()
  : "";
useUserInfo.getUserAllList();
// 通知
let ws: any = null;
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
      obj.zoomCameraStatus = 0;
    } else if (message.message.description.type === "answer") {
      //如果使应答类消息（那么接收到这个事件的是呼叫者）
      let desc = new RTCSessionDescription(message.message.description);
      obj.pc[message.userId].setRemoteDescription(desc);
      trunCandidate(hhxsUserId, message.userId);
    }
  }
  //监听视频被拒绝
  if (message.cmd === 5 && message.sendType === 0) {
    cameraHangUp(message.userId);
  }
};
ws = useWebSocket(hhxsUserId, handleMessage);
provide("ws", ws);
const {
  openInitCamera,
  connectOfferColse,
  connectOffer,
  connectHangUp,
  trunCandidate,
  cameraHangUp,
} = useVideoChat(localVideoElm, obj, ws);
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
        <my-footer :openInitCamera="openInitCamera" />
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
      <div class="mb-9">视频电话</div>
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
        muted
      ></video>
      <el-button class="qm-connect-hang-up" @click="connectHangUp"
        >挂断</el-button
      >
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
  .qm-connect-hang-up {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 30px;
    width: 56px;
    height: 56px;
    background: red;
    color: #fff;
    border-radius: 50%;
    border: none;
    z-index: 2;
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
