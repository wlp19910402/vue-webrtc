<script setup lang="ts">
import { inject, onMounted, reactive, provide } from "vue";
import { useWebSocket } from "@/utils/websocket";
import createStoreUserInfo from "@/store/userinfo";
import myAside from "./components/myAside.vue";
import myFooter from "./components/myFooter.vue";
import myMain from "./components/myMain.vue";
let useUserInfo = createStoreUserInfo();
let hhxsUserId = localStorage.getItem("hhxsUserId");
useUserInfo.getUserAllList();
// 回调的值 接收新的通知数据，并处理
const handleMessage = (e: any) => {
  // 新消息插入
  let message = JSON.parse(e.data);
  if (message.cmd === 2 && message.sendType === 0) {
    const currchat = useUserInfo.chatList.find(
      (item) => item.hhxsUserId == message.userId
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
};
// 通知
let ws: any = null;
ws = useWebSocket(hhxsUserId, handleMessage);
provide("ws", ws);
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
        <my-footer />
      </el-footer>
    </el-container>
  </el-container>
  <!-- <div class="qm-mian-card-box">
    <input />
    <button @click="handleSendMessage">发送</button>
  </div>

  <div class="qm-mian-box">
    <video id="video-local" controls autoplay></video>
  </div> -->
</template>

<style lang="scss" scoped>
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
